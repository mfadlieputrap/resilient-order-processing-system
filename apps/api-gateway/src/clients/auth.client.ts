import { LoginDto } from '@app/shared/dto/auth/login.dto';
import { RegisterDto } from '@app/shared/dto/auth/register.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthClient {
  private AUTH_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.AUTH_SERVICE_URL =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      'http://auth-service:3001';
  }

  login(dto: LoginDto) {
    return this.http.post(`${this.AUTH_SERVICE_URL}/auth/login`, dto);
  }

  register(dto: RegisterDto) {
    return this.http.post(`${this.AUTH_SERVICE_URL}/auth/register`, dto);
  }
}
