import { Injectable } from '@nestjs/common';
import { BuildingRepository } from '../../core/domain/repository/building.repository';
import { FilterBuildingDto } from '../../infrastructure/presenter/rest-api/documentation/building/filter.building.dto';
import { BuildingObjectListDto } from '../../infrastructure/response/building/building.object.list.dto';
import { EquipmentJobStatusEnum } from '../../infrastructure/shared/enum/equipment.job.status.enum';
import { Building } from '../../core/domain/entity/building.entity';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { BUILDING_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { Equipment } from '../../core/domain/entity/equipment.entity';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { User } from '../../core/domain/entity/user.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class BuildingService {
  constructor(
    private buildingRepository: BuildingRepository,
    private equipmentRepository: EquipmentRepository,
    private userRepository: UserRepository,
  ) {}

  private equipmentRelation = 'equipment';
  private engineerRelation = 'engineer';
  private managerRelation = 'manager';
  private ownerRelation = 'owner';
  private parentRelation = 'parent';
  private buildingRelation = 'building';

  async getListBuilding(
    filter: FilterBuildingDto,
    user: User,
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
    const equipmentsFind = await this.equipmentRepository.find({
      relations: [
        this.buildingRelation,
        this.engineerRelation,
        this.managerRelation,
        this.ownerRelation,
        this.parentRelation,
      ],
    });
    const buildingObjectList: BuildingObjectListDto[] = [];
    for (const building of buildings) {
      const equipments: Equipment[] = await this.getFilterEquipments(
        user,
        building,
        equipmentsFind,
      );
      if (equipments.length > 0) {
        let extensionEquipment = 0;
        let errorEquipment = 0;
        for (const buildingEquipment of equipments) {
          if (
            buildingEquipment.jobStatus === EquipmentJobStatusEnum.NOT_CRITICAL
          ) {
            extensionEquipment++;
          }
          if (buildingEquipment.jobStatus === EquipmentJobStatusEnum.CRITICAL) {
            errorEquipment++;
          }
        }
        const address = building.equipment[0].address;
        buildingObjectList.push(
          new BuildingObjectListDto(
            building.id,
            building.type,
            address,
            equipments.length,
            extensionEquipment,
            errorEquipment,
            building.geoLat,
            building.geoLon,
            building.region,
            building.area,
            building.city,
          ),
        );
      }
    }
    return buildingObjectList;
  }

  async getById(idDto: NumberIdDto, user: User): Promise<Building> {
    const building = await this.buildingRepository.findOne({
      where: { id: idDto.id },
      relations: [this.equipmentRelation],
      loadEagerRelations: true,
    });
    ErrorIf.isEmpty(building, BUILDING_NOT_FOUND);
    if (building.equipment && building.equipment.length > 0) {
      const where: FindConditions<Equipment>[] = [];
      const equipmentIds = building.equipment.map(
        equipmentOne => equipmentOne.id,
      );
      for (const equipmentId of equipmentIds) {
        where.push({ id: equipmentId });
      }
      const equipmentsFind = await this.equipmentRepository.find({
        where,
        relations: [
          this.buildingRelation,
          this.engineerRelation,
          this.managerRelation,
          this.ownerRelation,
          this.parentRelation,
        ],
      });
      building.equipment = await this.getFilterEquipments(
        user,
        building,
        equipmentsFind,
      );
    }
    return building;
  }

  async getFilterEquipments(
    user: User,
    building: Building,
    equipmentList: Equipment[],
  ): Promise<Equipment[]> {
    const returnEquipments: Equipment[] = [];
    await Promise.all(
      building.equipment.map(async equipment => {
        const boolean = await this.isRightEquipmentViewInList(
          user,
          equipmentList,
          equipment,
        );
        if (boolean) {
          returnEquipments.push(equipment);
        }
      }),
    );
    return returnEquipments;
  }

  async isRightEquipmentViewInList(
    user: User,
    equipments: Equipment[],
    equipment: Equipment,
  ): Promise<boolean> {
    const equipmentFind = equipments.find(
      equipmentOne => equipmentOne.id === equipment.id,
    );
    if (equipmentFind) {
      const boolean =
        (await this.userRepository.isRightToEquipmentView(
          user,
          equipmentFind,
        )) && !!!equipment.deletedAt;
      return boolean;
    } else {
      return false;
    }
  }
}
