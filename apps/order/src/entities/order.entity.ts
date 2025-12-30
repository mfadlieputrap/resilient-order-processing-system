import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum StatusOrder {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ length: 20, default: StatusOrder.PENDING })
  status: StatusOrder; // Status: PENDING, COMPLETED, CANCELLED

  @CreateDateColumn()
  createdAt: Date;
}
