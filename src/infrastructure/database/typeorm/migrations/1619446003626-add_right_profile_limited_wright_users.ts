import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';
import { Right } from '../../../../core/domain/entity/right.entity';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';

export class addRightProfileLimitedWrightUsers1619446003626
  implements MigrationInterface {
  private tableName = 'role_right';
  public async up(): Promise<void> {
    const findProfileLimitedWrightId = await this.findProfileLimitedWrightId();
    if (findProfileLimitedWrightId && findProfileLimitedWrightId.length > 0) {
      const values = [];
      const findDealer = await this.findRoleDealer();
      if (findDealer && findDealer.length > 0) {
        values.push({
          roleId: findDealer[0],
          rightId: findProfileLimitedWrightId[0],
        });
      }
      const findDealerService = await this.findRoleDealerService();
      if (findDealerService && findDealerService.length > 0) {
        values.push({
          roleId: findDealerService[0],
          rightId: findProfileLimitedWrightId[0],
        });
      }
      const findClient = await this.findRoleClient();
      if (findClient && findClient.length > 0) {
        values.push({
          roleId: findClient[0],
          rightId: findProfileLimitedWrightId[0],
        });
      }
      const findClientService = await this.findRoleClientService();
      if (findClientService && findClientService.length > 0) {
        values.push({
          roleId: findClientService[0],
          rightId: findProfileLimitedWrightId[0],
        });
      }
      const findManufacture = await this.findRoleManufacture();
      if (findManufacture && findManufacture.length > 0) {
        values.push({
          roleId: findManufacture[0],
          rightId: findProfileLimitedWrightId[0],
        });
      }
      const findManufactureService = await this.findRoleManufactureService();
      if (findManufactureService && findManufactureService.length > 0) {
        values.push({
          roleId: findManufactureService[0],
          rightId: findProfileLimitedWrightId[0],
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

  private async findRoleDealerService(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.DEALER_SERVICE}'`,
    );
  }

  private async findRoleClient(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.CLIENT}'`,
    );
  }

  private async findRoleClientService(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.CLIENT_SERVICE}'`,
    );
  }

  private async findRoleManufacture(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.MANUFACTURER}'`,
    );
  }

  private async findRoleManufactureService(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.MANUFACTURER_SERVICE}'`,
    );
  }

  private async findProfileLimitedWrightId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.PROFILE_LIMITED_WRIGHT}'`,
    );
  }
}
