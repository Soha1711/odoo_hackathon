import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Gift, Award } from 'lucide-react';

interface RewardCardProps {
  reward: any;
  pointsBalance: number;
  onRedeemClick?: (id: string) => void;
  isRedeeming?: boolean;
}

export function RewardCard({
  reward,
  pointsBalance,
  onRedeemClick,
  isRedeeming = false,
}: RewardCardProps) {
  const hasEnoughPoints = pointsBalance >= reward.pointsRequired;
  const isOutOfStock = reward.stock <= 0;

  return (
    <Card hoverable className="flex flex-col justify-between h-full">
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-teal-100 dark:bg-teal-950/20 text-teal-600 rounded-xl">
              <Gift className="h-5 w-5" />
            </div>
            <Badge variant={isOutOfStock ? 'danger' : 'default'}>
              {isOutOfStock ? 'Out of Stock' : `${reward.stock} Left`}
            </Badge>
          </div>

          <h4 className="text-base font-bold text-foreground line-clamp-2">{reward.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5">{reward.description || 'Redeem this item with your points.'}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">Cost</span>
            <span className="text-lg font-extrabold text-foreground flex items-center">
              <Award className="h-5 w-5 mr-1 text-yellow-500" />
              {reward.pointsRequired}
            </span>
          </div>

          {onRedeemClick && (
            <Button
              variant={hasEnoughPoints && !isOutOfStock ? 'primary' : 'outline'}
              size="sm"
              className="h-8 py-0 px-3 text-xs"
              disabled={!hasEnoughPoints || isOutOfStock}
              onClick={() => onRedeemClick(reward.id)}
              isLoading={isRedeeming}
            >
              {isOutOfStock ? 'Sold Out' : 'Redeem'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default RewardCard;
