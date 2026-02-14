import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MainServiceResponse } from './interface/service.interface';


@Injectable()
export class MainServiceClient {
  private readonly logger = new Logger(MainServiceClient.name);

  constructor(@Inject('Main') private readonly cli: ClientProxy) {}


  async callEvent<T = unknown>(data: unknown): Promise<MainServiceResponse<T>> {
    try {
      this.logger.debug(`Emitting event to Main service: ${JSON.stringify(data)}`);
      const res: unknown = await lastValueFrom(this.cli.emit('callEvent', data));
      return res as MainServiceResponse<T>;
    } catch (error) {
      this.logger.error(`Failed to emit event`, error);
      return {
        context: data,
        status: 'FAILED',
        code: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Event emission failed',
        error: 'err_service_failedToEmit',
        data: `${error}` as any,
      };
    }
  }

  async callAction<T = unknown>(data: unknown): Promise<MainServiceResponse<T>> {
    try {
      this.logger.debug(`Calling action on Main service: ${JSON.stringify(data)}`);
      const res: any = await lastValueFrom(this.cli.send('callAction', data));
      return res;
    } catch (error) {
      this.logger.error(`Failed to call action`, error);
      return {
        context: data,
        status: 'FAILED',
        code: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Service failed to respond',
        error: 'err_services_failedToResolve',
        data: `${error}` as any,
      };
    }
  }
}
