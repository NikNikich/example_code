import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBaseDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    type: 'string',
    example: 'test data',
    required: false,
  })
  data: string;
}
