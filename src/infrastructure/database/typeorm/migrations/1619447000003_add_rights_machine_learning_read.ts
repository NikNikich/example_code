import { getConnection, MigrationInterface } from 'typeorm';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';
import { Right } from '../../../../core/domain/entity/right.entity';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';

export class addRightsMachineLearningRead1619447000003
  implements MigrationInterface {
  private tableName = 'role_right';
  public async up(): Promise<void> {
    const findMachineLearning = await this.findRoleMachineLearning();
    if (findMachineLearning && findMachineLearning.length > 0) {
      const values = [];
      const findMachineLearningId = await this.findRightMachineLearningId();
      if (findMachineLearningId && findMachineLearningId.length > 0) {
        values.push({
          roleId: findMachineLearning[0],
          rightId: findMachineLearningId[0],
        });
      }
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(this.tableName)
        .values(values)
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

  private async findRightMachineLearningId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = 
      '${UserRightsEnum.MACHINE_LEARNING_READ}'`,
    );
  }
}
