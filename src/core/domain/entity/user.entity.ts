import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoleEntity } from './role.entity';
import { EquipmentEntity } from './equipment.entity';

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

  @OneToOne(() => RoleEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  role: RoleEntity;

  @OneToMany(
    () => EquipmentEntity,
    equipment => equipment.user,
    { nullable: true },
  )
  equipment: EquipmentEntity[];

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
