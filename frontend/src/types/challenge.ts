import { User } from './auth';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  pointsAward: number;
  xpAward: number;
  targetValue: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  categoryId: string | null;
  createdAt?: string;
}

export interface ChallengeParticipation {
  id: string;
  userId: string;
  challengeId: string;
  currentProgress: number;
  proofUrl: string | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: User;
  challenge?: Challenge;
}
