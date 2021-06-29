import { Injectable } from '@nestjs/common';
import { User } from '../../core/domain/entity/user.entity';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { Equipment } from '../../core/domain/entity/equipment.entity';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  NOT_CHANGE_EQUIPMENT,
  OBJECT_NOT_FOUND,
  USED_ID_EQUIPMENT,
  USER_NOT_FOUND,
  USER_PARENT_NOT_FOUND,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { IsNull } from 'typeorm';
import { UserRolesEnum } from '../../infrastructure/shared/enum/user.roles.enum';
import { CreateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { UpdateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';
import { EquipmentUseStatusEnum } from '../../infrastructure/shared/enum/equipment.use.status.enum';
import { FilterEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/filter.equipment.dto';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { UserRightsEnum } from '../../infrastructure/shared/enum/user.rights.enum';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}
  private engineerRelation = 'engineer';
  private managerRelation = 'manager';
  private ownerRelation = 'owner';
  private parentRelation = 'parent';
  private buildingRelation = 'building';

  async getActiveEquipments(
    user: User,
    filter: FilterEquipmentDto,
  ): Promise<Equipment[]> {
    const where:
      | FindConditions<Equipment>
      | FindConditions<Equipment>[] = await this.getWhereOption(user);
    let equipments = await this.equipmentRepository.find({
      where,
      relations: [
        this.engineerRelation,
        this.managerRelation,
        this.ownerRelation,
      ],
    });
    if (equipments.length > 0 && filter) {
      if (filter.notUsed && !filter.andMy) {
        equipments = equipments.filter(equipment => !!!equipment.owner);
      }
      if (filter.notUsed && filter.andMy) {
        equipments = equipments.filter(
          equipment => !!!equipment.owner || equipment.owner.id === user.id,
        );
      }
      if (!filter.notUsed && filter.andMy) {
        equipments = equipments.filter(
          equipment => !!equipment.owner && equipment.owner.id === user.id,
        );
      }
    }
    return equipments;
  }

  async getActiveEquipment(idDto: NumberIdDto, user: User): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne(idDto.id, {
      relations: [
        this.buildingRelation,
        this.engineerRelation,
        this.managerRelation,
        this.ownerRelation,
        this.parentRelation,
      ],
    });
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    await this.isRightToGet(user, equipment);
    return plainToClass(Equipment, equipment);
  }

  async delete(user: User, id: number): Promise<void> {
    const equipment = await this.equipmentRepository.findOne(
      {
        id,
        deletedAt: IsNull(),
      },
      { relations: [this.parentRelation, this.ownerRelation] },
    );
    ErrorIf.isEmpty(equipment, OBJECT_NOT_FOUND);
    await this.isRightToDelete(user, equipment);
    await this.equipmentRepository.softDelete(equipment.id);
  }

  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
    parent: User,
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
      parent,
    );
  }

  async editEquipment(
    idDto: NumberIdDto,
    updateEquipmentDto: UpdateEquipmentDto,
    user: User,
  ): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne(idDto.id, {
      relations: [
        this.parentRelation,
        this.ownerRelation,
        this.managerRelation,
        this.engineerRelation,
        this.buildingRelation,
      ],
    });
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    await this.isRightToEdit(user, equipment);
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
    const limitedWright = await this.isLimitedWright(user);
    if (limitedWright) {
      return this.equipmentRepository.updateLimitedEquipment(
        equipment,
        engineer,
      );
    } else {
      return this.equipmentRepository.updateEquipment(
        equipment,
        updateEquipmentDto,
        manager,
        engineer,
      );
    }
  }
  async isLimitedWright(user: User): Promise<boolean> {
    const rights = await this.roleRepository.getRights(user.role);
    const roleLimitedWrightEquipment = rights.find(
      right => right === UserRightsEnum.EQUIPMENT_LIMITED_WRIGHT,
    );
    const roleWrightEquipment = rights.find(
      right => right === UserRightsEnum.EQUIPMENT_SETTINGS_WRIGHT,
    );
    return roleLimitedWrightEquipment && !roleWrightEquipment;
  }

  getUseStatusList(): string[] {
    const statusList = [];
    for (const key in EquipmentUseStatusEnum) {
      statusList.push(EquipmentUseStatusEnum[key]);
    }
    return statusList;
  }

  async getWhereOption(
    user: User,
  ): Promise<FindConditions<Equipment> | FindConditions<Equipment>[]> {
    const where: FindConditions<Equipment> = { deletedAt: IsNull() };
    if (user.role.name === UserRolesEnum.MANUFACTURER) {
      return [
        { ...where, parent: user, owner: IsNull() },
        { ...where, owner: user },
        { ...where, manager: user },
      ];
    }
    if (user.role.name === UserRolesEnum.CLIENT_SERVICE) {
      const parent = await this.getParentUser(user);
      ErrorIf.isEmpty(parent, USER_PARENT_NOT_FOUND);
      where['owner'] = parent;
    }
    if (user.role.name === UserRolesEnum.CLIENT) {
      where['owner'] = user;
    }
    if (user.role.name === UserRolesEnum.DEALER_SERVICE) {
      where['engineer'] = user;
    }
    if (user.role.name === UserRolesEnum.DEALER) {
      return [
        { ...where, owner: user },
        { ...where, manager: user },
      ];
    }
    if (user.role.name === UserRolesEnum.MANUFACTURER_SERVICE) {
      where['engineer'] = user;
    }
    return where;
  }
  parent;

  async isRightToGet(user: User, equipment: Equipment): Promise<void> {
    const boolean = await this.userRepository.isRightToEquipmentView(
      user,
      equipment,
    );
    ErrorIf.isFalse(boolean, NOT_CHANGE_EQUIPMENT);
  }

  async getParentUser(user: User): Promise<User> {
    const userFind = await this.userRepository.findOne(user.id, {
      relations: ['parent'],
    });
    return userFind.parent;
  }

  async isRightToDelete(user: User, equipment: Equipment): Promise<void> {
    ErrorIf.isFalse(
      !equipment.parent ||
        user.id === equipment.parent.id ||
        user.role.name === UserRolesEnum.ADMIN,
      NOT_CHANGE_EQUIPMENT,
    );
  }

  async isRightToEdit(parent: User, equipment: Equipment): Promise<void> {
    let userOwner: User = null;
    if (equipment.owner) {
      userOwner = await this.userRepository.getUserByIdNotDelete(
        equipment.owner.id,
      );
    }
    const boolean = await this.userRepository.isRightToEquipmentEdit(
      parent,
      equipment,
      userOwner,
    );
    ErrorIf.isFalse(boolean, NOT_CHANGE_EQUIPMENT);
  }
}
