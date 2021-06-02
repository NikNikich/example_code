import CustomResponse from '../custom.response';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../../../core/domain/entity/user.entity';
import { Role } from '../../../core/domain/entity/role.entity';

export class GetRolesUserResponse extends CustomResponse {
  @ApiModelProperty({ type: User, isArray: true })
  data: Role[];

  constructor(requestId: string, data: Role[]) {
    super(requestId);
    this.data = data;
  }
}
