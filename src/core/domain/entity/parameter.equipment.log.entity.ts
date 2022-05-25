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

  @Expose()
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

  @ApiModelProperty({ type: 'varchar', description: 'Общий статус' })
  @Column({ nullable: true, name: 'status_overall' })
  statusOverall: string;

  @ApiModelProperty({ type: 'varchar', description: 'Статус бойлера' })
  @Column({ nullable: true, name: 'status_boiler' })
  statusBoiler: string;

  @ApiModelProperty({ type: 'varchar', description: 'Стутус куллера' })
  @Column({ nullable: true, name: 'status_cooler' })
  statusCooler: string;

  @ApiModelProperty({ type: 'varchar', description: 'Статус карбонайзера' })
  @Column({ nullable: true, name: 'status_carbonize' })
  statusCarbonize: string;

  @ApiModelProperty({ type: 'varchar', description: 'Время и тип выдачи воды' })
  @Column({ nullable: true, name: 'time_out_water' })
  timeOutWater: string;

  @ApiModelProperty({
    type: 'timestamp',
    description: 'Время от оборудования',
  })
  @Column({ nullable: true, name: 'date_equipment' })
  dateEquipment: Date;

  @ApiModelProperty({ type: 'integer', description: 'Расход энергии бойлера' })
  @Column({ nullable: true, name: 'energy_boiler' })
  energyBoiler: number;

  @ApiModelProperty({ type: 'integer', description: 'Расход энергии куллера' })
  @Column({ nullable: true, name: 'energy_cooler' })
  energyCooler: number;

  @ApiModelProperty({
    type: 'integer',
    description: 'Расход энергии карбонайзера',
  })
  @Column({ nullable: true, name: 'energy_carbonize' })
  energyCarbonize: number;

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
