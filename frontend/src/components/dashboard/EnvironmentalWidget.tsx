import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Leaf, Compass } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

interface EnvironmentalWidgetProps {
  goals: any[];
}

export function EnvironmentalWidget({ goals = [] }: EnvironmentalWidgetProps) {
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE').slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Leaf className="h-4.5 w-4.5 mr-2 text-emerald-500" />
          Environmental Goals
        </CardTitle>
        <CardDescription>Progress on resource efficiency targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-center">
              <Compass className="h-8 w-8 mb-2 text-muted-foreground/50" />
              <p className="text-xs">No active environmental goals found.</p>
            </div>
          ) : (
            activeGoals.map((goal) => {
              const percentage = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
              return (
                <div key={goal.id} className="space-y-1.5 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="line-clamp-2">{goal.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <ProgressBar value={percentage} color="success" />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default EnvironmentalWidget;
