import { User } from './auth';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  evidenceRequired: boolean;
  deadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'ARCHIVED';
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  proofUrl: string | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  xpAwarded: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  challenge?: Challenge;
}
