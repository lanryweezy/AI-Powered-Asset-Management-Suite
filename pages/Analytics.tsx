
import React from 'react';
import type { PortfolioAsset } from '../types.ts';
import AssetAllocationChart from '../components/charts/AssetAllocationChart.tsx';
import PortfolioValueChart from '../components/charts/PortfolioValueChart.tsx';
import RiskReturnChart from '../components/charts/RiskReturnChart.tsx';
import SectorPerformanceChart from '../components/charts/SectorPerformanceChart.tsx';

interface AnalyticsProps {
    assets: PortfolioAsset[];
}

const Analytics: React.FC<AnalyticsProps> = ({ assets }) => {
  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">AI-Powered Analytics</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
                Deep dive into portfolio performance and market trends with predictive insights.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PortfolioValueChart assets={assets} />
            <AssetAllocationChart assets={assets} />
            <SectorPerformanceChart assets={assets} />
            <RiskReturnChart assets={assets} />
        </div>
    </div>
  );
};

export default Analytics;
