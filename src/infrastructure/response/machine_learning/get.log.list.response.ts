import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetLogListResponse extends CustomResponse {
  @ApiModelProperty({ type: 'string', isArray: true })
  data: string[];

  constructor(requestId: string, data: string[]) {
    super(requestId);
    this.data = data;
  }
}
