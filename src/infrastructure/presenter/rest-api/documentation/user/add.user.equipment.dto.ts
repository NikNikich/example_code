import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { EquipmentUseStatusEnum } from '../../../../shared/equipment.use.status.enum';
import { DadataObjectDto } from './dadata.object.dto';
import { Type } from 'class-transformer';
export class CreateAdminUserDto {
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
    description: 'Id menu item',
    isArray: true,
  })
  @Type(() => DadataObjectDto)
  @ValidateNested()
  address: DadataObjectDto;
}
