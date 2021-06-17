import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRightsEnum } from '../../../infrastructure/shared/enum/user.rights.enum';

export const AllowRights = (rights: UserRightsEnum[]): CustomDecorator =>
  SetMetadata('rights', rights);
