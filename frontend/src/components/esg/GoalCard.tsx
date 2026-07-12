import { Card, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, Target, Edit } from 'lucide-react';
import { EnvironmentalGoal } from '../../types/goal';

interface GoalCardProps {
  goal: EnvironmentalGoal;
  onUpdateClick?: (goal: EnvironmentalGoal) => void;
  canUpdate?: boolean;
}

export function GoalCard({ goal, onUpdateClick, canUpdate = false }: GoalCardProps) {
  const percentage = (goal.currentValue / goal.targetValue) * 100;
  const isCompleted = goal.status === 'ACHIEVED' || percentage >= 100;

  return (
    <Card hoverable className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-base font-semibold text-foreground truncate max-w-[200px]">{goal.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{goal.description || 'No description provided.'}</p>
          </div>
          <Badge variant={isCompleted ? 'success' : goal.status === 'MISSED' ? 'danger' : 'default'}>
            {goal.status}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Target details */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Target: {goal.targetValue} {goal.unit}</span>
            </div>
            <span className="text-foreground">Current: {goal.currentValue} {goal.unit}</span>
          </div>

          {/* Progress bar */}
          <ProgressBar value={percentage} color={isCompleted ? 'success' : 'primary'} />

          {/* Footer meta */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
            
            {canUpdate && onUpdateClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 hover:bg-muted text-primary hover:text-primary-foreground"
                onClick={() => onUpdateClick(goal)}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Update
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default GoalCard;
