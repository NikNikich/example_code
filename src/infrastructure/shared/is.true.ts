import { QueryBooleanEnum } from './enum/query.boolean.enum';
import * as lodash from 'lodash';
import { ErrorIf } from '../presenter/rest-api/errors/error.if';
import { INVALID_BOOLEAN_DATA } from '../presenter/rest-api/errors/errors';

export function isTrue(value: string): boolean {
  ErrorIf.isFalse(
    lodash.includes(QueryBooleanEnum, value.toLowerCase()),
    INVALID_BOOLEAN_DATA,
  );
  return value.toLowerCase() === QueryBooleanEnum.True || false;
}
