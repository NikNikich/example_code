import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Equipment } from './equipment.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'parameter_equipment_log' })
export class ParameterEquipmentLog extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'real', description: 'Температура холодной воды' })
  @Column({
    nullable: true,
    name: 'temp_boiler',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempBoiler: number;

  @ApiModelProperty({ type: 'real', description: 'Температура горячей воды' })
  @Column({
    nullable: true,
    name: 'temp_chiller',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempChiller: number;

  @ApiModelProperty({ type: 'real', description: 'Температура CO2' })
  @Column({
    nullable: true,
    name: 'temp_env',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempEnv: number;

  @ApiModelProperty({ type: 'integer', description: 'Давление холодной воды' })
  @Column({ nullable: true, name: 'pressure_cold_water' })
  pressureColdWater: number;

  @ApiModelProperty({ type: 'integer', description: 'Давление горячей воды' })
  @Column({ nullable: true, name: 'pressure_hot_water' })
  pressureHotWater: number;

  @ApiModelProperty({ type: 'integer', description: 'Давление CO2' })
  @Column({ nullable: true, name: 'pressure_co2' })
  pressureCO2: number;

  @ApiModelProperty({ type: 'integer', description: 'Статус бойлера' })
  @Column({ nullable: true, name: 'status_boiler' })
  statusBoiler: number;

  @ApiModelProperty({ type: 'integer', description: 'Стутус куллера' })
  @Column({ nullable: true, name: 'status_chiller' })
  statusChiller: number;

  @ApiModelProperty({ type: 'integer', description: 'Статус карбонайзера' })
  @Column({ nullable: true, name: 'status_carbonize' })
  statusCarbonize: number;

  @ApiModelProperty({ type: 'integer', description: 'Расход энергии бойлера' })
  @Column({ nullable: true, name: 'energy_boiler' })
  energyBoiler: number;

  @ApiModelProperty({ type: 'integer', description: 'Расход энергии куллера' })
  @Column({ nullable: true, name: 'energy_chiller' })
  energyChiller: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Расход энергии карбонайзера',
  })
  @Column({ nullable: true, name: 'energy_carbonize' })
  energyCarbonize: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Расход воды бойлера',
  })
  @Column({ nullable: true, name: 'waterflow_hot' })
  waterflowHot: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Расход воды чиллера',
  })
  @Column({ nullable: true, name: 'waterflow_cold' })
  waterflowCold: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Расход воды карбонизатора',
  })
  @Column({ nullable: true, name: 'waterflow_spark' })
  waterflowSpark: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Битовая маска состояния цифровых входов',
  })
  @Column({ nullable: true, name: 'c_di' })
  cDi: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Битовая маска состояния силовых выходов контроллера',
  })
  @Column({ nullable: true, name: 'c_po' })
  cPo: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Битовая маска ошибок контроллера',
  })
  @Column({ nullable: true, name: 'c_err' })
  cErr: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Передает состояние контроллера',
  })
  @Column({ nullable: true, name: 'cont_state' })
  contState: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Тип воды при начале операции выдачи',
  })
  @Column({ nullable: true, name: 'start_serve_type' })
  startServeType: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Какой сенсор используется при выдаче воды',
  })
  @Column({ nullable: true, name: 'start_serve_sensor' })
  startServeSensor: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Тип овыданной',
  })
  @Column({ nullable: true, name: 'stop_serve_type' })
  stopServeType: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Время выданной воды',
  })
  @Column({ nullable: true, name: 'stop_serve_duration' })
  stopServeDuration: number;

  @ApiModelProperty({
    type: 'timestamp',
    description: 'Время от оборудования',
  })
  @Column({ nullable: true, name: 'date_equipment' })
  dateEquipment: Date;

  @Exclude()
  @ManyToOne(
    () => Equipment,
    equipment => equipment.id,
  )
  @JoinColumn()
  equipment: Equipment;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;
}
