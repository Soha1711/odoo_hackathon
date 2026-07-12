import { MetricCard, MetricCardProps } from './MetricCard';
import { cn } from '../../lib/utils';

interface KPIWidgetProps {
  metrics: MetricCardProps[];
  gridCols?: 2 | 3 | 4;
  className?: string;
}

export function KPIWidget({ metrics, gridCols = 4, className }: KPIWidgetProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        {
          'grid-cols-1 sm:grid-cols-2': gridCols === 2,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': gridCols === 3,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': gridCols === 4,
        },
        className
      )}
    >
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
}
export default KPIWidget;
