import { GamificationRepository } from './gamification.repository';
import { HttpError } from '../../middleware/error.middleware';
import { ChallengeStatus, Difficulty, ApprovalStatus } from '@prisma/client';
import prisma from '../../config/prisma';

export class GamificationService {
  private repository = new GamificationRepository();

  // Challenges
  async getChallenges(status?: ChallengeStatus) {
    return this.repository.getChallenges(status);
  }

  async addChallenge(data: { title: string; categoryId: string; description: string; xp: number; difficulty: Difficulty; evidenceRequired?: boolean; deadline: string; status?: ChallengeStatus }) {
    return this.repository.createChallenge({
      ...data,
      deadline: new Date(data.deadline),
    });
  }

  // Participations
  async getParticipations(filters: { userId?: string; challengeId?: string; approvalStatus?: ApprovalStatus }) {
    return this.repository.getParticipations(filters);
  }

  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.repository.findChallengeById(challengeId);
    if (!challenge) {
      throw new HttpError(404, 'Challenge not found');
    }

    if (challenge.status !== ChallengeStatus.ACTIVE) {
      throw new HttpError(400, 'This challenge is not active');
    }

    if (new Date() > challenge.deadline) {
      throw new HttpError(400, 'This challenge deadline has passed');
    }

    // Check if already joined
    const existing = await prisma.challengeParticipation.findFirst({
      where: { userId, challengeId },
    });
    if (existing) {
      throw new HttpError(400, 'You have already joined this challenge');
    }

    return this.repository.createParticipation(userId, challengeId);
  }

  async updateProgress(userId: string, challengeId: string, progress: number, proofUrl?: string | null) {
    const participation = await prisma.challengeParticipation.findFirst({
      where: { userId, challengeId },
      include: { challenge: true },
    });

    if (!participation) {
      throw new HttpError(404, 'Challenge participation record not found');
    }

    if (participation.approvalStatus === 'APPROVED') {
      throw new HttpError(400, 'This challenge has already been completed and approved');
    }

    const updated = await this.repository.updateParticipationProgress(participation.id, progress, proofUrl);

    // If progress reaches 100% and NO evidence is required, we can auto-submit it or auto-approve it
    // To match ERP workflows, let's keep it pending review if evidence is required, or auto-complete it
    if (progress === 100 && !participation.challenge.evidenceRequired) {
      // Auto-approve since no evidence is required
      await this.reviewParticipation(participation.id, ApprovalStatus.APPROVED);
    }

    return updated;
  }

  async reviewParticipation(id: string, status: ApprovalStatus) {
    const participation = await this.repository.findParticipationById(id);
    if (!participation) {
      throw new HttpError(404, 'Participation record not found');
    }

    if (participation.approvalStatus !== 'PENDING') {
      throw new HttpError(400, 'This participation record has already been reviewed');
    }

    const completedAt = status === 'APPROVED' ? new Date() : null;
    const xpAwarded = status === 'APPROVED' ? participation.challenge.xp : 0;

    const result = await this.repository.updateParticipationApproval(id, status, xpAwarded, completedAt);

    if (status === 'APPROVED') {
      // Award User XP and Voucher points
      await prisma.user.update({
        where: { id: participation.userId },
        data: {
          xpBalance: { increment: xpAwarded },
          pointsBalance: { increment: xpAwarded },
        },
      });

      // Send challenge completion notification
      await prisma.notification.create({
        data: {
          userId: participation.userId,
          title: `Challenge Completed: ${participation.challenge.title}`,
          message: `Congratulations! You completed the challenge and earned ${xpAwarded} XP!`,
          type: 'APPROVAL',
        },
      });

      // Check and Unlock Badges
      await this.checkAndUnlockBadges(participation.userId);
    }

    return result;
  }

  // Badges
  async getBadges() {
    return this.repository.getBadges();
  }

  async getMyBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  // Rewards
  async getRewards() {
    return this.repository.getRewards();
  }

  async addReward(data: { name: string; description: string; pointsRequired: number; stock?: number; status?: string }) {
    return this.repository.createReward(data);
  }

  async redeemReward(userId: string, rewardId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const reward = await this.repository.findRewardById(rewardId);
    if (!reward) {
      throw new HttpError(404, 'Reward not found');
    }

    if (reward.status !== 'ACTIVE') {
      throw new HttpError(400, 'This reward is currently unavailable');
    }

    if (reward.stock <= 0) {
      throw new HttpError(400, 'This reward is out of stock');
    }

    if (user.pointsBalance < reward.pointsRequired) {
      throw new HttpError(400, `Insufficient points balance. Required: ${reward.pointsRequired}, Current: ${user.pointsBalance}`);
    }

    const redemption = await this.repository.createRedemption(userId, rewardId, reward.pointsRequired);

    // Create Notification
    await prisma.notification.create({
      data: {
        userId,
        title: `Reward Redeemed: ${reward.name}`,
        message: `You successfully redeemed ${reward.name} for ${reward.pointsRequired} points.`,
        type: 'APPROVAL',
      },
    });

    return redemption;
  }

  // Leaderboard
  async getLeaderboards() {
    const users = await this.repository.getUserLeaderboard();
    const departments = await this.repository.getDepartmentLeaderboard();
    return { users, departments };
  }

  // Helper Badge Checker
  private async checkAndUnlockBadges(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { badges: true },
    });
    if (!user) return;

    const completedChallengesCount = await prisma.challengeParticipation.count({
      where: { userId, approvalStatus: ApprovalStatus.APPROVED },
    });

    const badges = await this.repository.getBadges();
    const unlockedBadgeIds = new Set(user.badges.map((ub) => ub.badgeId));

    for (const badge of badges) {
      if (unlockedBadgeIds.has(badge.id)) continue;

      try {
        const rule = JSON.parse(badge.unlockRule);
        let qualifies = false;

        if (rule.minXp && user.xpBalance >= rule.minXp) {
          qualifies = true;
        }

        if (rule.minCompletedChallenges && completedChallengesCount >= rule.minCompletedChallenges) {
          qualifies = true;
        }

        if (qualifies) {
          // Unlock
          await prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
            },
          });

          // Notify
          await prisma.notification.create({
            data: {
              userId,
              title: `New Badge Unlocked: ${badge.name}`,
              message: `Incredible! You unlocked the "${badge.name}" badge: ${badge.description}`,
              type: 'BADGE_UNLOCK',
            },
          });
        }
      } catch (e) {
        // Skip invalid badge rules
      }
    }
  }
}
