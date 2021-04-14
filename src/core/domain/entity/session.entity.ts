import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expirationDate: Date;
}
