import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'building' })
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  type: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  country: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  region: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  area: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  city: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  street: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  house: string;

  @ApiModelProperty({
    type: Equipment,
    description:
      '[Мат долгий] Свагер глючит. Тут список оборудования смотри get Equipments',
  })
  @OneToMany(
    () => Equipment,
    equipment => equipment.building,
    { nullable: true },
  )
  equipment?: Equipment[];

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
