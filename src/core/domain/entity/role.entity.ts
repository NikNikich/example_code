import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRolesEnum } from '../../../infrastructure/shared/user.roles.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ enum: UserRolesEnum, nullable: true })
  @Column({ enum: UserRolesEnum, default: UserRolesEnum.USER })
  name: UserRolesEnum;

  @OneToMany(
    () => User,
    user => user.role,
    { nullable: true },
  )
  users: User[];
}
