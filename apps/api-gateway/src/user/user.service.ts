import { Injectable } from '@nestjs/common';
import { UserClient } from '../clients/user.client';
import { lastValueFrom } from 'rxjs';
import { UserResponseDto } from '@app/shared/dto/user/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userClient: UserClient) {}

  async findAllUsers(): Promise<UserResponseDto[]> {
    const res = await lastValueFrom(this.userClient.findAll());
    return res.data;
  }

  async findUserById(userId: string): Promise<UserResponseDto | null> {
    const res = await lastValueFrom(this.userClient.findById(userId));
    return res.data;
  }
}
