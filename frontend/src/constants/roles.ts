import { Role } from '../../../shared/interfaces';

export const USER_ROLES = {
  ADMIN: Role.ADMIN,
  MANAGER: Role.MANAGER,
  CONTRIBUTOR: Role.CONTRIBUTOR,
} as const;
