import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { EquipmentObjectListDto } from './equipment.object.list.dto';

export class GetEquipmentResponse extends CustomResponse {
  @ApiModelProperty({ type: EquipmentObjectListDto, nullable: false })
  data: EquipmentObjectListDto[];

  constructor(requestId: string, data: EquipmentObjectListDto[]) {
    super(requestId);
    this.data = data;
  }
}
