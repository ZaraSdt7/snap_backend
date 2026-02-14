import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as config from 'config';

interface ServerOptions { port: number }

const DEFAULT_PORT = Number(process.env.PORT) || 3000;

function getServerOptions(): ServerOptions {
  try {
    if (config && typeof (config as any).has === 'function' && (config as any).has('server')) {
      const cfg = (config as any).get('server');
      return { port: Number(cfg?.port) || DEFAULT_PORT };
    }
  } catch {
    // fall through to default
  }
  return { port: DEFAULT_PORT };
}

async function bootstrap(): Promise<void> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  app.enableCors();
  app.use(helmet());

  const { port } = getServerOptions();

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
