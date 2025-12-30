import { Injectable } from '@nestjs/common';
import { OrderClient } from '../clients/order.client';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from '@app/shared/dto/order/create-order.dto';
import { OrderResponseDto } from '@app/shared/dto/order/order-response.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderClient: OrderClient) {}

  async createOrder(
    dto: CreateOrderDto,
    withKafka: boolean,
  ): Promise<OrderResponseDto> {
    const res = await lastValueFrom(
      withKafka
        ? this.orderClient.createWithKafka(dto)
        : this.orderClient.createRestOnly(dto),
    );
    return res.data;
  }

  async findAllOrders(): Promise<OrderResponseDto[]> {
    const res = await lastValueFrom(this.orderClient.findAll());
    return res.data;
  }
}
