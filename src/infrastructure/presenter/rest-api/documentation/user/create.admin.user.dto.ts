import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MAX_PHONE_NUMBER, MIN_PHONE_NUMBER } from './sign.in.by.sms.dto';
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
  @MinLength(MIN_PHONE_NUMBER)
  @MaxLength(MAX_PHONE_NUMBER)
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
}
