
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils.ts';
import type { ModelPortfolio } from '../../types.ts';
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
        <p className="intro text-blue-300">{`Indexed Value: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const generateModelHistory = (days: number, riskLevel: ModelPortfolio['riskLevel']) => {
    const history = [];
    let currentValue = 100; // Start with an indexed value of 100
    
    let baseFluctuation = 0.015;
    if(riskLevel === 'High') baseFluctuation = 0.03;
    if(riskLevel === 'Low') baseFluctuation = 0.008;

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const fluctuation = (Math.random() - 0.45) * baseFluctuation;
        currentValue *= (1 + fluctuation);
        history.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: currentValue,
        });
    }
    return history;
};

interface ModelPerformanceChartProps {
    model: ModelPortfolio;
}

const ModelPerformanceChart: React.FC<ModelPerformanceChartProps> = ({ model }) => {
    const modelHistory = useMemo(() => generateModelHistory(90, model.riskLevel), [model]);
    const chartTitle = "Backtested Performance (90 Days, Indexed)";

    return (
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{chartTitle}</h3>
            <div className="mt-4 h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modelHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: '14px'}} />
                        <Line type="monotone" dataKey="value" name={`${model.name} Performance`} stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <AIInsight chartTitle={chartTitle} chartData={modelHistory} />
        </div>
    );
};

export default ModelPerformanceChart;
