import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { ParameterEquipment } from '../../../core/domain/entity/parameter.equipment.entity';

export class GetLogListResponse extends CustomResponse {
  @ApiModelProperty({ type: 'string', isArray: true })
  data: ParameterEquipment[];

  constructor(requestId: string, data: ParameterEquipment[]) {
    super(requestId);
    this.data = data;
  }
}
