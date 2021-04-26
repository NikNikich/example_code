import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { RoleEntity } from '../../../core/domain/entity/role.entity';
import { UserRolesEnum } from '../../shared/user.roles.enum';
import { UserEntity } from '../../../core/domain/entity/user.entity';

export class addUserAdmin1619445993614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new UserEntity();
    user.firstName = 'Admin';
    user.lastName = 'Admin';
    user.surName = 'Admin';
    user.email = 'admin@email.com';
    user.password = await hash('password', await genSalt());
    const findAdmin = await this.findRoleAdmin();
    if (findAdmin && findAdmin.length > 0) {
      user.role = findAdmin[0];
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserEntity.name)
        .values(user)
        .execute();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  private async findRoleAdmin(): Promise<RoleEntity[] | undefined> {
    const manager = getConnection().manager;
    return manager.query(
      `SELECT m.id FROM role AS m WHERE m."name" = '${UserRolesEnum.ADMIN}'`,
    );
  }
}
