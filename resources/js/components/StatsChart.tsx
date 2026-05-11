import {
  BarChart, Bar, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';

type Props = {
  data: Record<string, unknown>[];
  dataKey: string;
  barName: string;
  barColor?: string;
  height?: number;
  barSize?: number;
  xKey?: string;
  yAxisWidth?: number;
  cursorHighlight?: boolean;
};

export default function StatsChart({
  data,
  dataKey,
  barName,
  barColor = '#f97316',
  height = 192,
  barSize,
  xKey = 'day',
  yAxisWidth = 28,
  cursorHighlight = false,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={barSize}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={yAxisWidth}
        />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }}
          {...(cursorHighlight && { cursor: { fill: '#f97316', opacity: 0.08, radius: 4 } })}
        />
        <Bar dataKey={dataKey} fill={barColor} radius={[6, 6, 0, 0]} name={barName} />
      </BarChart>
    </ResponsiveContainer>
  );
}
