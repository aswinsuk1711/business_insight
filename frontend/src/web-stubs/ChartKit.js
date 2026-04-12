import React from 'react';

export const BarChart = ({ data, width, height, chartConfig }) => {
  const values = data?.datasets?.[0]?.data ?? [];
  const labels = data?.labels ?? [];
  const max = Math.max(...values, 1);
  const barWidth = (width - 60) / values.length - 8;
  const chartHeight = height - 50;
  const color = chartConfig?.color?.(1) ?? '#1A73E8';

  return (
    <svg width={width} height={height} style={{ background: '#fff', borderRadius: 8 }}>
      {values.map((val, i) => {
        const barH = (val / max) * chartHeight;
        const x = 40 + i * (barWidth + 8);
        const y = chartHeight - barH + 10;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} fill={color} rx={4} />
            <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#5F6368">{val}</text>
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize={10} fill="#5F6368">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default { BarChart };
