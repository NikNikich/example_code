import { EntityRepository, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';
import { UserEntity } from '../entity/user.entity';
import * as _ from 'lodash';
import { CreateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UpdateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';

@EntityRepository(EquipmentEntity)
export class EquipmentRepository extends Repository<EquipmentEntity> {
  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
    manager: UserEntity,
    engineer: UserEntity,
  ): Promise<EquipmentEntity> {
    const equipmentNew = new EquipmentEntity();
    _.assign(
      equipmentNew,
      _.omit(createEquipmentDto, ['managerId', 'engineerId']),
    );
    equipmentNew.manager = manager;
    equipmentNew.engineer = engineer;
    return await equipmentNew.save();
  }

  async updateEquipment(
    equipment: EquipmentEntity,
    updateEquipmentDto: UpdateEquipmentDto,
    manager?: UserEntity,
    engineer?: UserEntity,
  ): Promise<EquipmentEntity> {
    const editEquipment = equipment;
    const listOmit = [];
    if (manager) {
      listOmit.push('manager');
      editEquipment.manager = manager;
    }
    if (engineer) {
      listOmit.push('engineer');
      editEquipment.engineer = engineer;
    }
    _.assign(editEquipment, _.omit(updateEquipmentDto, listOmit));
    return editEquipment.save();
  }
}
