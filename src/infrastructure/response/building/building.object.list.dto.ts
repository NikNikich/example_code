import { ApiModelProperty } from '@nestjs/swagger';

export class BuildingObjectListDto {
  @ApiModelProperty({ type: 'number' })
  id: number;

  @ApiModelProperty({ type: 'string' })
  geoLat: string;

  @ApiModelProperty({ type: 'string' })
  geoLon: string;

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
    geoLat: string,
    geoLon: string,
  ) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.allEquipment = allEquipment;
    this.extensionEquipment = extensionEquipment;
    this.errorEquipment = errorEquipment;
    this.geoLat = geoLat;
    this.geoLon = geoLon;
  }
}
