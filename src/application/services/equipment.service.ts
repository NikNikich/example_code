import { Injectable } from '@nestjs/common';
import { User } from '../../core/domain/entity/user.entity';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { Equipment } from '../../core/domain/entity/equipment.entity';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  OBJECT_NOT_FOUND,
  USED_ID_EQUIPMENT,
  USER_NOT_FOUND,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { IsNull } from 'typeorm';
import { UserRolesEnum } from '../../infrastructure/shared/user.roles.enum';
import { CreateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { UpdateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';
import { EquipmentUseStatusEnum } from '../../infrastructure/shared/equipment.use.status.enum';
import { FilterEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/filter.equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private userRepository: UserRepository,
  ) {}
  private engineerRelation = 'engineer';
  private managerRelation = 'manager';
  private ownerRelation = 'owner';

  async getActiveEquipments(
    user: User,
    filter: FilterEquipmentDto,
  ): Promise<Equipment[]> {
    if (user.role.name === UserRolesEnum.ADMIN) {
      let equipments = await this.equipmentRepository.find({
        where: { deletedAt: IsNull() },
        relations: [
          this.engineerRelation,
          this.managerRelation,
          this.ownerRelation,
        ],
      });
      if (filter.notUsed) {
        equipments = equipments.filter(equipment => !!!equipment.owner);
      }
      return equipments;
    } else {
      return [];
    }
  }

  async getActiveEquipment(idDto: NumberIdDto): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne(idDto.id, {
      relations: [
        this.engineerRelation,
        this.managerRelation,
        this.ownerRelation,
      ],
    });
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    return equipment;
  }

  async delete(user: User, id: number): Promise<void> {
    const equipment = await this.equipmentRepository.findOne({
      id,
      deletedAt: IsNull(),
    });
    ErrorIf.isEmpty(equipment, OBJECT_NOT_FOUND);
    await this.equipmentRepository.softDelete(equipment.id);
  }

  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    const engineer = await this.userRepository.getUserByIdNotDelete(
      createEquipmentDto.engineerId,
    );
    const manager = await this.userRepository.getUserByIdNotDelete(
      createEquipmentDto.managerId,
    );
    ErrorIf.isTrue(!engineer || !manager, USER_NOT_FOUND);
    const equipmentWithId = await this.equipmentRepository.getEquipmentByEquipmentId(
      createEquipmentDto.equipmentId,
    );
    ErrorIf.isExist(equipmentWithId, USED_ID_EQUIPMENT);
    return this.equipmentRepository.createEquipment(
      createEquipmentDto,
      manager,
      engineer,
    );
  }

  async editEquipment(
    idDto: NumberIdDto,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne(idDto.id);
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    let engineer: User;
    let manager: User;
    if (updateEquipmentDto.engineerId) {
      engineer = await this.userRepository.getUserByIdNotDelete(
        updateEquipmentDto.engineerId,
      );
      ErrorIf.isEmpty(engineer, USER_NOT_FOUND);
    }
    if (updateEquipmentDto.managerId) {
      manager = await this.userRepository.getUserByIdNotDelete(
        updateEquipmentDto.managerId,
      );
      ErrorIf.isEmpty(manager, USER_NOT_FOUND);
    }
    if (updateEquipmentDto.equipmentId) {
      const equipmentWithId = await this.equipmentRepository.getEquipmentByEquipmentId(
        updateEquipmentDto.equipmentId,
      );
      ErrorIf.isTrue(
        equipmentWithId && equipmentWithId.id !== idDto.id,
        USED_ID_EQUIPMENT,
      );
    }
    return this.equipmentRepository.updateEquipment(
      equipment,
      updateEquipmentDto,
      manager,
      engineer,
    );
  }

  getUseStatusList(): string[] {
    const statusList = [];
    for (const key in EquipmentUseStatusEnum) {
      statusList.push(EquipmentUseStatusEnum[key]);
    }
    return statusList;
  }
}
