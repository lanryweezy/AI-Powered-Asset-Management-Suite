
import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PortfolioAsset } from '../../types.ts';
import AIInsight from '../shared/AIInsight.tsx';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg border border-slate-700 shadow-lg">
        <p className="label font-bold">{`${data.ticker}`}</p>
        <p>{`Risk Score: ${data.risk}`}</p>
        <p className={data.return >= 0 ? 'text-green-300' : 'text-red-300'}>{`24h Return: ${data.return.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

interface RiskReturnChartProps {
    assets: PortfolioAsset[];
}

const RiskReturnChart: React.FC<RiskReturnChartProps> = ({ assets }) => {
    const chartData = useMemo(() => assets.map(asset => ({
        ticker: asset.ticker,
        risk: asset.riskScore || 0,
        return: asset.change || 0
    })), [assets]);
    
    const chartTitle = "Risk vs. Return Analysis";

    return (
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{chartTitle}</h3>
            <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                        <XAxis 
                            type="number" 
                            dataKey="risk" 
                            name="Risk Score" 
                            stroke="currentColor" 
                            fontSize={12} 
                            label={{ value: 'Risk Score', position: 'insideBottom', offset: -10, fontSize: 14 }}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="return" 
                            name="24h Return" 
                            unit="%" 
                            stroke="currentColor" 
                            fontSize={12}
                            label={{ value: '24h Return (%)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 14 }}
                        />
                        <ZAxis dataKey="ticker" name="ticker" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />}/>
                        <Scatter name="Assets" data={chartData} fill="#3B82F6" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <AIInsight chartTitle={chartTitle} chartData={chartData} />
        </div>
    );
};

export default RiskReturnChart;