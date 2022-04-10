import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';
import { User } from '../../../../core/domain/entity/user.entity';
import { genSalt, hash } from 'bcryptjs';
import * as _ from 'lodash';

export class addMachineLearningUser1619447000004 implements MigrationInterface {
  private tableName = User.name;
  private data = {
    firstName: 'Machine',
    lastName: 'learning',
    email: 'machine@learning.com',
    phone: '1234567890',
    organization: 'machine-learning',
    position: 'program',
  };
  private password = 'xGWc3GF3pn';

  public async up(): Promise<void> {
    const findMachineLearning = await this.findRoleMachineLearning();
    if (findMachineLearning && findMachineLearning.length > 0) {
      const value = new User();
      _.assign(value, this.data);
      value.role = findMachineLearning[0];
      const salt: string = await genSalt();
      value.password = hash(this.password, salt);
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(this.tableName)
        .values([value])
        .execute();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}

  private async findRoleMachineLearning(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = 
      '${UserRolesEnum.MACHINE_LEARNING}'`,
    );
  }
}
