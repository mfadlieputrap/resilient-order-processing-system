import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '@app/shared/dto/order/create-order.dto';
import { OrderResponseDto } from '@app/shared/dto/order/order-response.dto';

@Injectable()
export class OrderClient {
  private ORDER_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ORDER_SERVICE_URL =
      this.configService.get<string>('ORDER_SERVICE_URL') ||
      'http://order-service:3004';
  }

  createWithKafka(dto: CreateOrderDto) {
    return this.http.post<OrderResponseDto>(
      `${this.ORDER_SERVICE_URL}/orders/with-kafka`,
      dto,
    );
  }

  createRestOnly(dto: CreateOrderDto) {
    return this.http.post<OrderResponseDto>(
      `${this.ORDER_SERVICE_URL}/orders/rest-only`,
      dto,
    );
  }

  findAll() {
    return this.http.get<OrderResponseDto[]>(
      `${this.ORDER_SERVICE_URL}/orders`,
    );
  }
}
