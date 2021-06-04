import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageBaseDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'test data',
    required: false,
  })
  message: string;
}
