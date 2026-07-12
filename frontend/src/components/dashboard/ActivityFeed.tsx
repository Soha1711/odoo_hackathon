import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Activity, Leaf, Shield, FileText } from 'lucide-react';
import { RecentActivity } from '../../types/dashboard';

interface ActivityFeedProps {
  activities: RecentActivity[];
}

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Activity className="h-4.5 w-4.5 mr-2 text-primary" />
          Recent ESG Activity
        </CardTitle>
        <CardDescription>Live tracking logs from your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-border/60 ml-3.5 space-y-5">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 -ml-3.5">No recent actions logged.</p>
          ) : (
            activities.map((act) => {
              const isCarbon = act.type === 'CARBON_LOG';
              const isCsr = act.type === 'CSR_PARTICIPATION';

              return (
                <div key={act.id} className="relative pl-6">
                  {/* Bullet indicator */}
                  <span className={`absolute -left-[14px] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm ${
                    isCarbon ? 'text-emerald-500' : isCsr ? 'text-teal-500' : 'text-blue-500'
                  }`}>
                    {isCarbon ? <Leaf className="h-3.5 w-3.5" /> : isCsr ? <FileText className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                  </span>

                  <div>
                    <h6 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{act.title}</h6>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{act.subtitle}</p>
                    <span className="text-[10px] text-muted-foreground/80 font-medium block mt-1">
                      {new Date(act.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default ActivityFeed;
