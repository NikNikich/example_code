import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { EquipmentEntity } from '../../../core/domain/entity/equipment.entity';

export class EquipmentListResponseDto extends CustomResponse {
  @ApiModelProperty({ type: EquipmentEntity, isArray: true })
  data: EquipmentEntity[];

  constructor(requestId: string, data: EquipmentEntity[]) {
    super(requestId);
    this.data = data;
  }
}
