import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Calendar, Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SocialWidgetProps {
  activities: any[];
}

export function SocialWidget({ activities = [] }: SocialWidgetProps) {
  const activeActivities = activities.filter((a) => a.status === 'ACTIVE').slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Heart className="h-4.5 w-4.5 mr-2 text-red-500" />
          Active CSR Activities
        </CardTitle>
        <CardDescription>Social campaigns available for signup</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No active CSR activities scheduled.</p>
          ) : (
            activeActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <h6 className="text-sm font-semibold text-foreground truncate max-w-[180px]">{act.title}</h6>
                  <span className="text-[10px] text-muted-foreground flex items-center space-x-1.5 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    <span>Ends: {new Date(act.deadline).toLocaleDateString()}</span>
                  </span>
                </div>
                <Badge variant="secondary">
                  +{act.pointsXp || 100} XP
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default SocialWidget;
