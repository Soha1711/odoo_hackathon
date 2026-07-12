import { EnvironmentalRepository } from './environmental.repository';
import { HttpError } from '../../middleware/error.middleware';
import { TransactionSourceType, ChallengeStatus } from '@prisma/client';
import prisma from '../../config/prisma';

export class EnvironmentalService {
  private repository = new EnvironmentalRepository();

  // Emission Factors
  async getFactors() {
    return this.repository.getEmissionFactors();
  }

  async addFactor(data: { name: string; factor: number; unit: string; source: string }) {
    return this.repository.createEmissionFactor(data);
  }

  // Product ESG Profiles
  async getProfiles() {
    return this.repository.getProductProfiles();
  }

  async addProfile(data: { productId: string; productName: string; carbonFootprint: number; recycledContentPercentage?: number; waterFootprint?: number; status?: string }) {
    return this.repository.createProductProfile(data);
  }

  // Carbon Transactions
  async getTransactions(filters: { departmentId?: string; sourceType?: TransactionSourceType }) {
    return this.repository.getCarbonTransactions(filters);
  }

  async logTransaction(data: { sourceType: TransactionSourceType; sourceId: string; quantity: number; unit: string; emissionFactorId: string; departmentId: string; transactionDate: string }) {
    const factor = await this.repository.getEmissionFactorById(data.emissionFactorId);
    if (!factor) {
      throw new HttpError(404, 'Emission factor reference not found');
    }

    const calculatedEmissions = data.quantity * factor.factor;
    const txDate = new Date(data.transactionDate);

    const transaction = await this.repository.createCarbonTransaction({
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      quantity: data.quantity,
      unit: data.unit,
      emissionFactorId: data.emissionFactorId,
      calculatedEmissions,
      departmentId: data.departmentId,
      transactionDate: txDate,
    });

    // Automatically recalculate ESG scores for this department, year, month
    const year = txDate.getFullYear();
    const month = txDate.getMonth() + 1; // 1-indexed
    await this.recalculateScores(data.departmentId, year, month);

    return transaction;
  }

  // Environmental Goals
  async getGoals(departmentId?: string) {
    return this.repository.getGoals(departmentId);
  }

  async addGoal(data: { title: string; departmentId: string; targetValue: number; currentValue?: number; unit: string; deadline: string; status?: ChallengeStatus }) {
    return this.repository.createGoal({
      ...data,
      deadline: new Date(data.deadline),
    });
  }

  async updateGoal(id: string, currentValue: number) {
    const goal = await prisma.environmentalGoal.findUnique({ where: { id } });
    if (!goal) {
      throw new HttpError(404, 'Environmental goal not found');
    }
    const updated = await this.repository.updateGoalProgress(id, currentValue);
    const now = new Date();
    await this.recalculateScores(goal.departmentId, now.getFullYear(), now.getMonth() + 1);
    return updated;
  }

  // Score Recalculation Engine
  async recalculateScores(departmentId: string, year: number, month: number) {
    // 1. Fetch SystemConfig
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' },
    }) || {
      environmentalWeight: 0.4,
      socialWeight: 0.3,
      governanceWeight: 0.3,
    };

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // --- ENVIRONMENTAL SCORE ---
    // Calculate total emissions in the period
    const totalEmissions = await this.repository.getEmissionsSumByDepartment(departmentId, startDate, endDate);
    // Fetch goals
    const goals = await prisma.environmentalGoal.findMany({
      where: { departmentId },
    });
    let goalScore = 100;
    if (goals.length > 0) {
      const sumProgress = goals.reduce((acc, goal) => {
        const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) : 1;
        return acc + Math.min(1, progress);
      }, 0);
      goalScore = (sumProgress / goals.length) * 100;
    }
    // Environmental Score = Goal progress (60%) + emissions penalty (40%)
    const emissionsPenalty = Math.max(0, 100 - (totalEmissions / 100)); // penalty drops score for high emissions
    const environmentalScore = Math.min(100, Math.max(0, goalScore * 0.6 + emissionsPenalty * 0.4));

    // --- SOCIAL SCORE ---
    // Fetch user counts in department
    const usersCount = await prisma.user.count({ where: { departmentId } });
    // Fetch approved employee CSR participation counts in department
    const approvedParticipations = await prisma.employeeParticipation.count({
      where: {
        user: { departmentId },
        approvalStatus: 'APPROVED',
        completionDate: { gte: startDate, lte: endDate },
      },
    });
    // Social Score = approved participations per employee ratio
    const socialRatio = usersCount > 0 ? (approvedParticipations / usersCount) : 0;
    const socialScore = Math.min(100, Math.max(40, 60 + socialRatio * 40)); // starts at base 60, goes up to 100

    // --- GOVERNANCE SCORE ---
    // A. Policy Acknowledgment
    const activePoliciesCount = await prisma.esgPolicy.count({ where: { status: 'ACTIVE' } });
    const acknowledgmentsCount = await prisma.policyAcknowledgment.count({
      where: {
        user: { departmentId },
      },
    });
    const expectedAcks = activePoliciesCount * usersCount;
    const ackScore = expectedAcks > 0 ? (acknowledgmentsCount / expectedAcks) * 100 : 100;

    // B. Audit Scores
    const audits = await prisma.audit.findMany({
      where: {
        departmentId,
        auditDate: { gte: startDate, lte: endDate },
      },
    });
    const avgAuditScore = audits.length > 0
      ? audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length
      : 85; // default default audit score is 85

    // C. Compliance Issues penalty
    const openComplianceIssues = await prisma.complianceIssue.count({
      where: {
        departmentId,
        status: 'OPEN',
      },
    });
    const compliancePenalty = openComplianceIssues * 10; // deduct 10 points per open issue

    const governanceScore = Math.min(100, Math.max(0, avgAuditScore * 0.5 + ackScore * 0.5 - compliancePenalty));

    // --- TOTAL SCORE ---
    const totalScore =
      environmentalScore * config.environmentalWeight +
      socialScore * config.socialWeight +
      governanceScore * config.governanceWeight;

    // Save
    return this.repository.saveDepartmentScore({
      departmentId,
      year,
      month,
      environmentalScore,
      socialScore,
      governanceScore,
      totalScore,
    });
  }
}
