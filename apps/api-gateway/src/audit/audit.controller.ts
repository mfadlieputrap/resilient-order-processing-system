import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditResponseDto } from '@app/shared/dto/audit/audit-response.dto';

@Controller('audits')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(): Promise<AuditResponseDto[]> {
    return this.auditService.findAllAudits();
  }

  @Post()
  postLog(@Body() data: any) {
    return this.auditService.postLog(data);
  }
}
