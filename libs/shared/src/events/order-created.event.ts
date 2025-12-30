export class OrderCreatedEvent {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
}
