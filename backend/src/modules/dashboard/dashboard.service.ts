import prisma from '../../config/prisma';

export class DashboardService {
  async getDashboardSummary(departmentId?: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // 1. Scorecard (ESG Scores)
    // Fetch all department scores for the current month
    const scores = await prisma.departmentScore.findMany({
      where: {
        year,
        month,
        ...(departmentId && { departmentId }),
      },
    });

    let environmentalScore = 0;
    let socialScore = 0;
    let governanceScore = 0;

    if (scores.length > 0) {
      const sumEnv = scores.reduce((acc, s) => acc + s.environmentalScore, 0);
      const sumSoc = scores.reduce((acc, s) => acc + s.socialScore, 0);
      const sumGov = scores.reduce((acc, s) => acc + s.governanceScore, 0);

      environmentalScore = Math.round(sumEnv / scores.length);
      socialScore = Math.round(sumSoc / scores.length);
      governanceScore = Math.round(sumGov / scores.length);
    } else {
      environmentalScore = 0;
      socialScore = 0;
      governanceScore = 0;
    }

    const overallScore = Math.round(
      environmentalScore * 0.4 + socialScore * 0.3 + governanceScore * 0.3
    );

    // 2. Emission Trends (6 Months)
    const trends: { month: string; emissions: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mY = d.getFullYear();
      const mM = d.getMonth() + 1;

      const sumRes = await prisma.carbonTransaction.aggregate({
        where: {
          transactionDate: {
            gte: new Date(mY, mM - 1, 1),
            lte: new Date(mY, mM, 0, 23, 59, 59),
          },
          ...(departmentId && { departmentId }),
        },
        _sum: { calculatedEmissions: true },
      });

      trends.push({
        month: d.toLocaleString('default', { month: 'short' }),
        emissions: sumRes._sum.calculatedEmissions ?? 0,
      });
    }

    // 3. Department Rankings
    const allDepts = await prisma.department.findMany({
      where: { status: 'ACTIVE' },
      include: {
        scores: {
          where: { year, month },
        },
      },
    });

    const ranking = allDepts.map((d) => {
      const scoreObj = d.scores[0];
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        score: scoreObj ? Math.round(scoreObj.totalScore) : 0,
      };
    }).sort((a, b) => b.score - a.score);

    // 4. Recent Activities Timeline
    const carbonTx = await prisma.carbonTransaction.findMany({
      take: 2,
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });

    const csrParticipations = await prisma.employeeParticipation.findMany({
      take: 2,
      include: { user: true, csrActivity: true },
      orderBy: { createdAt: 'desc' },
    });

    const complianceIssues = await prisma.complianceIssue.findMany({
      take: 2,
      include: { department: true },
      orderBy: { createdAt: 'desc' },
    });

    const activities: any[] = [];

    carbonTx.forEach((tx) => {
      activities.push({
        id: tx.id,
        type: 'CARBON_LOG',
        title: `Logged carbon emissions for ${tx.department.name}`,
        subtitle: `${tx.calculatedEmissions.toFixed(1)} kg CO2e from ${tx.sourceType.toLowerCase()}`,
        date: tx.transactionDate,
      });
    });

    csrParticipations.forEach((p) => {
      activities.push({
        id: p.id,
        type: 'CSR_PARTICIPATION',
        title: `${p.user.firstName} ${p.user.lastName} submitted CSR proof`,
        subtitle: `${p.csrActivity.title} (${p.approvalStatus})`,
        date: p.createdAt,
      });
    });

    complianceIssues.forEach((issue) => {
      activities.push({
        id: issue.id,
        type: 'COMPLIANCE',
        title: `Compliance Issue Filed: ${issue.title}`,
        subtitle: `Department: ${issue.department.name} | Severity: ${issue.severity}`,
        date: issue.createdAt,
      });
    });

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 5. Quick Actions count / references
    const activeChallengesCount = await prisma.challenge.count({ where: { status: 'ACTIVE' } });
    const pendingApprovalsCount = (await prisma.employeeParticipation.count({ where: { approvalStatus: 'PENDING' } })) +
                                  (await prisma.challengeParticipation.count({ where: { approvalStatus: 'PENDING' } }));

    return {
      scorecard: {
        environmentalScore,
        socialScore,
        governanceScore,
        overallScore,
      },
      trends,
      ranking,
      activities: activities.slice(0, 5),
      quickStats: {
        activeChallenges: activeChallengesCount,
        pendingApprovals: pendingApprovalsCount,
      },
    };
  }
}
