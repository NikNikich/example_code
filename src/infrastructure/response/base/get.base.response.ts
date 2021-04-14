import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { BaseDto } from './base.dto';

export class GetBaseResponse extends CustomResponse {
  @ApiModelProperty({ type: BaseDto, nullable: false })
  data: BaseDto;

  constructor(requestId: string, data: BaseDto) {
    super(requestId);
    this.data = data;
  }
}
