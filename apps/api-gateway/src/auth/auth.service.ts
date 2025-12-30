import { Injectable } from '@nestjs/common';
import { AuthClient } from '../clients/auth.client';
import { LoginDto } from '@app/shared/dto/auth/login.dto';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from '@app/shared/dto/auth/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: AuthClient) {}

  async login(dto: LoginDto) {
    const res = await lastValueFrom(this.authClient.login(dto));
    return res.data;
  }

  async register(dto: RegisterDto) {
    const res = await lastValueFrom(this.authClient.register(dto));
    return res.data;
  }
}
