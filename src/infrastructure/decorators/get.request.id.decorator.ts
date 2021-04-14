import { createParamDecorator, Logger } from '@nestjs/common';

export const GetRequestId = createParamDecorator((data, req): string => {
  const incomingMessage = req && req.args && req.args[0];
  const requestId: string =
    incomingMessage &&
    incomingMessage.locals &&
    incomingMessage.locals.requestId
      ? incomingMessage.locals.requestId
      : 'REQUEST_ID_DECORATOR_ERR';
  const logger = new Logger(requestId);
  const userId = incomingMessage.user ? incomingMessage.user.id : '?';
  logger.log('UserId: ' + userId);
  return requestId;
});
