import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, map } from 'rxjs';
  import { ApiResponse } from '../interfaces/api-response.interface';
  
  @Injectable()
  export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
  {
    intercept(
      _context: ExecutionContext,
      next: CallHandler,
    ): Observable<ApiResponse<T>> {
      return next.handle().pipe(
        map((response) => {
          if (response && typeof response === 'object' && 'data' in response) {
            return {
              success: true,
              data: response.data,
              message: response.message ?? 'Success',
              ...(response.meta && { meta: response.meta }),
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
  