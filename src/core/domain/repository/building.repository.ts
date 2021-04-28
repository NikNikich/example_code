import { EntityRepository, Repository } from 'typeorm';
import { Building } from '../entity/building.entity';

@EntityRepository(Building)
export class BuildingRepository extends Repository<Building> {}
