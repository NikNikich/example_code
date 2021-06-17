import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';
import { RoleRepository } from '../../domain/repository/role.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleRepository: RoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodRoles =
      this.reflector.get<UserRightsEnum[]>('rights', context.getHandler()) ??
      [];
    const classRoles =
      this.reflector.get<UserRightsEnum[]>('rights', context.getClass()) ?? [];
    const rights = [...methodRoles, ...classRoles];
    if (!rights.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user || !user.role) {
      return false;
    }
    const userRights: UserRightsEnum[] = await this.roleRepository.getRights(
      user.role,
    );
    if (userRights.find(right => right === UserRightsEnum.ALL)) {
      return true;
    } else {
      return !!rights.find(rightFind => userRights.includes(rightFind));
    }
  }
}
