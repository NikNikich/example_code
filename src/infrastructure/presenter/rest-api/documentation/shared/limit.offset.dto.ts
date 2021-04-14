import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MAX_ID_POSTGRES, MIN_ID_POSTGRES } from '../../../../shared/constants';

export class LimitOffsetDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID_POSTGRES)
  @Max(MAX_ID_POSTGRES)
  @ApiModelProperty({
    type: 'number',
    example: '1',
    required: false,
  })
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID_POSTGRES)
  @Max(MAX_ID_POSTGRES)
  @ApiModelProperty({
    type: 'number',
    example: '2',
    required: false,
  })
  offset: number;
}
