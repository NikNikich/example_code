import { EntityRepository, Repository } from 'typeorm';
import { Building } from '../entity/building.entity';
import { ErrorIf } from '../../../infrastructure/presenter/rest-api/errors/error.if';
import { INVALID_ADDRESS_DATA } from '../../../infrastructure/presenter/rest-api/errors/errors';
import { DadataObjectDto } from '../../../infrastructure/presenter/rest-api/documentation/user/dadata.object.dto';

@EntityRepository(Building)
export class BuildingRepository extends Repository<Building> {
  async getBuildingByAddress(dadataObject: DadataObjectDto): Promise<Building> {
    const dadataData = dadataObject.data;
    const dataOk: boolean =
      !!dadataData &&
      !!dadataData.city_with_type &&
      !!dadataData.region_with_type &&
      !!dadataData.street_with_type &&
      !!dadataData.country &&
      !!dadataData.house;
    ErrorIf.isFalse(dataOk, INVALID_ADDRESS_DATA);
    const findOption = {
      country: dadataData.country,
      region: dadataData.region_with_type,
      city: dadataData.city_with_type,
      street: dadataData.street_with_type,
      house: dadataData.house,
    };
    if (dadataData.area_with_type) {
      Object.assign(findOption, { area: dadataData.area_with_type });
    }
    const findBuilding = await this.findOne(findOption);
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
    newBuilding.geoLon = dadataData.geo_lon;
    newBuilding.geoLat = dadataData.geo_lat;
    newBuilding.dadataJson = dadataObject;
    return newBuilding.save();
  }
}
