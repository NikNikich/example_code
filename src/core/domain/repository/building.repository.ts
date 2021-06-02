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
      !!dadataData && !!dadataData.geo_lat && !!dadataData.geo_lon;
    ErrorIf.isFalse(dataOk, INVALID_ADDRESS_DATA);
    const findOption = {
      geoLat: dadataData.geo_lat,
      geoLon: dadataData.geo_lon,
    };
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
