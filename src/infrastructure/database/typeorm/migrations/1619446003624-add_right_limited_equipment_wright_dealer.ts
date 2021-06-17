import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';
import { Right } from '../../../../core/domain/entity/right.entity';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';

export class addRightsLimitedEquipmentWrightDealer1619446003624
  implements MigrationInterface {
  private tableName = 'role_right';
  public async up(): Promise<void> {
    const findDealer = await this.findRoleDealer();
    if (findDealer && findDealer.length > 0) {
      const values = [];
      const findEquipmentLimitedWrightId = await this.findRightEquipmentLimitedWrightId();
      if (
        findEquipmentLimitedWrightId &&
        findEquipmentLimitedWrightId.length > 0
      ) {
        values.push({
          roleId: findDealer[0],
          rightId: findEquipmentLimitedWrightId[0],
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

  private async findRoleDealer(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.DEALER}'`,
    );
  }

  private async findRightEquipmentLimitedWrightId(): Promise<
    Right[] | undefined
  > {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.EQUIPMENT_LIMITED_WRIGHT}'`,
    );
  }
}
