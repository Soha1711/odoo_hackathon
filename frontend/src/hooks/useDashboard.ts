import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export function useDashboard(departmentId?: string) {
  const {
    data: summaryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard_summary', departmentId],
    queryFn: async () => {
      const response = await dashboardApi.getSummary(departmentId);
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    summary: summaryData,
    isLoading,
    error,
    refetchSummary: refetch,
  };
}
