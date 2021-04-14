import { Session } from '../entity/session.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  public async createSession(userId: number, token: string): Promise<Session> {
    const session = new Session();
    session.userId = userId;
    session.token = token;
    session.expirationDate = moment
      .utc()
      .add(30, 'days')
      .toDate();
    return session.save();
  }

  public async deleteSession(session: Session): Promise<void> {
    await this.delete(session.id);
  }

  public async getSessionByToken(token: string): Promise<Session | undefined> {
    const query: SelectQueryBuilder<Session> = this.createQueryBuilder(
      'session',
    );
    query.andWhere('session.token = :token', { token });
    return query.getOne();
  }

  public async getSessionsByUserId(userId: number): Promise<Session[]> {
    const query: SelectQueryBuilder<Session> = this.createQueryBuilder(
      'session',
    );
    query.andWhere('"session"."userId" = :userId', { userId });
    return query.getMany();
  }
}
