import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
export class UpdatePasswordDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: '987654',
    required: true,
  })
  oldPassword: string;

  @IsString()
  @Length(6, 100)
  @ApiModelProperty({
    type: 'string',
    example: '123456',
    required: true,
  })
  password: string;
}
