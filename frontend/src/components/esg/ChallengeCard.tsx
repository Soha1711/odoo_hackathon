import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Trophy, Calendar, Sparkles, UserCheck } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { Challenge, ChallengeParticipation } from '../../types/challenge';

interface ChallengeCardProps {
  challenge: Challenge;
  participation?: ChallengeParticipation;
  onJoinClick?: (id: string) => void;
  onUpdateClick?: (id: string) => void;
  isJoining?: boolean;
}

export function ChallengeCard({
  challenge,
  participation,
  onJoinClick,
  onUpdateClick,
  isJoining = false,
}: ChallengeCardProps) {
  const isJoined = !!participation;
  const isPendingReview = participation?.approvalStatus === 'PENDING' && participation?.progress >= 100;
  const isApproved = participation?.approvalStatus === 'APPROVED';

  return (
    <Card hoverable className="flex flex-col justify-between h-full">
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              {challenge.difficulty}
            </span>
            <Badge variant={isApproved ? 'success' : isPendingReview ? 'warning' : isJoined ? 'default' : 'outline'}>
              {isApproved ? 'Completed' : isPendingReview ? 'Pending Review' : isJoined ? 'In Progress' : 'Available'}
            </Badge>
          </div>

          <h4 className="text-base font-bold text-foreground line-clamp-2">{challenge.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5">{challenge.description}</p>

          {/* Rewards details */}
          <div className="mt-5 grid grid-cols-2 gap-2 p-3 bg-secondary/35 rounded-lg border border-border/40 text-center">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">XP</span>
              <span className="text-sm font-extrabold text-foreground flex items-center justify-center mt-0.5">
                <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                {challenge.xp} XP
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground block uppercase">Difficulty</span>
              <span className="text-sm font-extrabold text-foreground flex items-center justify-center mt-0.5">
                <Trophy className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                {challenge.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Footer options */}
        <div className="mt-6 pt-4 border-t border-border/50">
          {isJoined && participation && (
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span className="font-semibold">{participation.progress.toFixed(0)}%</span>
              </div>
              <ProgressBar value={participation.progress} color={isApproved ? 'success' : 'primary'} />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Ends: {new Date(challenge.deadline).toLocaleDateString()}</span>
            </div>

            {isApproved ? (
              <div className="flex items-center space-x-1 text-emerald-500 font-semibold">
                <UserCheck className="h-4 w-4" />
                <span>Rewards Awarded</span>
              </div>
            ) : isJoined ? (
              onUpdateClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 py-0 px-3 text-xs"
                  onClick={() => onUpdateClick(challenge.id)}
                >
                  Log Progress
                </Button>
              )
            ) : (
              onJoinClick && (
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 py-0 px-3 text-xs"
                  onClick={() => onJoinClick(challenge.id)}
                  isLoading={isJoining}
                >
                  Join Challenge
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ChallengeCard;
