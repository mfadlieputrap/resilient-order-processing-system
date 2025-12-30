import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, StatusOrder } from './entities/order.entity';
import { CreateOrderDto } from '../../../libs/shared/src/dto/order/create-order.dto';
import { OrderResponseDto } from '../../../libs/shared/src/dto/order/order-response.dto';
import { KafkaService } from '@app/kafka';
import { InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

export class OrderService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly kafka: KafkaService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.kafka.subscribeMany(
      'order-service-group',
      ['product.stock_decreased', 'product.stock_failed'], // Daftar topik
      async ({ message, topic }: EachMessagePayload) => {
        if (!message.value) return;

        const payload = JSON.parse(message.value.toString()) as {
          orderId: string;
          status: StatusOrder;
        };

        console.log(`[OrderService] Processing event from topic: ${topic}`);
        await this.handleProductStock(payload);
      },
    );
  }

  async createOrder(
    dto: CreateOrderDto,
    emitEvent = true,
  ): Promise<OrderResponseDto> {
    const order = this.orderRepository.create(dto);
    const savedOrder = await this.orderRepository.save(order);

    if (emitEvent) {
      await this.kafka.emit(
        'order.created',
        {
          orderId: savedOrder.orderId,
          userId: savedOrder.userId,
          productId: savedOrder.productId,
          quantity: savedOrder.quantity,
          totalPrice: savedOrder.totalPrice,
          status: savedOrder.status,
          createdAt: savedOrder.createdAt,
        },
        savedOrder.orderId,
      );
    } else {
      try {
        await firstValueFrom(
          this.httpService.post('http://api-gateway:3000/api/audits', {
            eventType: 'order.created',
            payload: savedOrder,
            correlationId: savedOrder.orderId,
          }),
        );
      } catch (error) {
        console.error('Audit Service mati/error', (error as Error).message);
        throw new InternalServerErrorException('Internal server error');
      }
    }

    return this.toResponse(savedOrder);
  }

  async findAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find();
    return orders.map((o) => this.toResponse(o));
  }

  /*---------------------
      Consumer Service
    ---------------------
  */
  private async handleProductStock(payload: {
    orderId: string;
    status: StatusOrder;
  }) {
    const order = await this.orderRepository.findOne({
      where: { orderId: payload.orderId },
    });
    if (!order) return;
    try {
      if (payload.status === StatusOrder.COMPLETED) {
        order.status = payload.status;
        const updatedOrder = await this.orderRepository.save(order);

        await this.kafka.emit(
          'order.status_completed',
          updatedOrder,
          updatedOrder.orderId,
        );
      } else {
        order.status = payload.status;
        const updatedOrder = await this.orderRepository.save(order);

        await this.kafka.emit(
          'order.status_cancelled',
          updatedOrder,
          updatedOrder.orderId,
        );
      }
    } catch (error) {
      console.error('[HANDLE PRODUCT STOCK ERROR]', (error as Error).message);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  private toResponse(order: Order): OrderResponseDto {
    return {
      orderId: order.orderId,
      userId: order.userId,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    };
  }
}
