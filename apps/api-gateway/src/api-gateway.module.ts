import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ApiClientsModule } from './clients/api-clients.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditModule } from './audit/audit.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiClientsModule,
    AuthModule,
    UserModule,
    OrderModule,
    AuditModule,
    ProductModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
