import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../api/gamification';

export function useGamification(options?: { status?: string }) {
  const queryClient = useQueryClient();

  const challengesQuery = useQuery({
    queryKey: ['game_challenges', options?.status],
    queryFn: async () => {
      const res = await gamificationApi.getChallenges(options?.status);
      return res.data;
    },
  });

  const badgesQuery = useQuery({
    queryKey: ['game_badges'],
    queryFn: async () => {
      const res = await gamificationApi.getBadges();
      return res.data;
    },
  });

  const myBadgesQuery = useQuery({
    queryKey: ['game_my_badges'],
    queryFn: async () => {
      const res = await gamificationApi.getMyBadges();
      return res.data;
    },
  });

  const rewardsQuery = useQuery({
    queryKey: ['game_rewards'],
    queryFn: async () => {
      const res = await gamificationApi.getRewards();
      return res.data;
    },
  });

  const leaderboardQuery = useQuery({
    queryKey: ['game_leaderboard'],
    queryFn: async () => {
      const res = await gamificationApi.getLeaderboard();
      return res.data;
    },
  });

  const participationsQuery = useQuery({
    queryKey: ['game_participations'],
    queryFn: async () => {
      const res = await gamificationApi.getParticipations();
      return res.data;
    },
  });

  const joinChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => gamificationApi.joinChallenge(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_challenges'] });
      queryClient.invalidateQueries({ queryKey: ['game_participations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: (payload: { challengeId: string; progress: number; proofUrl?: string }) =>
      gamificationApi.updateProgress(payload.challengeId, payload.progress, payload.proofUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_challenges'] });
      queryClient.invalidateQueries({ queryKey: ['game_participations'] });
    },
  });

  const approveParticipationMutation = useMutation({
    mutationFn: (payload: { participationId: string; approvalStatus: 'APPROVED' | 'REJECTED' }) =>
      gamificationApi.approveParticipation(payload.participationId, payload.approvalStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_challenges'] });
      queryClient.invalidateQueries({ queryKey: ['game_participations'] });
      queryClient.invalidateQueries({ queryKey: ['auth_me'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
  });

  const createRewardMutation = useMutation({
    mutationFn: gamificationApi.createReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_rewards'] });
    },
  });

  const redeemRewardMutation = useMutation({
    mutationFn: (rewardId: string) => gamificationApi.redeemReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_rewards'] });
      queryClient.invalidateQueries({ queryKey: ['auth_me'] });
    },
  });

  return {
    challenges: challengesQuery.data || [],
    isLoadingChallenges: challengesQuery.isLoading,
    badges: badgesQuery.data || [],
    isLoadingBadges: badgesQuery.isLoading,
    myBadges: myBadgesQuery.data || [],
    isLoadingMyBadges: myBadgesQuery.isLoading,
    rewards: rewardsQuery.data || [],
    isLoadingRewards: rewardsQuery.isLoading,
    participations: participationsQuery.data || [],
    isLoadingParticipations: participationsQuery.isLoading,
    leaderboard: leaderboardQuery.data || { departments: [], employees: [] },
    isLoadingLeaderboard: leaderboardQuery.isLoading,

    joinChallenge: joinChallengeMutation.mutateAsync,
    isJoiningChallenge: joinChallengeMutation.isPending,

    updateProgress: updateProgressMutation.mutateAsync,
    logProgress: updateProgressMutation.mutateAsync,
    isUpdatingProgress: updateProgressMutation.isPending,

    approveParticipation: approveParticipationMutation.mutateAsync,
    isApprovingParticipation: approveParticipationMutation.isPending,

    createReward: createRewardMutation.mutateAsync,
    isCreatingReward: createRewardMutation.isPending,

    redeemReward: redeemRewardMutation.mutateAsync,
    isRedeemingReward: redeemRewardMutation.isPending,
  };
}
