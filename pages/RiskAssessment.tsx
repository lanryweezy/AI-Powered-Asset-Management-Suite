
import React, { useState, useMemo, useCallback } from 'react';
import { getRiskSummary, analyzeRiskScenario } from '../services/geminiService.ts';
import type { ScenarioAnalysisResult, PortfolioAsset } from '../types.ts';
import CircularProgress from '../components/shared/CircularProgress.tsx';
import RiskHeatmap from '../components/RiskHeatmap.tsx';
import RiskIcon from '../components/icons/RiskIcon.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';
import TrendingUpIcon from '../components/icons/TrendingUpIcon.tsx';
import TrendingDownIcon from '../components/icons/TrendingDownIcon.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';

const scenarios = [
    "Market Crash (-20%)",
    "Interest Rate Hike (+2%)",
    "Tech Sector Rally (+15%)",
    "Oil Price Shock (+25%)",
];

interface RiskAssessmentProps {
    assets: PortfolioAsset[];
    setAssets: React.Dispatch<React.SetStateAction<PortfolioAsset[]>>;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ assets, setAssets }) => {
    const [riskSummary, setRiskSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);

    const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
    const [analysisResult, setAnalysisResult] = useState<ScenarioAnalysisResult | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const overallRiskScore = useMemo(() => {
        const equityAssets = assets.filter(a => a.sector !== 'Cash');
        const totalValue = equityAssets.reduce((sum, asset) => sum + asset.value, 0);
        if (totalValue === 0) return 0;
        const weightedRisk = equityAssets.reduce((sum, asset) => sum + asset.riskScore * asset.value, 0);
        return (weightedRisk / totalValue) * 100;
    }, [assets]);
    
    const fetchSummary = useCallback(async () => {
         if (!assets.some(a => a.sector !== 'Cash')) {
             setRiskSummary("No equity assets in portfolio to analyze.");
             return;
        }
        try {
            setLoadingSummary(true);
            const summary = await getRiskSummary(assets.filter(a => a.sector !== 'Cash'));
            setRiskSummary(summary);
        } catch (error) {
            console.error(error);
            setRiskSummary("Failed to load AI risk summary.");
        } finally {
            setLoadingSummary(false);
        }
    }, [assets]);

    const handleRunAnalysis = async () => {
        setLoadingAnalysis(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeRiskScenario(assets, selectedScenario);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            setAnalysisError('Failed to run AI analysis. Please try again.');
        } finally {
            setLoadingAnalysis(false);
        }
    };


    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Risk Assessment</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Analyze portfolio risk exposure and run stress tests with AI-powered scenarios.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overall Portfolio Risk</h3>
                    <CircularProgress progress={overallRiskScore} label="Weighted Score" />
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                     <div className="flex justify-between items-center">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
                            <LightbulbIcon className="w-6 h-6 text-yellow-500" />
                            AI-Powered Risk Summary
                        </h3>
                        {!riskSummary && (
                            <button onClick={fetchSummary} disabled={loadingSummary} className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-blue-400 hover:underline disabled:opacity-50">
                                <SparklesIcon className={`w-5 h-5 ${loadingSummary ? 'animate-pulse' : ''}`} />
                                {loadingSummary ? 'Analyzing...' : 'Generate Summary'}
                            </button>
                        )}
                     </div>
                     <div className="mt-4 min-h-[60px]">
                        {loadingSummary ? (
                             <div className="space-y-3 animate-pulse">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>
                        ) : (
                             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {riskSummary || 'Click "Generate Summary" to get an AI-powered analysis of your portfolio\'s risk profile.'}
                            </p>
                        )}
                     </div>
                </div>
            </div>

             <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Asset Risk Heatmap</h3>
                 <RiskHeatmap assets={assets.filter(a => a.sector !== 'Cash')} />
             </div>
             
             <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Interactive Stress Testing</h3>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <select 
                        value={selectedScenario}
                        onChange={(e) => setSelectedScenario(e.target.value)}
                        className="w-full md:w-auto flex-grow bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        {scenarios.map(s => <option key={s}>{s}</option>)}
                    </select>
                     <button
                        onClick={handleRunAnalysis}
                        disabled={loadingAnalysis}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {loadingAnalysis ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <RiskIcon className="w-5 h-5" />
                        )}
                        {loadingAnalysis ? 'Analyzing...' : 'Run Scenario'}
                    </button>
                </div>
                
                 <div className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
                    {loadingAnalysis && (
                        <p className="text-slate-500 dark:text-slate-400">AI is analyzing the scenario impact...</p>
                    )}
                    {analysisError && <p className="text-red-500">{analysisError}</p>}
                    {analysisResult && (
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                           <div className="flex flex-col items-center justify-center flex-shrink-0">
                             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Impact</p>
                             <div className={`flex items-center gap-2 font-bold text-3xl ${analysisResult.estimatedImpact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {analysisResult.estimatedImpact >= 0 ? <TrendingUpIcon className="w-8 h-8"/> : <TrendingDownIcon className="w-8 h-8"/>}
                                {analysisResult.estimatedImpact.toFixed(2)}%
                             </div>
                           </div>
                           <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-6">
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysisResult.summary}</p>
                           </div>
                        </div>
                    )}
                    {!loadingAnalysis && !analysisResult && !analysisError && (
                        <p className="text-slate-500 dark:text-slate-400">Select a scenario and click "Run Scenario" to see the AI analysis.</p>
                    )}
                 </div>
             </div>
        </div>
    );
};

export default RiskAssessment;
