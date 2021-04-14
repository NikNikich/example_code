import { IsNumberString, Length, IsEmail } from 'class-validator';
// import * as config from 'config';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignUpByEmailDto {
  @IsEmail()
  @ApiModelProperty({
    type: 'string',
    example: 'test@test.com',
    required: true,
  })
  email: string;

  @IsNumberString()
  @Length(6, 100)
  @ApiModelProperty({
    type: 'string',
    example: '123456',
    required: true,
  })
  password: string;
}
