import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@app/kafka';
import { AuditLog } from './entities/audit.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        database: config.get<string>('DB_DATABASE') ?? 'audit_db',
        entities: [AuditLog],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([AuditLog]),
    KafkaModule,
  ],
  providers: [AuditService],
  controllers: [AuditController],
})
export class AuditModule {}
