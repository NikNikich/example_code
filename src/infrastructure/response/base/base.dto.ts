import { ApiModelProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiModelProperty({
    type: 'number',
    description: '',
    nullable: false,
    isArray: false,
  })
  public readonly id: number;

  @ApiModelProperty({
    type: 'string',
    description: '',
    nullable: false,
    isArray: false,
  })
  public readonly data: string;
}
