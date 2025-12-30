import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  auditId: string;

  @Column()
  eventType: string; // product.created | order.created

  @Column({ nullable: true })
  correlationId: string;

  @Column({ type: 'json' })
  payload: unknown; // simpan payload event apa adanya (ringan & fleksibel)

  @CreateDateColumn()
  createdAt: Date;
}
