import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import GaugeChart from '../charts/GaugeChart';
import ProgressRing from '../charts/ProgressRing';

interface ESGScoreCardProps {
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
}

export function ESGScoreCard({
  environmentalScore = 0,
  socialScore = 0,
  governanceScore = 0,
  overallScore = 0,
}: ESGScoreCardProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="pb-2">
        <CardTitle>ESG Scorecard</CardTitle>
        <CardDescription>Real-time corporate sustainability indices</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Overall Index */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0">
          <GaugeChart value={overallScore} title="Overall Index" size={180} />
        </div>

        {/* E, S, G Sub-Scores */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={environmentalScore} size={90} color="success" />
            <div>
              <p className="text-sm font-semibold">Environmental</p>
              <p className="text-xs text-muted-foreground">Carbon footprint & resources</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={socialScore} size={90} color="primary" />
            <div>
              <p className="text-sm font-semibold">Social</p>
              <p className="text-xs text-muted-foreground">CSR & community actions</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={governanceScore} size={90} color="warning" />
            <div>
              <p className="text-sm font-semibold">Governance</p>
              <p className="text-xs text-muted-foreground">Policies, audits & risk</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ESGScoreCard;
