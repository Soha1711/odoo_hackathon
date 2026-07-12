export type Role = 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR';

export interface UserContext {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  departmentId: string | null;
  xpBalance: number;
  pointsBalance: number;
}

export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
  head: string | null;
  employeeCount: number;
  status: string;
}

export interface EsgScorecard {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
}

export interface ReportFilterOptions {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  module?: 'environmental' | 'social' | 'governance' | 'summary';
  employeeId?: string;
  challengeId?: string;
  categoryId?: string;
}
