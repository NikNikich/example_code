import { getConnection, MigrationInterface } from 'typeorm';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';
import { Right } from '../../../../core/domain/entity/right.entity';

export class addRightLimitedEquipmentWright1619446003623
  implements MigrationInterface {
  private data = [{ name: UserRightsEnum.EQUIPMENT_LIMITED_WRIGHT }];

  public async up(): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Right.name)
      .values(this.data)
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
