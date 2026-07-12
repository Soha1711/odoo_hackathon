import { GovernanceRepository } from './governance.repository';
import { EnvironmentalService } from '../environmental/environmental.service';
import { HttpError } from '../../middleware/error.middleware';
import { ComplianceStatus } from '@prisma/client';
import prisma from '../../config/prisma';

export class GovernanceService {
  private repository = new GovernanceRepository();
  private environmentalService = new EnvironmentalService();

  // Policies
  async getPolicies() {
    return this.repository.getPolicies();
  }

  async addPolicy(data: { title: string; description: string; contentUrl: string; version?: string; effectiveDate: string }) {
    return this.repository.createPolicy({
      ...data,
      effectiveDate: new Date(data.effectiveDate),
    });
  }

  // Acknowledgements
  async getAcks() {
    return this.repository.getAcknowledgements();
  }

  async acknowledgePolicy(policyId: string, userId: string) {
    const policy = await this.repository.findPolicyById(policyId);
    if (!policy) {
      throw new HttpError(404, 'Policy not found');
    }

    const alreadyAcked = await this.repository.hasUserAckedPolicy(policyId, userId);
    if (alreadyAcked) {
      throw new HttpError(400, 'You have already acknowledged this policy');
    }

    const ack = await this.repository.createAcknowledgment(policyId, userId);

    // Recalculate Department Score for the user's department
    if (ack.user.departmentId) {
      const now = new Date();
      await this.environmentalService.recalculateScores(ack.user.departmentId, now.getFullYear(), now.getMonth() + 1);
    }

    return ack;
  }

  // Audits
  async getAudits(departmentId?: string) {
    return this.repository.getAudits(departmentId);
  }

  async recordAudit(data: { departmentId: string; auditorName: string; auditDate: string; score: number; outcome: string; findings: string }) {
    // Map frontend outcome aliases to Prisma AuditOutcome enum
    const outcomeMap: Record<string, 'COMPLIANT' | 'ACTION_REQUIRED'> = {
      PASSED: 'COMPLIANT',
      COMPLIANT: 'COMPLIANT',
      FAILED: 'ACTION_REQUIRED',
      UNDER_REVIEW: 'ACTION_REQUIRED',
      ACTION_REQUIRED: 'ACTION_REQUIRED',
    };
    const mappedOutcome = (outcomeMap[data.outcome] || 'COMPLIANT') as 'COMPLIANT' | 'ACTION_REQUIRED';

    const auditDate = new Date(data.auditDate);
    const audit = await this.repository.createAudit({
      ...data,
      outcome: mappedOutcome,
      auditDate,
    });

    // Recalculate Department Score
    const year = auditDate.getFullYear();
    const month = auditDate.getMonth() + 1;
    await this.environmentalService.recalculateScores(data.departmentId, year, month);

    return audit;
  }

  // Compliance Issues
  async getIssues(filters: { departmentId?: string; status?: ComplianceStatus }) {
    return this.repository.getIssues(filters);
  }

  async fileIssue(data: { auditId?: string | null; title: string; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; departmentId: string; ownerId: string; dueDate: string }) {
    const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
    if (!owner) {
      throw new HttpError(404, 'Assigned owner user not found');
    }

    const issue = await this.repository.createIssue({
      ...data,
      auditId: data.auditId ?? null,
      dueDate: new Date(data.dueDate),
    });

    // Trigger Notification
    await prisma.notification.create({
      data: {
        userId: data.ownerId,
        title: `New Compliance Issue: ${data.title}`,
        message: `You have been assigned as the owner of a new compliance issue in department ${issue.department.name}. Due date: ${issue.dueDate.toLocaleDateString()}`,
        type: 'COMPLIANCE_ISSUE',
      },
    });

    // Recalculate Department Score
    const now = new Date();
    await this.environmentalService.recalculateScores(data.departmentId, now.getFullYear(), now.getMonth() + 1);

    return issue;
  }

  async editIssue(id: string, data: { status?: ComplianceStatus; ownerId?: string }) {
    const issue = await this.repository.findIssueById(id);
    if (!issue) {
      throw new HttpError(404, 'Compliance issue not found');
    }

    const updated = await this.repository.updateIssue(id, data);

    // Recalculate Department Score
    const now = new Date();
    await this.environmentalService.recalculateScores(updated.departmentId, now.getFullYear(), now.getMonth() + 1);

    return updated;
  }
}
