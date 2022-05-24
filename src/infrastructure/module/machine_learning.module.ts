import { Module } from '@nestjs/common';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MachineLearningService } from '../../application/services/machine_learning.service';
import { MachineLearningController } from '../presenter/rest-api/controller/machine_learning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../../core/domain/repository/user.repository';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { ParameterEquipment } from '../../core/domain/entity/parameter.equipment.entity';
import { Equipment } from '../../core/domain/entity/equipment.entity';

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
      RoleRepository,
      Equipment,
      RabbitLog,
      ParameterEquipment,
    ]),
  ],
  controllers: [MachineLearningController],
  providers: [MachineLearningService],
})
export class MachineLearningModule {}
