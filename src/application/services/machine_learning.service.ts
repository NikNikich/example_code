import { Injectable } from '@nestjs/common';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import {
  EQUIPMENT_NOT_FOUND,
  ERROR_INFLUX_QUERY,
} from '../../infrastructure/presenter/rest-api/errors/errors';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  IsNull,
  Repository,
} from 'typeorm';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { LogMachineLearningDto } from '../../infrastructure/presenter/rest-api/documentation/machine_learning/log.machine_learning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InfluxDB } from '@influxdata/influxdb-client';
import * as config from 'config';
import { InfluxDto } from '../../infrastructure/presenter/rest-api/documentation/influx/influx.dto';
import { Equipment } from '../../core/domain/entity/equipment.entity';
import { ParameterEquipmentLog } from '../../core/domain/entity/parameter.equipment.log.entity';

Injectable();
export class MachineLearningService {
  constructor(
    @InjectRepository(RabbitLog)
    private rabbitsRepository: Repository<RabbitLog>,
    @InjectRepository(ParameterEquipmentLog)
    private parameterEquipmentLogRepository: Repository<ParameterEquipmentLog>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  private logDate = 'dateEquipment';

  private queryApi = new InfluxDB({
    url: config.get('influxDB.host'),
    token: config.get('influxDB.token'),
  }).getQueryApi(config.get('influxDB.org'));

  async getIds(): Promise<string[]> {
    const equipments = await this.equipmentRepository.find({
      where: { equipmentId: Not(IsNull()) },
    });
    return equipments.length > 0
      ? equipments.map(equipment => equipment.equipmentId)
      : [];
  }

  async getLogs(
    filter: LogMachineLearningDto,
  ): Promise<ParameterEquipmentLog[]> {
    const equipment = await this.equipmentRepository.findOne({
      where: { equipmentId: filter.id },
    });
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    const where: FindConditions<ParameterEquipmentLog> = await this.getWhereLogOption(
      equipment,
      filter,
    );
    if (false) {
      try {
        const queryInflux = await this.getQueryInflux(filter);
        const influxFind: Array<InfluxDto> = await this.queryApi.collectRows<
          InfluxDto
        >(queryInflux);
        if (influxFind.length > 0) {
          return []; // influxFind.map(finded => finded._value);
        } else {
          return [];
        }
      } catch (e) {
        throw ERROR_INFLUX_QUERY;
      }
    }
    const findParameter = await this.parameterEquipmentLogRepository.find(
      where,
    );
    findParameter.forEach(param =>
      Object.keys(param).forEach(k => param[k] == null && delete param[k]),
    );
    return findParameter;
  }

  async getWhereLogOption(
    equipment: Equipment,
    filter: LogMachineLearningDto,
  ): Promise<FindConditions<ParameterEquipmentLog>> {
    const where: FindConditions<ParameterEquipmentLog> = { equipment };
    if (Object.keys(filter).length > 0) {
      if (filter.fromDate) {
        const fromDate = new Date(filter.fromDate);
        where[this.logDate] = MoreThanOrEqual(fromDate);
      }
      if (filter.toDate) {
        const toDate = new Date(filter.toDate);
        where[this.logDate] = LessThanOrEqual(toDate);
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
