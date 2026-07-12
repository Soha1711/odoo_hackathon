import { Role } from '../types/auth';

export const USER_ROLES = {
  ADMIN: 'ADMIN' as Role,
  MANAGER: 'MANAGER' as Role,
  CONTRIBUTOR: 'CONTRIBUTOR' as Role,
} as const;
