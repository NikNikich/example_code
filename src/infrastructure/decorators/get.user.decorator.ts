import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../core/domain/entity/user.entity';

export const GetUser = createParamDecorator(
  (data, req): UserEntity => {
    const incomingMessage = req && req.args && req.args[0];
    return incomingMessage.user;
  },
);
