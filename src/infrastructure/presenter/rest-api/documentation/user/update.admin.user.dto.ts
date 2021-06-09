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
export class UpdateAdminUserDto {
  @IsString()
  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'Кот',
    required: false,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'Простоквашин',
    required: false,
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Котович',
    required: false,
  })
  surName?: string;

  @IsEmail()
  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'test@test.com',
    required: false,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(MIN_PHONE_NUMBER_LENGTH)
  @MaxLength(MAX_PHONE_NUMBER_LENGTH)
  @ApiModelProperty({
    type: 'string',
    example: '12345678',
    required: false,
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'ООО "Лысо-Котвской"',
    required: false,
  })
  organization?: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example:
      ' Заместитель Директор по управлению движения ручки двери входа в туалет',
    required: false,
  })
  position?: string;

  @IsInt()
  @IsOptional()
  @Min(MIN_ID_POSTGRES)
  @ApiModelProperty({
    description: 'id роли',
    type: 'number',
    example: '',
    required: true,
  })
  roleId?: number;
}
