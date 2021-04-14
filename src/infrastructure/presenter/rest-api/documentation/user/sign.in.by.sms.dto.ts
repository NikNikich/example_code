import {
  IsString,
  MaxLength,
  MinLength,
  IsNumberString,
  Length,
} from 'class-validator';
import * as config from 'config';
import { ApiModelProperty } from '@nestjs/swagger';

export const MIN_PHONE_NUMBER_LENGTH = 4;
export const MAX_PHONE_NUMBER_LENGTH = 20;

export class SignInBySmsDto {
  @IsString()
  @MinLength(MIN_PHONE_NUMBER_LENGTH)
  @MaxLength(MAX_PHONE_NUMBER_LENGTH)
  @ApiModelProperty({
    type: 'string',
    example: '12345678',
    required: true,
  })
  phone: string;

  @IsNumberString()
  @Length(4, 4)
  @ApiModelProperty({
    type: 'string',
    example: config.get('sms.notRandom'),
    required: true,
  })
  code: string;
}
