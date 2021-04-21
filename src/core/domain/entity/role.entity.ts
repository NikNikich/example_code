import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRolesEnum } from '../../../infrastructure/shared/user.roles.enum';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ enum: UserRolesEnum, nullable: true })
  @Column({ enum: UserRolesEnum, default: UserRolesEnum.USER })
  name: UserRolesEnum;
}
