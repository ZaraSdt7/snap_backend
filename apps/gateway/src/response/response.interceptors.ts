import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapper } from './interface/response.wrap.interface';



@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // Normalize status code for POST -> 200 OK instead of 201
        if (req.method === 'POST' && res.statusCode === HttpStatus.CREATED) {
          res.status(HttpStatus.OK);
        }

        // If the response is already wrapped, just return as is
        if (data && data._isWrapped) return data;

        // Default message
        let message = 'Operation successful';
        if (req.method === 'POST') message = 'Resource created successfully';
        if (req.method === 'PUT') message = 'Resource updated successfully';
        if (req.method === 'DELETE') message = 'Resource deleted successfully';
        if (req.method === 'GET') message = 'Request successful';

        return {
          _isWrapped: true, // internal flag to avoid double wrapping
          code: res.statusCode,
          status: 'SUCCEED',
          message,
          error: null,
          data,
        } as ResponseWrapper;
      }),
    );
  }
}
