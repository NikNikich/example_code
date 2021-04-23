import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { JwtPayload } from './jwt.payload.interface';
import { UserEntity } from '../../entity/user.entity';
import { SessionRepository } from '../../repository/session.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  /* This method is mandatory for jwt strategy */
  // noinspection JSUnusedGlobalSymbols
  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { token } = payload;
    const session = await this.sessionRepository.getSessionByToken(token);
    if (!session) {
      throw new UnauthorizedException();
    }

    // TODO: check expiration date

    const user = await this.userRepository.findOne({
      where: { id: session.userId },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
