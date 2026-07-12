export interface EnvironmentalGoal {
  id: string;
  title: string;
  description: string | null;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'ACTIVE' | 'ACHIEVED' | 'MISSED';
  departmentId: string | null;
  createdAt?: string;
  department?: {
    id: string;
    name: string;
  } | null;
}
