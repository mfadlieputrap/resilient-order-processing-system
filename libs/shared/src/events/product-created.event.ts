export class ProductCreatedEvent {
  productId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: Date;
}
