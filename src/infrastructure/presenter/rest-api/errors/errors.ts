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
  1010,
  'Equipment id already registered in system',
);

export const BUILDING_NOT_FOUND: StandardRestApiError = StandardRestApiError.create(
  1011,
  'Building not found',
);

// noinspection MagicNumberJS,JSUnusedGlobalSymbols
export const INVALID_ADDRESS_DATA: StandardRestApiError = StandardRestApiError.create(
  1012,
  'invalid data address',
);

export const INVALID_BOOLEAN_DATA: StandardRestApiError = StandardRestApiError.create(
  1013,
  'Value is not a boolean',
);

export const ROLE_NOT_FOUND: StandardRestApiError = StandardRestApiError.create(
  1014,
  'Role not found',
);

export const NOT_CHANGE_USER: StandardRestApiError = StandardRestApiError.create(
  1015,
  'You cannot change or view this user.',
);

export const NOT_CREATE_USER: StandardRestApiError = StandardRestApiError.create(
  1016,
  'You are wrong to create user.',
);

export const NOT_CHANGE_EQUIPMENT: StandardRestApiError = StandardRestApiError.create(
  1017,
  'You cannot change or view this equipment',
);

export const NOT_CREATE_EQUIPMENT: StandardRestApiError = StandardRestApiError.create(
  1018,
  'You are wrong to create equipment.',
);
