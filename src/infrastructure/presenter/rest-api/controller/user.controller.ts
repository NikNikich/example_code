import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../../../../application/services/user.service';

import { GetUser } from '../../../decorators/get.user.decorator';
import * as config from 'config';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { User } from '../../../../core/domain/entity/user.entity';
import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { LogoutResponse } from '../../../response/user/logout.response';
import { SmsResponse } from '../../../response/user/sms.response';
import { SignInResponse } from '../../../response/user/sign.in.response';
import { MeResponse } from '../../../response/user/me.response';
import { SmsDto } from '../documentation/user/sms.dto';
import { SignInBySmsDto } from '../documentation/user/sign.in.by.sms.dto';
import { UpdateUserDto } from '../documentation/user/update.user.dto';
import { PasswordResetDto } from '../documentation/user/password.reset.dto';
import { PasswordRestoreDto } from '../documentation/user/password.restore.dto';
import { PasswordRestoreResponse } from '../../../response/user/password.restore.response';
import { SignInByEmailDto } from '../documentation/user/sign.in.by.email.dto';
import { SignUpByEmailDto } from '../documentation/user/sign.up.by.email.dto';
import { MILLISECONDS_IN_SECOND } from '../../../shared/constants';
import { Auth } from '../../../../core/common/decorators/auth';
import { UserRolesEnum } from '../../../shared/user.roles.enum';
import { ListUserResponse } from '../../../response/user/list.user.response';
import { NumberIdDto } from '../documentation/shared/number.id.dto';
import { UpdateAdminUserDto } from '../documentation/user/update.admin.user.dto';
import { CreateAdminUserDto } from '../documentation/user/create.admin.user.dto';
import { plainToClass } from 'class-transformer';
import { UpdatePasswordDto } from '../documentation/user/update.password.dto';

@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: ListUserResponse })
  @ApiOperation({ title: 'Вывести список пользователей' })
  async getListUser(
    @GetRequestId() requestId: string,
  ): Promise<ListUserResponse> {
    const users = await this.userService.getListUser();
    const listUser = new ListUserResponse(requestId, users);
    return plainToClass(ListUserResponse, listUser);
  }

  @Post()
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: MeResponse })
  @ApiOperation({ title: 'Создание пользователя администратором' })
  async createAdminUser(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) createAdminUserDto: CreateAdminUserDto,
  ): Promise<MeResponse> {
    const meResponse = new MeResponse(
      requestId,
      await this.userService.createAdminUser(createAdminUserDto, requestId),
    );
    return plainToClass(MeResponse, meResponse);
  }

  @Post('/me/password')
  @Auth()
  @ApiResponse({ status: HttpStatus.OK, type: SignInResponse })
  @ApiOperation({ title: 'Поменять пароль' })
  async updatePassword(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ): Promise<SignInResponse> {
    return new SignInResponse(
      requestId,
      await this.userService.updateMePassword(user, updatePasswordDto),
    );
  }

  @Post('/sms')
  @ApiResponse({ status: HttpStatus.CREATED, type: SmsResponse })
  @ApiOperation({
    title: 'Регистрация нового аккаунта или вход в существующий',
  })
  async sendSms(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) smsRequestDto: SmsDto,
  ): Promise<SmsResponse> {
    const newUser: boolean = await this.userService.sendSms(
      requestId,
      smsRequestDto,
    );
    return new SmsResponse(requestId, { newUser });
  }

  @Post('/signin/sms')
  @ApiResponse({ status: HttpStatus.CREATED, type: SignInResponse })
  @ApiOperation({
    title:
      'Используйте код 1234.' +
      ' Для авторизации к полученному токену нужно добавить слово Bearer и пробел. ' +
      ` Время жизни кода ${Number(config.get('sms.codeLifetime')) /
        MILLISECONDS_IN_SECOND} сек.` +
      ` Повторно отправить запрос на смс можно через ${Number(
        config.get('sms.minRepeatTime'),
      ) / MILLISECONDS_IN_SECOND} сек.`,
  })
  async signInBySms(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) signInRequestDto: SignInBySmsDto,
  ): Promise<SignInResponse> {
    return new SignInResponse(
      requestId,
      await this.userService.signInBySms(requestId, signInRequestDto),
    );
  }

  @Post('/signup/email')
  @ApiResponse({ status: HttpStatus.CREATED, type: SignInResponse })
  @ApiOperation({
    title: 'Регистрация пользователя с помощью email',
  })
  async signUpByEmail(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) signUpByEmailRequestDto: SignUpByEmailDto,
  ): Promise<SignInResponse> {
    return new SignInResponse(
      requestId,
      await this.userService.signUpByEmail(requestId, signUpByEmailRequestDto),
    );
  }

  @Post('/signin/email')
  @ApiResponse({ status: HttpStatus.CREATED, type: SignInResponse })
  @ApiOperation({
    title: 'Авторизация для пользователей админки',
  })
  async signInByEmail(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) signInByEmailRequestDto: SignInByEmailDto,
  ): Promise<SignInResponse> {
    return new SignInResponse(
      requestId,
      await this.userService.signInByEmail(requestId, signInByEmailRequestDto),
    );
  }

  @Post('/logout')
  @Auth()
  @ApiResponse({ status: HttpStatus.CREATED, type: LogoutResponse })
  @ApiOperation({
    title: 'Деактивировать jwt токен',
  })
  async logout(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
  ): Promise<LogoutResponse> {
    await this.userService.logout(requestId, user);
    return new LogoutResponse(requestId, null);
  }

  @Post('/password/restore')
  @ApiResponse({ status: HttpStatus.CREATED, type: PasswordRestoreResponse })
  @ApiOperation({
    title:
      'Запрос на восстановление пароля. Если email существует в системе, то будет отправлена ссылка. ' +
      'Если email не существует, то ничего не произойдёт.',
  })
  async restorePassword(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) passwordRestoreDto: PasswordRestoreDto,
  ): Promise<PasswordRestoreResponse> {
    await this.userService.passwordRestore(requestId, passwordRestoreDto);
    return new PasswordRestoreResponse(requestId, null);
  }

  @Post('/password/reset')
  @ApiResponse({ status: HttpStatus.CREATED, type: SignInResponse })
  @ApiOperation({
    title: 'Смена пароля, используя код из письма',
  })
  async resetPassword(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) passwordResetRequestDto: PasswordResetDto,
  ): Promise<SignInResponse> {
    return new SignInResponse(
      requestId,
      await this.userService.passwordReset(requestId, passwordResetRequestDto),
    );
  }

  @Get('/me')
  @Auth()
  @ApiResponse({ status: HttpStatus.OK, type: MeResponse })
  @ApiOperation({ title: 'Информация об авторизованном юзере' })
  async getMe(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
  ): Promise<MeResponse> {
    const meResponse = new MeResponse(requestId, user);
    return plainToClass(MeResponse, meResponse);
  }

  @Put('/me')
  @Auth()
  @ApiResponse({ status: HttpStatus.OK, type: MeResponse })
  @ApiOperation({ title: 'Редактирование полей юзера' })
  async editMyself(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
    @Body(ValidationPipe) userUpdateDto: UpdateUserDto,
  ): Promise<MeResponse> {
    const meResponse = new MeResponse(
      requestId,
      await this.userService.editMyself(user, userUpdateDto),
    );
    return plainToClass(MeResponse, meResponse);
  }

  @Get('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: MeResponse })
  @ApiOperation({ title: 'Выдаёт данные пользователя по его id' })
  async getUserById(
    @GetRequestId() requestId: string,
    @Param(
      new ValidationPipe({
        transform: true,
      }),
    )
    idDto: NumberIdDto,
  ): Promise<MeResponse> {
    const user = await this.userService.getUserById(idDto);
    const meResponse = new MeResponse(requestId, user);
    return plainToClass(MeResponse, meResponse);
  }

  @Put('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: MeResponse })
  @ApiOperation({ title: 'Изменение пользователя администратором' })
  async editUser(
    @GetRequestId() requestId: string,
    @Param(
      new ValidationPipe({
        transform: true,
      }),
    )
    idDto: NumberIdDto,
    @Body(ValidationPipe) userUpdateDto: UpdateAdminUserDto,
  ): Promise<MeResponse> {
    const meResponse = new MeResponse(
      requestId,
      await this.userService.updateAdminUser(idDto, userUpdateDto),
    );
    return plainToClass(MeResponse, meResponse);
  }

  @Delete('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: LogoutResponse })
  @ApiOperation({ title: 'Изменение пользователя администратором' })
  async deleteUser(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<LogoutResponse> {
    await this.userService.deleteAdminUser(idDto);
    return new LogoutResponse(requestId, null);
  }
}
