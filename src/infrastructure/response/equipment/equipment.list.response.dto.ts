import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { Equipment } from '../../../core/domain/entity/equipment.entity';

export class EquipmentListResponseDto extends CustomResponse {
  @ApiModelProperty({ type: Equipment, isArray: true })
  data: Equipment[];

  constructor(requestId: string, data: Equipment[]) {
    super(requestId);
    this.data = data;
  }
}
