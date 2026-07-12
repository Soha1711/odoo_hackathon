import { z } from 'zod';
import { AuditOutcome, ComplianceSeverity, ComplianceStatus } from '@prisma/client';

export const CreatePolicySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    contentUrl: z.string().url(),
    version: z.string().optional(),
    effectiveDate: z.string().datetime(),
  }),
});

export const CreateAuditSchema = z.object({
  body: z.object({
    departmentId: z.string().uuid(),
    auditorName: z.string().min(1),
    auditDate: z.string().datetime(),
    score: z.number().min(0).max(100),
    outcome: z.nativeEnum(AuditOutcome),
    findings: z.string().min(1),
  }),
});

export const CreateIssueSchema = z.object({
  body: z.object({
    auditId: z.string().uuid().optional().nullable(),
    title: z.string().min(1),
    description: z.string().min(1),
    severity: z.nativeEnum(ComplianceSeverity),
    departmentId: z.string().uuid(),
    ownerId: z.string().uuid(),
    dueDate: z.string().datetime(),
  }),
});

export const UpdateIssueSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ComplianceStatus).optional(),
    ownerId: z.string().uuid().optional(),
  }),
});
