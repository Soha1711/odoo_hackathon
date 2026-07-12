import prisma from '../../config/prisma';
import { ComplianceStatus } from '@prisma/client';

export class GovernanceRepository {
  // Policies
  async getPolicies() {
    return prisma.esgPolicy.findMany({
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async findPolicyById(id: string) {
    return prisma.esgPolicy.findUnique({
      where: { id },
    });
  }

  async createPolicy(data: { title: string; description: string; contentUrl: string; version?: string; effectiveDate: Date }) {
    return prisma.esgPolicy.create({
      data: {
        title: data.title,
        description: data.description,
        contentUrl: data.contentUrl,
        version: data.version ?? '1.0.0',
        effectiveDate: data.effectiveDate,
        status: 'ACTIVE',
      },
    });
  }

  // Acknowledgements
  async createAcknowledgment(policyId: string, userId: string) {
    return prisma.policyAcknowledgment.create({
      data: {
        policyId,
        userId,
      },
      include: {
        policy: true,
        user: true,
      },
    });
  }

  async hasUserAckedPolicy(policyId: string, userId: string) {
    const ack = await prisma.policyAcknowledgment.findFirst({
      where: { policyId, userId },
    });
    return !!ack;
  }

  async getAcknowledgements() {
    return prisma.policyAcknowledgment.findMany({
      include: {
        user: {
          include: { department: true },
        },
        policy: true,
      },
      orderBy: { acknowledgedAt: 'desc' },
    });
  }

  // Audits
  async getAudits(departmentId?: string) {
    return prisma.audit.findMany({
      where: {
        ...(departmentId && { departmentId }),
      },
      include: {
        department: true,
      },
      orderBy: { auditDate: 'desc' },
    });
  }

  async createAudit(data: { departmentId: string; auditorName: string; auditDate: Date; score: number; outcome: 'COMPLIANT' | 'ACTION_REQUIRED'; findings: string }) {
    return prisma.audit.create({
      data,
      include: {
        department: true,
      },
    });
  }

  // Compliance Issues
  async getIssues(filters: { departmentId?: string; status?: ComplianceStatus }) {
    return prisma.complianceIssue.findMany({
      where: {
        ...(filters.departmentId && { departmentId: filters.departmentId }),
        ...(filters.status && { status: filters.status }),
      },
      include: {
        department: true,
        owner: true,
        audit: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findIssueById(id: string) {
    return prisma.complianceIssue.findUnique({
      where: { id },
    });
  }

  async createIssue(data: { auditId?: string | null; title: string; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; departmentId: string; ownerId: string; dueDate: Date }) {
    return prisma.complianceIssue.create({
      data,
      include: {
        department: true,
        owner: true,
      },
    });
  }

  async updateIssue(id: string, data: { status?: ComplianceStatus; ownerId?: string }) {
    return prisma.complianceIssue.update({
      where: { id },
      data,
      include: {
        department: true,
        owner: true,
      },
    });
  }
}
