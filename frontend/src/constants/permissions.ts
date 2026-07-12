import { Role } from '../../../shared/interfaces';

export const PERMISSIONS = {
  // Environmental
  LOG_CARBON: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR],
  MANAGE_FACTORS: [Role.ADMIN, Role.MANAGER],
  MANAGE_GOALS: [Role.ADMIN, Role.MANAGER],

  // Social
  JOIN_CSR: [Role.CONTRIBUTOR],
  APPROVE_CSR: [Role.ADMIN, Role.MANAGER],

  // Governance
  ACKNOWLEDGE_POLICY: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR],
  PUBLISH_POLICY: [Role.ADMIN, Role.MANAGER],
  RECORD_AUDIT: [Role.ADMIN, Role.MANAGER],
  MANAGE_COMPLIANCE: [Role.ADMIN, Role.MANAGER],

  // Settings
  MANAGE_CONFIG: [Role.ADMIN],
  MANAGE_DEPARTMENTS: [Role.ADMIN],
};

export function hasPermission(userRole: Role, permissionRoles: Role[]): boolean {
  return permissionRoles.includes(userRole);
}
