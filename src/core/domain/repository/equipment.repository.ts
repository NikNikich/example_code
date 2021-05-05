import { EntityRepository, Repository } from 'typeorm';
import { Equipment } from '../entity/equipment.entity';
import { User } from '../entity/user.entity';
import * as _ from 'lodash';
import { CreateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UpdateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';

@EntityRepository(Equipment)
export class EquipmentRepository extends Repository<Equipment> {
  async createEquipment(
    createEquipmentDto: CreateEquipmentDto,
    manager: User,
    engineer: User,
  ): Promise<Equipment> {
    const equipmentNew = new Equipment();
    _.assign(
      equipmentNew,
      _.omit(createEquipmentDto, ['managerId', 'engineerId']),
    );
    equipmentNew.manager = manager;
    equipmentNew.engineer = engineer;
    return await equipmentNew.save();
  }

  async updateEquipment(
    equipment: Equipment,
    updateEquipmentDto: UpdateEquipmentDto,
    manager?: User,
    engineer?: User,
  ): Promise<Equipment> {
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
  async getEquipmentByEquipmentId(
    equipmentId: string,
  ): Promise<Equipment | undefined> {
    return this.findOne({ where: { equipmentId }, withDeleted: true });
  }
}
