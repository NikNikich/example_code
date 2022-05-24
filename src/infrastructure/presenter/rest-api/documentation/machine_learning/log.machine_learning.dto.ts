import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LogMachineLearningDto {
  @IsString()
  @MinLength(2)
  @ApiModelProperty({
    type: 'string',
    example: 'id оборудования',
    required: true,
  })
  id: string;

  @IsOptional()
  @IsDateString()
  @ApiModelProperty({
    type: 'string',
    example: '2017-06-07T14:34:08.700Z',
    required: false,
    isArray: false,
  })
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiModelProperty({
    type: 'string',
    example: '2017-06-07T14:34:08.700Z',
    required: false,
    isArray: false,
  })
  toDate?: string;
}
