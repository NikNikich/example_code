import { EntityRepository, Repository } from 'typeorm';
import { Building } from '../entity/building.entity';
import { DadataDataDto } from '../../../infrastructure/presenter/rest-api/documentation/user/dadata.data.dto';
import { ErrorIf } from '../../../infrastructure/presenter/rest-api/errors/error.if';
import { INVALID_ADDRESS_DATA } from '../../../infrastructure/presenter/rest-api/errors/errors';

@EntityRepository(Building)
export class BuildingRepository extends Repository<Building> {
  async getBuildingByAddress(dadataData: DadataDataDto): Promise<Building> {
    const dataOk: boolean =
      !!dadataData &&
      !!dadataData.area_with_type &&
      !!dadataData.city_with_type &&
      !!dadataData.region_with_type &&
      !!dadataData.street_with_type &&
      !!dadataData.country &&
      !!dadataData.house;
    ErrorIf.isFalse(dataOk, INVALID_ADDRESS_DATA);
    const findBuilding = await this.findOne({
      country: dadataData.country,
      region: dadataData.region_with_type,
      area: dadataData.area_with_type,
      city: dadataData.city_with_type,
      street: dadataData.street_with_type,
      house: dadataData.house,
    });
    if (findBuilding) {
      return findBuilding;
    }
    const newBuilding = new Building();
    newBuilding.country = dadataData.country;
    newBuilding.region = dadataData.region_with_type;
    newBuilding.area = dadataData.area_with_type;
    newBuilding.city = dadataData.city_with_type;
    newBuilding.street = dadataData.street_with_type;
    newBuilding.house = dadataData.house;
    return newBuilding.save();
  }
}
