import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KafkaModule } from '@app/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: config.get<number>('DB_PORT') ?? 3306,
        username: config.get<string>('DB_USER') ?? 'root',
        password: config.get<string>('DB_PASS') ?? 'root',
        database: config.get<string>('DB_DATABASE') ?? 'order_db',
        entities: [User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
    KafkaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
