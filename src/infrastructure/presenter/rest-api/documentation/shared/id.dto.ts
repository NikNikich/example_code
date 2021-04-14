import { IsNumber, Max, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MAX_ID_POSTGRES, MIN_ID_POSTGRES } from '../../../../shared/constants';

export class IdDto {
  @IsNumber()
  @Min(MIN_ID_POSTGRES)
  @Max(MAX_ID_POSTGRES)
  @Type(() => Number)
  @ApiModelProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  id: number;
}
