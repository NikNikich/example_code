import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBaseDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'test data',
    required: false,
  })
  data: string;
}
