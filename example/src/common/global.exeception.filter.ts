import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  HttpExceptionBodyMessage,
} from '@nestjs/common';
import { GlobalResponse } from './global.response';

const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';
const SYS_INTER_EXCEPTION_MSG = 'System internal exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status = exception.getStatus ? exception.getStatus() : 500;
    const exceptionRes = exception.getResponse?.() as
      | HttpExceptionBody
      | undefined;
    let statusCode =
      exceptionRes?.statusCode ?? exception.getStatus
        ? exception.getStatus()
        : 500;
    let statusText =
      exceptionRes?.error ?? exception.message ?? SYS_INTER_EXCEPTION_MSG;
    let cause: HttpExceptionBodyMessage | undefined =
      exceptionRes?.message ??
      (statusCode === 500 ? exception.stack : undefined);

    if (status === 500 && IS_PRODUCTION_ENV) {
      cause = void 0;
      statusText = SYS_INTER_EXCEPTION_MSG;
    }

    // Judge is handled by remix
    if (request.handleByRemix) {
      if (exception instanceof Response) {
        throw exception;
      }
      throw new Response(JSON.stringify({ msg: statusText, cause }), {
        status: statusCode,
        statusText: statusText,
      });
    }

    const errorResponse = new GlobalResponse(
      { msg: statusText, cause },
      statusCode,
      false,
    );

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse.toPlainObject());
  }
}
