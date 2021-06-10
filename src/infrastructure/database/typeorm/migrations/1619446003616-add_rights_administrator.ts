import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';
import { Right } from '../../../../core/domain/entity/right.entity';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';

export class addRightsAdministrator1619446003616 implements MigrationInterface {
  private tableName = 'role_right';
  public async up(): Promise<void> {
    const findAdmin = await this.findRoleAdmin();
    const findRightAllId = await this.findRightAllId();
    if (
      findAdmin &&
      findAdmin.length > 0 &&
      findRightAllId &&
      findRightAllId.length > 0
    ) {
      const values = [{ roleId: findAdmin[0], rightId: findRightAllId[0] }];
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

  private async findRoleAdmin(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.ADMIN}'`,
    );
  }

  private async findRightAllId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.ALL}'`,
    );
  }
}
