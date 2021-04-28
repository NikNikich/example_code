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
import { EquipmentStatusEnum } from '../../../infrastructure/shared/equipment.status.enum';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'equipment' })
export class Equipment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.equipment,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  user: User;

  @ManyToOne(
    () => Building,
    building => building.equipment,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  building: Building;

  @ApiModelProperty({ enum: EquipmentStatusEnum, nullable: true })
  @Column({ enum: EquipmentStatusEnum, default: EquipmentStatusEnum.OK })
  status: EquipmentStatusEnum;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
