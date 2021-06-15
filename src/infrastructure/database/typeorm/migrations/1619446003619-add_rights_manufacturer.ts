import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';
import { Right } from '../../../../core/domain/entity/right.entity';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';

export class addRightsManufacturer1619446003619 implements MigrationInterface {
  private tableName = 'role_right';
  public async up(): Promise<void> {
    const findManufacturer = await this.findRoleManufacturer();
    if (findManufacturer && findManufacturer.length > 0) {
      const values = [];
      const findRightUserReadId = await this.findRightUserReadId();
      if (findRightUserReadId && findRightUserReadId.length > 0) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightUserReadId[0],
        });
      }
      const findRightUserWriteId = await this.findRightUserWrightId();
      if (findRightUserWriteId && findRightUserWriteId.length > 0) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightUserWriteId[0],
        });
      }
      const findRightEquipmentReadId = await this.findRightEquipmentReadId();
      if (findRightEquipmentReadId && findRightEquipmentReadId.length > 0) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightEquipmentReadId[0],
        });
      }
      const findRightEquipmentWriteId = await this.findRightEquipmentWriteId();
      if (findRightEquipmentWriteId && findRightEquipmentWriteId.length > 0) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightEquipmentWriteId[0],
        });
      }
      const findRightEquipmentSettingsReadId = await this.findRightEquipmentSettingsReadId();
      if (
        findRightEquipmentSettingsReadId &&
        findRightEquipmentSettingsReadId.length > 0
      ) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightEquipmentSettingsReadId[0],
        });
      }
      const findRightEquipmentSettingsWrightId = await this.findRightEquipmentSettingsWrightId();
      if (
        findRightEquipmentSettingsWrightId &&
        findRightEquipmentSettingsWrightId.length > 0
      ) {
        values.push({
          roleId: findManufacturer[0],
          rightId: findRightEquipmentSettingsWrightId[0],
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

  private async findRoleManufacturer(): Promise<Role[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM role AS r WHERE r."name" = '${UserRolesEnum.MANUFACTURER}'`,
    );
  }

  private async findRightUserWrightId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.USER_WRIGHT}'`,
    );
  }

  private async findRightUserReadId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.USER_READ}'`,
    );
  }

  private async findRightEquipmentSettingsWrightId(): Promise<
    Right[] | undefined
  > {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.EQUIPMENT_SETTINGS_WRIGHT}'`,
    );
  }

  private async findRightEquipmentSettingsReadId(): Promise<
    Right[] | undefined
  > {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.EQUIPMENT_SETTINGS_READ}'`,
    );
  }

  private async findRightEquipmentReadId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.EQUIPMENT_READ}'`,
    );
  }

  private async findRightEquipmentWriteId(): Promise<Right[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT r.id FROM "right" AS r WHERE r."name" = '${UserRightsEnum.EQUIPMENT_WRIGHT}'`,
    );
  }
}
