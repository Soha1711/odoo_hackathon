import { BarChart as ReChartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface StackedBarData {
  name: string; // e.g. "Jan", "Feb"
  [key: string]: number | string; // e.g. "Scope 1": 120, "Scope 2": 90, "Scope 3": 50
}

interface StackedBarChartProps {
  data: StackedBarData[];
  keys: string[]; // e.g. ["Scope 1", "Scope 2", "Scope 3"]
  colors: string[]; // e.g. ["#10b981", "#3b82f6", "#f59e0b"]
  height?: number;
}

export function StackedBarChart({ data, keys, colors, height = 300 }: StackedBarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsBar data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted)/0.2)" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {keys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[idx] || '#10b981'}
              radius={idx === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
}
export default StackedBarChart;
