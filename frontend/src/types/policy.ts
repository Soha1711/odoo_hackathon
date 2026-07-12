import { User } from './auth';

export interface EsgPolicy {
  id: string;
  title: string;
  description: string;
  contentUrl: string;
  version: string;
  effectiveDate: string;
  status: string;
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
