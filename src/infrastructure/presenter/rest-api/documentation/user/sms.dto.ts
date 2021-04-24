import { IsNumber, Max, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { MAX_PHONE_NUMBER, MIN_PHONE_NUMBER } from './sign.in.by.sms.dto';

export class SmsDto {
  @IsNumber()
  @Min(MIN_PHONE_NUMBER)
  @Max(MAX_PHONE_NUMBER)
  @ApiModelProperty({
    type: 'string',
    example: 12345678,
    required: true,
  })
  phone: number;
}
