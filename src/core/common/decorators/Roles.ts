import { UserRolesEnum } from '../../../infrastructure/shared/user.roles.enum';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const AllowRoles = (roles: UserRolesEnum[]): CustomDecorator =>
  SetMetadata('roles', roles);
