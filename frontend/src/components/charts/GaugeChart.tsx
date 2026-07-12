
interface GaugeChartProps {
  value: number; // 0 to 100
  title?: string;
  size?: number;
}

export function GaugeChart({ value, title, size = 200 }: GaugeChartProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  
  // Angle calculations for SVG arc
  const radius = 80;
  const strokeWidth = 16;
  const center = size / 2;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color selection based on ESG score
  let gaugeColor = '#10b981'; // green/emerald
  if (value < 40) {
    gaugeColor = '#ef4444'; // red
  } else if (value < 70) {
    gaugeColor = '#f59e0b'; // amber
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="hsl(var(--muted)/0.3)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Text values in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">{value.toFixed(0)}</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase">{title || 'ESG Index'}</span>
        </div>
      </div>
    </div>
  );
}
export default GaugeChart;
