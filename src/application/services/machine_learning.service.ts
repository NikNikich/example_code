import { Injectable } from '@nestjs/common';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { EQUIPMENT_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { LogMachineLearningDto } from '../../infrastructure/presenter/rest-api/documentation/machine_learning/log.machine_learning.dto';
import { InjectRepository } from '@nestjs/typeorm';

Injectable();
export class MachineLearningService {
  constructor(
    @InjectRepository(RabbitLog)
    private rabbitsRepository: Repository<RabbitLog>,
  ) {}

  private snEquipment = 'dfgg4353hhh';

  async getIds(): Promise<string[]> {
    return [this.snEquipment];
  }

  async getLogs(filter: LogMachineLearningDto): Promise<string[]> {
    ErrorIf.isFalse(filter.id === this.snEquipment, EQUIPMENT_NOT_FOUND);
    const where: FindConditions<RabbitLog> = await this.getWhereLogOption(
      filter,
    );
    const find = await this.rabbitsRepository.find(where);
    if (find.length > 0) {
      return find.map(log => log.message);
    } else {
      return [];
    }
  }

  async getWhereLogOption(
    filter: LogMachineLearningDto,
  ): Promise<FindConditions<RabbitLog>> {
    const where: FindConditions<RabbitLog> = { snEquipment: filter.id };
    if (Object.keys(filter).length > 0) {
      if (filter.fromDate) {
        const fromDate = new Date(filter.fromDate);
        where['createdAt'] = MoreThanOrEqual(fromDate);
      }
      if (filter.toDate) {
        const toDate = new Date(filter.toDate);
        where['createdAt'] = LessThanOrEqual(toDate);
      }
    }
    return where;
  }
}
