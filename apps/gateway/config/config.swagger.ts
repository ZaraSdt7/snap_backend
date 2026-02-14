import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AdminModule } from '../src/rest/admin/admin.module';
import { DriverModule } from '../src/rest/driver/driver.module';
import { PassengerModule } from '../src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  name: string;
  path: string;
  module: any;
  bearer?: boolean;
}

interface SwaggerOptions {
  title: string;
  description: string;
  version: string;
  bearer?: boolean;
}

export function setupSwagger(app: INestApplication, configService: ConfigService): void {
  const swaggerTitle = configService.get<string>('server.swagger.title') ?? 'Snap API';
  const swaggerDescription = configService.get<string>('server.swagger.description') ?? 'API Documentation';
  const swaggerVersion = configService.get<string>('server.swagger.version') ?? '1.0.0';
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  if (nodeEnv === 'production') return;

  const modules: SwaggerModuleItem[] = [
    { name: 'Admin', path: 'admin', module: AdminModule, bearer: false },
    { name: 'Driver', path: 'driver', module: DriverModule, bearer: true },
    { name: 'Passenger', path: 'passenger', module: PassengerModule, bearer: true },
  ];

  modules.forEach((item) => {
    const document = createSwaggerDocument(app, {
      title: `${swaggerTitle} - ${item.name}`,
      description: swaggerDescription,
      version: swaggerVersion,
      bearer: item.bearer,
    }, item.module);

    SwaggerModule.setup(`/${item.path}/docs`, app, document);

    console.log(`Swagger ready at: /${item.path}/docs`);
  });
}

function createSwaggerDocument(app: INestApplication, options: SwaggerOptions, module: any) {
  let builder = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version);

  if (options.bearer) {
    builder = builder.addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    }, 'access-token');
  }

  const config = builder.build();

  return SwaggerModule.createDocument(app, config, { include: [module] });
}
