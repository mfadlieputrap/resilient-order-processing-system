import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../../../libs/shared/src/dto/product/create-product.dto';
import { ProductResponseDto } from '../../../libs/shared/src/dto/product/product-response.dto';
import { KafkaService } from '@app/kafka';
import { EachMessagePayload } from 'kafkajs';
import {
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { OrderCreatedEvent } from '@app/shared/events/order-created.event';
import { StatusOrder } from 'apps/order/src/entities/order.entity';

export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly kafka: KafkaService,
  ) {}

  async onModuleInit() {
    await this.kafka.subscriber(
      'product-service-group',
      'order.created',
      async ({ message }: EachMessagePayload) => {
        if (!message.value) return;
        const payload = JSON.parse(
          message?.value?.toString(),
        ) as OrderCreatedEvent;
        await this.handleOrderCreated(payload);
      },
    );
  }

  async createProduct(
    dto: CreateProductDto,
    emitEvent = true,
  ): Promise<ProductResponseDto> {
    const product = this.productRepository.create(dto);
    const savedProduct = await this.productRepository.save(product);
    if (emitEvent) {
      await this.kafka.emit(
        'product.created',
        {
          productId: savedProduct.productId,
          name: savedProduct.name,
          category: savedProduct.category,
          price: savedProduct.price,
          stock: savedProduct.stock,
          createdAt: savedProduct.createdAt,
        },
        savedProduct.productId,
      );
    }
    return this.mapToProductResponseDto(savedProduct);
  }

  async findAllProducts(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find();
    return products.map((p) => this.mapToProductResponseDto(p));
  }

  async findProductById(productId: string): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findOne({
      where: { productId },
    });
    return product ? this.mapToProductResponseDto(product) : null;
  }

  /*  ---------------------
        Consumer Service
      ---------------------
  */
  async handleOrderCreated(payload: OrderCreatedEvent) {
    const product = await this.findProductById(payload.productId);
    if (!product) throw new NotFoundException('Product tidak ada');

    try {
      if (product.stock >= payload.quantity) {
        product.stock -= payload.quantity;
        await this.productRepository.save(product);
        console.log('Emit product.stock_decreased running');
        await this.kafka.emit(
          'product.stock_decreased',
          {
            orderId: payload.orderId,
            status: StatusOrder.COMPLETED,
          },
          payload.orderId,
        );
      } else {
        console.log('Emit product.stock_failed running');
        await this.kafka.emit(
          'product.stock_failed',
          {
            orderId: payload.orderId,
            status: StatusOrder.CANCELLED,
          },
          payload.orderId,
        );
      }
    } catch (error) {
      console.error('[HANDLE ORDER CREATED ERROR]', (error as Error).message);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  private mapToProductResponseDto(product: Product): ProductResponseDto {
    const productResponseDto = new ProductResponseDto();
    productResponseDto.productId = product.productId;
    productResponseDto.name = product.name;
    productResponseDto.category = product.category;
    productResponseDto.price = product.price;
    productResponseDto.stock = product.stock;
    productResponseDto.createdAt = product.createdAt;
    return productResponseDto;
  }
}
