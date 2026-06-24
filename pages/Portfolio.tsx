
import React, { useState, useEffect, useCallback } from 'react';
import { getPortfolioOptimization, getPortfolioDoctorAnalysis } from '../services/geminiService.ts';
import { PortfolioAsset, OptimizationSuggestion, Transaction, AuditLog } from '../types.ts';
import { formatCurrency } from '../utils.ts';
import PortfolioModal from '../components/PortfolioModal.tsx';
import TradeConfirmationModal from '../components/TradeConfirmationModal.tsx';
import PortfolioDoctorModal from '../components/PortfolioDoctorModal.tsx';
import PlusIcon from '../components/icons/PlusIcon.tsx';
import EditIcon from '../components/icons/EditIcon.tsx';
import TrashIcon from '../components/icons/TrashIcon.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';
import StethoscopeIcon from '../components/icons/StethoscopeIcon.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';


const getActionChipColor = (action: 'BUY' | 'SELL' | 'HOLD') => {
    switch(action) {
        case 'BUY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'SELL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'HOLD': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
}

const recalculateAllocations = (assets: PortfolioAsset[]): PortfolioAsset[] => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    if (totalValue === 0) return assets.map(a => ({...a, allocation: 0}));

    return assets.map(asset => ({
        ...asset,
        allocation: (asset.value / totalValue) * 100,
    }));
};

interface PortfolioProps {
    assets: PortfolioAsset[];
    setAssets: React.Dispatch<React.SetStateAction<PortfolioAsset[]>>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ assets, setAssets, addTransaction, addAuditLog }) => {
    const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Modal states
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [assetToEdit, setAssetToEdit] = useState<PortfolioAsset | null>(null);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [suggestionToTrade, setSuggestionToTrade] = useState<OptimizationSuggestion | null>(null);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        if (assets.filter(a => a.sector !== 'Cash').length === 0) {
            setSuggestions([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const result = await getPortfolioOptimization(assets.filter(a => a.sector !== 'Cash'));
            setSuggestions(result);
        } catch (err) {
            setError('Failed to load AI suggestions. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [assets]);

    const handleOpenAssetModal = (asset?: PortfolioAsset) => {
        setAssetToEdit(asset || null);
        setIsAssetModalOpen(true);
    };

    const handleCloseAssetModal = () => {
        setIsAssetModalOpen(false);
        setAssetToEdit(null);
    };

    const handleSaveAsset = (savedAsset: PortfolioAsset) => {
        let updatedAssets;
        const existingAsset = assets.find(a => a.id === savedAsset.id);

        if (existingAsset) {
            updatedAssets = assets.map(a => a.id === savedAsset.id ? savedAsset : a);
            addAuditLog({ user: 'Femi Adebayo', action: 'UPDATE_ASSET', details: `Edited asset: ${savedAsset.ticker}`, ipAddress: '192.168.1.1' });
        } else {
            updatedAssets = [...assets, savedAsset];
            addAuditLog({ user: 'Femi Adebayo', action: 'CREATE_ASSET', details: `Added new asset: ${savedAsset.ticker}`, ipAddress: '192.168.1.1' });
        }
        
        setAssets(recalculateAllocations(updatedAssets));
        handleCloseAssetModal();
    };

    const handleDeleteAsset = (assetId: string) => {
        const assetToDelete = assets.find(a => a.id === assetId);
        if (window.confirm(`Are you sure you want to delete ${assetToDelete?.ticker}?`)) {
            const updatedAssets = assets.filter(a => a.id !== assetId);
            setAssets(recalculateAllocations(updatedAssets));
            addAuditLog({ user: 'Femi Adebayo', action: 'DELETE_ASSET', details: `Deleted asset: ${assetToDelete?.ticker}`, ipAddress: '192.168.1.1' });
        }
    };

    const handleExecuteTrade = (tradeAmount: number) => {
        if (!suggestionToTrade) return;

        const { ticker, action } = suggestionToTrade;

        if (action === 'HOLD') {
            // This case should not be reached due to UI filtering, but as a safeguard.
            return;
        }
        
        setAssets(prevAssets => {
            const cashAsset = prevAssets.find(a => a.ticker === 'NGN');
            if (!cashAsset) {
                alert("Error: No cash account found in portfolio.");
                return prevAssets;
            }

            const targetAsset = prevAssets.find(a => a.ticker === ticker);
            if (!targetAsset && action === 'SELL') {
                alert(`Error: Asset ${ticker} not found in portfolio.`);
                return prevAssets;
            }
            
            if (action === 'BUY' && cashAsset.value < tradeAmount) {
                alert("Error: Insufficient cash for this transaction.");
                return prevAssets;
            }
            
             if (action === 'SELL' && targetAsset && targetAsset.value < tradeAmount) {
                alert("Error: Not enough holdings to sell this amount.");
                return prevAssets;
            }

            const newAssets = prevAssets.map(asset => {
                if (asset.ticker === 'NGN') {
                    // Debit for BUY, Credit for SELL
                    return {...asset, value: asset.value + (action === 'BUY' ? -tradeAmount : tradeAmount)};
                }
                if (asset.ticker === ticker) {
                     // Increase value for BUY, decrease for SELL
                    return {...asset, value: asset.value + (action === 'BUY' ? tradeAmount : -tradeAmount)};
                }
                return asset;
            });
            
            // If buying a new asset not in portfolio
            if (action === 'BUY' && !targetAsset) {
                // In a real app, you'd fetch asset details from a service.
                // For this demo, we can't create a new asset from just a ticker.
                // We'll show a warning and prevent the state update.
                console.warn("This demo does not support buying a brand new asset not already in the portfolio.");
                alert("This demo does not support buying a brand new asset. The trade was not executed.");
                return prevAssets; // Return original state
            }

            return recalculateAllocations(newAssets);
        });
        
        const transactionType = action === 'BUY' ? 'Buy' : 'Sell';

        addTransaction({ type: transactionType, ticker, amount: tradeAmount });
        addAuditLog({ user: 'Femi Adebayo', action: `EXECUTE_${action}`, details: `${transactionType} ${formatCurrency(tradeAmount)} of ${ticker}`, ipAddress: '192.168.1.1' });
        
        setIsTradeModalOpen(false);
        setSuggestionToTrade(null);
    };


    return (
        <div className="space-y-8">
            <PortfolioModal 
                isOpen={isAssetModalOpen}
                onClose={handleCloseAssetModal}
                onSave={handleSaveAsset}
                assetToEdit={assetToEdit}
            />
            <TradeConfirmationModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                onConfirm={handleExecuteTrade}
                suggestion={suggestionToTrade}
                assets={assets}
            />
            <PortfolioDoctorModal
                isOpen={isDoctorModalOpen}
                onClose={() => setIsDoctorModalOpen(false)}
                assets={assets}
            />

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Current Holdings</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsDoctorModalOpen(true)}
                            className="flex items-center gap-2 bg-slate-100 text-slate-700 dark:text-slate-200 dark:bg-slate-800 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <StethoscopeIcon className="w-4 h-4" />
                            Portfolio Doctor
                        </button>
                        <button 
                            onClick={() => handleOpenAssetModal()}
                            className="flex items-center gap-2 bg-primary text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Asset
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th scope="col" className="px-4 py-3">Asset Name</th>
                                <th scope="col" className="px-4 py-3">Value</th>
                                <th scope="col" className="px-4 py-3">24h Change</th>
                                <th scope="col" className="px-4 py-3">Allocation</th>
                                <th scope="col" className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {assets.map(asset => (
                                <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-4 font-semibold text-slate-950 dark:text-white whitespace-nowrap">{asset.name} <span className="text-slate-500 font-normal">{asset.ticker}</span></td>
                                    <td className="px-4 py-4">{formatCurrency(asset.value)}</td>
                                    <td className={`px-4 py-4 font-semibold ${asset.ticker === 'NGN' ? 'text-slate-500' : asset.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{asset.ticker === 'NGN' ? '–' : `${asset.change.toFixed(2)}%`}</td>
                                    <td className="px-4 py-4">{asset.allocation.toFixed(2)}%</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleOpenAssetModal(asset)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:text-blue-400 dark:hover:bg-slate-800 transition-colors" aria-label={`Edit ${asset.ticker}`}>
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button disabled={asset.ticker === 'NGN'} onClick={() => handleDeleteAsset(asset.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label={`Delete ${asset.ticker}`}>
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {assets.length === 0 && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            No assets in your portfolio. Click "Add New Asset" to get started.
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white mb-5">
                    <LightbulbIcon className="w-4 h-4 text-amber-500" />
                    AI Tax Optimization
                </h3>
                <div className="p-4 border border-amber-100 dark:border-amber-900/50 rounded-xl bg-amber-50 dark:bg-amber-950/20">
                    <h4 className="font-semibold text-xs text-amber-900 dark:text-amber-200">Tax-Loss Harvesting Opportunity</h4>
                    <p className="mt-1.5 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        AI suggests selling <strong className="font-semibold">BUAFOODS</strong> to realize a loss of <strong className="font-semibold">{formatCurrency(300000)}</strong>. This can offset gains from other investments.
                    </p>
                     <button className="mt-4 text-xs font-semibold text-amber-900 hover:text-amber-700 dark:text-amber-300 hover:underline">Execute Harvest</button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">AI Optimization Suggestions</h3>
                     <button 
                        onClick={fetchSuggestions}
                        disabled={loading}
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 dark:text-slate-200 dark:bg-slate-800 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        <SparklesIcon className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                        {loading ? 'Analyzing...' : 'Get AI Suggestions'}
                    </button>
                </div>
                
                {loading && (
                    <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                        <div className="space-y-3 animate-pulse max-w-lg mx-auto">
                            <div className="h-20 bg-slate-50 dark:bg-slate-800 rounded-xl w-full"></div>
                            <div className="h-20 bg-slate-50 dark:bg-slate-800 rounded-xl w-full"></div>
                        </div>
                        <p className="mt-4 text-xs">Analyzing your portfolio...</p>
                    </div>
                )}
                {error && <div className="text-center p-8 text-xs text-red-500">{error}</div>}
                {!loading && !error && (
                    <div className="space-y-3">
                        {suggestions.length > 0 ? suggestions.map(suggestion => (
                             <div key={suggestion.ticker} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                                 <div className="flex flex-wrap gap-y-2 justify-between items-center">
                                     <div className="flex items-center gap-2">
                                         <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getActionChipColor(suggestion.action)}`}>{suggestion.action}</span>
                                         <h4 className="font-semibold text-xs text-slate-950 dark:text-white">{suggestion.ticker}</h4>
                                     </div>
                                     <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                         Confidence: <span className="font-semibold text-slate-900 dark:text-slate-200">{(suggestion.confidenceScore * 100).toFixed(0)}%</span>
                                     </div>
                                 </div>
                                 <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{suggestion.reasoning}</p>
                                  {suggestion.action !== 'HOLD' && (
                                     <div className="mt-4 text-right">
                                         <button 
                                            onClick={() => { setSuggestionToTrade(suggestion); setIsTradeModalOpen(true); }}
                                            className="bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-colors"
                                         >
                                             Execute Trade
                                         </button>
                                     </div>
                                 )}
                             </div>
                        )) : (
                            <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400">
                                Click "Get AI Suggestions" to analyze your portfolio for optimization opportunities.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
