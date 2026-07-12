import { AreaChart as ReChartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  fillColor?: string;
  strokeColor?: string;
  height?: number;
}

export function AreaChart({ data, xKey, yKey, fillColor = '#10b981', strokeColor = '#059669', height = 300 }: AreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsArea data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted)/0.2)" />
          <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              borderRadius: '8px',
            }}
          />
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={yKey} stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#colorArea)" />
        </ReChartsArea>
      </ResponsiveContainer>
    </div>
  );
}
export default AreaChart;
