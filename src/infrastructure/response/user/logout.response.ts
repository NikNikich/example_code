import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';

export class LogoutResponse extends CustomResponse {
  @ApiModelProperty({ type: null, nullable: true })
  data: null;

  constructor(requestId: string, data: null) {
    super(requestId);
    this.data = data;
  }
}
