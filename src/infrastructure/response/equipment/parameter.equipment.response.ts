import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { ParameterEquipment } from '../../../core/domain/entity/parameter.equipment.entity';

export class GraphResponseDto {
  @ApiModelProperty({
    type: 'number',
    description: 'Температура холодной воды',
    nullable: true,
  })
  public tempColdWater: number | null;

  @ApiModelProperty({
    type: 'number',
    description: 'Температура гоячей воды',
    nullable: true,
  })
  public tempHotWater: number | null;

  @ApiModelProperty({
    type: 'number',
    description: 'Температура СО2',
    nullable: true,
  })
  public tempCO2: number | null;

  @ApiModelProperty({
    type: 'number',
    description: 'Давление холодной воды',
    nullable: true,
  })
  public pressureColdWater: number | null;

  @ApiModelProperty({
    type: 'number',
    description: 'Давление горячей воды',
    nullable: true,
  })
  public pressureHotWater: number | null;

  @ApiModelProperty({
    type: 'number',
    description: 'Давление СО2',
    nullable: true,
  })
  public pressureCO2: number | null;
}

export class ParameterEquipmentResponseDto {
  @ApiModelProperty({ type: GraphResponseDto })
  graph: GraphResponseDto[];

  @ApiModelProperty({ type: ParameterEquipment })
  equipmentParameters: ParameterEquipment;
}

export class ParameterEquipmentResponse extends CustomResponse {
  @ApiModelProperty({ type: ParameterEquipmentResponseDto })
  data: ParameterEquipmentResponseDto;

  constructor(requestId: string, data: ParameterEquipmentResponseDto) {
    super(requestId);
    this.data = data;
  }
}
