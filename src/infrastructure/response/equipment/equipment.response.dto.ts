import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { Equipment } from '../../../core/domain/entity/equipment.entity';

export class EquipmentResponseDto extends CustomResponse {
  @ApiModelProperty({ type: Equipment })
  data: Equipment;

  constructor(requestId: string, data: Equipment) {
    super(requestId);
    this.data = data;
  }
}
