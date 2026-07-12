import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import AreaChart from '../charts/AreaChart';
import { EmissionTrend } from '../../types/dashboard';

interface CarbonTrendWidgetProps {
  trends: EmissionTrend[];
}

export function CarbonTrendWidget({ trends = [] }: CarbonTrendWidgetProps) {
  return (
    <Card className="col-span-1 lg:col-span-3 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Carbon Emissions Trend</CardTitle>
        <CardDescription>Monthly CO₂e output comparison (kg CO₂e)</CardDescription>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No emission trends data recorded yet.</p>
        ) : (
          <AreaChart data={trends} xKey="month" yKey="emissions" fillColor="#10b981" strokeColor="#059669" height={280} />
        )}
      </CardContent>
    </Card>
  );
}
export default CarbonTrendWidget;
