import { LineChart as ReChartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  strokeColor?: string;
  height?: number;
}

export function LineChart({ data, xKey, yKey, strokeColor = '#10b981', height = 300 }: LineChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsLine data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <Line type="monotone" dataKey={yKey} stroke={strokeColor} strokeWidth={2} activeDot={{ r: 8 }} />
        </ReChartsLine>
      </ResponsiveContainer>
    </div>
  );
}
export default LineChart;
