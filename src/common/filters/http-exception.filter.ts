import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { ApiErrorResponse } from '../interfaces/api-response.interface';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost): void {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const { status, message } = this.resolveException(exception);
  
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: HttpStatus[status],
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      };
  
      if (status >= 500) {
        this.logger.error(
          `${request.method} ${request.url}`,
          exception instanceof Error ? exception.stack : String(exception),
        );
      }
  
      response.status(status).json(errorResponse);
    }
  
    private resolveException(exception: unknown): {
      status: number;
      message: string | string[];
    } {
      if (exception instanceof HttpException) {
        const response = exception.getResponse();
        const message =
          typeof response === 'object' && 'message' in response
            ? (response as { message: string | string[] }).message
            : exception.message;
  
        return { status: exception.getStatus(), message };
      }
  
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
  