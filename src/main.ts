import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [
      'error',
      'log',
      'warn'
    ]
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  await app.listen(process.env.PORT ?? 3000);

  Logger.log('Server is running on http://localhost:3000', 'Bootstrap')
}
bootstrap();
