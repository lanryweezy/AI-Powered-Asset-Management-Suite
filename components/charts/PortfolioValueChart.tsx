
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils.ts';
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
        <p className="intro text-blue-300">{`Value: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const generatePortfolioHistory = (days: number, initialValue: number) => {
    const history = [];
    let currentValue = initialValue;
    const baseFluctuation = 0.02;

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        let fluctuation = (Math.random() - 0.45) * baseFluctuation;
        if (i < 5) fluctuation = (Math.random() - 0.3) * (baseFluctuation * 1.5);

        currentValue *= (1 + fluctuation);
        history.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: Math.round(currentValue),
        });
    }
    return history;
};

interface PortfolioValueChartProps {
    assets: PortfolioAsset[];
}

const PortfolioValueChart: React.FC<PortfolioValueChartProps> = ({ assets }) => {
    const totalAssets = useMemo(() => assets.reduce((acc, asset) => acc + asset.value, 0), [assets]);
    const portfolioHistory = useMemo(() => generatePortfolioHistory(30, totalAssets), [totalAssets]);
    const chartTitle = "Portfolio Performance (30 Days)";

    return (
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{chartTitle}</h3>
            <div className="mt-4 h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${formatCurrency(value / 1000000)}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: '14px'}} />
                        <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <AIInsight chartTitle={chartTitle} chartData={portfolioHistory} />
        </div>
    );
};

export default PortfolioValueChart;