import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MAX_PHONE_NUMBER_LENGTH,
  MIN_PHONE_NUMBER_LENGTH,
} from './sign.in.by.sms.dto';
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
}
