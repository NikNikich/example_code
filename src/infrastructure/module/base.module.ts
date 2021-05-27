import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { BaseService } from '../../application/services/base.service';
import { BaseRepository } from '../../core/domain/repository/base.repository';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { UserService } from '../../application/services/user.service';
import { JwtStrategy } from '../../core/domain/service/jwt/jwt.strategy';
import { BaseController } from '../presenter/rest-api/controller/base.controller';
import { SessionRepository } from '../../core/domain/repository/session.repository';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { BuildingRepository } from '../../core/domain/repository/building.repository';

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
      UserRepository,
      SessionRepository,
      BaseRepository,
      RoleRepository,
      EquipmentRepository,
      BuildingRepository,
    ]),
  ],
  controllers: [BaseController],
  providers: [UserService, JwtStrategy, BaseService],
  exports: [JwtStrategy, PassportModule],
})
export class BaseModule {}
