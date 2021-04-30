import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { EquipmentUseStatusEnum } from '../../../../shared/equipment.use.status.enum';
import { DadataObjectDto } from './dadata.object.dto';
import { Type } from 'class-transformer';
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
    isArray: true,
  })
  @Type(() => DadataObjectDto)
  @ValidateNested()
  address: DadataObjectDto;
}
