import { z } from 'zod';
import { ApprovalStatus } from '@prisma/client';

export const CreateCsrActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    categoryId: z.string().uuid(),
    pointsXp: z.number().nonnegative(),
    deadline: z.string().min(1), // Accept YYYY-MM-DD or ISO 8601
  }),
});

export const SubmitParticipationSchema = z.object({
  body: z.object({
    proofUrl: z.string().url().optional().nullable(),
  }),
});

export const ApproveParticipationSchema = z.object({
  body: z.object({
    approvalStatus: z.nativeEnum(ApprovalStatus),
    pointsEarned: z.number().nonnegative().optional(),
  }),
});
