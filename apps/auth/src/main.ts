import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3001, '0.0.0.0');
}
bootstrap();
