import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class StringIdDto {
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 1,
    required: true,
  })
  id: string;
}
