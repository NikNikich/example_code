import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../../../core/domain/entity/user.entity';
import CustomResponse from '../custom.response';

export class MeResponse extends CustomResponse {
  @ApiModelProperty({ type: User })
  data: User;

  constructor(requestId: string, data: User) {
    super(requestId);
    this.data = data;
  }
}
