import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../core/domain/entity/user.entity';
import * as config from 'config';
import { HtmlRender } from '../../infrastructure/presenter/html.render';
import { PdfRender } from '../../infrastructure/presenter/pdf.render';
import { UpdateUserDto } from '../../infrastructure/presenter/rest-api/documentation/user/update.user.dto';
import { SignInBySmsDto } from '../../infrastructure/presenter/rest-api/documentation/user/sign.in.by.sms.dto';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  INVALID_CREDENTIALS,
  PASSWORD_IS_EMPTY,
  SMS_TOO_OFTEN,
  USED_EMAIL,
  USER_NOT_FOUND,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { SmsDto } from '../../infrastructure/presenter/rest-api/documentation/user/sms.dto';
import { JwtPayload } from '../../core/domain/service/jwt/jwt.payload.interface';
import { EmailSend } from '../../infrastructure/transport/email.send.interface';
import { EmailTransport } from '../../infrastructure/transport/email.transport';
import { SmsTransport } from '../../infrastructure/transport/sms.transport';
import { Notifications } from '../../infrastructure/transport/notifications.transport';
import { SignInByEmailDto } from '../../infrastructure/presenter/rest-api/documentation/user/sign.in.by.email.dto';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { compare } from 'bcryptjs';
import { PasswordRestoreDto } from '../../infrastructure/presenter/rest-api/documentation/user/password.restore.dto';
import { PasswordResetDto } from '../../infrastructure/presenter/rest-api/documentation/user/password.reset.dto';
import { SessionRepository } from '../../core/domain/repository/session.repository';
import { Session } from '../../core/domain/entity/session.entity';
import { SignUpByEmailDto } from '../../infrastructure/presenter/rest-api/documentation/user/sign.up.by.email.dto';
import { SingInResponseDto } from '../../infrastructure/response/user/sign.in.response';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { UserRolesEnum } from '../../infrastructure/shared/user.roles.enum';
import { UpdateAdminUserDto } from '../../infrastructure/presenter/rest-api/documentation/user/update.admin.user.dto';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { CreateAdminUserDto } from '../../infrastructure/presenter/rest-api/documentation/user/create.admin.user.dto';
import * as generator from 'generate-password';
import { AddUserEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/user/add.user.equipment.dto';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { BuildingRepository } from '../../core/domain/repository/building.repository';
import { UpdatePasswordDto } from '../../infrastructure/presenter/rest-api/documentation/user/update.password.dto';
import { NumberEquipmentIdDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/number.equipment.id.dto';

const REPEAT_SMS_TIME_MS: number = config.get('sms.minRepeatTime');
const emailTransport = new EmailTransport();

@Injectable()
export class UserService {
  constructor(
    private roleRepository: RoleRepository,

    private userRepository: UserRepository,

    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,

    private jwtService: JwtService,

    private equipmentRepository: EquipmentRepository,

    private buildingRepository: BuildingRepository,
  ) {}

  private lengthPassword = 10;

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { phone }, withDeleted: true });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, withDeleted: true });
  }

  async getUserByEmailNotDeleted(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async editMyself(user: User, userUpdateDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(user, userUpdateDto);
  }

  async updateAdminUser(
    idDto: NumberIdDto,
    userUpdateDto: UpdateAdminUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne(
      { id: idDto.id },
      { withDeleted: true },
    );
    ErrorIf.isEmpty(user, USER_NOT_FOUND);
    if (userUpdateDto.email) {
      const userEmail = await this.getUserByEmail(
        userUpdateDto.email.toLowerCase(),
      );
      if (userEmail && userEmail.id !== user.id) {
        ErrorIf.isExist(userEmail, USED_EMAIL);
      }
    }
    return this.userRepository.updateAdminUser(user, userUpdateDto);
  }

  async deleteAdminUser(idDto: NumberIdDto): Promise<void> {
    const user = await this.userRepository.findOne(idDto.id);
    ErrorIf.isEmpty(user, USER_NOT_FOUND);
    await this.equipmentRepository.deleteOwnerFromEquipments(user);
    user.softRemove();
  }

  async createAdminUser(
    createAdminUserDto: CreateAdminUserDto,
    requestId: string,
  ): Promise<User> {
    const user = await this.getUserByEmail(
      createAdminUserDto.email.toLowerCase(),
    );
    ErrorIf.isExist(user, USED_EMAIL);
    const password = generator.generate({
      length: this.lengthPassword,
      numbers: true,
    });
    const role = await this.roleRepository.findOne({
      where: { name: UserRolesEnum.USER },
    });
    const newUser = await this.userRepository.createAdminUser(
      createAdminUserDto,
      role,
      password,
    );
    await this.sendRestoreEmail(requestId, newUser);
    return newUser;
  }

  async createUserByPhone(phone: string): Promise<User> {
    const role = await this.roleRepository.findOne({
      name: UserRolesEnum.USER,
    });
    return this.userRepository.createUser(phone, role);
  }

  async createUserByEmail(email: string, password: string): Promise<User> {
    const role = await this.roleRepository.findOne({
      name: UserRolesEnum.USER,
    });
    return this.userRepository.createUserByEmail(email, password, role);
  }

  async signInBySms(
    requestId: string,
    signInRequestDto: SignInBySmsDto,
  ): Promise<SingInResponseDto> {
    const user = await this.getUserByPhone(signInRequestDto.phone);
    if (!user) {
      ErrorIf.isTrue(true, INVALID_CREDENTIALS);
    }

    const backdoorPhones: string[] = config.get('sms.backdoorPhones');
    const backdoorCodes: string[] = config.get('sms.backdoorCodes');

    if (
      backdoorPhones.includes(user.phone.toString()) &&
      backdoorCodes.includes(signInRequestDto.code)
    ) {
      await Notifications.send(
        '🔑 Authentication via BACKDOOR +' + user.phone + ' UserId: ' + user.id,
        false,
        requestId,
      );
    } else if (config.get('sms.sendRealSms')) {
      ErrorIf.isFalse(
        signInRequestDto.code === user.smsCode,
        INVALID_CREDENTIALS,
      );
      await Notifications.send(
        '🔑 Authentication via SMS +' + user.phone + ' UserId: ' + user.id,
        false,
        requestId,
      );
    } else {
      ErrorIf.isFalse(
        signInRequestDto.code === config.get('sms.notRandom'),
        INVALID_CREDENTIALS,
      );
      await Notifications.send(
        '🔑 Authentication via 1234 +' + user.phone + ' UserId: ' + user.id,
        false,
        requestId,
      );
    }
    await this.userRepository.resetSmsCode(user);

    const token = await this.generateJwtToken(user);
    return { token };
  }

  async signInByEmail(
    requestId: string,
    signInByEmailRequestDto: SignInByEmailDto,
  ): Promise<SingInResponseDto> {
    const user = await this.getUserByEmail(
      signInByEmailRequestDto.email.toLowerCase(),
    );

    ErrorIf.isEmpty(user, INVALID_CREDENTIALS);
    ErrorIf.isTrue(user.deletedAt !== null, INVALID_CREDENTIALS);
    ErrorIf.isFalse(
      await this.comparePassword(user, signInByEmailRequestDto.password),
      INVALID_CREDENTIALS,
    );

    await Notifications.send(
      '🔑 Authentication via EMAIL +' + user.email + ' UserId: ' + user.id,
      false,
      requestId,
    );
    const token = await this.generateJwtToken(user);
    return { token };
  }

  generateRandomString(): string {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '_');
  }

  async generateJwtToken(user: User): Promise<string> {
    const token = this.generateRandomString();
    await this.sessionRepository.createSession(user.id, token);
    const payload: JwtPayload = { token };
    return this.jwtService.sign(payload);
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    ErrorIf.isEmpty(user.password, PASSWORD_IS_EMPTY);
    return compare(password, user.password);
  }

  async logout(requestId: string, user: User): Promise<void> {
    const sessions: Session[] = await this.sessionRepository.getSessionsByUserId(
      user.id,
    );
    for (const session of sessions) {
      await this.sessionRepository.deleteSession(session);
    }
  }

  async passwordRestore(
    requestId: string,
    passwordRestoreDto: PasswordRestoreDto,
  ): Promise<void> {
    const user = await this.getUserByEmailNotDeleted(
      passwordRestoreDto.email.toLowerCase(),
    );
    ErrorIf.isEmpty(user, USER_NOT_FOUND);

    await this.sendRestoreEmail(requestId, user);
  }

  async updateMePassword(
    user: User,
    passwordUpdateDto: UpdatePasswordDto,
  ): Promise<SingInResponseDto> {
    ErrorIf.isFalse(
      await this.comparePassword(user, passwordUpdateDto.oldPassword),
      INVALID_CREDENTIALS,
    );
    const updateUser = await this.userRepository.updatePassword(
      user,
      passwordUpdateDto.password,
    );
    const token = await this.generateJwtToken(updateUser);
    return { token };
  }

  async passwordReset(
    requestId: string,
    passwordResetRequestDto: PasswordResetDto,
  ): Promise<SingInResponseDto> {
    const user = await this.getUserByResetCode(
      passwordResetRequestDto.resetCode,
    );
    ErrorIf.isEmpty(user, USER_NOT_FOUND);

    await this.userRepository.deleteResetCode(user);
    await this.userRepository.updatePassword(
      user,
      passwordResetRequestDto.password,
    );

    await Notifications.send(
      '🔑 Authentication via password reset +' +
        user.email +
        ' UserId: ' +
        user.id,
      false,
      requestId,
    );

    const token = await this.generateJwtToken(user);
    return { token };
  }

  async getUserById(idDto: NumberIdDto): Promise<User> {
    const user = await this.userRepository.findUserByIdWithDeleted(idDto.id);
    ErrorIf.isEmpty(user, USER_NOT_FOUND);
    return user;
  }

  async getUserByResetCode(resetCode: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { resetCode } });
  }

  async getListUser(): Promise<User[]> {
    return this.userRepository.getListNotDeleteUser();
  }

  async generateSmsCode(): Promise<string> {
    const min = 1000; // TODO: move to config
    const max = 9999; // TODO: move to config
    return Math.round(min - 0.5 + Math.random() * (max - min + 1)).toString();
  }

  async sendSms(requestId: string, smsRequestDto: SmsDto): Promise<boolean> {
    let newUser = false;
    const { phone } = smsRequestDto;
    let user: User | undefined = await this.getUserByPhone(phone);
    if (!user) {
      user = await this.createUserByPhone(phone);
      newUser = true;
      await Notifications.send(
        '🙋 New user +' + phone + ' UserId: ' + user.id,
        false,
        requestId,
      );
    }
    ErrorIf.isTrue(user.lastCode && this.isFewTime(user), SMS_TOO_OFTEN);

    const code: string = await this.generateSmsCode();

    await this.userRepository.updateLastCode(user);
    await this.userRepository.updateSmsCode(user, code);
    const smsText = `Hello! This is your code: ${code}`;
    await this.backdoorCheck(user.phone, smsText, requestId, user.id);
    return newUser;
  }

  async signUpByEmail(
    requestId: string,
    signUpByEmailRequestDto: SignUpByEmailDto,
  ): Promise<SingInResponseDto> {
    const { email, password } = signUpByEmailRequestDto;
    let user: User | undefined = await this.getUserByEmail(email);
    if (!user) {
      user = await this.createUserByEmail(email, password);
      await Notifications.send(
        '🙋 New user +' + email + ' UserId: ' + user.id,
        false,
        requestId,
      );
    }
    const token = await this.generateJwtToken(user);
    return { token };
  }

  async backdoorCheck(
    phone: string,
    smsText: string,
    requestId: string,
    userId: number,
  ): Promise<void> {
    const backdoorPhones: string[] = config.get('sms.backdoorPhones');
    if (backdoorPhones.includes(phone.toString())) {
      await Notifications.send(
        '📱 Sms request: BACKDOOR +' +
          phone +
          ' UserId: ' +
          userId +
          ' Payload: ' +
          smsText,
        false,
        requestId,
      );
    } else if (config.get('sms.sendRealSms')) {
      const transport = new SmsTransport();
      await transport.send(phone.toString(), smsText, requestId, userId);
    } else {
      await Notifications.send(
        '📱 Sms request: 1234 +' +
          phone +
          ' UserId: ' +
          userId +
          ' Payload: ' +
          smsText,
        false,
        requestId,
      );
    }
  }

  isFewTime(user: User): boolean {
    const diff = moment.utc().diff(moment.utc(user.lastCode), 'milliseconds');
    return diff < REPEAT_SMS_TIME_MS;
  }

  async sendEmail(
    requestId: string,
    user: User,
    html: string,
    content: Buffer,
    subject: string,
    payload: string,
  ): Promise<void> {
    const emailData: EmailSend = {
      recipientEmails: [user.email],
      subject,
      payload,
      html,
      requestId: requestId,
      userId: user.id,
      attachments: [
        {
          content,
          filename: 'certificate.pdf',
        },
      ],
    };
    await emailTransport.send(emailData);
  }
  async addUserEquipment(
    idDto: NumberIdDto,
    addUserEquipmentDto: AddUserEquipmentDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne(idDto.id);
    ErrorIf.isEmpty(user, USER_NOT_FOUND);
    const equipment = await this.equipmentRepository.findOne(
      addUserEquipmentDto.equipmentId,
    );
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    const building = await this.buildingRepository.getBuildingByAddress(
      addUserEquipmentDto.address,
    );
    equipment.useStatus = addUserEquipmentDto.status;
    equipment.owner = user;
    equipment.building = building;
    equipment.address = addUserEquipmentDto.address.value;
    equipment.save();
  }

  async deleteUserEquipment(
    idDto: NumberIdDto,
    equipmentIdDto: NumberEquipmentIdDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne(idDto.id);
    ErrorIf.isEmpty(user, USER_NOT_FOUND);
    const equipment = await this.equipmentRepository.findOne(
      equipmentIdDto.equipmentId,
    );
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    await this.equipmentRepository.deleteOwner(equipment);
  }

  async sendRestoreEmail(requestId: string, user: User): Promise<void> {
    const resetCode = this.generateRandomString();
    await this.userRepository.updateResetCode(user, resetCode);

    const resetLink = `${config.get('restoreURL')}/${resetCode}`;
    const html: string = await HtmlRender.renderResetPasswordEmail({
      resetLink,
    });

    const pdfHtml: string = await HtmlRender.renderGiftCertificate({
      resetLink,
    });
    const content: Buffer = await PdfRender.renderPdf(pdfHtml);

    this.sendEmail(
      requestId,
      user,
      html,
      content,
      'Reset Password',
      'Hello! Reset link is here!',
    );

    await Notifications.send(
      '🔑 Password restore from EMAIL +' + user.email + ' UserId: ' + user.id,
      false,
      requestId,
    );
  }
}
