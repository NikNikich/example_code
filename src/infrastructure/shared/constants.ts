import { UserRolesEnum } from './enum/user.roles.enum';

export const MIN_ID_POSTGRES = 1;
export const MAX_ID_POSTGRES = Math.pow(2, 31) - 1;
export const MILLISECONDS_IN_SECOND = 1000;
export const VISIBLE_ROLES = (): { [name: string]: UserRolesEnum[] } => {
  const visible = {};
  visible[UserRolesEnum.ADMIN] = [
    UserRolesEnum.ADMIN,
    UserRolesEnum.USER,
    UserRolesEnum.DEALER,
    UserRolesEnum.DEALER_SERVICE,
    UserRolesEnum.MANUFACTURER,
    UserRolesEnum.MANUFACTURER_SERVICE,
    UserRolesEnum.CLIENT,
    UserRolesEnum.CLIENT_SERVICE,
  ];
  visible[UserRolesEnum.MANUFACTURER] = [
    UserRolesEnum.DEALER,
    UserRolesEnum.MANUFACTURER_SERVICE,
    UserRolesEnum.CLIENT,
  ];
  visible[UserRolesEnum.DEALER] = [
    UserRolesEnum.DEALER_SERVICE,
    UserRolesEnum.CLIENT,
  ];
  visible[UserRolesEnum.DEALER] = [UserRolesEnum.CLIENT_SERVICE];
  return visible;
};
