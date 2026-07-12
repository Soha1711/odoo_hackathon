import { z } from 'zod';
import { TransactionSourceType, ChallengeStatus } from '@prisma/client';

export const CreateCarbonTransactionSchema = z.object({
  body: z.object({
    sourceType: z.nativeEnum(TransactionSourceType),
    sourceId: z.string().min(1),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    emissionFactorId: z.string().uuid(),
    departmentId: z.string().uuid(),
    transactionDate: z.string().datetime(),
  }),
});

export const CreateGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    departmentId: z.string().uuid(),
    targetValue: z.number().positive(),
    currentValue: z.number().nonnegative().optional(),
    unit: z.string().min(1),
    deadline: z.string().datetime(),
    status: z.nativeEnum(ChallengeStatus).optional(),
  }),
});

export const CreateFactorSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    factor: z.number().positive(),
    unit: z.string().min(1),
    source: z.string().min(1),
  }),
});

export const CreateProfileSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    carbonFootprint: z.number().nonnegative(),
    recycledContentPercentage: z.number().min(0).max(100).optional(),
    waterFootprint: z.number().nonnegative().optional(),
    status: z.string().optional(),
  }),
});
