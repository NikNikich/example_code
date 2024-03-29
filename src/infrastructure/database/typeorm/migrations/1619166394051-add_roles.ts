import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';

export class addRoles1619166394051 implements MigrationInterface {
  private dataStatus = [
    { name: UserRolesEnum.USER },
    { name: UserRolesEnum.ADMIN },
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
