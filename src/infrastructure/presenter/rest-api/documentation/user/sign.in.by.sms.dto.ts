import { IsNumberString, Length, IsNumber, Min, Max } from 'class-validator';
import * as config from 'config';
import { ApiModelProperty } from '@nestjs/swagger';

export const MIN_PHONE_NUMBER = 1;
export const MAX_PHONE_NUMBER = 99999999999999999999;

export class SignInBySmsDto {
  @IsNumber()
  @Min(MIN_PHONE_NUMBER)
  @Max(MAX_PHONE_NUMBER)
  @ApiModelProperty({
    type: 'string',
    example: 12345678,
    required: true,
  })
  phone: number;

  @IsNumberString()
  @Length(4, 4)
  @ApiModelProperty({
    type: 'string',
    example: config.get('sms.notRandom'),
    required: true,
  })
  code: string;
}
