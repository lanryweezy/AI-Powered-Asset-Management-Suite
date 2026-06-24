
import React, { useState, useCallback, useEffect } from 'react';
import { Client } from '../../types.ts';
import { getClientRiskProfileSummary } from '../../services/geminiService.ts';
import LightbulbIcon from '../icons/LightbulbIcon.tsx';
import SparklesIcon from '../icons/SparklesIcon.tsx';

const AIProfileSummary = ({ client }: { client: Client }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateSummary = useCallback(async () => {
        if (!client) return;
        setLoading(true);
        setError('');
        try {
            const result = await getClientRiskProfileSummary(client.riskProfile);
            setSummary(result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
        } catch (err) {
            console.error(err);
            setError('Could not load AI summary.');
        } finally {
            setLoading(false);
        }
    }, [client]);

    return (
         <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20 dark:bg-blue-900/20 dark:border-blue-500/30">
            <div className="flex justify-between items-center mb-2">
                 <h4 className="flex items-center gap-2 text-md font-semibold text-primary dark:text-blue-300">
                    <LightbulbIcon className="w-6 h-6" />
                    AI-Powered Suitability Analysis
                </h4>
                {!summary && !loading && !error && (
                    <button onClick={handleGenerateSummary} className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline flex items-center gap-1">
                        <SparklesIcon className="w-4 h-4" />
                        Generate
                    </button>
                )}
            </div>
            
            {loading && (
                <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-slate-400/30 rounded w-full"></div>
                    <div className="h-3 bg-slate-400/30 rounded w-5/6"></div>
                </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {summary && <p className="text-sm text-primary/80 dark:text-blue-200/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary }} />}
            {!loading && !summary && !error && (
                <p className="text-sm text-primary/70 dark:text-blue-200/70">Click "Generate" for an AI-powered analysis of this client's risk profile.</p>
            )}
        </div>
    );
};

export default AIProfileSummary;
