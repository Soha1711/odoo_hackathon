import { z } from 'zod';
import { Difficulty, ChallengeStatus, ApprovalStatus } from '@prisma/client';

export const CreateChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    categoryId: z.string().uuid(),
    description: z.string().min(1),
    xp: z.number().nonnegative(),
    difficulty: z.nativeEnum(Difficulty),
    evidenceRequired: z.boolean().optional(),
    deadline: z.string().min(1), // Accept YYYY-MM-DD or ISO 8601
    status: z.nativeEnum(ChallengeStatus).optional(),
  }),
});

export const UpdateProgressSchema = z.object({
  body: z.object({
    progress: z.number().min(0).max(100),
    proofUrl: z.string().url().optional().nullable(),
  }),
});

export const ApproveChallengeParticipationSchema = z.object({
  body: z.object({
    approvalStatus: z.nativeEnum(ApprovalStatus),
  }),
});

export const CreateRewardSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    pointsRequired: z.number().positive(),
    stock: z.number().nonnegative().optional(),
    status: z.string().optional(),
  }),
});
