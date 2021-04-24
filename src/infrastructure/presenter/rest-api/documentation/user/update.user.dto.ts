import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Кот',
    required: false,
  })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Простоквашин',
    required: false,
  })
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  @ApiModelProperty({
    type: 'string',
    example: '123456',
    required: true,
  })
  password: string;

  @IsOptional()
  @IsEmail()
  @ApiModelProperty({
    type: 'string',
    example: 'test@test.com',
    required: false,
  })
  email: string;
}
