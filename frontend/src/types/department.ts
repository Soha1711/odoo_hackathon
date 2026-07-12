export interface Department {
  id: string;
  name: string;
  code: string;
  head: string | null;
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}
