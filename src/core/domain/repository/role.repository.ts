import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { Right } from '../entity/right.entity';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async getRights(role: Role): Promise<UserRightsEnum[]> {
    const findRole = await this.findOne(role.id, { relations: ['rights'] });
    return findRole.rights.map((right: Right) => right.name);
  }
}
