import { EntityRepository, Repository } from 'typeorm';
import { UpdateUserDto } from '../../../infrastructure/presenter/rest-api/documentation/user/update.user.dto';
import { UserEntity } from '../entity/user.entity';
import * as moment from 'moment';
import { genSalt, hash } from 'bcryptjs';
import { RoleEntity } from '../entity/role.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(phone: string, role: RoleEntity): Promise<UserEntity> {
    const user = new UserEntity();
    user.role = role || null;
    user.phone = phone;
    await user.save();
    return user;
  }

  async createUserByEmail(
    email: string,
    password: string,
    role?: RoleEntity,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.role = role || null;
    user.email = email;
    user.password = await this.hashPassword(password);
    return user.save();
  }

  async findUserById(id: string): Promise<UserEntity | undefined> {
    return UserEntity.findOne(id);
  }

  async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();
    return hash(password, salt);
  }

  async updateUser(
    user: UserEntity,
    userUpdateDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const dtoKeys: string[] = Object.keys(userUpdateDto);

    if (dtoKeys.includes('firstName')) {
      user.firstName = userUpdateDto.firstName;
    }

    if (dtoKeys.includes('lastName')) {
      user.lastName = userUpdateDto.lastName;
    }

    if (dtoKeys.includes('email')) {
      user.email = userUpdateDto.email.toLowerCase();
    }

    if (dtoKeys.includes('password')) {
      user.password = await this.hashPassword(userUpdateDto.password);
    }

    return await user.save();
  }

  async updateResetCode(user: UserEntity, resetCode: string): Promise<void> {
    user.resetCode = resetCode;
    user.resetCodeExpirationDate = moment
      .utc()
      .add(15, 'minutes')
      .toDate();
    await user.save();
  }

  async deleteResetCode(user: UserEntity): Promise<void> {
    user.resetCode = null;
    user.resetCodeExpirationDate = null;
    await user.save();
  }

  async updatePassword(user: UserEntity, password: string): Promise<void> {
    user.password = await this.hashPassword(password);
    await user.save();
  }

  async resetSmsCode(user: UserEntity): Promise<void> {
    user.smsCode = null;
    await user.save();
  }

  async updateSmsCode(user: UserEntity, smsCode: string): Promise<void> {
    user.smsCode = smsCode;
    await user.save();
  }

  async updateLastCode(user: UserEntity): Promise<void> {
    user.lastCode = moment().toDate();
    await user.save();
  }
}
