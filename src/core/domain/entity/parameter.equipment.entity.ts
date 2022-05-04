import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Equipment } from './equipment.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'parameter_equipment' })
export class ParameterEquipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'real', description: 'Температура холодной воды' })
  @Column({
    nullable: true,
    name: 'temp_cold_water',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempColdWater: number;

  @ApiModelProperty({ type: 'real', description: 'Температура горячей воды' })
  @Column({
    nullable: true,
    name: 'temp_hot_water',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempHotWater: number;

  @ApiModelProperty({ type: 'real', description: 'Температура CO2' })
  @Column({
    nullable: true,
    name: 'temp_co2',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  tempCO2: number;

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
