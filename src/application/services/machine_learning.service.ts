import { Injectable } from '@nestjs/common';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  ERROR_INFLUX_QUERY,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { LogMachineLearningDto } from '../../infrastructure/presenter/rest-api/documentation/machine_learning/log.machine_learning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InfluxDB } from '@influxdata/influxdb-client';
import * as config from 'config';
import { InfluxDto } from '../../infrastructure/presenter/rest-api/documentation/influx/influx.dto';
import { ParameterEquipment } from '../../core/domain/entity/parameter.equipment.entity';

Injectable();
export class MachineLearningService {
  constructor(
    @InjectRepository(RabbitLog)
    private rabbitsRepository: Repository<RabbitLog>,
    @InjectRepository(ParameterEquipment)
    private parameterEquipmentRepository: Repository<ParameterEquipment>,
  ) {}

  private snEquipment = 'long2';

  private queryApi = new InfluxDB({
    url: config.get('influxDB.host'),
    token: config.get('influxDB.token'),
  }).getQueryApi(config.get('influxDB.org'));

  async getIds(): Promise<string[]> {
    return [this.snEquipment];
  }

  async getLogs(filter: LogMachineLearningDto): Promise<string[]> {
    ErrorIf.isFalse(filter.id === this.snEquipment, EQUIPMENT_NOT_FOUND);
    const where: FindConditions<RabbitLog> = await this.getWhereLogOption(
      filter,
    );
    const find = await this.rabbitsRepository.find(where);
    console.error(find);
    try {
      const queryInflux = await this.getQueryInflux(filter);
      const influxFind: Array<InfluxDto> = await this.queryApi.collectRows<
        InfluxDto
      >(queryInflux);
      if (influxFind.length > 0) {
        return influxFind.map(finded => finded._value);
      } else {
        return [];
      }
    } catch (e) {
      throw ERROR_INFLUX_QUERY;
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

  async getQueryInflux(filter: LogMachineLearningDto): Promise<string> {
    const table = config.get('influxDB.bucket');
    let queryInflux = `from(bucket: "${table}") |> range(`;
    if (Object.keys(filter).length > 0 && filter.fromDate) {
      const fromDate = new Date(filter.fromDate).toISOString();
      queryInflux = queryInflux + `start: ${fromDate} , `;
    }
    if (Object.keys(filter).length > 0 && filter.toDate) {
      const toDate = new Date(filter.toDate).toISOString();
      queryInflux = queryInflux + `stop: ${toDate})`;
    } else {
      queryInflux = queryInflux + 'stop: now())';
    }
    queryInflux = queryInflux + '|> keep(columns: ["_value"])';
    return queryInflux;
  }
}
