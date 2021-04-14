import { Length, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordResetDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'adsf9023u4OIlw02389',
    required: true,
  })
  resetCode: string;

  @IsString()
  @Length(6, 100)
  @ApiModelProperty({
    type: 'string',
    example: '123456',
    required: true,
  })
  password: string;
}
