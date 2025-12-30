import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '@app/shared/dto/order/create-order.dto';
import { OrderResponseDto } from '@app/shared/dto/order/order-response.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('with-kafka')
  createWithKafka(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto, true);
  }

  @Post('rest-only')
  createRestOnly(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(dto, false);
  }

  @Get()
  findAll(): Promise<OrderResponseDto[]> {
    return this.orderService.findAllOrders();
  }
}
