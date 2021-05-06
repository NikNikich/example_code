import { IsOptional, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class FilterBuildingDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'регион',
    type: 'string',
    example: '',
    required: false,
  })
  region: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'район',
    type: 'string',
    example: '',
    required: false,
  })
  area: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'город',
    type: 'string',
    example: '',
    required: false,
  })
  city: string;
}
