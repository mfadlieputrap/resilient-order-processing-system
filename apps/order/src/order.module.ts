import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { KafkaModule } from '@app/kafka';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

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
        entities: [Order],
        synchronize: true,
      }),
    }),
    HttpModule,
    TypeOrmModule.forFeature([Order]),
    KafkaModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
