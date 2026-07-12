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
import { Skeleton } from '../../components/ui/Skeleton';

export function Dashboard() {
  const { summary, isLoading: isLoadingSummary } = useDashboard();
  const { goals, isLoadingGoals } = useEnvironmental();
  const { activities, isLoadingActivities } = useSocial();
  const { issues, isLoadingIssues } = useGovernance();

  const isLoading = isLoadingSummary || isLoadingGoals || isLoadingActivities || isLoadingIssues;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-52 col-span-1" />
          <Skeleton className="h-52 col-span-1" />
          <Skeleton className="h-52 col-span-1" />
          <Skeleton className="h-52 col-span-1" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
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
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-display">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          High-level compliance, sustainability and ESG indicators.
        </p>
      </div>

      <div className="stagger-children">
        <ESGScoreCard
          environmentalScore={scorecard.environmentalScore}
          socialScore={scorecard.socialScore}
          governanceScore={scorecard.governanceScore}
          overallScore={scorecard.overallScore}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 stagger-children">
        <CarbonTrendWidget trends={summary?.trends || []} />
        <LeaderboardWidget departments={summary?.ranking || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <QuickActions />
        <EnvironmentalWidget goals={goals} />
        <SocialWidget activities={activities} />
        <GovernanceWidget issues={issues} />
      </div>

      <div className="stagger-children">
        <ActivityFeed activities={summary?.activities || []} />
      </div>
    </div>
  );
}

export default Dashboard;
