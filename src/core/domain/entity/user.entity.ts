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
import { Role } from './role.entity';
import { Equipment } from './equipment.entity';
import { Exclude } from 'class-transformer';

// TODO: move API Model Properties to DTO in documentation
@Entity()
export class User extends BaseEntity {
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

  @Exclude()
  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  resetCode: string;

  @Exclude()
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

  @ManyToOne(
    () => Role,
    role => role.users,
    {},
  )
  @JoinColumn()
  role: Role;

  @OneToMany(
    () => Equipment,
    equipment => equipment.user,
    { nullable: true },
  )
  equipment: Equipment[];

  @ApiModelProperty({
    type: 'Date',
    nullable: true,
    description: 'Если не null, значит запись считается йдалённой',
  })
  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
