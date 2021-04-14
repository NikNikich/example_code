import { ApiModelProperty } from '@nestjs/swagger';
import CustomResponse from '../custom.response';

export class SettingsData {
  @ApiModelProperty({
    type: 'string',
    description: 'Where media keeps',
    nullable: false,
    isArray: false,
  })
  cdnUrl: string;
}

export class SettingsResponse extends CustomResponse {
  @ApiModelProperty({ type: SettingsData, nullable: false })
  data: SettingsData;

  constructor(requestId: string, data: SettingsData) {
    super(requestId);
    this.data = data;
  }
}
