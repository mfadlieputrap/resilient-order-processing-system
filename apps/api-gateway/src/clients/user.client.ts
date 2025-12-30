import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from '@app/shared/dto/user/user-response.dto';

@Injectable()
export class UserClient {
  private USER_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.USER_SERVICE_URL =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://user-service:3002';
  }

  findAll() {
    return this.http.get<UserResponseDto[]>(`${this.USER_SERVICE_URL}/users`);
  }

  findById(userId: string) {
    return this.http.get<UserResponseDto | null>(
      `${this.USER_SERVICE_URL}/users/${userId}`,
    );
  }
}
