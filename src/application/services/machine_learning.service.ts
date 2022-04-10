import { Injectable } from '@nestjs/common';
import { InfluxDbService } from 'nest-influxdb';
import * as config from 'config';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

Injectable();
export class MachineLearningService {
  constructor() {}
  private queryApi = new InfluxDB({
    url: config.get('influxDB.host'),
    token: config.get('influxDB.token'),
  }).getQueryApi(config.get('influxDB.org'));

  /*async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.baseRepository.createBase(createBaseDto);
  }*/

  async getIds(): Promise<string[]> {
    console.log(1);
    const query =
      `from(bucket: "` +
      config.get('influxDB.bucket') +
      `") 
    |> range(start: -1m)`;
    const results = this.queryApi.rows(query);
    console.log(results);
    return ['base'];
  }

  async getLogs(id: string): Promise<string[]> {
    return ['bbb'];
  }
}
