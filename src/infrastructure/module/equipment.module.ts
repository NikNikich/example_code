import { Module } from '@nestjs/common';
import { EquipmentService } from '../../application/services/equipment.service';
import { EquipmentController } from '../presenter/rest-api/controller/equipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { SocketService } from '../../application/services/socket.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || config.get('jwt.secret'),
      signOptions: {
        expiresIn: config.get('jwt.expiresIn'),
      },
    }),
    TypeOrmModule.forFeature([EquipmentRepository, UserRepository]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService, SocketService],
  exports: [],
})
export class EquipmentModule {}
