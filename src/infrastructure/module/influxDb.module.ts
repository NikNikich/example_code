import { Module } from '@nestjs/common';
import { InfluxDbModule, InfluxModuleOptions } from 'nest-influxdb';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || config.get('jwt.secret'),
      signOptions: {
        expiresIn: config.get('jwt.expiresIn'),
      },
    }),
    InfluxDbModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: async (): Promise<InfluxModuleOptions> => {
        return {
          host: config.get('influxDB.host'),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class InfluxDbModuleModule {}
