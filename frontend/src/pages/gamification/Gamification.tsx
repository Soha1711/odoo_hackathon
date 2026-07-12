import { useState } from 'react';
import { useGamification } from '../../hooks/useGamification';
import { ChallengeCard } from '../../components/esg/ChallengeCard';
import { RewardCard } from '../../components/esg/RewardCard';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';
import { Trophy, Zap, Gift } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export function Gamification() {
  const { user, refetchMe } = useAuthContext();
  const {
    challenges,
    participations,
    rewards,
    joinChallenge,
    logProgress,
    redeemReward,
    isLoadingChallenges,
    isLoadingRewards,
    isJoiningChallenge,
    isRedeemingReward,
  } = useGamification();

  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [proofUrl, setProofUrl] = useState('');
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const handleJoin = async (challengeId: string) => {
    try {
      await joinChallenge(challengeId);
      toast.success('Joined challenge successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to join challenge.');
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallengeId) return;

    try {
      await logProgress({
        challengeId: activeChallengeId,
        progress: progressVal,
        proofUrl,
      });
      toast.success('Challenge progress updated successfully!');
      setIsProgressModalOpen(false);
      setActiveChallengeId(null);
      setProofUrl('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update progress.');
    }
  };

  const handleRedeem = async (rewardId: string) => {
    try {
      await redeemReward(rewardId);
      toast.success('Reward redeemed successfully! check your email.');
      refetchMe(); // update points balances
    } catch (err: any) {
      toast.error(err.message || 'Failed to redeem reward.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start">
            <Trophy className="h-8 w-8 mr-2.5 text-yellow-300 animate-pulse" />
            Sustainability Rewards
          </h1>
          <p className="text-emerald-100 text-sm max-w-md">
            Complete active challenges, accumulate XP to increase rank, and spend earned points on rewards!
          </p>
        </div>

        {user && (
          <div className="flex space-x-6">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-center">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">Points Balance</span>
              <span className="text-2xl font-black">{user.pointsBalance} pts</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-center">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">XP Balance</span>
              <span className="text-2xl font-black">{user.xpBalance} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Challenges */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Active Challenges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingChallenges ? (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-52" />
              <Skeleton className="h-52" />
              <Skeleton className="h-52" />
            </div>
          ) : challenges.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Zap className="h-10 w-10 mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium">No active challenges available right now.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">New sustainability challenges are posted regularly — check back soon!</p>
            </div>
          ) : (
            challenges.map((ch) => {
              const part = (participations || []).find((p: any) => p.challengeId === ch.id);
              return (
                <ChallengeCard
                  key={ch.id}
                  challenge={ch}
                  participation={part}
                  onJoinClick={handleJoin}
                  onUpdateClick={(id) => {
                    setActiveChallengeId(id);
                    setIsProgressModalOpen(true);
                  }}
                  isJoining={isJoiningChallenge}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Rewards shop */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
          <Gift className="h-5 w-5 mr-2 text-purple-500" />
          Rewards Center
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingRewards ? (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-44" />
              <Skeleton className="h-44" />
              <Skeleton className="h-44" />
            </div>
          ) : rewards.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Gift className="h-10 w-10 mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium">No rewards available for redemption.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Earn points by completing challenges to unlock rewards.</p>
            </div>
          ) : (
            rewards.map((rw) => (
              <RewardCard
                key={rw.id}
                reward={rw}
                pointsBalance={user?.pointsBalance || 0}
                onRedeemClick={handleRedeem}
                isRedeeming={isRedeemingReward}
              />
            ))
          )}
        </div>
      </div>

      {/* Update progress verification modal */}
      <Modal isOpen={isProgressModalOpen} onClose={() => setIsProgressModalOpen(false)} title="Log Challenge Progress">
        <form onSubmit={handleProgressSubmit} className="space-y-4 pt-2">
          <Input
            label="Progress Percentage (0-100)"
            type="number"
            min="0"
            max="100"
            value={progressVal}
            onChange={(e) => setProgressVal(Math.min(100, Math.max(0, Number(e.target.value))))}
            required
          />

          <FileUpload onChange={(url) => setProofUrl(url)} value={proofUrl} label="Completion Evidence / Photo Proof" />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsProgressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log Progress
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Gamification;
