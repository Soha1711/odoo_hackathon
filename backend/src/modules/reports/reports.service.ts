import prisma from '../../config/prisma';

export class ReportsService {
  async compileReport(filters: { departmentId?: string; startDate?: string; endDate?: string; module?: string }) {
    const { departmentId, startDate, endDate, module } = filters;

    const dateFilter = startDate && endDate ? {
      gte: new Date(startDate),
      lte: new Date(endDate),
    } : undefined;

    const reportData: any = {
      meta: {
        compiledAt: new Date(),
        filters,
      },
    };

    if (!module || module === 'summary' || module === 'environmental') {
      // Fetch Carbon Transactions
      const carbonTransactions = await prisma.carbonTransaction.findMany({
        where: {
          ...(departmentId && { departmentId }),
          ...(dateFilter && { transactionDate: dateFilter }),
        },
        include: { department: true, emissionFactor: true },
        orderBy: { transactionDate: 'desc' },
      });

      // Fetch Goals
      const goals = await prisma.environmentalGoal.findMany({
        where: {
          ...(departmentId && { departmentId }),
        },
        include: { department: true },
      });

      const totalEmissions = carbonTransactions.reduce((sum, tx) => sum + tx.calculatedEmissions, 0);

      reportData.environmental = {
        totalEmissions,
        transactionsCount: carbonTransactions.length,
        transactions: carbonTransactions.map(tx => ({
          id: tx.id,
          sourceType: tx.sourceType,
          sourceId: tx.sourceId,
          quantity: tx.quantity,
          unit: tx.unit,
          factorName: tx.emissionFactor.name,
          calculatedEmissions: tx.calculatedEmissions,
          department: tx.department.name,
          date: tx.transactionDate,
        })),
        goals: goals.map(g => ({
          title: g.title,
          department: g.department.name,
          targetValue: g.targetValue,
          currentValue: g.currentValue,
          unit: g.unit,
          progress: g.targetValue > 0 ? (g.currentValue / g.targetValue) * 100 : 0,
          deadline: g.deadline,
          status: g.status,
        })),
      };
    }

    if (!module || module === 'summary' || module === 'social') {
      // Fetch CSR participations
      const participations = await prisma.employeeParticipation.findMany({
        where: {
          ...(departmentId && { user: { departmentId } }),
          ...(dateFilter && { createdAt: dateFilter }),
        },
        include: { user: { include: { department: true } }, csrActivity: true },
        orderBy: { createdAt: 'desc' },
      });

      const approvedCount = participations.filter(p => p.approvalStatus === 'APPROVED').length;

      reportData.social = {
        totalParticipations: participations.length,
        approvedParticipations: approvedCount,
        approvalRate: participations.length > 0 ? (approvedCount / participations.length) * 100 : 0,
        activities: participations.map(p => ({
          id: p.id,
          employee: `${p.user.firstName} ${p.user.lastName}`,
          department: p.user.department?.name ?? 'Unassigned',
          activityTitle: p.csrActivity.title,
          status: p.approvalStatus,
          pointsEarned: p.pointsEarned,
          date: p.createdAt,
        })),
      };
    }

    if (!module || module === 'summary' || module === 'governance') {
      // Fetch Audits
      const audits = await prisma.audit.findMany({
        where: {
          ...(departmentId && { departmentId }),
          ...(dateFilter && { auditDate: dateFilter }),
        },
        include: { department: true },
        orderBy: { auditDate: 'desc' },
      });

      // Fetch compliance issues
      const issues = await prisma.complianceIssue.findMany({
        where: {
          ...(departmentId && { departmentId }),
        },
        include: { department: true, owner: true },
        orderBy: { dueDate: 'asc' },
      });

      const avgAuditScore = audits.length > 0
        ? audits.reduce((sum, a) => sum + a.score, 0) / audits.length
        : 100;

      reportData.governance = {
        averageAuditScore: Math.round(avgAuditScore),
        totalAudits: audits.length,
        openComplianceIssues: issues.filter(i => i.status === 'OPEN').length,
        resolvedComplianceIssues: issues.filter(i => i.status === 'RESOLVED').length,
        audits: audits.map(a => ({
          id: a.id,
          department: a.department.name,
          auditor: a.auditorName,
          score: a.score,
          outcome: a.outcome,
          date: a.auditDate,
        })),
        issues: issues.map(i => ({
          id: i.id,
          title: i.title,
          department: i.department.name,
          severity: i.severity,
          owner: `${i.owner.firstName} ${i.owner.lastName}`,
          status: i.status,
          dueDate: i.dueDate,
        })),
      };
    }

    return reportData;
  }
}
