import { ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../core/domain/entity/user.entity';
import CustomResponse from '../custom.response';

export class MeResponse extends CustomResponse {
  @ApiModelProperty({ type: UserEntity })
  data: UserEntity;

  constructor(requestId: string, data: UserEntity) {
    super(requestId);
    this.data = data;
  }
}
