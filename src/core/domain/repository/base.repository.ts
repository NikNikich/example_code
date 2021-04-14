import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CreateBaseDto } from '../../../infrastructure/presenter/rest-api/documentation/base/create.base.dto';
import { DirectionSortingDto } from '../../../infrastructure/presenter/rest-api/documentation/shared/direction.sorting.dto';
import { LimitOffsetDto } from '../../../infrastructure/presenter/rest-api/documentation/shared/limit.offset.dto';
import { Base } from '../entity/base.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Base)
export class BaseRepository extends Repository<Base> {
  public async createBase(createBaseDto: CreateBaseDto): Promise<Base> {
    const base: Base = new Base();
    base.data = createBaseDto.data;
    return base.save();
  }

  public async getBase(id: number): Promise<Base> {
    return this.findOne(id);
  }

  public async getManyBase(
    limitOffset: LimitOffsetDto,
    direction: DirectionSortingDto,
  ): Promise<Base[]> {
    const findOptions: FindManyOptions = {};

    if (limitOffset.limit) {
      findOptions.take = limitOffset.limit;
    }

    if (limitOffset.offset) {
      findOptions.skip = limitOffset.offset;
    }

    if (direction) {
      findOptions.order = {
        id: direction.orderBy,
      };
    }
    return this.find(findOptions);
  }

  public async updateBase(
    base: Base,
    createBaseDto: CreateBaseDto,
  ): Promise<Base> {
    base.data = createBaseDto.data;
    return base.save();
  }

  public async deleteBase(id: number): Promise<void> {
    await Base.delete(id);
  }
}
