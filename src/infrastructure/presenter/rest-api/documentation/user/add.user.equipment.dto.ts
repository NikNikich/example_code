import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { EquipmentUseStatusEnum } from '../../../../shared/enum/equipment.use.status.enum';
import { Type } from 'class-transformer';
import { DadataObjectDto } from './dadata.object.dto';
export class AddUserEquipmentDto {
  @IsNumber()
  @ApiModelProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  equipmentId: number;

  @IsEnum(EquipmentUseStatusEnum)
  @ApiModelProperty({
    enum: EquipmentUseStatusEnum,
    example: 'Куплено',
    required: true,
  })
  status: EquipmentUseStatusEnum;

  @ApiModelProperty({
    type: DadataObjectDto,
    description: 'DaData validation JSON',
  })
  @Type(() => DadataObjectDto)
  @ValidateNested({ each: true })
  address: DadataObjectDto;
}
