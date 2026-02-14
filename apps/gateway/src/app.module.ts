import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';

@Module({
  imports: [ConfigModule.forRoot(),
    RestModule,
    ServiceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
