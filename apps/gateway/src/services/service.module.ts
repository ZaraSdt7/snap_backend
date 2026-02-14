import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MainServiceClient } from './service.main';



@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Main',
        transport: Transport.TCP,
        options: {
          host: process.env.MAIN_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.MAIN_SERVICE_PORT) || 4000,
        },
      },
    ]),
  ],
  providers: [MainServiceClient],
  exports: [MainServiceClient],
})
export class ServiceModule {}
