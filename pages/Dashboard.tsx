
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../utils.ts';
import { getMarketOverview, getAnomalyDetection } from '../services/geminiService.ts';
import type { Transaction, PortfolioAsset } from '../types.ts';
import AnalyticsIcon from '../components/icons/AnalyticsIcon.tsx';
import PortfolioIcon from '../components/icons/PortfolioIcon.tsx';
import RiskIcon from '../components/icons/RiskIcon.tsx';
import MarketIcon from '../components/icons/MarketIcon.tsx';
import TransactionArrowIcon from '../components/icons/TransactionArrowIcon.tsx';
import PortfolioValueChart from '../components/charts/PortfolioValueChart.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';
import RefreshIcon from '../components/icons/RefreshIcon.tsx';

const StatCard = ({ icon, title, value, change, changeColor }: { icon: React.ReactNode, title: string, value: string, change?: string, changeColor: string }) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</p>
            <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
                {icon}
            </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tighter truncate">{value}</h3>
        {change && <p className={`mt-1.5 text-xs font-semibold ${changeColor}`}>{change}</p>}
    </div>
);

const AnomalyCard = ({ anomaly, loading }) => {
    const levelColors = {
        critical: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
        warning: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
        info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
    };

    if (loading) {
         return (
             <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
                 <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
                 <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
             </div>
        );
    }
    
    if (!anomaly) return (
         <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">No anomalies detected.</p>
        </div>
    );

    return (
        <div className={`p-5 rounded-2xl border ${levelColors[anomaly.level]}`}>
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${anomaly.level === 'critical' ? 'bg-red-500' : anomaly.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                <div>
                    <h3 className="text-sm font-semibold capitalize">{anomaly.title} ({anomaly.level})</h3>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">{anomaly.details}</p>
                </div>
            </div>
        </div>
    );
}

interface DashboardProps {
    setActivePage: (page: string) => void;
    assets: PortfolioAsset[];
    transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage, assets, transactions }) => {
    const [marketOverview, setMarketOverview] = useState('');
    const [anomaly, setAnomaly] = useState<{ title: string; details: string; level: 'critical' | 'warning' | 'info' } | null>(null);
    const [loadingInsights, setLoadingInsights] = useState(false);

    const summaryData = useMemo(() => {
        const totalAssets = assets.reduce((acc, asset) => acc + asset.value, 0);
        const dayChangeValue = assets.reduce((acc, asset) => acc + (asset.value * (asset.change / 100)), 0);
        const dayChangePercent = totalAssets > 0 ? (dayChangeValue / totalAssets) * 100 : 0;
        
        const equityAssets = assets.filter(a => a.sector !== 'Cash');
        const sortedByChange = [...equityAssets].sort((a, b) => b.change - a.change);
        const bestPerformer = sortedByChange[0];
        const worstPerformer = sortedByChange[sortedByChange.length - 1];
        
        return { totalAssets, dayChangeValue, dayChangePercent, bestPerformer, worstPerformer };
    }, [assets]);
    
    const fetchInsights = useCallback(async () => {
        if (!assets.some(a => a.sector !== 'Cash')) {
             setMarketOverview("No equity assets in portfolio to analyze.");
             setAnomaly(null);
             return;
        }
        setLoadingInsights(true);
        setMarketOverview('');
        setAnomaly(null);
        try {
            const [overview, anomalyResult] = await Promise.all([
                getMarketOverview(assets.filter(a => a.sector !== 'Cash')),
                getAnomalyDetection()
            ]);
            setMarketOverview(overview);
            setAnomaly(anomalyResult);
        } catch (error) {
            console.error(error);
            setMarketOverview("Failed to load AI market overview. Please check the console for details.");
            setAnomaly({ title: "Error", details: "Could not fetch anomaly data.", level: "critical" });
        } finally {
            setLoadingInsights(false);
        }
    }, [assets]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Assets"
                    value={formatCurrency(summaryData.totalAssets)}
                    change={`${summaryData.dayChangeValue >= 0 ? '+' : ''}${formatCurrency(summaryData.dayChangeValue)} (${summaryData.dayChangePercent.toFixed(2)}%)`}
                    changeColor={summaryData.dayChangeValue >= 0 ? "text-green-500" : "text-red-500"}
                    icon={<PortfolioIcon className="w-6 h-6 text-slate-400" />}
                />
                <StatCard 
                    title="Best Performer"
                    value={summaryData.bestPerformer?.ticker || 'N/A'}
                    change={summaryData.bestPerformer ? `+${summaryData.bestPerformer.change.toFixed(2)}%` : ''}
                    changeColor="text-green-500"
                    icon={<AnalyticsIcon className="w-6 h-6 text-slate-400" />}
                />
                <StatCard 
                    title="Worst Performer"
                    value={summaryData.worstPerformer?.ticker || 'N/A'}
                    change={summaryData.worstPerformer ? `${summaryData.worstPerformer.change.toFixed(2)}%` : ''}
                    changeColor="text-red-500"
                    icon={<RiskIcon className="w-6 h-6 text-slate-400" />}
                />
                <StatCard 
                    title="Market Status"
                    value="NGX Open"
                    change="Closes in 4h 15m"
                    changeColor="text-slate-500 dark:text-slate-400"
                    icon={<MarketIcon className="w-6 h-6 text-slate-400" />}
                />
            </div>
            
             <div className="bg-primary/10 dark:bg-blue-900/20 p-4 rounded-xl border border-primary/20 dark:border-blue-500/30">
                 <div className="flex justify-between items-center">
                    <h3 className="flex items-center gap-2 text-md font-semibold text-primary dark:text-blue-300">
                        <LightbulbIcon className="w-6 h-6" />
                        AI Anomaly Detection
                    </h3>
                    <button onClick={fetchInsights} disabled={loadingInsights} className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-blue-300 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-900/80 disabled:opacity-50">
                        <RefreshIcon className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
                        {loadingInsights ? 'Refreshing...' : 'Refresh Insights'}
                    </button>
                 </div>
                <div className="mt-2">
                    <AnomalyCard anomaly={anomaly} loading={loadingInsights} />
                </div>
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PortfolioValueChart assets={assets} />
                </div>

                <div className="space-y-8">
                     <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">AI Market Overview</h3>
                        <div className="mt-4 min-h-[72px]">
                            {loadingInsights ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {marketOverview || 'Click "Refresh Insights" to get the latest AI-powered market overview.'}
                                </p>
                            )}
                        </div>
                         <button onClick={() => setActivePage('Market Intelligence')} className="mt-4 text-xs font-semibold text-primary dark:text-blue-400 hover:underline">
                            Get Deeper Insights
                        </button>
                    </div>
                     <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-5">Recent Activity</h3>
                        <ul className="space-y-4">
                            {transactions.slice(0, 4).map(tx => (
                                <li key={tx.id} className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'Buy' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                                        <TransactionArrowIcon type={tx.type} className={`w-4 h-4 ${tx.type === 'Buy' ? 'text-emerald-500' : 'text-red-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-xs text-slate-950 dark:text-white truncate">{tx.type} {tx.ticker}</p>
                                            <p className={`font-semibold text-xs ${tx.type === 'Buy' ? 'text-emerald-600' : 'text-red-600'}`}>{tx.type === 'Sell' ? '+' : '-'}{formatCurrency(tx.amount)}</p>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{tx.date}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
