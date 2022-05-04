import { EntityRepository, Repository } from 'typeorm';
import { ParameterEquipment } from '../entity/parameter.equipment.entity';

@EntityRepository(ParameterEquipment)
export class ParameterEquipmentRepository extends Repository<
  ParameterEquipment
> {}
