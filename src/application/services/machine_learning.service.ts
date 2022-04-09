import { Injectable } from '@nestjs/common';

Injectable();
export class MachineLearningService {
  /* constructor(
  ) {}*/

  /*async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.baseRepository.createBase(createBaseDto);
  }*/

  async getIds(): Promise<string[]> {
    return ['base'];
  }

  async getLogs(id: string): Promise<string[]> {
    return ['bbb'];
  }
}
