import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';
import { Role } from './role.entity';

@Entity({ name: 'right' })
export class Right extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: UserRightsEnum, default: UserRightsEnum.EQUIPMENT_READ })
  name: UserRightsEnum;

  @ManyToMany(
    () => Role,
    role => role.rights,
  )
  roles: Role[];
}
