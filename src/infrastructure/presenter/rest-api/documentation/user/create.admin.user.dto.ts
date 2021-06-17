import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  MAX_PHONE_NUMBER_LENGTH,
  MIN_PHONE_NUMBER_LENGTH,
} from './sign.in.by.sms.dto';
import { MIN_ID_POSTGRES } from '../../../../shared/constants';
export class CreateAdminUserDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Кот',
    required: true,
  })
  firstName: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Простоквашин',
    required: true,
  })
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Котович',
    required: false,
  })
  surName?: string;

  @IsEmail()
  @ApiModelProperty({
    type: 'string',
    example: 'test@test.com',
    required: true,
  })
  email: string;

  @IsString()
  @MinLength(MIN_PHONE_NUMBER_LENGTH)
  @MaxLength(MAX_PHONE_NUMBER_LENGTH)
  @ApiModelProperty({
    type: 'string',
    example: '12345678',
    required: true,
  })
  phone: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'ООО "Лысо-Котвской"',
    required: true,
  })
  organization: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example:
      ' Заместитель Директор по управлению движения ручки двери входа в туалет',
    required: true,
  })
  position: string;

  @IsInt()
  @Min(MIN_ID_POSTGRES)
  @ApiModelProperty({
    description: 'id роли',
    type: 'number',
    example: 2,
    required: true,
  })
  roleId: number;
}
