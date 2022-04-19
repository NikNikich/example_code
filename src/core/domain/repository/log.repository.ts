import { EntityRepository, Repository } from 'typeorm';
import { RabbitLog } from '../entity/log.entity';

@EntityRepository(RabbitLog)
export class RabbitLogRepository extends Repository<RabbitLog> {}
