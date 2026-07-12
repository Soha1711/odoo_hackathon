import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Leaf, Award, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../constants/routes';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-emerald-500/5 hover:border-emerald-500/30 text-emerald-600 border border-border/60"
          onClick={() => navigate(AppRoutes.ENVIRONMENTAL)}
        >
          <Leaf className="h-4.5 w-4.5" />
          <span className="text-xs font-semibold">Log Carbon</span>
        </Button>

        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-blue-500/5 hover:border-blue-500/30 text-blue-600 border border-border/60"
          onClick={() => navigate(AppRoutes.GOVERNANCE)}
        >
          <Shield className="h-4.5 w-4.5" />
          <span className="text-xs font-semibold">Sign Policies</span>
        </Button>

        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-purple-500/5 hover:border-purple-500/30 text-purple-600 border border-border/60"
          onClick={() => navigate(AppRoutes.SOCIAL)}
        >
          <FileText className="h-4.5 w-4.5" />
          <span className="text-xs font-semibold">Join CSR</span>
        </Button>

        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-yellow-500/5 hover:border-yellow-500/30 text-yellow-600 border border-border/60"
          onClick={() => navigate(AppRoutes.GAMIFICATION)}
        >
          <Award className="h-4.5 w-4.5" />
          <span className="text-xs font-semibold">View Challenges</span>
        </Button>
      </CardContent>
    </Card>
  );
}
export default QuickActions;
