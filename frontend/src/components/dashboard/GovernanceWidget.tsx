import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ShieldAlert, CheckCircle, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface GovernanceWidgetProps {
  issues: any[];
}

export function GovernanceWidget({ issues = [] }: GovernanceWidgetProps) {
  const openIssues = issues.filter((i) => i.status === 'OPEN').slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
          <Shield className="h-4.5 w-4.5 mr-2 text-blue-500" />
          Compliance Issues
        </CardTitle>
        <CardDescription>Open risk audits & policy exceptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {openIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-center">
              <CheckCircle className="h-8 w-8 mb-2 text-emerald-500" />
              <p className="text-xs">All governance checks passed.</p>
            </div>
          ) : (
            openIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <h6 className="text-sm font-semibold text-foreground line-clamp-2">{issue.title}</h6>
                  <span className="text-[10px] text-muted-foreground flex items-center space-x-1.5 mt-0.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                    <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>
                <Badge variant={issue.severity === 'HIGH' ? 'danger' : issue.severity === 'MEDIUM' ? 'warning' : 'outline'}>
                  {issue.severity}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default GovernanceWidget;
