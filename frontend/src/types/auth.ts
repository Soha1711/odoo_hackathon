import { Role } from '../../../shared/interfaces';

export interface User {
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

export interface SessionState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}
