import { EntityRepository, Repository } from 'typeorm';
import { BuildingEntity } from '../entity/building.entity';

@EntityRepository(BuildingEntity)
export class BuildingRepository extends Repository<BuildingEntity> {}
