import { Injectable } from '@nestjs/common';
import { User } from '../../core/domain/entity/user.entity';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { Equipment } from '../../core/domain/entity/equipment.entity';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { OBJECT_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';
import { IsNull } from 'typeorm';
import { UserRolesEnum } from '../../infrastructure/shared/user.roles.enum';

@Injectable()
export class EquipmentService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async getActiveEquipments(user: User): Promise<Equipment[]> {
    if (user.role.name === UserRolesEnum.ADMIN) {
      return this.equipmentRepository.find({ deletedAt: IsNull() });
    } else {
      return this.equipmentRepository.find({ user, deletedAt: IsNull() });
    }
  }

  async delete(user: User, id: number): Promise<void> {
    const equipment = await this.equipmentRepository.findOne({
      id,
      deletedAt: IsNull(),
    });
    ErrorIf.isEmpty(equipment, OBJECT_NOT_FOUND);
    if (user.role.name === UserRolesEnum.ADMIN) {
      await this.equipmentRepository.softDelete(equipment.id);
    }
  }
}
