import React from 'react';
import { Card, CardContent } from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number; // percentage change, e.g. -5.2 or 12.4
  changeType?: 'positive_good' | 'negative_good' | 'neutral'; // determines color of change indicator
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeType = 'positive_good',
  icon,
  subtitle,
  className,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Determine indicator colors
  let changeColor = 'text-muted-foreground';
  if (change !== undefined) {
    if (changeType === 'positive_good') {
      changeColor = isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10';
    } else if (changeType === 'negative_good') {
      changeColor = isNegative ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10';
    } else {
      changeColor = 'text-amber-500 bg-amber-500/10';
    }
  }

  return (
    <Card hoverable className={cn('relative', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground line-clamp-1">{title}</p>
          {icon && <div className="text-muted-foreground p-2 bg-secondary/50 rounded-lg">{icon}</div>}
        </div>

        <div className="mt-2 flex items-baseline space-x-1">
          <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
        </div>

        {change !== undefined && (
          <div className="mt-4 flex items-center space-x-2">
            <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', changeColor)}>
              {isPositive && <ArrowUpRight className="h-3 w-3 mr-1" />}
              {isNegative && <ArrowDownRight className="h-3 w-3 mr-1" />}
              {change === 0 && <Minus className="h-3 w-3 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">{subtitle || 'vs last month'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default MetricCard;
