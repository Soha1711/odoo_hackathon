import { cn } from '../../lib/utils';

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  color = 'primary',
  className,
}: ProgressRingProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = 'stroke-primary';
  if (color === 'success') strokeColor = 'stroke-emerald-500';
  if (color === 'warning') strokeColor = 'stroke-amber-500';
  if (color === 'danger') strokeColor = 'stroke-red-500';

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted/20"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Active Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn('transition-all duration-500 ease-out', strokeColor)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Inner Centered Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}
export default ProgressRing;
