// components/CryptoChart.tsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CryptoChartProps {
  data: { name: string; value: number }[];
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ data }) => {
  // Paleta suave; você pode ajustar pelas suas variáveis CSS ou usar Tailwind colors
  const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={2}
            // desenha somente o label interno com %. Não mostra linhas externas
            labelLine={false}
            label={({ percent }) =>
              `${(percent! * 100).toFixed(1)}%`
            }
          >
            {data.map((entry, idx) => (
              <Cell
                key={entry.name}
                fill={COLORS[idx % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) =>
              [
                value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
                name,
              ]
            }
            wrapperStyle={{ outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
