import { Injectable } from '@nestjs/common';
import { AuditClient } from '../clients/audit.client';
import { lastValueFrom } from 'rxjs';
import { AuditResponseDto } from '@app/shared/dto/audit/audit-response.dto';

@Injectable()
export class AuditService {
  constructor(private readonly auditClient: AuditClient) {}

  async findAllAudits(): Promise<AuditResponseDto[]> {
    const res = await lastValueFrom(this.auditClient.findAll());
    return res.data;
  }

  async postLog(data: any): Promise<any> {
    const res = await lastValueFrom(this.auditClient.saveAudit(data));
    return res.data;
  }
}
