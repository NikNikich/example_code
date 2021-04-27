import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { EquipmentEntity } from '../../../core/domain/entity/equipment.entity';

export class EquipmentResponseDto extends CustomResponse {
  @ApiModelProperty({ type: EquipmentEntity })
  data: EquipmentEntity;

  constructor(requestId: string, data: EquipmentEntity) {
    super(requestId);
    this.data = data;
  }
}
