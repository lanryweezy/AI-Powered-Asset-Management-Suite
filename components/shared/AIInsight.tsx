
import React, { useState } from 'react';
import { getAnalyticsInsight } from '../../services/geminiService.ts';
import InfoIcon from '../icons/InfoIcon.tsx';
import SparklesIcon from '../icons/SparklesIcon.tsx';

interface AIInsightProps {
  chartTitle: string;
  chartData: any;
}

const AIInsight: React.FC<AIInsightProps> = ({ chartTitle, chartData }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateInsight = async () => {
    try {
      setLoading(true);
      setError('');
      setInsight('');
      const result = await getAnalyticsInsight(chartTitle, chartData);
      setInsight(result);
    } catch (err) {
      console.error(`Error fetching insight for ${chartTitle}`, err);
      setError('Could not load AI analysis at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <InfoIcon className="w-5 h-5 text-primary/80" />
            AI Insight
        </h4>
        {!insight && !loading && !error && (
             <button onClick={handleGenerateInsight} className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline flex items-center gap-1">
                <SparklesIcon className="w-4 h-4" />
                Generate Insight
             </button>
        )}
      </div>
      
      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {insight && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {insight}
        </p>
      )}
    </div>
  );
};

export default AIInsight;
