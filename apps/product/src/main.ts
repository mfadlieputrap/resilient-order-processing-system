import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3003, '0.0.0.0');
}
bootstrap();
