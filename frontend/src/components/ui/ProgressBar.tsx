import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  className,
  value,
  max = 100,
  showLabel = false,
  color = 'primary',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex justify-between items-center mb-1 text-xs font-medium">
        {showLabel && (
          <>
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{percentage.toFixed(0)}%</span>
          </>
        )}
      </div>
      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            {
              'bg-primary': color === 'primary',
              'bg-emerald-500': color === 'success',
              'bg-amber-500': color === 'warning',
              'bg-red-500': color === 'danger',
            }
          )}
        />
      </div>
    </div>
  );
}
