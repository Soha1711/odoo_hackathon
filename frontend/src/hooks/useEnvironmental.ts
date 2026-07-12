import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentApi, CarbonTransactionInput } from '../api/environment';

export function useEnvironmental(options?: { departmentId?: string; sourceType?: string }) {
  const queryClient = useQueryClient();

  const factorsQuery = useQuery({
    queryKey: ['env_factors'],
    queryFn: async () => {
      const res = await environmentApi.getFactors();
      return res.data;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const profilesQuery = useQuery({
    queryKey: ['env_profiles'],
    queryFn: async () => {
      const res = await environmentApi.getProfiles();
      return res.data;
    },
    staleTime: 1000 * 60 * 15,
  });

  const transactionsQuery = useQuery({
    queryKey: ['env_transactions', options?.departmentId, options?.sourceType],
    queryFn: async () => {
      const res = await environmentApi.getTransactions(options);
      return res.data;
    },
  });

  const goalsQuery = useQuery({
    queryKey: ['env_goals', options?.departmentId],
    queryFn: async () => {
      const res = await environmentApi.getGoals(options?.departmentId);
      return res.data;
    },
  });

  const logTransactionMutation = useMutation({
    mutationFn: (data: CarbonTransactionInput) => environmentApi.logTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: environmentApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env_goals'] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: (payload: { id: string; currentValue: number }) =>
      environmentApi.updateGoal(payload.id, payload.currentValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env_goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  return {
    factors: factorsQuery.data || [],
    isLoadingFactors: factorsQuery.isLoading,
    profiles: profilesQuery.data || [],
    isLoadingProfiles: profilesQuery.isLoading,
    transactions: transactionsQuery.data || [],
    isLoadingTransactions: transactionsQuery.isLoading,
    goals: goalsQuery.data || [],
    isLoadingGoals: goalsQuery.isLoading,

    logTransaction: logTransactionMutation.mutateAsync,
    isLoggingTransaction: logTransactionMutation.isPending,

    createGoal: createGoalMutation.mutateAsync,
    isCreatingGoal: createGoalMutation.isPending,

    updateGoal: updateGoalMutation.mutateAsync,
    isUpdatingGoal: updateGoalMutation.isPending,
  };
}
