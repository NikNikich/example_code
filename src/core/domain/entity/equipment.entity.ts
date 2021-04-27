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
import { UserEntity } from './user.entity';
import { BuildingEntity } from './building.entity';
import { EquipmentJobStatusEnum } from '../../../infrastructure/shared/equipment.job.status.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { EquipmentUseStatusEnum } from '../../../infrastructure/shared/equipment.use.status.enum';
import { RoleEntity } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'equipment' })
export class EquipmentEntity extends BaseEntity {
  @ApiModelProperty({ type: 'number' })
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

  @ApiModelProperty({ type: UserEntity, nullable: true })
  @ManyToOne(
    () => UserEntity,
    user => user.equipmentEngineers,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  engineer: UserEntity;

  @ApiModelProperty({ type: UserEntity, nullable: true })
  @ManyToOne(
    () => UserEntity,
    user => user.equipmentManagers,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  manager: UserEntity;

  @ApiModelProperty({ type: BuildingEntity, nullable: true })
  @ManyToOne(
    () => BuildingEntity,
    building => building.equipment,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  building: BuildingEntity;

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
