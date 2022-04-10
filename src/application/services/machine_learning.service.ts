import { Injectable } from '@nestjs/common';
import { InfluxDbService } from 'nest-influxdb';
import * as config from 'config';

Injectable();
export class MachineLearningService {
  constructor(private readonly influx_service: InfluxDbService) {}

  /*async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.baseRepository.createBase(createBaseDto);
  }*/

  async getIds(): Promise<string[]> {
    const results = await this.influx_service.query(
      `
            select MEAN(*) from(bucket: ") ` +
        config.get('influxDB.bucket') +
        `" WHERE time > now() - 1d GROUP BY time(10m);
        `,
    );
    console.log(results);
    return ['base'];
  }

  async getLogs(id: string): Promise<string[]> {
    return ['bbb'];
  }
}
