import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Building } from './building.entity';
import { EquipmentJobStatusEnum } from '../../../infrastructure/shared/equipment.job.status.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { EquipmentUseStatusEnum } from '../../../infrastructure/shared/equipment.use.status.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'equipment' })
export class Equipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'string' })
  @Column()
  name: string;

  @ApiModelProperty({ type: 'string' })
  @Column({ unique: true })
  idEquipment: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  servicePassword: string;

  @ApiModelProperty({ type: User, nullable: true })
  @ManyToOne(
    () => User,
    user => user.equipmentEngineers,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  engineer: User;

  @ApiModelProperty({ type: User, nullable: true })
  @ManyToOne(
    () => User,
    user => user.equipmentManagers,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  manager: User;

  @ApiModelProperty({ type: Building, nullable: true })
  @ManyToOne(
    () => Building,
    building => building.equipment,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  building: Building;

  @ApiModelProperty({ enum: EquipmentJobStatusEnum })
  @Column({ enum: EquipmentJobStatusEnum, default: EquipmentJobStatusEnum.OK })
  jobStatus: EquipmentJobStatusEnum;

  @ApiModelProperty({ enum: EquipmentUseStatusEnum, nullable: true })
  @Column({ enum: EquipmentUseStatusEnum })
  useStatus: EquipmentUseStatusEnum;

  @ApiModelProperty({ type: 'timestamp', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateStatus: Date;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent1: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent2: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent3: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent4: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent5: string;

  @ApiModelProperty({ type: 'string' })
  @Column()
  SNComponent6: string;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
