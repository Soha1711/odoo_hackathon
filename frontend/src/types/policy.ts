import { User } from './auth';

export interface EsgPolicy {
  id: string;
  title: string;
  description: string;
  url: string | null;
  departmentId: string | null;
  categoryId: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  acknowledgments?: PolicyAcknowledgment[];
}

export interface PolicyAcknowledgment {
  id: string;
  userId: string;
  policyId: string;
  acknowledgedAt: string;
  user?: User;
}
