import { Global, Module } from '@nestjs/common';
import { AuthClient } from './auth.client';
import { HttpModule } from '@nestjs/axios';
import { UserClient } from './user.client';
import { AuditClient } from './audit.client';
import { OrderClient } from './order.client';
import { ProductClient } from './product.client';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [AuthClient, UserClient, ProductClient, OrderClient, AuditClient],
  exports: [AuthClient, UserClient, ProductClient, OrderClient, AuditClient],
})
export class ApiClientsModule {}
