import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from './custom.response';

class RootResponseDto {
  @ApiModelProperty({ type: 'string', nullable: true })
  public readonly uptime: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  public readonly env: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  public readonly image: string;

  @ApiModelProperty({ type: 'object', nullable: true })
  public readonly system: any;
}

export class RootResponse extends CustomResponse {
  @ApiModelProperty({ type: RootResponseDto })
  data: RootResponseDto;

  constructor(requestId: string, data: RootResponseDto) {
    super(requestId);
    this.data = data;
  }
}
