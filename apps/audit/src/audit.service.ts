/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '@app/kafka';
import { EachMessagePayload } from 'kafkajs';
import { AuditLog } from './entities/audit.entity';
import { AuditResponseDto } from '../../../libs/shared/src/dto/audit/audit-response.dto';
import { AUDIT_GROUP } from 'libs/shared/kafka/consumer/group';

@Injectable()
export class AuditService implements OnModuleInit {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
    private readonly kafka: KafkaService,
  ) {}

  async onModuleInit() {
    await this.subscribeAll();
  }

  private async subscribeAll() {
    const topics = [
      'product.created',
      'order.created',
      'product.stock_decreased',
      'product.stock_failed',
      'order.status_completed',
      'order.status_cancelled',
    ];

    for (const topic of topics) {
      const unikId = `${AUDIT_GROUP}-${topic}`;
      await this.kafka.subscriber(
        unikId,
        topic,
        this.handleEvent.bind(this, topic),
      );
    }
  }

  private async handleEvent(
    eventType: string,
    { message }: EachMessagePayload,
  ) {
    if (!message?.value) return;
    console.log('handle event audit service');
    const payload = JSON.parse(message.value.toString());
    const correlationId = message.key?.toString() ?? '';

    await this.saveAudit(eventType, payload, correlationId);
  }

  async saveAudit<T>(eventType: string, payload: T, correlationId: string) {
    const audit = this.auditRepo.create({
      eventType,
      payload,
      correlationId,
    });
    console.log('Im on saveAudit');
    await this.auditRepo.save(audit);
  }

  async findAll(): Promise<AuditResponseDto[]> {
    const logs = await this.auditRepo.find({
      order: { createdAt: 'DESC' },
    });
    return logs.map((l) => ({
      auditId: l.auditId,
      eventType: l.eventType,
      payload: l.payload,
      correlationId: l.correlationId,
      createdAt: l.createdAt,
    }));
  }
}
