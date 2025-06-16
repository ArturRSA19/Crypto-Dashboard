// components/SparklineChart.tsx
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  positive: boolean;
}

export const SparklineChart: React.FC<SparklineProps> = ({ data, positive }) => (
  <ResponsiveContainer width={80} height={30}>
    <LineChart data={data.map((v, i) => ({ x: i, y: v }))}>
      <Line
        type="monotone"
        dataKey="y"
        stroke={positive ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);
