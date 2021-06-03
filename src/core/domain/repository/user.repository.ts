import { EntityRepository, FindConditions, IsNull, Repository } from 'typeorm';
import { UpdateUserDto } from '../../../infrastructure/presenter/rest-api/documentation/user/update.user.dto';
import * as moment from 'moment';
import { genSalt, hash } from 'bcryptjs';
import { Role } from '../entity/role.entity';
import { UpdateAdminUserDto } from '../../../infrastructure/presenter/rest-api/documentation/user/update.admin.user.dto';
import * as _ from 'lodash';
import { CreateAdminUserDto } from '../../../infrastructure/presenter/rest-api/documentation/user/create.admin.user.dto';
import { User } from '../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(phone: string, role: Role): Promise<User> {
    const user = new User();
    user.role = role || null;
    user.phone = phone;
    await user.save();
    return user;
  }

  async createUserByEmail(
    email: string,
    password: string,
    role?: Role,
  ): Promise<User> {
    const user = new User();
    user.role = role || null;
    user.email = email;
    user.password = await this.hashPassword(password);
    return user.save();
  }

  async findUserByIdWithDeleted(id: number): Promise<User | undefined> {
    return User.findOne(id, {
      withDeleted: true,
      relations: ['role', 'equipmentOwner'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();
    return hash(password, salt);
  }

  async updateUser(user: User, userUpdateDto: UpdateUserDto): Promise<User> {
    const dtoKeys: string[] = Object.keys(userUpdateDto);

    if (dtoKeys.includes('firstName')) {
      user.firstName = userUpdateDto.firstName;
    }

    if (dtoKeys.includes('surName')) {
      user.surName = userUpdateDto.surName;
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

  async updateAdminUser(
    user: User,
    updateUserDto: UpdateAdminUserDto,
  ): Promise<User> {
    const userNew = user;
    _.assign(userNew, updateUserDto);
    return await userNew.save();
  }

  async createAdminUser(
    createUserDto: CreateAdminUserDto,
    role: Role,
    password: string,
  ): Promise<User> {
    const userNew = new User();
    _.assign(userNew, createUserDto);
    userNew.role = role;
    userNew.password = await this.hashPassword(password);
    return await userNew.save();
  }

  async updateResetCode(user: User, resetCode: string): Promise<void> {
    user.resetCode = resetCode;
    user.resetCodeExpirationDate = moment
      .utc()
      .add(15, 'minutes')
      .toDate();
    await user.save();
  }

  async deleteResetCode(user: User): Promise<void> {
    user.resetCode = null;
    user.resetCodeExpirationDate = null;
    await user.save();
  }

  async updatePassword(user: User, password: string): Promise<User> {
    user.password = await this.hashPassword(password);
    return user.save();
  }

  async resetSmsCode(user: User): Promise<void> {
    user.smsCode = null;
    await user.save();
  }

  async updateSmsCode(user: User, smsCode: string): Promise<void> {
    user.smsCode = smsCode;
    await user.save();
  }

  async updateLastCode(user: User): Promise<void> {
    user.lastCode = moment().toDate();
    await user.save();
  }

  async getListNotDeleteUser(role?: Role): Promise<User[]> {
    const where: FindConditions<User> = { deletedAt: IsNull() };
    if (role) {
      where.role = role;
    }
    return this.find({
      where,
      relations: ['role', 'equipmentOwner'],
    });
  }

  async getUserByIdNotDelete(id: number): Promise<User | undefined> {
    return this.findOne({ where: { id, deletedAt: IsNull() } });
  }
}
