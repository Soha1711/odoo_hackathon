import prisma from '../../config/prisma';
import { ChallengeStatus, Difficulty, ApprovalStatus } from '@prisma/client';

export class GamificationRepository {
  // Challenges
  async getChallenges(status?: ChallengeStatus) {
    return prisma.challenge.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        category: true,
      },
      orderBy: { deadline: 'asc' },
    });
  }

  async findChallengeById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
    });
  }

  async createChallenge(data: { title: string; categoryId: string; description: string; xp: number; difficulty: Difficulty; evidenceRequired?: boolean; deadline: Date; status?: ChallengeStatus }) {
    return prisma.challenge.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
        description: data.description,
        xp: data.xp,
        difficulty: data.difficulty,
        evidenceRequired: data.evidenceRequired ?? false,
        deadline: data.deadline,
        status: data.status ?? ChallengeStatus.DRAFT,
      },
      include: {
        category: true,
      },
    });
  }

  // Participations
  async getParticipations(filters: { userId?: string; challengeId?: string; approvalStatus?: ApprovalStatus }) {
    return prisma.challengeParticipation.findMany({
      where: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.challengeId && { challengeId: filters.challengeId }),
        ...(filters.approvalStatus && { approvalStatus: filters.approvalStatus }),
      },
      include: {
        user: {
          include: { department: true },
        },
        challenge: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findParticipationById(id: string) {
    return prisma.challengeParticipation.findUnique({
      where: { id },
      include: {
        user: true,
        challenge: true,
      },
    });
  }

  async createParticipation(userId: string, challengeId: string) {
    return prisma.challengeParticipation.create({
      data: {
        userId,
        challengeId,
        progress: 0.0,
        approvalStatus: 'PENDING',
      },
      include: {
        challenge: true,
      },
    });
  }

  async updateParticipationProgress(id: string, progress: number, proofUrl?: string | null) {
    return prisma.challengeParticipation.update({
      where: { id },
      data: {
        progress,
        ...(proofUrl !== undefined && { proofUrl }),
      },
      include: {
        challenge: true,
      },
    });
  }

  async updateParticipationApproval(id: string, status: ApprovalStatus, xpAwarded: number, completedAt: Date | null) {
    return prisma.challengeParticipation.update({
      where: { id },
      data: {
        approvalStatus: status,
        xpAwarded,
        completedAt,
      },
      include: {
        user: true,
        challenge: true,
      },
    });
  }

  // Badges
  async getBadges() {
    return prisma.badge.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Rewards
  async getRewards() {
    return prisma.reward.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findRewardById(id: string) {
    return prisma.reward.findUnique({
      where: { id },
    });
  }

  async createReward(data: { name: string; description: string; pointsRequired: number; stock?: number; status?: string }) {
    return prisma.reward.create({
      data: {
        name: data.name,
        description: data.description,
        pointsRequired: data.pointsRequired,
        stock: data.stock ?? 0,
        status: data.status ?? 'ACTIVE',
      },
    });
  }

  async createRedemption(userId: string, rewardId: string, pointsDeducted: number) {
    // Transaction to decrement stock and create redemption
    return prisma.$transaction(async (tx) => {
      // Decrement stock
      await tx.reward.update({
        where: { id: rewardId },
        data: {
          stock: { decrement: 1 },
        },
      });

      // Deduct user points
      await tx.user.update({
        where: { id: userId },
        data: {
          pointsBalance: { decrement: pointsDeducted },
        },
      });

      // Create redemption log
      return tx.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          pointsDeducted,
          status: 'APPROVED', // Auto-approved for vouchers
        },
        include: {
          reward: true,
        },
      });
    });
  }

  // Leaderboard statistics
  async getUserLeaderboard() {
    return prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        xpBalance: true,
        department: {
          select: { name: true },
        },
      },
      orderBy: { xpBalance: 'desc' },
      take: 10,
    });
  }

  async getDepartmentLeaderboard() {
    // Fetch latest computed scores for all departments in the current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return prisma.departmentScore.findMany({
      where: { year, month },
      include: {
        department: true,
      },
      orderBy: { totalScore: 'desc' },
    });
  }
}
