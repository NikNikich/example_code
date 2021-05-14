import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryBooleanEnum } from '../../../../shared/query.boolean.enum';
import { isTrue } from '../../../../shared/is.true';
import { ApiModelProperty } from '@nestjs/swagger';

export class FilterEquipmentDto {
  @IsOptional()
  @IsEnum(QueryBooleanEnum)
  @Type(() => isTrue)
  @ApiModelProperty({ type: 'boolean', example: false, required: false })
  notUsed: boolean;
}
