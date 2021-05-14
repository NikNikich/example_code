import { Injectable } from '@nestjs/common';
import { BuildingRepository } from '../../core/domain/repository/building.repository';
import { FilterBuildingDto } from '../../infrastructure/presenter/rest-api/documentation/building/filter.building.dto';
import { BuildingObjectListDto } from '../../infrastructure/response/building/building.object.list.dto';
import { EquipmentJobStatusEnum } from '../../infrastructure/shared/equipment.job.status.enum';
import { Building } from '../../core/domain/entity/building.entity';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { BUILDING_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';

@Injectable()
export class BuildingService {
  constructor(private buildingRepository: BuildingRepository) {}

  private equipmentRelation = 'equipment';

  async getListBuilding(
    filter: FilterBuildingDto,
  ): Promise<BuildingObjectListDto[]> {
    const buildingFilter = {};
    const { city, region, area } = filter;
    if (city) {
      Object.assign(buildingFilter, { city });
    }
    if (region) {
      Object.assign(buildingFilter, { region });
    }
    if (area) {
      Object.assign(buildingFilter, { area });
    }
    const buildings = await this.buildingRepository.find({
      where: buildingFilter,
      relations: [this.equipmentRelation],
    });
    const buildingObjectList: BuildingObjectListDto[] = [];
    for (const building of buildings) {
      if (building.equipment.length > 0) {
        let extensionEquipment = 0;
        let errorEquipment = 0;
        for (const equipment of building.equipment) {
          if (equipment.jobStatus === EquipmentJobStatusEnum.NOT_CRITICAL) {
            extensionEquipment++;
          }
          if (equipment.jobStatus === EquipmentJobStatusEnum.CRITICAL) {
            errorEquipment++;
          }
        }
        const address = `${building.region} ${building.area} ${building.city} ${building.street} ${building.house}`;
        buildingObjectList.push(
          new BuildingObjectListDto(
            building.id,
            building.type,
            address,
            building.equipment.length,
            extensionEquipment,
            errorEquipment,
            building.geoLat,
            building.geoLon,
          ),
        );
      }
    }
    return buildingObjectList;
  }

  async getById(idDto: NumberIdDto): Promise<Building> {
    const building = await this.buildingRepository.findOne({
      where: { id: idDto.id },
      relations: [this.equipmentRelation],
      loadEagerRelations: true,
    });
    ErrorIf.isEmpty(building, BUILDING_NOT_FOUND);
    return building;
  }
}
