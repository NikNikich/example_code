import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class BuildingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  city: string;

  @Column()
  address: string;
}
