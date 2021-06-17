import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRolesEnum } from '../../../infrastructure/shared/enum/user.roles.enum';

import { User } from './user.entity';
import { Right } from './right.entity';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: UserRolesEnum, default: UserRolesEnum.USER })
  name: UserRolesEnum;

  @OneToMany(
    () => User,
    user => user.role,
    { nullable: true },
  )
  users: User[];

  @ManyToMany(
    () => Right,
    right => right.roles,
  )
  @JoinTable({ name: 'role_right' })
  rights: Right[];
}
