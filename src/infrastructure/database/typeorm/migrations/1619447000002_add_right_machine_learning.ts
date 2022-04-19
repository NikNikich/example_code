import { getConnection, MigrationInterface } from 'typeorm';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';
import { Right } from '../../../../core/domain/entity/right.entity';

export class addRightMachineLearning1619447000002
  implements MigrationInterface {
  private data = [{ name: UserRightsEnum.MACHINE_LEARNING_READ }];

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
