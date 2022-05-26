import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { ParameterEquipment } from '../../core/domain/entity/parameter.equipment.entity';
import { RabbitLogRepository } from '../../core/domain/repository/log.repository';
import { ParameterEquipmentRepository } from '../../core/domain/repository/parameter.equipment.repository';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { ErrorIf } from '../../infrastructure/presenter/rest-api/errors/error.if';
import { EQUIPMENT_NOT_FOUND } from '../../infrastructure/presenter/rest-api/errors/errors';
import { ParameterEquipmentLogRepository } from '../../core/domain/repository/parameter.equipment.log.repository';
import { ParameterEquipmentLog } from '../../core/domain/entity/parameter.equipment.log.entity';
import { Equipment } from '../../core/domain/entity/equipment.entity';

@Injectable()
export class RabbitService {
  constructor(
    private parameterEquipmentRepository: ParameterEquipmentRepository,
    private parameterEquipmentLogRepository: ParameterEquipmentLogRepository,
    private rabbitLogRepository: RabbitLogRepository,
    private equipmentRepository: EquipmentRepository,
  ) {}

  private snEquipment = 'dfgg4353hhh';
  private regexp = new RegExp('([^.]+)', 'g');

  private id = 'id';
  private createdAt = 'createdAt';

  private findProperties = {
    temp: 'temp',
    tempBoiler: 'boiler',
    tempChiller: 'chiller',
    tempEnv: 'env',

    pressure: 'pressure',
    pressureCold: 'cold',
    pressureHot: 'hot',
    pressureCo2: 'co2',

    waterflow: 'waterflow',
    waterflowCold: 'cold',
    waterflowHot: 'hot',
    waterflowSpark: 'spark',

    energy: 'energy',
    energyBoiler: 'boiler',
    energyChiller: 'chiller',
    energyCarb: 'carb',

    stopServe: 'stop_serve',
    stopServeType: 'type',
    stopServeDuration: 'duration',

    startServe: 'start_serve',
    startServeType: 'type',
    startServeSensor: 'sensor',

    carbStatus: 'carb_status',
    chilStatus: 'chil_status',
    boilStatus: 'boil_status',
    contState: 'cont_state',
    cErr: 'c_err',
    cPo: 'c_po',
    cDi: 'c_di',
    val: 'val',
  };

  public async getMessage(msg: string, routingKey: string): Promise<void> {
    const log = new RabbitLog();
    const key = +config.get('rabbitMQ.replacement1');
    log.message = msg;
    log.snEquipment = this.getKey(routingKey, key);
    await this.rabbitLogRepository.save(log);
    const equipment = await this.equipmentRepository.findOne({
      where: { equipmentId: log.snEquipment },
    });
    ErrorIf.isEmpty(equipment, EQUIPMENT_NOT_FOUND);
    const parameterEquipmentLog = await this.getMessageParsing(msg);
    if (parameterEquipmentLog) {
      await this.saveLog(parameterEquipmentLog, equipment);
      parameterEquipmentLog.equipment = equipment;
      await this.parameterEquipmentLogRepository.save(parameterEquipmentLog);
    }
  }

  private getKey(routingKey: string, key: number): string {
    const routingKeyFind = routingKey.match(this.regexp);
    const writeSnEquipment =
      routingKeyFind && routingKeyFind[key]
        ? routingKeyFind[key]
        : this.snEquipment;
    return writeSnEquipment;
  }

  private async getMessageParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(' ');
      if (msgSplit.length > 2) {
        let parameterEquipment: ParameterEquipmentLog | null = null;
        const timestamp = +msgSplit[2];
        switch (msgSplit[0]) {
          case this.findProperties.temp:
            parameterEquipment = await this.getTempDataParsing(msgSplit[1]);
            break;
          case this.findProperties.pressure:
            parameterEquipment = await this.getPressureDataParsing(msgSplit[1]);
            break;
          case this.findProperties.waterflow:
            parameterEquipment = await this.getWaterflowDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.energy:
            parameterEquipment = await this.getEnergyDataParsing(msgSplit[1]);
            break;
          case this.findProperties.stopServe:
            parameterEquipment = await this.getStopServeDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.startServe:
            parameterEquipment = await this.getStartServeDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.carbStatus:
            parameterEquipment = await this.getCarbStatusDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.chilStatus:
            parameterEquipment = await this.getChilStatusDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.boilStatus:
            parameterEquipment = await this.getBoilStatusDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.contState:
            parameterEquipment = await this.getContStateDataParsing(
              msgSplit[1],
            );
            break;
          case this.findProperties.cErr:
            parameterEquipment = await this.getCErrDataParsing(msgSplit[1]);
            break;
          case this.findProperties.cPo:
            parameterEquipment = await this.getCpoDataParsing(msgSplit[1]);
            break;
          case this.findProperties.cDi:
            parameterEquipment = await this.getCDiDataParsing(msgSplit[1]);
            break;
          default:
            return null;
        }
        if (parameterEquipment && timestamp && timestamp > 100000) {
          parameterEquipment.dateEquipment = new Date(timestamp);
          return parameterEquipment;
        }
        return null;
      }
    }
    return null;
  }

  private async getTempDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const tempData = message.split('=');
          if (tempData[0] && tempData[1]) {
            switch (tempData[0]) {
              case this.findProperties.tempBoiler:
                parameterEquipment.tempBoiler = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.tempChiller:
                parameterEquipment.tempChiller = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.tempEnv:
                parameterEquipment.tempEnv = Number(tempData[1].slice(0, -1));
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getWaterflowDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const tempData = message.split('=');
          if (tempData[0] && tempData[1]) {
            switch (tempData[0]) {
              case this.findProperties.waterflowHot:
                parameterEquipment.waterflowHot = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.waterflowCold:
                parameterEquipment.waterflowCold = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.waterflowSpark:
                parameterEquipment.waterflowSpark = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getEnergyDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const tempData = message.split('=');
          if (tempData[0] && tempData[1]) {
            switch (tempData[0]) {
              case this.findProperties.energyCarb:
                parameterEquipment.energyCarbonize = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.energyChiller:
                parameterEquipment.energyChiller = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              case this.findProperties.energyBoiler:
                parameterEquipment.energyBoiler = Number(
                  tempData[1].slice(0, -1),
                );
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getPressureDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const pressureData = message.split('=');
          if (pressureData[0] && pressureData[1]) {
            switch (pressureData[0]) {
              case this.findProperties.pressureCold:
                parameterEquipment.pressureColdWater = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              case this.findProperties.pressureHot:
                parameterEquipment.pressureHotWater = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              case this.findProperties.pressureCo2:
                parameterEquipment.pressureCO2 = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getStopServeDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const pressureData = message.split('=');
          if (pressureData[0] && pressureData[1]) {
            switch (pressureData[0]) {
              case this.findProperties.stopServeType:
                parameterEquipment.stopServeType = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              case this.findProperties.stopServeDuration:
                parameterEquipment.stopServeDuration = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getStartServeDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const msgSplit = msg.trim().split(',');
      const parameterEquipment = new ParameterEquipmentLog();
      msgSplit.forEach(message => {
        if (message.length > 1) {
          const pressureData = message.split('=');
          if (pressureData[0] && pressureData[1]) {
            switch (pressureData[0]) {
              case this.findProperties.startServeType:
                parameterEquipment.startServeType = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              case this.findProperties.startServeSensor:
                parameterEquipment.startServeSensor = Number(
                  pressureData[1].slice(0, -1),
                );
                break;
              default:
                break;
            }
          }
        }
      });
      return parameterEquipment;
    }
    return null;
  }

  private async getCarbStatusDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.statusCarbonize = Number(
              pressureData[1].slice(0, -1),
            );
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getChilStatusDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.statusChiller = Number(
              pressureData[1].slice(0, -1),
            );
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getBoilStatusDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.statusBoiler = Number(
              pressureData[1].slice(0, -1),
            );
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getContStateDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.contState = Number(pressureData[1].slice(0, -1));
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getCErrDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.cErr = Number(pressureData[1].slice(0, -1));
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getCpoDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.cPo = Number(pressureData[1].slice(0, -1));
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async getCDiDataParsing(
    msg: string,
  ): Promise<ParameterEquipmentLog | null> {
    if (msg && msg.length > 5) {
      const pressureData = msg.split('=');
      if (pressureData[0] && pressureData[1]) {
        const parameterEquipment = new ParameterEquipmentLog();
        switch (pressureData[0]) {
          case this.findProperties.val:
            parameterEquipment.cDi = Number(pressureData[1].slice(0, -1));
            break;
          default:
            break;
        }
        return parameterEquipment;
      }
    }
    return null;
  }

  private async saveLog(
    log: ParameterEquipmentLog,
    equipment: Equipment,
  ): Promise<void> {
    if (log) {
      let parameterEquipment = await this.parameterEquipmentRepository.findOne({
        where: { equipment: equipment },
      });
      if (!parameterEquipment) {
        parameterEquipment = new ParameterEquipment();
        parameterEquipment.equipment = equipment;
      }

      parameterEquipment.pressureColdWater = log.pressureColdWater
        ? log.pressureColdWater
        : parameterEquipment.pressureColdWater;
      for (const [key, value] of Object.entries(log)) {
        if (key != this.id && key != this.createdAt && value) {
          parameterEquipment[key] = value;
        }
        console.log(`${key}: ${value}`);
      }

      await this.parameterEquipmentRepository.save(parameterEquipment);
    }
  }
}
