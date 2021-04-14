import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { BaseDto } from './base.dto';

export class GetManyBaseResponse extends CustomResponse {
  @ApiModelProperty({
    type: BaseDto,
    nullable: false,
    isArray: true,
  })
  data: BaseDto[];

  constructor(requestId: string, data: BaseDto[]) {
    super(requestId);
    this.data = data;
  }
}
