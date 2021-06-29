import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { MIN_ID_POSTGRES } from '../../../../shared/constants';
import { isTrue } from '../../../../shared/is.true';

export class FilterUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID_POSTGRES)
  @ApiModelProperty({
    description: 'id роли',
    type: 'number',
    example: '',
    required: false,
  })
  roleId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(value => isTrue(value))
  @ApiModelProperty({
    description: 'добавить текущего пользователя в выводимый список',
    type: 'boolean',
    example: false,
    required: false,
  })
  andI?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(value => isTrue(value))
  @ApiModelProperty({
    description: 'вывести сервисиков текущего пользователя',
    type: 'boolean',
    example: false,
    required: false,
  })
  engineers?: boolean;
}
