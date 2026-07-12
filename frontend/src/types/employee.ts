import { Role } from './auth';

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  departmentId: string | null;
  xpBalance: number;
  pointsBalance: number;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
}
