import { getConnection, MigrationInterface } from 'typeorm';
import { ParameterEquipment } from '../../../../core/domain/entity/parameter.equipment.entity';

export class addParameterEquipment1619447000005 implements MigrationInterface {
  private tableName = ParameterEquipment.name;
  private data1 = {
    tempColdWater: 10.1,
    tempHotWater: 40.2,
    tempCO2: 20.2,
    pressureColdWater: 700,
    pressureHotWater: 770,
    pressureCO2: 800,
    statusOverall: 'Normal',
    statusBoiler: 'Normal',
    statusCooler: 'Normal',
    statusCarbonize: 'Normal',
    timeOutWater: '08/05/2022 19:11',
    energyBoiler: 15,
    energyCooler: 16,
    energyCarbonize: 17,
  };
  private data2 = {
    tempColdWater: 14.1,
    tempHotWater: 42.2,
    tempCO2: 20.5,
    pressureColdWater: 702,
    pressureHotWater: 754,
    pressureCO2: 807,
    statusOverall: 'Normal',
    statusBoiler: 'Normal',
    statusCooler: 'Normal',
    statusCarbonize: 'Normal',
    timeOutWater: '11/05/2022 17:31',
    energyBoiler: 17,
    energyCooler: 16,
    energyCarbonize: 17,
  };
  private data3 = {
    tempColdWater: 9.9,
    tempHotWater: 38.2,
    tempCO2: 24.4,
    pressureColdWater: 670,
    pressureHotWater: 778,
    pressureCO2: 790,
    statusOverall: 'Normal',
    statusBoiler: 'Normal',
    statusCooler: 'Normal',
    statusCarbonize: 'Normal',
    timeOutWater: '09/05/2022 10:01',
    energyBoiler: 21,
    energyCooler: 22,
    energyCarbonize: 23,
  };
  private data4 = {
    tempColdWater: 15.6,
    tempHotWater: 41.8,
    tempCO2: 19.3,
    pressureColdWater: 705,
    pressureHotWater: 776,
    pressureCO2: 815,
    statusOverall: 'Normal',
    statusBoiler: 'Normal',
    statusCooler: 'Normal',
    statusCarbonize: 'Normal',
    timeOutWater: '01/05/2022 01:51',
    energyBoiler: 13,
    energyCooler: 13,
    energyCarbonize: 15,
  };

  public async up(): Promise<void> {
    const findEquipments = await this.findEquipment();
    if (findEquipments && findEquipments.length > 3) {
      const value = [
        {
          ...this.data1,
          equipmentId: findEquipments[0].id,
          equipment: findEquipments[0],
        },
        {
          ...this.data2,
          equipmentId: findEquipments[1].id,
          equipment: findEquipments[1],
        },
        {
          ...this.data3,
          equipmentId: findEquipments[2].id,
          equipment: findEquipments[2],
        },
        {
          ...this.data4,
          equipmentId: findEquipments[3].id,
          equipment: findEquipments[3],
        },
      ];
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(this.tableName)
        .values(value)
        .execute();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}

  private async findEquipment(): Promise<ParameterEquipment[] | undefined> {
    const manager = getConnection().manager;
    return manager.query('SELECT * FROM Equipment AS e');
  }
}
