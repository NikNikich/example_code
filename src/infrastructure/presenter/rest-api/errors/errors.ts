import { StandardRestApiError } from './standard.rest.api.error';

// STATUS CODE 400 IS RESERVED FOR VALIDATION

// noinspection MagicNumberJS
export const INVALID_CREDENTIALS: StandardRestApiError = StandardRestApiError.create(
  1001,
  'Invalid credentials',
);

// noinspection MagicNumberJS
export const SMS_TOO_OFTEN: StandardRestApiError = StandardRestApiError.create(
  1003,
  'Sms request too often',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const OBJECT_NOT_FOUND: StandardRestApiError = StandardRestApiError.create(
  1004,
  'Object not found',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const USER_NOT_FOUND: StandardRestApiError = StandardRestApiError.create(
  1006,
  'User not found',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const PASSWORD_IS_EMPTY: StandardRestApiError = StandardRestApiError.create(
  1007,
  'User`s password is empty',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const USED_EMAIL: StandardRestApiError = StandardRestApiError.create(
  1008,
  'Users email already registered in system',
);

export const EQUIPMENT_NOT_FOUND: StandardRestApiError = StandardRestApiError.create(
  1009,
  'Equipment not found',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const USED_ID_EQUIPMENT: StandardRestApiError = StandardRestApiError.create(
  1008,
  'Equipment id already registered in system',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const INVALID_ADDRESS_DATA: StandardRestApiError = StandardRestApiError.create(
  1009,
  'invalid data address',
);
