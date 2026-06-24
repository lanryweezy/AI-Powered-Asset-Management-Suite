
import React from 'react';
import { PortfolioAsset } from '../types.ts';

const getRiskColor = (value: number, metric: 'volatility' | 'liquidity' | 'correlation') => {
  let lowThreshold: number, highThreshold: number;

  switch(metric) {
    case 'volatility': // Higher is riskier
      lowThreshold = 0.20; highThreshold = 0.35;
      if (value > highThreshold) return 'bg-red-200/50 dark:bg-red-900/40 text-red-700 dark:text-red-300';
      if (value > lowThreshold) return 'bg-yellow-100/70 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
      return 'bg-green-100/70 dark:bg-green-900/40 text-green-700 dark:text-green-300';
    case 'liquidity': // Lower is riskier
      lowThreshold = 0.75; highThreshold = 0.90;
      if (value < lowThreshold) return 'bg-red-200/50 dark:bg-red-900/40 text-red-700 dark:text-red-300';
      if (value < highThreshold) return 'bg-yellow-100/70 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
      return 'bg-green-100/70 dark:bg-green-900/40 text-green-700 dark:text-green-300';
    case 'correlation': // Higher is riskier (less diversification)
      lowThreshold = 0.65; highThreshold = 0.80;
      if (value > highThreshold) return 'bg-red-200/50 dark:bg-red-900/40 text-red-700 dark:text-red-300';
      if (value > lowThreshold) return 'bg-yellow-100/70 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
      return 'bg-green-100/70 dark:bg-green-900/40 text-green-700 dark:text-green-300';
    default:
      return 'bg-slate-100 dark:bg-slate-800';
  }
};


interface RiskHeatmapProps {
  assets: PortfolioAsset[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ assets }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-l-lg">Asset</th>
            <th scope="col" className="px-6 py-3 text-center">Volatility</th>
            <th scope="col" className="px-6 py-3 text-center">Liquidity Score</th>
            <th scope="col" className="px-6 py-3 text-center rounded-r-lg">Market Correlation</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{asset.ticker}</td>
              <td className={`px-6 py-4 text-center font-semibold ${getRiskColor(asset.volatility, 'volatility')}`}>
                {(asset.volatility * 100).toFixed(1)}%
              </td>
              <td className={`px-6 py-4 text-center font-semibold ${getRiskColor(asset.liquidityScore, 'liquidity')}`}>
                {asset.liquidityScore.toFixed(2)}
              </td>
              <td className={`px-6 py-4 text-center font-semibold ${getRiskColor(asset.marketCorrelation, 'correlation')}`}>
                {asset.marketCorrelation.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskHeatmap;
