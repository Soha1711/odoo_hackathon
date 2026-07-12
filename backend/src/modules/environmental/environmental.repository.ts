import prisma from '../../config/prisma';
import { TransactionSourceType, ChallengeStatus } from '@prisma/client';

export class EnvironmentalRepository {
  // Emission Factors
  async getEmissionFactors() {
    return prisma.emissionFactor.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getEmissionFactorById(id: string) {
    return prisma.emissionFactor.findUnique({
      where: { id },
    });
  }

  async createEmissionFactor(data: { name: string; factor: number; unit: string; source: string }) {
    return prisma.emissionFactor.create({
      data,
    });
  }

  // Product ESG Profiles
  async getProductProfiles() {
    return prisma.productEsgProfile.findMany({
      orderBy: { productName: 'asc' },
    });
  }

  async createProductProfile(data: { productId: string; productName: string; carbonFootprint: number; recycledContentPercentage?: number; waterFootprint?: number; status?: string }) {
    return prisma.productEsgProfile.create({
      data: {
        productId: data.productId,
        productName: data.productName,
        carbonFootprint: data.carbonFootprint,
        recycledContentPercentage: data.recycledContentPercentage ?? 0.0,
        waterFootprint: data.waterFootprint ?? 0.0,
        status: data.status ?? 'ACTIVE',
      },
    });
  }

  // Carbon Transactions
  async getCarbonTransactions(filters: { departmentId?: string; sourceType?: TransactionSourceType }) {
    return prisma.carbonTransaction.findMany({
      where: {
        ...(filters.departmentId && { departmentId: filters.departmentId }),
        ...(filters.sourceType && { sourceType: filters.sourceType }),
      },
      include: {
        department: true,
        emissionFactor: true,
      },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async createCarbonTransaction(data: { sourceType: TransactionSourceType; sourceId: string; quantity: number; unit: string; emissionFactorId: string; calculatedEmissions: number; departmentId: string; transactionDate: Date }) {
    return prisma.carbonTransaction.create({
      data,
      include: {
        department: true,
        emissionFactor: true,
      },
    });
  }

  async getEmissionsSumByDepartment(departmentId: string, startDate: Date, endDate: Date) {
    const result = await prisma.carbonTransaction.aggregate({
      where: {
        departmentId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        calculatedEmissions: true,
      },
    });
    return result._sum.calculatedEmissions ?? 0;
  }

  // Environmental Goals
  async getGoals(departmentId?: string) {
    return prisma.environmentalGoal.findMany({
      where: {
        ...(departmentId && { departmentId }),
      },
      include: {
        department: true,
      },
      orderBy: { deadline: 'asc' },
    });
  }

  async createGoal(data: { title: string; departmentId: string; targetValue: number; currentValue?: number; unit: string; deadline: Date; status?: ChallengeStatus }) {
    return prisma.environmentalGoal.create({
      data: {
        title: data.title,
        departmentId: data.departmentId,
        targetValue: data.targetValue,
        currentValue: data.currentValue ?? 0.0,
        unit: data.unit,
        deadline: data.deadline,
        status: data.status ?? ChallengeStatus.ACTIVE,
      },
    });
  }

  async updateGoalProgress(id: string, currentValue: number) {
    return prisma.environmentalGoal.update({
      where: { id },
      data: { currentValue },
    });
  }

  // Department Scores
  async getDepartmentScore(departmentId: string, year: number, month: number) {
    return prisma.departmentScore.findUnique({
      where: {
        departmentId_year_month: {
          departmentId,
          year,
          month,
        },
      },
    });
  }

  async saveDepartmentScore(data: { departmentId: string; year: number; month: number; environmentalScore: number; socialScore: number; governanceScore: number; totalScore: number }) {
    return prisma.departmentScore.upsert({
      where: {
        departmentId_year_month: {
          departmentId: data.departmentId,
          year: data.year,
          month: data.month,
        },
      },
      update: {
        environmentalScore: data.environmentalScore,
        socialScore: data.socialScore,
        governanceScore: data.governanceScore,
        totalScore: data.totalScore,
      },
      create: data,
    });
  }
}
