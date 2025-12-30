import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseDto } from '../../../libs/shared/src/dto/user/user-response.dto';
import { KafkaService } from '@app/kafka';
import { EachMessagePayload } from 'kafkajs';
import { OnModuleInit, Injectable } from '@nestjs/common';

export interface UserCreatedEvent {
  userId: string;
  name: string;
  email: string;
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly kafka: KafkaService,
  ) {}

  async onModuleInit() {
    await this.kafka.subscriber(
      'user-service-group',
      'user.created',
      async ({ message }: EachMessagePayload) => {
        if (!message.value) return;

        const payload = JSON.parse(
          message.value.toString(),
        ) as UserCreatedEvent;

        await this.handleUserCreated(payload);
      },
    );
  }

  private async handleUserCreated(event: UserCreatedEvent) {
    const exists = await this.userRepository.findOne({
      where: { userId: event.userId },
    });

    if (exists) return;

    const user = this.userRepository.create({
      userId: event.userId,
      name: event.name,
      email: event.email,
    });

    await this.userRepository.save(user);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((u) => this.toResponse(u));
  }

  async findUserById(userId: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({ where: { userId } });
    return user ? this.toResponse(user) : null;
  }

  private toResponse(user: User): UserResponseDto {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
