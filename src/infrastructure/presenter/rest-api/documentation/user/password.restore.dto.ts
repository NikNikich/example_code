import { IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordRestoreDto {
  @IsEmail()
  @ApiModelProperty({
    type: 'string',
    example: 'test@test.com',
    required: true,
  })
  email: string;
}
