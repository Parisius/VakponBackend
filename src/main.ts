import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  // Behind Nginx/NPM in every deployment topology — needed so req.ip reflects
  // the real visitor IP (via X-Forwarded-For) instead of the proxy's own.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(cookieParser());

  // Swagger documents the full API surface — keep it out of production.
  if (config.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Vakpon Tours API')
      .setDescription('Auth, offers, reservations, CRM and admin endpoints for the Vakpon Tours platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);
  }

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.setGlobalPrefix('api');

  const port = config.get<string>('PORT') || 3000;
  await app.listen(port);
  console.log(`Vakpon Tours API running on http://localhost:${port}/api`);
}
bootstrap();
