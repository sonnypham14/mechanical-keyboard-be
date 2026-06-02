import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response: T | ApiResponse<T>): ApiResponse<T> => {
        if (
          response !== null &&
          typeof response === 'object' &&
          'data' in response
        ) {
          const { data, message, meta } = response;
          return {
            success: true,
            data,
            message: message ?? 'Success',
            ...(meta && { meta }),
          };
        }

        return {
          success: true,
          data: response,
          message: 'Success',
        };
      }),
    );
  }
}
