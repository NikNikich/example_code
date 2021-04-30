import { IsString, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { DadataDataDto } from './dadata.data.dto';
import { Type } from 'class-transformer';

export class DadataObjectDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'Респ Татарстан, г Зеленодольск, ул Йошкар-Олинская',
    required: true,
  })
  value: string;

  @ApiModelProperty({
    type: DadataDataDto,
    description: 'Dadata data',
    isArray: true,
  })
  @Type(() => DadataDataDto)
  @ValidateNested()
  data: DadataDataDto;
}
