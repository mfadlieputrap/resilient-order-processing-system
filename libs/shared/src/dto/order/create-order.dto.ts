import { IsInt, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  totalPrice: number;
}
