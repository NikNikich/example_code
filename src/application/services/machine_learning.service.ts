import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../core/domain/repository/base.repository';
import { CreateBaseDto } from '../../infrastructure/presenter/rest-api/documentation/base/create.base.dto';
import { Base } from '../../core/domain/entity/base.entity';

Injectable();
export class MachineLearningService {
  constructor(
    @InjectRepository(BaseRepository)
    private baseRepository: BaseRepository,
  ) {}

  async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.baseRepository.createBase(createBaseDto);
  }

  async getIds(): Promise<string[]> {
    return ['base'];
  }

  async getLogs(id: string): Promise<string[]> {
    return ['bbb'];
  }
}
