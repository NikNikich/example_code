import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { BuildingObjectListDto } from './building.object.list.dto';

export class GetBuildingResponse extends CustomResponse {
  @ApiModelProperty({
    type: BuildingObjectListDto,
    isArray: true,
    nullable: false,
  })
  data: BuildingObjectListDto[];

  constructor(requestId: string, data: BuildingObjectListDto[]) {
    super(requestId);
    this.data = data;
  }
}
