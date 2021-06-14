import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';
import { AllowRights } from './Rights';

export function Auth(rights: UserRightsEnum[] = []): any {
  return applyDecorators(
    AllowRights(rights),
    UseGuards(AuthGuard(), RolesGuard),
    ApiBearerAuth(),
  );
}
