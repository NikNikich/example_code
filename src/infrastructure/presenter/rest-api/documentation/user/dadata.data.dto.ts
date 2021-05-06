import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class DadataDataDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Россия',
    required: true,
  })
  country: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Респ Марий-Эл',
    required: true,
  })
  region_with_type: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Зеленодольский р-н',
    required: true,
  })
  area_with_type: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'г Зеленодольск',
    required: true,
  })
  city_with_type: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'ул Йошкар-Олинская',
    required: true,
  })
  street_with_type: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: '34',
    required: true,
  })
  house: string;
}
