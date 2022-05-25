import { EntityRepository, Repository } from 'typeorm';
import { ParameterEquipmentLog } from '../entity/parameter.equipment.log.entity';

@EntityRepository(ParameterEquipmentLog)
export class ParameterEquipmentLogRepository extends Repository<
  ParameterEquipmentLog
> {}
