import { Role } from '../types/auth';

export const PERMISSIONS: Record<string, Role[]> = {
  LOG_CARBON: ['ADMIN', 'MANAGER', 'CONTRIBUTOR'],
  MANAGE_FACTORS: ['ADMIN', 'MANAGER'],
  MANAGE_GOALS: ['ADMIN', 'MANAGER'],
  JOIN_CSR: ['CONTRIBUTOR'],
  APPROVE_CSR: ['ADMIN', 'MANAGER'],
  ACKNOWLEDGE_POLICY: ['ADMIN', 'MANAGER', 'CONTRIBUTOR'],
  PUBLISH_POLICY: ['ADMIN', 'MANAGER'],
  RECORD_AUDIT: ['ADMIN', 'MANAGER'],
  MANAGE_COMPLIANCE: ['ADMIN', 'MANAGER'],
  MANAGE_CONFIG: ['ADMIN'],
  MANAGE_DEPARTMENTS: ['ADMIN'],
};

export function hasPermission(userRole: Role, permissionRoles: Role[]): boolean {
  return permissionRoles.includes(userRole);
}
