import { IsEnum, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrderByEnum } from './order.by.enum';

export class DirectionSortingDto {
  @IsOptional()
  @IsEnum(OrderByEnum)
  @ApiModelProperty({
    type: 'string',
    enum: [OrderByEnum.ASC, OrderByEnum.DESC],
    required: false,
  })
  orderBy: OrderByEnum;
}
