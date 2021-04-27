import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoleEntity } from './role.entity';
import { EquipmentEntity } from './equipment.entity';
import { Exclude } from 'class-transformer';

// TODO: move API Model Properties to DTO in documentation
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiModelProperty({ type: 'number', nullable: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'number', nullable: true })
  @Column({ nullable: true })
  phone: number;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  smsCode: string;

  @ApiModelProperty({ type: 'string', nullable: true, format: 'date-time' })
  @Column({ nullable: true })
  lastCode: Date;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  email: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  password: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  resetCode: string;

  @ApiModelProperty({ type: 'string', nullable: true, format: 'date-time' })
  @Column({ nullable: true })
  resetCodeExpirationDate: Date;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  surName: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  organization: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  position: string;

  @ApiModelProperty({ type: RoleEntity, nullable: true })
  @ManyToOne(
    () => RoleEntity,
    role => role.users,
    {},
  )
  @JoinColumn()
  role: RoleEntity;

  @Exclude()
  @OneToMany(
    () => EquipmentEntity,
    equipment => equipment.manager,
    { nullable: true },
  )
  equipmentManagers: EquipmentEntity[];

  @Exclude()
  @OneToMany(
    () => EquipmentEntity,
    equipment => equipment.engineer,
    { nullable: true },
  )
  equipmentEngineers: EquipmentEntity[];

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
