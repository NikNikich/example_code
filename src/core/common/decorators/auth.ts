import { UserRolesEnum } from '../../../infrastructure/shared/enum/user.roles.enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AllowRoles } from './Roles';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';

export function Auth(roles: UserRolesEnum[] = [UserRolesEnum.USER]): any {
  return applyDecorators(
    AllowRoles(roles),
    UseGuards(AuthGuard(), RolesGuard),
    ApiBearerAuth(),
  );
}
