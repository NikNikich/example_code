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
  private temp = 'temp';
  private pressure = 'pressure';
  private tempBoiler = 'boiler';
  private tempChiller = 'chiller';
  private tempEnv = 'env';
  private pressureCold = 'cold';
  private pressureHot = 'hot';
  private pressureCo2 = 'co2';

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
        switch (msgSplit[0]) {
          case this.temp:
            const tempDataParsing = await this.getTempDataParsing(msgSplit[1]);
            const timestampT = +msgSplit[2];
            if (tempDataParsing && timestampT && timestampT > 100000) {
              tempDataParsing.dateEquipment = new Date(timestampT);
              return tempDataParsing;
            }
            break;
          case this.pressure:
            const pressureEquipment = await this.getPressureDataParsing(
              msgSplit[1],
            );
            const timestampP = +msgSplit[2];
            if (pressureEquipment && timestampP && timestampP > 100000) {
              pressureEquipment.dateEquipment = new Date(timestampP);
              return pressureEquipment;
            }
            break;
          default:
            break;
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
            const lengthData1 =
              tempData[1].length > 1 ? tempData[1].length - 1 : 0;
            switch (tempData[0]) {
              case this.tempBoiler:
                parameterEquipment.tempBoiler = Number(
                  tempData[1].slice(0, lengthData1),
                );
                break;
              case this.tempChiller:
                parameterEquipment.tempChiller = Number(
                  tempData[1].slice(0, lengthData1),
                );
                break;
              case this.tempEnv:
                parameterEquipment.tempEnv = Number(
                  tempData[1].slice(0, lengthData1),
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
            const lengthData1 =
              pressureData[1].length > 1 ? pressureData[1].length - 1 : 0;
            switch (pressureData[0]) {
              case this.pressureCold:
                parameterEquipment.pressureColdWater = Number(
                  pressureData[1].slice(0, lengthData1),
                );
                break;
              case this.pressureHot:
                parameterEquipment.pressureHotWater = Number(
                  pressureData[1].slice(0, lengthData1),
                );
                break;
              case this.pressureCo2:
                parameterEquipment.pressureCO2 = Number(
                  pressureData[1].slice(0, lengthData1),
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
      parameterEquipment.pressureHotWater = log.pressureHotWater
        ? log.pressureHotWater
        : parameterEquipment.pressureHotWater;
      parameterEquipment.pressureCO2 = log.pressureCO2
        ? log.pressureCO2
        : parameterEquipment.pressureCO2;
      parameterEquipment.tempEnv = log.tempEnv
        ? log.tempEnv
        : parameterEquipment.tempEnv;
      parameterEquipment.tempChiller = log.tempChiller
        ? log.tempChiller
        : parameterEquipment.tempChiller;
      parameterEquipment.tempBoiler = log.tempBoiler
        ? log.tempBoiler
        : parameterEquipment.tempBoiler;
      parameterEquipment.dateEquipment = log.dateEquipment
        ? log.dateEquipment
        : parameterEquipment.dateEquipment;

      await this.parameterEquipmentRepository.save(parameterEquipment);
    }
  }
}
