import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceClientOutputDto } from './interface/serviceClientOutput..interface';




export function throwHttpErr(errorData: ServiceClientOutputDto<any>) {
  const message = errorData?.error || errorData?.message || 'err_service_failed';
  const status = errorData?.code || HttpStatus.FAILED_DEPENDENCY;
  throw new HttpException({ message, data: errorData?.data || null }, status);
}


  //Handle Service Client Response

export function handleSrvCliResponse<T>(data: ServiceClientOutputDto<T>): T {
  if (!data || data.status !== 'SUCCEED') {
    throwHttpErr(data);
  }
  return data.data as T;
}


// HttpExceptionFilter

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as
      | string
      | { message?: string | string[]; data?: any; error?: any };

    // Normalize error object
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse?.error || exceptionResponse?.message || exception.name;

    const errorDescription =
      typeof exceptionResponse === 'string'
        ? [exceptionResponse]
        : Array.isArray(exceptionResponse?.message)
        ? exceptionResponse.message
        : [exceptionResponse?.message || 'Unexpected error'];

    const errorData =
      typeof exceptionResponse === 'string'
        ? null
        : exceptionResponse?.data || null;

    response.status(status).json({
      code: status,
      status: 'FAILED',
      message: errorMessage,
      error: errorDescription,
      data: errorData,
    });
  }
}
