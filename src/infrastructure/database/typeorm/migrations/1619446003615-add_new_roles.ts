import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/user.roles.enum';

export class addNewRoles1619446003615 implements MigrationInterface {
  private dataStatus = [
    { name: UserRolesEnum.CLIENT },
    { name: UserRolesEnum.CLIENT_SERVICE },
    { name: UserRolesEnum.DEALER },
    { name: UserRolesEnum.DEALER_SERVICE },
    { name: UserRolesEnum.MANUFACTURER },
    { name: UserRolesEnum.MANUFACTURER_SERVICE },
  ];

  public async up(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Role.name)
      .values(this.dataStatus)
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
