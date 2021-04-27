import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../core/domain/entity/user.entity';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { EquipmentEntity } from '../../core/domain/entity/equipment.entity';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  OBJECT_NOT_FOUND,
  USER_NOT_FOUND,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { IsNull } from 'typeorm';
import { UserRolesEnum } from '../../infrastructure/shared/user.roles.enum';
import { CreateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { NumberIdDto } from '../../infrastructure/presenter/rest-api/documentation/shared/number.id.dto';
import { UpdateEquipmentDto } from '../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    private userRepository: UserRepository,
  ) {}

  async getActiveEquipments(user: UserEntity): Promise<EquipmentEntity[]> {
    if (user.role.name === UserRolesEnum.ADMIN) {
      return this.equipmentRepository.find({ deletedAt: IsNull() });
    }
  }

  async delete(user: UserEntity, id: number): Promise<void> {
    const equipment = await this.equipmentRepository.findOne({
      id,
      deletedAt: IsNull(),
    });
    ErrorIf.isEmpty(equipment, OBJECT_NOT_FOUND);
    await this.equipmentRepository.softDelete(equipment.id);
  }

  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const engineer = await this.userRepository.getUserByIdNotDelete(
      createEquipmentDto.engineerId,
    );
    const manager = await this.userRepository.getUserByIdNotDelete(
      createEquipmentDto.managerId,
    );
    ErrorIf.isTrue(!engineer || !manager, USER_NOT_FOUND);
    return this.equipmentRepository.createEquipment(
      createEquipmentDto,
      manager,
      engineer,
    );
  }

  async editEquipment(
    idDto: NumberIdDto,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const equipment = await this.equipmentRepository.findOne(idDto.id);
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    let engineer: UserEntity;
    let manager: UserEntity;
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
    return this.equipmentRepository.updateEquipment(
      equipment,
      updateEquipmentDto,
      manager,
      engineer,
    );
  }
}
