import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsString } from 'class-validator';
import { EquipmentUseStatusEnum } from '../../../../shared/equipment.use.status.enum';
import { Type } from 'class-transformer';

export class CreateEquipmentDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'ИП умник 13',
    required: true,
  })
  name: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: '1212e25',
    required: true,
  })
  equipmentId: string;

  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  servicePassword: string;

  @IsInt()
  @ApiModelProperty({
    type: 'number',
    example: 13,
    required: true,
    description: 'id user',
  })
  engineerId: number;

  @IsInt()
  @ApiModelProperty({
    type: 'number',
    example: 13,
    required: true,
    description: 'id user',
  })
  managerId: number;

  @IsEnum(EquipmentUseStatusEnum)
  @ApiModelProperty({
    enum: EquipmentUseStatusEnum,
    example: 'Куплено',
    required: true,
  })
  useStatus: EquipmentUseStatusEnum;

  @IsDate()
  @Type(() => Date)
  @ApiModelProperty({
    type: 'datetime',
    required: true,
    example: '2021-04-26 14:04:16',
  })
  dateInitialization: Date;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent1: string;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent2: string;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent3: string;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent4: string;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent5: string;

  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent6: string;
}
