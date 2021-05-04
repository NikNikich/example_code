import { ApiModelProperty } from '@nestjs/swagger';

export class BuildingObjectListDto {
  @ApiModelProperty({ type: 'number' })
  id: number;

  @ApiModelProperty({ type: 'string' })
  type: string;

  @ApiModelProperty({ type: 'string' })
  address: string | undefined;

  @ApiModelProperty({ type: 'number' })
  allEquipment: number;

  @ApiModelProperty({ type: 'number' })
  extensionEquipment: number;

  @ApiModelProperty({ type: 'number' })
  errorEquipment: number;

  constructor(
    id: number,
    type: string | undefined,
    address: string,
    allEquipment: number,
    extensionEquipment: number,
    errorEquipment: number,
  ) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.allEquipment = allEquipment;
    this.extensionEquipment = extensionEquipment;
    this.errorEquipment = errorEquipment;
  }
}
