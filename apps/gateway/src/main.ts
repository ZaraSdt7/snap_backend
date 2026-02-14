import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from '../config/config.swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  setupSwagger(app, configService);
  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(` Server running at http://localhost:${port}`);
  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`Swagger Admin: http://localhost:${port}/admin/docs`);
  logger.log(`Swagger Driver: http://localhost:${port}/driver/docs`);
  logger.log(`Swagger Passenger: http://localhost:${port}/passenger/docs`);
}

bootstrap().catch((error) => {
  console.error(' Failed to start application:', error);
  process.exit(1);
});
