import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '../api/governance';

export function useGovernance(options?: { departmentId?: string; status?: string }) {
  const queryClient = useQueryClient();

  const policiesQuery = useQuery({
    queryKey: ['gov_policies'],
    queryFn: async () => {
      const res = await governanceApi.getPolicies();
      return res.data;
    },
  });

  const acksQuery = useQuery({
    queryKey: ['gov_acks'],
    queryFn: async () => {
      const res = await governanceApi.getAcks();
      return res.data;
    },
  });

  const auditsQuery = useQuery({
    queryKey: ['gov_audits', options?.departmentId],
    queryFn: async () => {
      const res = await governanceApi.getAudits(options?.departmentId);
      return res.data;
    },
  });

  const issuesQuery = useQuery({
    queryKey: ['gov_issues', options?.departmentId, options?.status],
    queryFn: async () => {
      const res = await governanceApi.getIssues(options);
      return res.data;
    },
  });

  const createPolicyMutation = useMutation({
    mutationFn: governanceApi.createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov_policies'] });
    },
  });

  const acknowledgePolicyMutation = useMutation({
    mutationFn: (policyId: string) => governanceApi.acknowledgePolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov_policies'] });
      queryClient.invalidateQueries({ queryKey: ['gov_acks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const createAuditMutation = useMutation({
    mutationFn: governanceApi.createAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov_audits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const createIssueMutation = useMutation({
    mutationFn: governanceApi.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov_issues'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: (payload: { id: string; status: 'OPEN' | 'RESOLVED' | 'UNDER_REVIEW'; resolutionNotes?: string }) =>
      governanceApi.updateIssue(payload.id, { status: payload.status, resolutionNotes: payload.resolutionNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov_issues'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  return {
    policies: policiesQuery.data || [],
    isLoadingPolicies: policiesQuery.isLoading,
    acks: acksQuery.data || [],
    isLoadingAcks: acksQuery.isLoading,
    audits: auditsQuery.data || [],
    isLoadingAudits: auditsQuery.isLoading,
    issues: issuesQuery.data || [],
    isLoadingIssues: issuesQuery.isLoading,

    createPolicy: createPolicyMutation.mutateAsync,
    isCreatingPolicy: createPolicyMutation.isPending,

    acknowledgePolicy: acknowledgePolicyMutation.mutateAsync,
    isAcknowledgingPolicy: acknowledgePolicyMutation.isPending,

    createAudit: createAuditMutation.mutateAsync,
    isCreatingAudit: createAuditMutation.isPending,

    createIssue: createIssueMutation.mutateAsync,
    isCreatingIssue: createIssueMutation.isPending,

    updateIssue: updateIssueMutation.mutateAsync,
    isUpdatingIssue: updateIssueMutation.isPending,
  };
}
