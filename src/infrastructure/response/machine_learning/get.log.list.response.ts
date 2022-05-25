import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { ParameterEquipmentLog } from '../../../core/domain/entity/parameter.equipment.log.entity';

export class GetLogListResponse extends CustomResponse {
  @ApiModelProperty({ type: 'string', isArray: true })
  data: ParameterEquipmentLog[];

  constructor(requestId: string, data: ParameterEquipmentLog[]) {
    super(requestId);
    this.data = data;
  }
}
