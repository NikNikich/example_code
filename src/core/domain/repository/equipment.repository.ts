import { EntityRepository, Repository } from 'typeorm';
import { Equipment } from '../entity/equipment.entity';
import { User } from '../entity/user.entity';
import * as lodash from 'lodash';
import { CreateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/create.equipment.dto';
import { UpdateEquipmentDto } from '../../../infrastructure/presenter/rest-api/documentation/equipment/update.equipment.dto';
import { EquipmentUseStatusEnum } from '../../../infrastructure/shared/enum/equipment.use.status.enum';

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

  async updateLimitedEquipment(
    equipment: Equipment,
    engineer?: User,
  ): Promise<Equipment> {
    if (engineer) {
      equipment.engineer = engineer;
      return equipment.save();
    } else {
      return equipment;
    }
  }

  async getEquipmentByEquipmentId(
    equipmentId: string,
  ): Promise<Equipment | undefined> {
    return this.findOne({ where: { equipmentId }, withDeleted: true });
  }

  async deleteOwner(equipment: Equipment): Promise<void> {
    equipment.useStatus = EquipmentUseStatusEnum.OTHER;
    equipment.owner = null;
    equipment.building = null;
    equipment.address = null;
    await equipment.save();
  }

  async deleteOwnerFromEquipments(user: User): Promise<void> {
    const equipments = await this.find({ where: { owner: user } });
    if (equipments.length === 0) {
      return;
    }
    for (const equipment of equipments) {
      if (equipment.useStatus === EquipmentUseStatusEnum.BUY) {
        equipment.deletedAt = new Date();
      }
      equipment.useStatus = EquipmentUseStatusEnum.OTHER;
      equipment.owner = null;
      equipment.building = null;
      equipment.address = null;
    }
    await this.save(equipments);
  }
}
