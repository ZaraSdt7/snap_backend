import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RestModule } from './rest/rest.module';
import { ServiceModule } from './services/service.module';
import { UtilsModule } from './utils/util.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
    RestModule,
    ServiceModule,
    UtilsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
