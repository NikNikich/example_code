import { Module } from '@nestjs/common';
import { EquipmentService } from '../../application/services/equipment.service';
import { EquipmentController } from '../presenter/rest-api/controller/equipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentRepository])],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [],
})
export class equipmentModule {}
