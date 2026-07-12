import { useMutation } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';
import { ReportFilter } from '../types/report';

export function useReports() {
  const compileReportMutation = useMutation({
    mutationFn: (filters: ReportFilter) => reportsApi.compileReport(filters),
  });

  return {
    reportData: compileReportMutation.data?.data || null,
    compileReport: compileReportMutation.mutateAsync,
    isCompiling: compileReportMutation.isPending,
    error: compileReportMutation.error,
  };
}
