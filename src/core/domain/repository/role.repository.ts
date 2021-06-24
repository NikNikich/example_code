import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { Right } from '../entity/right.entity';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';
import { UserRolesEnum } from '../../../infrastructure/shared/enum/user.roles.enum';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async getRights(role: Role): Promise<UserRightsEnum[]> {
    const findRole = await this.findOne(role.id, { relations: ['rights'] });
    return findRole.rights.map((right: Right) => right.name);
  }

  async getRolesForName(roleNames: UserRolesEnum[]): Promise<Role[]> {
    if (roleNames.length > 0) {
      const where: FindConditions<Role>[] = [];
      for (const name of roleNames) {
        where.push({ name });
      }
      return this.find({ where });
    } else {
      return [];
    }
  }
}
