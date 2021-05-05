import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EquipmentUseStatusEnum } from '../../../../shared/equipment.use.status.enum';
import { Type } from 'class-transformer';

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'ИП умник 13',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: '1212e25',
    required: false,
  })
  equipmentId?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: false,
  })
  servicePassword?: string;

  @IsOptional()
  @Min(1)
  @IsInt()
  @ApiModelProperty({
    type: 'number',
    example: 13,
    required: false,
    description: 'id user',
  })
  engineerId?: number;

  @IsOptional()
  @Min(1)
  @IsInt()
  @ApiModelProperty({
    type: 'number',
    example: 13,
    required: false,
    description: 'id user',
  })
  managerId?: number;

  @IsOptional()
  @IsEnum(EquipmentUseStatusEnum)
  @ApiModelProperty({
    enum: EquipmentUseStatusEnum,
    example: 'Куплено',
    required: false,
  })
  useStatus?: EquipmentUseStatusEnum;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiModelProperty({
    type: 'datetime',
    example: '2021-04-26 14:04:16',
    required: true,
  })
  dateInitialization?: Date;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent1?: string;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent2?: string;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent3?: string;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent4?: string;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent5?: string;

  @IsOptional()
  @ApiModelProperty({
    type: 'string',
    example: 'sdfdsfe23aqwq',
    required: true,
  })
  SNComponent6?: string;
}
