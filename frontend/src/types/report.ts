export interface ReportFilter {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  module?: string;
}

export interface EnvironmentalReport {
  totalEmissions: number;
  transactionsCount: number;
  transactions: any[];
  goals: any[];
}

export interface SocialReport {
  totalParticipations: number;
  approvedParticipations: number;
  approvalRate: number;
  activities: any[];
}

export interface GovernanceReport {
  averageAuditScore: number;
  totalAudits: number;
  openComplianceIssues: number;
  resolvedComplianceIssues: number;
  audits: any[];
  issues: any[];
}

export interface ReportData {
  meta: {
    compiledAt: string;
    filters: ReportFilter;
  };
  environmental?: EnvironmentalReport;
  social?: SocialReport;
  governance?: GovernanceReport;
}
