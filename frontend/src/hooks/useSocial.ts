import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social';

export function useSocial(options?: { userId?: string; approvalStatus?: string }) {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: ['social_activities'],
    queryFn: async () => {
      const res = await socialApi.getActivities();
      return res.data;
    },
  });

  const participationsQuery = useQuery({
    queryKey: ['social_participations', options?.userId, options?.approvalStatus],
    queryFn: async () => {
      const res = await socialApi.getParticipations(options);
      return res.data;
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: socialApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_activities'] });
    },
  });

  const joinActivityMutation = useMutation({
    mutationFn: (payload: { activityId: string; proofUrl?: string }) =>
      socialApi.joinActivity(payload.activityId, payload.proofUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_participations'] });
    },
  });

  const reviewParticipationMutation = useMutation({
    mutationFn: (payload: { participationId: string; approvalStatus: 'APPROVED' | 'REJECTED'; pointsEarned?: number }) =>
      socialApi.reviewParticipation(payload.participationId, payload.approvalStatus, payload.pointsEarned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_participations'] });
      queryClient.invalidateQueries({ queryKey: ['auth_me'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  return {
    activities: activitiesQuery.data || [],
    isLoadingActivities: activitiesQuery.isLoading,
    participations: participationsQuery.data || [],
    isLoadingParticipations: participationsQuery.isLoading,

    createActivity: createActivityMutation.mutateAsync,
    isCreatingActivity: createActivityMutation.isPending,

    joinActivity: joinActivityMutation.mutateAsync,
    isJoiningActivity: joinActivityMutation.isPending,

    reviewParticipation: reviewParticipationMutation.mutateAsync,
    isReviewingParticipation: reviewParticipationMutation.isPending,
  };
}
