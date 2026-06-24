
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PortfolioAsset } from '../../types.ts';
import AIInsight from '../shared/AIInsight.tsx';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg border border-slate-700 shadow-lg">
        <p className="label font-bold">{`${label}`}</p>
        <p className="intro text-green-300">{`Avg. 24h Change: ${payload[0].value.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

interface SectorPerformanceChartProps {
    assets: PortfolioAsset[];
}

const SectorPerformanceChart: React.FC<SectorPerformanceChartProps> = ({ assets }) => {
    const chartData = useMemo(() => {
        const sectors: { [key: string]: { totalChange: number, count: number } } = {};

        assets.forEach(asset => {
            if (!sectors[asset.sector]) {
                sectors[asset.sector] = { totalChange: 0, count: 0 };
            }
            sectors[asset.sector].totalChange += asset.change;
            sectors[asset.sector].count += 1;
        });

        return Object.keys(sectors).map(sector => ({
            sector,
            performance: sectors[sector].count > 0 ? sectors[sector].totalChange / sectors[sector].count : 0
        }));
    }, [assets]);
    
    const chartTitle = "Sector Performance (Avg. 24h Change)";

    return (
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{chartTitle}</h3>
            <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                        <XAxis type="number" stroke="currentColor" fontSize={12} tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="sector" stroke="currentColor" fontSize={12} width={100} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                        <Bar dataKey="performance" name="Avg. 24h Change" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <AIInsight chartTitle={chartTitle} chartData={chartData} />
        </div>
    );
};

export default SectorPerformanceChart;