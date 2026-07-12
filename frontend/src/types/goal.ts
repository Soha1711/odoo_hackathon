export interface EnvironmentalGoal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'ARCHIVED';
  departmentId: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: string;
    name: string;
    code?: string;
  } | null;
}
