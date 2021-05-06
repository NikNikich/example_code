import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';

export class AddEquipmentResponse extends CustomResponse {
  @ApiModelProperty({ type: null, nullable: true })
  data: 'Ok';

  constructor(requestId: string) {
    super(requestId);
  }
}
