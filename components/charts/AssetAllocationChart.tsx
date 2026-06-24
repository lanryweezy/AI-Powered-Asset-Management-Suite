
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PortfolioAsset } from '../../types.ts';
import AIInsight from '../shared/AIInsight.tsx';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg border border-slate-700 shadow-lg">
        <p className="label font-bold">{`${data.name} (${(data.percent * 100).toFixed(2)}%)`}</p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (isNaN(cx) || isNaN(cy) || isNaN(innerRadius) || isNaN(outerRadius) || isNaN(midAngle)) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (isNaN(x) || isNaN(y)) return null;

  if (percent < 0.05) return null; // Don't render label for small slices

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-semibold text-xs">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


interface AssetAllocationChartProps {
    assets: PortfolioAsset[];
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ assets }) => {
    const chartData = useMemo(() => {
        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
        return assets.map(asset => ({
            name: asset.ticker,
            value: asset.value,
            percent: totalValue > 0 ? asset.value / totalValue : 0
        }));
    }, [assets]);
    
    const chartTitle = "Asset Allocation by Ticker";

    return (
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{chartTitle}</h3>
            <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius="90%"
                            innerRadius="50%"
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: '14px', paddingTop: '10px'}}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <AIInsight chartTitle={chartTitle} chartData={chartData} />
        </div>
    );
};

export default AssetAllocationChart;