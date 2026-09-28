import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = Number.parseInt(
  process.env.PORT ?? process.env.API_PORT ?? '3001',
  10,
);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin:
      process.env.CORS_ORIGIN
        ?.split(',')
        .map((origin) => origin.trim()) ?? true,
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Allow mobile devices on the same Wi-Fi network
  // to connect to the API.
  await app.listen(port, '0.0.0.0');

  console.log(
    `Kabadiwala Connect API running on port ${port}`,
  );
}

void bootstrap();