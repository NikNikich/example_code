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
  INVALID_CREDENTIALS,
  PASSWORD_IS_EMPTY,
  SMS_TOO_OFTEN,
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

const REPEAT_SMS_TIME_MS: number = config.get('sms.minRepeatTime');
const emailTransport = new EmailTransport();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,

    private jwtService: JwtService,
  ) {}

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { phone } });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async editMyself(user: User, userUpdateDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(user, userUpdateDto);
  }

  async createUserByPhone(phone: string): Promise<User> {
    return this.userRepository.createUser(phone);
  }

  async createUserByEmail(email: string, password: string): Promise<User> {
    return this.userRepository.createUserByEmail(email, password);
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
      backdoorPhones.includes(user.phone) &&
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
    const user = await this.getUserByEmail(
      passwordRestoreDto.email.toLowerCase(),
    );
    if (!user) {
      return;
    }

    const resetCode = this.generateRandomString();
    await this.userRepository.updateResetCode(user, resetCode);

    const resetLink =
      'addreallink.com' + '/change_password?resetCode=' + resetCode;
    const html: string = await HtmlRender.renderResetPasswordEmail({
      resetLink,
    });

    const pdfHtml: string = await HtmlRender.renderGiftCertificate({
      resetLink,
    });
    const content: Buffer = await PdfRender.renderPdf(pdfHtml);

    const emailData: EmailSend = {
      recipientEmails: [user.email],
      subject: 'Reset Password Request',
      payload: 'Hello! Reset link is here!',
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

    await Notifications.send(
      '🔑 Password restore from EMAIL +' + user.email + ' UserId: ' + user.id,
      false,
      requestId,
    );
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

  async getUserByResetCode(resetCode: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { resetCode } });
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
    if (backdoorPhones.includes(phone)) {
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
      await transport.send(phone, smsText, requestId, userId);
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
}
