import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Notifications } from '../../../transport/notifications.transport';
import * as config from 'config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // noinspection FunctionTooLongJS,OverlyComplexFunctionJS
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // noinspection OverlyComplexBooleanExpressionJS
    const requestId =
      (request && request.locals && request.locals.requestId) ||
      'EXCEPTION_FILTER';
    const logger = new Logger(requestId);
    const responseObject: any = {
      success: false,
      apiVersion: config.get('version'),
      timestamp: new Date(),
      requestId,
    };

    let notificationMessage;
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // noinspection IfStatementWithTooManyBranchesJS
    if (status === HttpStatus.BAD_REQUEST) {
      responseObject.statusCode = status;
      responseObject.error = 'Validation Error';
      responseObject.message =
        exception && exception.response && exception.response.error;
      notificationMessage =
        typeof responseObject.message === 'string'
          ? responseObject.message
          : '';
    } else if (status === HttpStatus.I_AM_A_TEAPOT) {
      responseObject.statusCode = exception.response.statusCode;
      responseObject.error = exception.response.error;
      status = HttpStatus.BAD_REQUEST;
    } else if (status === HttpStatus.UNAUTHORIZED) {
      responseObject.statusCode = status;
      responseObject.error = 'Unauthorized';
    } else if (status === HttpStatus.NOT_FOUND) {
      responseObject.statusCode = status;
      responseObject.error = 'Not Found';
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      responseObject.statusCode = status;
      responseObject.error = 'Internal Server Error';
      notificationMessage = exception.message || '';
    }

    await Notifications.send(
      `⚠️ ${responseObject.statusCode}. ${notificationMessage ||
        responseObject.error}. ${request.method} ${
        request.originalUrl
      } ${JSON.stringify(request.body) || ''} ${
        request.user ? 'UserId: ' + request.user.id : ''
      } ${status === HttpStatus.INTERNAL_SERVER_ERROR ? exception.stack : ''}`,
      false,
      requestId,
    );

    if (config.get('showErrorStackTrace')) {
      logger.error(
        `${notificationMessage || responseObject.error}` +
          `${
            responseObject.message
              ? '\n' + JSON.stringify(responseObject.message)
              : ''
          }`,
        exception.stack || '',
        requestId || 'EXCEPTION_FILTER',
      );
    }

    response.status(status).json(responseObject);
  }
}
