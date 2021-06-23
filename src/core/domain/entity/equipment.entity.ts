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
import { EquipmentJobStatusEnum } from '../../../infrastructure/shared/enum/equipment.job.status.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { EquipmentUseStatusEnum } from '../../../infrastructure/shared/enum/equipment.use.status.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'equipment' })
export class Equipment extends BaseEntity {
  @ApiModelProperty({ type: 'number', nullable: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'string' })
  @Column({ nullable: true })
  name: string;

  @ApiModelProperty({ type: 'string' })
  @Column({ unique: true, nullable: true })
  equipmentId: string;

  @ApiModelProperty({ type: 'string' })
  @Column({ nullable: true })
  servicePassword: string;

  @ApiModelProperty({ type: 'string' })
  @Column({ nullable: true })
  address: string;

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

  @ApiModelProperty({ type: User, nullable: true })
  @ManyToOne(
    () => User,
    user => user.equipmentOwner,
    {
      cascade: true,
      nullable: true,
      eager: true,
    },
  )
  @JoinColumn()
  owner: User;

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
  @Column({ enum: EquipmentUseStatusEnum, nullable: true })
  useStatus: EquipmentUseStatusEnum;

  @ApiModelProperty({ type: 'timestamp', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateInitialization: Date;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent1: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent2: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent3: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent4: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent5: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  SNComponent6: string;

  @Exclude()
  @ManyToOne(
    () => User,
    (user: User) => user.id,
  )
  @JoinColumn()
  parent?: User;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public deletedAt: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
