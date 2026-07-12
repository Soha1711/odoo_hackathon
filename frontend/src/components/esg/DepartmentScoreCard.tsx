import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, User, Activity } from 'lucide-react';

interface DepartmentScoreCardProps {
  department: any;
  score?: number;
}

export function DepartmentScoreCard({ department, score = 0 }: DepartmentScoreCardProps) {
  return (
    <Card hoverable className="overflow-hidden">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-foreground">{department.name}</h4>
            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0">
              {department.code}
            </Badge>
          </div>
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Head: {department.head || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Employees: {department.employeeCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Score indicator circular/radial look */}
        <div className="flex flex-col items-center justify-center p-3 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-500/25">
          <Activity className="h-4 w-4 mb-0.5 text-emerald-500" />
          <span className="text-xl font-black">{score.toFixed(0)}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">ESG Index</span>
        </div>
      </CardContent>
    </Card>
  );
}
export default DepartmentScoreCard;
