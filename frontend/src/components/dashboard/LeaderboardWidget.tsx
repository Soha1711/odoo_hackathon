import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface LeaderboardWidgetProps {
  departments: { id: string; name: string; score: number }[];
}

export function LeaderboardWidget({ departments = [] }: LeaderboardWidgetProps) {
  // Sort and take top 5
  const topDepts = [...departments]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Trophy className="h-4.5 w-4.5 mr-2 text-yellow-500" />
          Department Leaderboard
        </CardTitle>
        <CardDescription>Top corporate ESG index performers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topDepts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No department rankings available.</p>
          ) : (
            topDepts.map((dept, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <div key={dept.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6">
                      {isFirst ? (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      ) : isSecond ? (
                        <Medal className="h-5 w-5 text-slate-400" />
                      ) : isThird ? (
                        <Medal className="h-5 w-5 text-amber-600" />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                      {dept.name}
                    </span>
                  </div>
                  <Badge variant="success" className="font-bold">
                    {dept.score.toFixed(0)} pts
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default LeaderboardWidget;
