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

@Entity({ name: 'building' })
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

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
