
import React, { useState, useEffect } from 'react';
import { getMarketNews, getGroundedInsight, getInvestmentIdeas } from '../services/geminiService.ts';
import type { GroundedInsight } from '../types.ts';
import GlobeIcon from '../components/icons/GlobeIcon.tsx';
import QuestionMarkCircleIcon from '../components/icons/QuestionMarkCircleIcon.tsx';
import LinkIcon from '../components/icons/LinkIcon.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';

const MarketIntelligence: React.FC = () => {
    const [marketNews, setMarketNews] = useState<GroundedInsight | null>(null);
    const [loadingNews, setLoadingNews] = useState(true);
    const [newsError, setNewsError] = useState<string | null>(null);

    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState<GroundedInsight | null>(null);
    const [loadingQuery, setLoadingQuery] = useState(false);
    const [queryError, setQueryError] = useState<string | null>(null);

    const [idea, setIdea] = useState<{ title: string; reasoning: string; tickers: string[]; } | null>(null);
    const [loadingIdea, setLoadingIdea] = useState(false);


    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoadingNews(true);
                setNewsError(null);
                const news = await getMarketNews();
                setMarketNews(news);
            } catch (error) {
                console.error(error);
                setNewsError('Failed to load market news. Please try again later.');
            } finally {
                setLoadingNews(false);
            }
        };
        fetchNews();
    }, []);

    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoadingQuery(true);
            setQueryError(null);
            setQueryResult(null);
            const result = await getGroundedInsight(query);
            setQueryResult(result);
        } catch (error) {
            console.error(error);
            setQueryError('Failed to get insight. Please check your connection or try a different query.');
        } finally {
            setLoadingQuery(false);
        }
    };
    
    const handleGenerateIdea = async () => {
        setLoadingIdea(true);
        setIdea(null);
        try {
            const result = await getInvestmentIdeas();
            setIdea(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingIdea(false);
        }
    };

    const renderSources = (sources: GroundedInsight['sources']) => (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Sources:</h4>
            <ul className="space-y-2">
                {sources.map((source, index) => source.web && (
                     <li key={index} className="flex items-start gap-2">
                        <LinkIcon className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                        <a 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary dark:text-blue-400 hover:underline truncate"
                            title={source.web.title}
                        >
                            {source.web.title}
                        </a>
                     </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Market Intelligence</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Real-time market news and AI-driven insights for key assets, powered by Google Search.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        <SparklesIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                        AI Investment Idea Generator
                    </h3>
                     <div className="min-h-[140px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col justify-center">
                        {loadingIdea && <p className="text-slate-500 dark:text-slate-400 text-center">Generating new investment theme...</p>}
                        {!loadingIdea && idea && (
                             <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{idea.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">{idea.reasoning}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tickers:</span>
                                    {idea.tickers.map(t => <span key={t} className="px-2 py-0.5 text-xs font-mono rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">{t}</span>)}
                                </div>
                            </div>
                        )}
                         {!loadingIdea && !idea && <p className="text-slate-500 dark:text-slate-400 text-center">Click the button to generate a new investment idea.</p>}
                     </div>
                     <button onClick={handleGenerateIdea} disabled={loadingIdea} className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loadingIdea ? 'Generating...' : 'Generate New Idea'}
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        <GlobeIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                        Latest Market Summary
                    </h3>
                    {loadingNews && (
                         <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        </div>
                    )}
                    {newsError && <p className="text-red-500">{newsError}</p>}
                    {marketNews && (
                        <div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{marketNews.text}</p>
                            {marketNews.sources.length > 0 && renderSources(marketNews.sources)}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    <QuestionMarkCircleIcon className="w-6 h-6 text-primary dark:text-blue-400" />
                    Ask the Market
                </h3>
                <form onSubmit={handleQuerySubmit} className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="e.g., What is the outlook for the Nigerian banking sector?"
                        className="w-full flex-grow bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={loadingQuery}
                    />
                    <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loadingQuery || !query.trim()}>
                         {loadingQuery && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loadingQuery ? 'Thinking...' : 'Get Insight'}
                    </button>
                </form>
                <div className="mt-6 min-h-[100px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
                    {loadingQuery && <p className="text-slate-500 dark:text-slate-400">Searching for the latest information...</p>}
                    {queryError && <p className="text-red-500 text-center">{queryError}</p>}
                    {queryResult && (
                         <div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{queryResult.text}</p>
                            {queryResult.sources.length > 0 && renderSources(queryResult.sources)}
                        </div>
                    )}
                    {!loadingQuery && !queryResult && !queryError && <p className="text-slate-500 dark:text-slate-400">Ask a question to get a real-time, AI-powered answer.</p>}
                </div>
            </div>

        </div>
    );
};

export default MarketIntelligence;
