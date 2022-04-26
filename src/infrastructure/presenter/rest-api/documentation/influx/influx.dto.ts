import { IsOptional } from 'class-validator';

export class InfluxDto {
  @IsOptional()
  result: string;

  @IsOptional()
  table: number;

  @IsOptional()
  _value: string;
}
