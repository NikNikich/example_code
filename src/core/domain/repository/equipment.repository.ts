import { EntityRepository, Repository } from 'typeorm';
import { Equipment } from '../entity/equipment.entity';

@EntityRepository(Equipment)
export class EquipmentRepository extends Repository<Equipment> {}
