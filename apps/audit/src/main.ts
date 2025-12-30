import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3005, '0.0.0.0');
}
bootstrap();
