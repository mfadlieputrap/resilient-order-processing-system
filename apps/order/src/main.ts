import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3004, '0.0.0.0');
}
bootstrap();
