import {
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  MAX_PHONE_NUMBER_LENGTH,
  MIN_PHONE_NUMBER_LENGTH,
} from './sign.in.by.sms.dto';

export class SmsDto {
  @IsString()
  @MinLength(MIN_PHONE_NUMBER_LENGTH)
  @MaxLength(MAX_PHONE_NUMBER_LENGTH)
  @ApiModelProperty({
    type: 'string',
    example: '12345678',
    required: true,
  })
  phone: string;
}
