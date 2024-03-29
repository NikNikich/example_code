import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BuildingRepository } from '../../core/domain/repository/building.repository';
import { BuildingController } from '../presenter/rest-api/controller/building.controller';
import { BuildingService } from '../../application/services/building service';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { UserRepository } from '../../core/domain/repository/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || config.get('jwt.secret'),
      signOptions: {
        expiresIn: config.get('jwt.expiresIn'),
      },
    }),
    TypeOrmModule.forFeature([
      BuildingRepository,
      RoleRepository,
      EquipmentRepository,
      UserRepository,
    ]),
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [],
})
export class BuildingModule {}
