import { Injectable } from '@nestjs/common';
import { BuildingRepository } from '../../core/domain/repository/building.repository';
import { FilterBuildingDto } from '../../infrastructure/presenter/rest-api/documentation/building/filter.building.dto';
import { BuildingObjectListDto } from '../../infrastructure/response/building/building.object.list.dto';
import { EquipmentJobStatusEnum } from '../../infrastructure/shared/equipment.job.status.enum';

@Injectable()
export class BuildingService {
  constructor(private buildingRepository: BuildingRepository) {}
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
      relations: ['equipment'],
    });
    const buildingObjectList: BuildingObjectListDto[] = [];
    for (const building of buildings) {
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
        ),
      );
    }
    return buildingObjectList;
  }
}
