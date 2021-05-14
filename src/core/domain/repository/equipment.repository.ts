import { EntityRepository, Repository } from 'typeorm';
import { Equipment } from '../entity/equipment.entity';
import { User } from '../entity/user.entity';
import * as lodash from 'lodash';
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
    lodash.assign(
      equipmentNew,
      lodash.omit(createEquipmentDto, ['managerId', 'engineerId']),
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
    lodash.assign(editEquipment, lodash.omit(updateEquipmentDto, listOmit));
    return editEquipment.save();
  }
  async getEquipmentByEquipmentId(
    equipmentId: string,
  ): Promise<Equipment | undefined> {
    return this.findOne({ where: { equipmentId }, withDeleted: true });
  }

  async deleteOwner(equipment: Equipment): Promise<void> {
    equipment.useStatus = null;
    equipment.owner = null;
    equipment.building = null;
    equipment.address = null;
    equipment.save();
  }
}
