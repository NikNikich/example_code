import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../core/domain/entity/user.entity';

export class ListUserResponse extends CustomResponse {
  @ApiModelProperty({ type: UserEntity, isArray: true })
  data: UserEntity[];

  constructor(requestId: string, data: UserEntity[]) {
    super(requestId);
    this.data = data;
  }
}
