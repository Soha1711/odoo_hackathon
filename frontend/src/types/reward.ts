import { User } from './auth';

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  pointsRequired: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsRedeemed: number;
  status: 'PENDING' | 'SHIPPED' | 'COMPLETED';
  createdAt: string;
  user?: User;
  reward?: Reward;
}
