import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { KafkaModule } from '@app/kafka';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        entities: [Product],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Product]),
    KafkaModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
