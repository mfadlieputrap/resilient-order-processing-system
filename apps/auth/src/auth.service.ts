import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '@app/kafka';
import { RegisterDto } from '@app/shared/dto/auth/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '@app/shared/dto/auth/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
    private readonly kafka: KafkaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.findUserByEmail(dto.email);
    if (exists) {
      throw new ConflictException('Email already exists');
    }
    try {
      const hashedPassword = await bcryptjs.hash(dto.password, 10);
      const user = await this.authRepo.save(
        this.authRepo.create({
          ...dto,
          password: hashedPassword,
        }),
      );

      await this.kafka.emit(
        'user.created',
        {
          userId: user.id,
          name: user.username,
          email: user.email,
        },
        user.id,
      );

      return { id: user.id, username: user.username };
    } catch (error) {
      console.log('[AuthService][register]', error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.findUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcryptjs.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
    return { accessToken };
  }

  async findUserByEmail(email: string) {
    return await this.authRepo.findOneBy({ email });
  }
}
