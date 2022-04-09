import { getConnection, MigrationInterface } from 'typeorm';
import { Role } from '../../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../../shared/enum/user.roles.enum';

export class addRoleMachineLearning1619447000001 implements MigrationInterface {
  private dataStatus = [{ name: UserRolesEnum.MACHINE_LEARNING }];

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
