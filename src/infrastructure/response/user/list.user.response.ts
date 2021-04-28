import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../../../core/domain/entity/user.entity';

export class ListUserResponse extends CustomResponse {
  @ApiModelProperty({ type: User, isArray: true })
  data: User[];

  constructor(requestId: string, data: User[]) {
    super(requestId);
    this.data = data;
  }
}
