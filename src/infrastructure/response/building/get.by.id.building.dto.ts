import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { Building } from '../../../core/domain/entity/building.entity';

export class GetByIdBuildingDto extends CustomResponse {
  @ApiModelProperty({ type: Building, nullable: false })
  data: Building;

  constructor(requestId: string, data: Building) {
    super(requestId);
    this.data = data;
  }
}
