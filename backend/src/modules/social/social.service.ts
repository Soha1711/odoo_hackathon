import { SocialRepository } from './social.repository';
import { EnvironmentalService } from '../environmental/environmental.service';
import { HttpError } from '../../middleware/error.middleware';
import { ApprovalStatus } from '@prisma/client';
import prisma from '../../config/prisma';

export class SocialService {
  private repository = new SocialRepository();
  private environmentalService = new EnvironmentalService();

  // CSR Activities
  async getActivities() {
    return this.repository.getActivities();
  }

  async addActivity(data: { title: string; description: string; categoryId: string; pointsXp: number; deadline: string }) {
    return this.repository.createActivity({
      ...data,
      deadline: new Date(data.deadline),
    });
  }

  // Employee Participations
  async getParticipations(filters: { userId?: string; approvalStatus?: ApprovalStatus }) {
    return this.repository.getParticipations(filters);
  }

  async joinActivity(userId: string, csrActivityId: string, proofUrl?: string) {
    const activity = await this.repository.findActivityById(csrActivityId);
    if (!activity) {
      throw new HttpError(404, 'CSR activity not found');
    }

    if (new Date() > activity.deadline) {
      throw new HttpError(400, 'The deadline for this activity has passed');
    }

    // Check if user already participated
    const existing = await prisma.employeeParticipation.findFirst({
      where: { userId, csrActivityId },
    });
    if (existing) {
      throw new HttpError(400, 'You have already submitted a participation proof for this activity');
    }

    return this.repository.createParticipation({
      userId,
      csrActivityId,
      proofUrl,
    });
  }

  async reviewParticipation(id: string, status: ApprovalStatus, pointsEarnedInput?: number) {
    const participation = await this.repository.findParticipationById(id);
    if (!participation) {
      throw new HttpError(404, 'Participation record not found');
    }

    if (participation.approvalStatus !== 'PENDING') {
      throw new HttpError(400, 'This participation record has already been reviewed');
    }

    const pointsEarned = pointsEarnedInput ?? participation.csrActivity.pointsXp;
    const completionDate = new Date();

    const updated = await this.repository.updateParticipationApproval(
      id,
      status,
      status === 'APPROVED' ? pointsEarned : 0,
      completionDate
    );

    if (status === 'APPROVED') {
      // Award User XP and Points
      await prisma.user.update({
        where: { id: participation.userId },
        data: {
          xpBalance: { increment: pointsEarned },
          pointsBalance: { increment: pointsEarned },
        },
      });

      // Recalculate Department Score
      if (updated.user.departmentId) {
        const year = completionDate.getFullYear();
        const month = completionDate.getMonth() + 1;
        await this.environmentalService.recalculateScores(updated.user.departmentId, year, month);
      }
    }

    return updated;
  }
}
