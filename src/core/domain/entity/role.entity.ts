import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRolesEnum } from '../../../infrastructure/shared/user.roles.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: UserRolesEnum, default: UserRolesEnum.USER })
  name: UserRolesEnum;

  @OneToMany(
    () => UserEntity,
    user => user.role,
    { nullable: true },
  )
  users: UserEntity[];
}
