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
import { EquipmentStatusEnum } from '../../../infrastructure/shared/equipment.status.enum';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'equipment' })
export class EquipmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => UserEntity,
    user => user.equipment,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(
    () => BuildingEntity,
    building => building.equipment,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  building: BuildingEntity;

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
