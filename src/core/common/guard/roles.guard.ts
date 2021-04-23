import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRolesEnum } from '../../../infrastructure/shared/user.roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const methodRoles =
      this.reflector.get<UserRolesEnum[]>('roles', context.getHandler()) ?? [];
    const classRoles =
      this.reflector.get<UserRolesEnum[]>('roles', context.getClass()) ?? [];
    const roles = [...methodRoles, ...classRoles];
    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user || !user.role) {
      return false;
    }
    const userRoles: UserRolesEnum[] = [user.role.name];
    if (userRoles.indexOf(UserRolesEnum.USER) === -1) {
      userRoles.push(UserRolesEnum.USER);
    }
    return roles.every(function(item) {
      return userRoles.indexOf(item) !== -1;
    });
  }
}
