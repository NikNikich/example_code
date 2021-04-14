import { EntityRepository, Repository } from 'typeorm';
import { UpdateUserDto } from '../../../infrastructure/presenter/rest-api/documentation/user/update.user.dto';
import { User } from '../entity/user.entity';
import * as moment from 'moment';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(phone: string): Promise<User> {
    const user = new User();
    user.phone = phone;
    await user.save();
    return user;
  }

  async createUserByEmail(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = await this.hashPassword(password);
    return user.save();
  }

  async findUserById(id: string): Promise<User | undefined> {
    return User.findOne(id);
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

    if (dtoKeys.includes('lastName')) {
      user.lastName = userUpdateDto.lastName;
    }

    if (dtoKeys.includes('birthday')) {
      user.birthday = moment(userUpdateDto.birthday).toDate();
    }

    if (dtoKeys.includes('email')) {
      user.email = userUpdateDto.email.toLowerCase();
    }

    if (dtoKeys.includes('password')) {
      user.password = await this.hashPassword(userUpdateDto.password);
    }

    return await user.save();
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

  async updatePassword(user: User, password: string): Promise<void> {
    user.password = await this.hashPassword(password);
    await user.save();
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
}
