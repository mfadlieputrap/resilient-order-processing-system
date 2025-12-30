import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditResponseDto } from '@app/shared/dto/audit/audit-response.dto';

@Injectable()
export class AuditClient {
  private AUDIT_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.AUDIT_SERVICE_URL =
      this.configService.get<string>('AUDIT_SERVICE_URL') ||
      'http://audit-service:3005';
  }

  findAll() {
    return this.http.get<AuditResponseDto[]>(
      `${this.AUDIT_SERVICE_URL}/audits`,
    );
  }

  saveAudit(data: any) {
    return this.http.post(`${this.AUDIT_SERVICE_URL}/audits`, data);
  }
}
