import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { isTrue } from '../../../../shared/is.true';
import { ApiModelProperty } from '@nestjs/swagger';

export class FilterEquipmentDto {
  @IsOptional()
  @IsBoolean()
  @Transform(value => isTrue(value))
  @ApiModelProperty({ type: 'boolean', example: false, required: false })
  notUsed: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(value => isTrue(value))
  @ApiModelProperty({ type: 'boolean', example: false, required: false })
  andMy: boolean;
}
