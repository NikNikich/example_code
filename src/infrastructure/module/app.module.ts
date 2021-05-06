import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '../presenter/rest-api/controller/app.controller';
import { AppService } from '../../application/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseModule } from './base.module';
import { UserModule } from './user.module';
import { typeOrmConfig } from '../typeorm/typeorm.config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../presenter/rest-api/errors/all.exception.filter';
import { routerLogger } from '../presenter/rest-api/router.logger';
import { EquipmentModule } from './equipment.module';
import { BuildingModule } from './building.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    EquipmentModule,
    BaseModule,
    BuildingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(routerLogger).forRoutes('*');
  }
}
