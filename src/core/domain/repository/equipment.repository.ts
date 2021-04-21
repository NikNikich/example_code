import { EntityRepository, Repository } from 'typeorm';
import { EquipmentEntity } from '../entity/equipment.entity';

@EntityRepository(EquipmentEntity)
export class EquipmentRepository extends Repository<EquipmentEntity> {}
