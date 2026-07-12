import { User } from './auth';

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsDeducted: number;
  redemptionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user?: User;
  reward?: Reward;
}
