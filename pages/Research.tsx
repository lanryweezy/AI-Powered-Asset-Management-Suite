
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { mockStockUniverse } from '../data/mockData.ts';
import type { Stock, SWOTAnalysis, GroundedInsight } from '../types.ts';
import { getStockSWOT, compareStocks, getGroundedInsight } from '../services/geminiService.ts';
import { formatCurrency } from '../utils.ts';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SearchIcon from '../components/icons/SearchIcon.tsx';
import LinkIcon from '../components/icons/LinkIcon.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';


const StockPriceChart = ({ data, color }) => (
    <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <YAxis stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value)} domain={['dataMin', 'dataMax']}/>
                <XAxis dataKey="date" stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                    }} 
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    formatter={(value: number) => [formatCurrency(value), 'Price']}
                />
                <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


const SWOTCard = ({ title, points, color }) => (
    <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
        <h4 className={`font-bold text-sm text-${color}-600 dark:text-${color}-300`}>{title}</h4>
        <ul className="mt-1 list-disc list-inside space-y-1 text-sm text-${color}-800 dark:text-${color}-200/90">
            {points.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
    </div>
);

const Research: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([mockStockUniverse[3]]);
    const [viewMode, setViewMode] = useState<'detail' | 'compare'>('detail');
    
    // State for detail view
    const [swot, setSwot] = useState<SWOTAnalysis | null>(null);
    const [news, setNews] = useState<GroundedInsight | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // State for compare view
    const [comparisonSummary, setComparisonSummary] = useState<string>('');
    const [loadingCompare, setLoadingCompare] = useState(false);

    const filteredStocks = useMemo(() => {
        return mockStockUniverse.filter(stock => 
            stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    
    useEffect(() => {
        setSwot(null);
        setNews(null);
        setComparisonSummary('');

        if (selectedStocks.length > 1) {
            setViewMode('compare');
        } else if (selectedStocks.length === 1) {
            setViewMode('detail');
        }
    }, [selectedStocks]);

    const handleFetchDetail = useCallback(async () => {
        if (selectedStocks.length !== 1) return;
        const stock = selectedStocks[0];
        setLoadingDetail(true);
        setSwot(null);
        setNews(null);
        try {
            const [swotResult, newsResult] = await Promise.all([
                getStockSWOT(stock.ticker),
                getGroundedInsight(`Latest news and analysis for ${stock.name} (${stock.ticker})`)
            ]);
            setSwot(swotResult);
            setNews(newsResult);
        } catch (error) {
            console.error("Failed to fetch stock details:", error);
        } finally {
            setLoadingDetail(false);
        }
    }, [selectedStocks]);

    const handleFetchComparison = useCallback(async () => {
        if (selectedStocks.length <= 1) return;
        setLoadingCompare(true);
        setComparisonSummary('');
        try {
            const result = await compareStocks(selectedStocks);
            setComparisonSummary(result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
        } catch (error) {
            console.error("Failed to fetch comparison:", error);
        } finally {
            setLoadingCompare(false);
        }
    }, [selectedStocks]);
    
    const handleSelectStock = (stock: Stock) => {
        const isSelected = selectedStocks.some(s => s.id === stock.id);
        if (isSelected) {
            if (selectedStocks.length === 1) return;
            setSelectedStocks(selectedStocks.filter(s => s.id !== stock.id));
        } else {
            if (selectedStocks.length < 3) {
                 setSelectedStocks([...selectedStocks, stock]);
            } else {
                alert("You can compare up to 3 stocks at a time.");
            }
        }
    };
    
    const DetailView = () => {
        const stock = selectedStocks[0];
        if (!stock) return null;
        
        return (
            <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stock.name} ({stock.ticker})</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stock.sector}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(stock.price)}</p>
                            <p className={`text-sm font-semibold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">30-Day Price History</h4>
                    <StockPriceChart data={stock.priceHistory} color="#3B82F6" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Market Cap</p>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">{formatCurrency(stock.marketCap * 1_000_000_000).replace('.00', '')}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">P/E Ratio</p>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">{stock.peRatio.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Div. Yield</p>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">{stock.dividendYield.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                     <div className="flex justify-between items-center mb-3">
                         <h4 className="font-semibold text-slate-800 dark:text-white">AI-Powered Analysis</h4>
                         <button onClick={handleFetchDetail} disabled={loadingDetail} className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-blue-400 hover:underline disabled:opacity-50">
                             <SparklesIcon className={`w-5 h-5 ${loadingDetail ? 'animate-pulse' : ''}`} />
                             {loadingDetail ? 'Analyzing...' : 'Run Analysis'}
                         </button>
                     </div>

                     {loadingDetail && <p className="text-sm text-center text-slate-500 dark:text-slate-400 p-4">Generating analysis...</p>}
                     
                     {!loadingDetail && (!swot || !news) && (
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 p-4">Click "Run Analysis" to get the latest AI-powered insights for this stock.</p>
                     )}
                     
                     {swot && (
                         <div className="mb-4">
                             <h5 className="font-bold text-sm mb-2 text-slate-600 dark:text-slate-300">SWOT Analysis</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SWOTCard title="Strengths" points={swot.strengths} color="green" />
                                <SWOTCard title="Weaknesses" points={swot.weaknesses} color="red" />
                                <SWOTCard title="Opportunities" points={swot.opportunities} color="blue" />
                                <SWOTCard title="Threats" points={swot.threats} color="yellow" />
                             </div>
                         </div>
                     )}

                     {news && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                             <h5 className="font-bold text-sm mb-2 text-slate-600 dark:text-slate-300">Grounded News & Insights</h5>
                             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{news.text}</p>
                             {news.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">SOURCES</h5>
                                    <ul className="space-y-1">
                                        {news.sources.map((s, i) => s.web && (
                                            <li key={i}><a href={s.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary dark:text-blue-400 hover:underline"><LinkIcon className="w-3 h-3"/>{s.web.title}</a></li>
                                        ))}
                                    </ul>
                                </div>
                             )}
                        </div>
                     )}
                </div>
            </div>
        );
    };
    
    const CompareView = () => {
         return (
             <div className="space-y-6">
                 <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                     <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Stock Comparison</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Comparing {selectedStocks.map(s => s.ticker).join(', ')}</p>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                         <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-4 py-3 rounded-l-lg">Metric</th>
                                {selectedStocks.map(stock => (
                                    <th key={stock.id} scope="col" className="px-4 py-3 text-center">{stock.ticker}</th>
                                ))}
                            </tr>
                        </thead>
                         <tbody>
                            {[ 'sector', 'price', 'change', 'marketCap', 'peRatio', 'dividendYield'].map(metric => (
                                <tr key={metric} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
                                    <td className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 capitalize">{metric.replace('Cap', ' Cap').replace('Ratio', ' Ratio')}</td>
                                    {selectedStocks.map(stock => (
                                        <td key={stock.id} className="px-4 py-2 text-center font-medium text-slate-800 dark:text-white">
                                            {metric === 'price' ? formatCurrency(stock[metric]) :
                                             metric === 'marketCap' ? `${formatCurrency(stock[metric] * 1_000_000_000).replace('.00','')}` :
                                             metric === 'change' || metric === 'dividendYield' ? `${stock[metric].toFixed(2)}%` :
                                             stock[metric]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                         </tbody>
                    </table>
                 </div>

                 <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 dark:bg-blue-900/20 dark:border-blue-500/30">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="flex items-center gap-2 text-md font-semibold text-primary dark:text-blue-300">
                            <LightbulbIcon className="w-6 h-6" />
                            AI Comparison Summary
                        </h4>
                        <button onClick={handleFetchComparison} disabled={loadingCompare} className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline flex items-center gap-1 disabled:opacity-50">
                            <SparklesIcon className={`w-4 h-4 ${loadingCompare ? 'animate-pulse' : ''}`}/>
                             {loadingCompare ? 'Comparing...' : 'Run Comparison'}
                        </button>
                    </div>

                    {loadingCompare ? (
                         <div className="space-y-2 animate-pulse">
                            <div className="h-3 bg-slate-400/30 rounded w-full"></div>
                            <div className="h-3 bg-slate-400/30 rounded w-5/6"></div>
                        </div>
                    ) : comparisonSummary ? (
                        <p className="text-sm text-primary/80 dark:text-blue-200/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: comparisonSummary }} />
                    ) : (
                         <p className="text-sm text-primary/70 dark:text-blue-200/70">Click "Run Comparison" for an AI-powered summary of the selected stocks.</p>
                    )}
                </div>
             </div>
         );
    }
    
    return (
        <div className="flex h-full -m-6 lg:-m-8">
            {/* Left Pane: Stock List */}
            <div className="w-1/3 max-w-xs bg-white dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                 <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Market Universe</h2>
                     <div className="relative mt-2">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or ticker..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ul>
                        {filteredStocks.map(stock => (
                            <li key={stock.id}>
                                <button
                                    onClick={() => handleSelectStock(stock)}
                                    className={`w-full text-left p-3 flex items-center justify-between gap-3 border-l-4 transition-colors ${selectedStocks.some(s => s.id === stock.id) ? 'bg-primary/5 dark:bg-blue-500/10 border-primary' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={selectedStocks.some(s => s.id === stock.id)}
                                        className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 focus:ring-primary/50"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 dark:text-white">{stock.ticker}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{formatCurrency(stock.price)}</p>
                                        <p className={`text-xs font-semibold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{stock.change.toFixed(2)}%</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Right Pane: Detail/Compare View */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {viewMode === 'detail' && selectedStocks.length === 1 && <DetailView />}
                    {viewMode === 'compare' && selectedStocks.length > 1 && <CompareView />}
                    {selectedStocks.length === 0 && (
                        <div className="flex h-full items-center justify-center text-center">
                            <p className="text-slate-500 dark:text-slate-400">Select a stock to see details or multiple to compare.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Research;
