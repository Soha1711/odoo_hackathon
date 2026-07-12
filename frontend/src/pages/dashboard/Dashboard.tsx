import { useDashboard } from '../../hooks/useDashboard';
import { useEnvironmental } from '../../hooks/useEnvironmental';
import { useSocial } from '../../hooks/useSocial';
import { useGovernance } from '../../hooks/useGovernance';
import { ESGScoreCard } from '../../components/esg/ESGScoreCard';
import { CarbonTrendWidget } from '../../components/dashboard/CarbonTrendWidget';
import { LeaderboardWidget } from '../../components/dashboard/LeaderboardWidget';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { EnvironmentalWidget } from '../../components/dashboard/EnvironmentalWidget';
import { SocialWidget } from '../../components/dashboard/SocialWidget';
import { GovernanceWidget } from '../../components/dashboard/GovernanceWidget';
import Loader from '../../components/ui/Loader';

export function Dashboard() {
  const { summary, isLoading: isLoadingSummary } = useDashboard();
  const { goals, isLoadingGoals } = useEnvironmental();
  const { activities, isLoadingActivities } = useSocial();
  const { issues, isLoadingIssues } = useGovernance();

  const isLoading = isLoadingSummary || isLoadingGoals || isLoadingActivities || isLoadingIssues;

  if (isLoading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const scorecard = summary?.scorecard || {
    environmentalScore: 0,
    socialScore: 0,
    governanceScore: 0,
    overallScore: 0,
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-display">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          High-level compliance, sustainability and ESG indicators.
        </p>
      </div>

      {/* ESG Score Card */}
      <ESGScoreCard
        environmentalScore={scorecard.environmentalScore}
        socialScore={scorecard.socialScore}
        governanceScore={scorecard.governanceScore}
        overallScore={scorecard.overallScore}
      />

      {/* Middle row: Trend Chart & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <CarbonTrendWidget trends={summary?.trends || []} />
        <LeaderboardWidget departments={summary?.ranking || []} />
      </div>

      {/* Bottom widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActions />
        <EnvironmentalWidget goals={goals} />
        <SocialWidget activities={activities} />
        <GovernanceWidget issues={issues} />
      </div>

      {/* Activity Timeline */}
      <ActivityFeed activities={summary?.activities || []} />
    </div>
  );
}

export default Dashboard;
