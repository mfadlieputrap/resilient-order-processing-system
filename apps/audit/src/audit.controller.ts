// audit.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditResponseDto } from '../../../libs/shared/src/dto/audit/audit-response.dto';

@Controller('audits')
export class AuditController {
  constructor(private readonly auditService: AuditService) { }

  @Get()
  findAll(): Promise<AuditResponseDto[]> {
    console.log('I got hit!');
    return this.auditService.findAll();
  }

  @Post()
  async saveAuditFromPost(@Body() data: any) {
    return this.auditService.saveAudit(data.eventType, data.payload, data.correlationId);
  }
}
