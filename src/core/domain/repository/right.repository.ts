import { EntityRepository, Repository } from 'typeorm';
import { Right } from '../entity/right.entity';

@EntityRepository(Right)
export class RightRepository extends Repository<Right> {}
