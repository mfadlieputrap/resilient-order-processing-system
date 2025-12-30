import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../../../libs/shared/src/dto/order/create-order.dto';
import { OrderResponseDto } from '../../../libs/shared/src/dto/order/order-response.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('rest-only')
  createRestOnly(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto, false);
  }

  @Post('with-kafka')
  createWithKafka(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto, true);
  }

  @Get()
  findAll(): Promise<OrderResponseDto[]> {
    return this.orderService.findAllOrders();
  }
}
