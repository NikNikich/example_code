import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';
import { User } from '../../../core/domain/entity/user.entity';

export class SingInResponseDto {
  @ApiModelProperty({
    type: 'string',
    description: 'bearer token',
    nullable: false,
  })
  public readonly token: string;

  @ApiModelProperty({ type: User })
  user: User;
}

export class SignInResponse extends CustomResponse {
  @ApiModelProperty({ type: SingInResponseDto })
  data: SingInResponseDto;

  constructor(requestId: string, data: SingInResponseDto) {
    super(requestId);
    this.data = data;
  }
}
