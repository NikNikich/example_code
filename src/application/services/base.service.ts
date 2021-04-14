import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Base } from '../../core/domain/entity/base.entity';
import { BaseRepository } from '../../core/domain/repository/base.repository';
import { CreateBaseDto } from '../../infrastructure/presenter/rest-api/documentation/base/create.base.dto';
import { UpdateBaseDto } from '../../infrastructure/presenter/rest-api/documentation/base/update.base.dto';
import { DirectionSortingDto } from '../../infrastructure/presenter/rest-api/documentation/shared/direction.sorting.dto';
import { LimitOffsetDto } from '../../infrastructure/presenter/rest-api/documentation/shared/limit.offset.dto';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { OBJECT_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(BaseRepository)
    private baseRepository: BaseRepository,
  ) {}

  async create(createBaseDto: CreateBaseDto): Promise<Base> {
    return this.baseRepository.createBase(createBaseDto);
  }

  async get(id: number): Promise<Base> {
    const base: Base = await this.baseRepository.getBase(id);
    ErrorIf.isEmpty(base, OBJECT_NOT_FOUND);
    return base;
  }

  async getMany(
    limitOffset: LimitOffsetDto,
    direction: DirectionSortingDto,
  ): Promise<Base[]> {
    return this.baseRepository.getManyBase(limitOffset, direction);
  }

  async update(id: number, updateBaseDto: UpdateBaseDto): Promise<Base> {
    const base: Base = await this.baseRepository.getBase(id);
    ErrorIf.isEmpty(base, OBJECT_NOT_FOUND);
    return this.baseRepository.updateBase(base, updateBaseDto);
  }

  async delete(id: number): Promise<void> {
    const base: Base = await this.baseRepository.getBase(id);
    ErrorIf.isEmpty(base, OBJECT_NOT_FOUND);
    await this.baseRepository.deleteBase(id);
  }
}
