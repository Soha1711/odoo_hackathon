export interface Scorecard {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
}

export interface EmissionTrend {
  month: string;
  emissions: number;
}

export interface DepartmentRanking {
  id: string;
  name: string;
  code: string;
  score: number;
}

export interface RecentActivity {
  id: string;
  type: 'CARBON_LOG' | 'CSR_PARTICIPATION' | 'COMPLIANCE';
  title: string;
  subtitle: string;
  date: string;
}

export interface DashboardSummary {
  scorecard: Scorecard;
  trends: EmissionTrend[];
  ranking: DepartmentRanking[];
  activities: RecentActivity[];
  quickStats: {
    activeChallenges: number;
    pendingApprovals: number;
  };
}
