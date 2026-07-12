import prisma from '../../config/prisma';
import { ApprovalStatus } from '@prisma/client';

export class SocialRepository {
  // CSR Activities
  async getActivities() {
    return prisma.csrActivity.findMany({
      include: {
        category: true,
      },
      orderBy: { deadline: 'asc' },
    });
  }

  async findActivityById(id: string) {
    return prisma.csrActivity.findUnique({
      where: { id },
    });
  }

  async createActivity(data: { title: string; description: string; categoryId: string; pointsXp: number; deadline: Date }) {
    return prisma.csrActivity.create({
      data,
      include: {
        category: true,
      },
    });
  }

  // Employee Participations
  async getParticipations(filters: { userId?: string; approvalStatus?: ApprovalStatus }) {
    return prisma.employeeParticipation.findMany({
      where: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.approvalStatus && { approvalStatus: filters.approvalStatus }),
      },
      include: {
        user: {
          include: { department: true },
        },
        csrActivity: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findParticipationById(id: string) {
    return prisma.employeeParticipation.findUnique({
      where: { id },
      include: {
        user: true,
        csrActivity: true,
      },
    });
  }

  async createParticipation(data: { userId: string; csrActivityId: string; proofUrl?: string }) {
    return prisma.employeeParticipation.create({
      data: {
        userId: data.userId,
        csrActivityId: data.csrActivityId,
        proofUrl: data.proofUrl || null,
        approvalStatus: 'PENDING',
      },
      include: {
        csrActivity: true,
      },
    });
  }

  async updateParticipationApproval(id: string, status: ApprovalStatus, pointsEarned: number, completionDate: Date) {
    return prisma.employeeParticipation.update({
      where: { id },
      data: {
        approvalStatus: status,
        pointsEarned,
        completionDate,
      },
      include: {
        user: true,
        csrActivity: true,
      },
    });
  }
}
