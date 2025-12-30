import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from '../../../libs/shared/src/dto/user/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.userService.findUserById(id);
  }
}
