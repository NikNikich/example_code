import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MIN_ID_POSTGRES } from '../../../../shared/constants';

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
  roleId: number;
}
