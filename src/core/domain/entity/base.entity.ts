import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;
}
