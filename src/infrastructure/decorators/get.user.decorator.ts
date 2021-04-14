import { createParamDecorator } from '@nestjs/common';
import { User } from '../../core/domain/entity/user.entity';

export const GetUser = createParamDecorator(
  (data, req): User => {
    const incomingMessage = req && req.args && req.args[0];
    return incomingMessage.user;
  },
);
