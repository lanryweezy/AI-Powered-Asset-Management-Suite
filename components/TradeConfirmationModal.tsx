
import React, { useMemo } from 'react';
import { OptimizationSuggestion, PortfolioAsset } from '../types.ts';
import { formatCurrency } from '../utils.ts';

interface TradeConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    suggestion: OptimizationSuggestion | null;
    assets: PortfolioAsset[];
}

const TradeConfirmationModal: React.FC<TradeConfirmationModalProps> = ({ isOpen, onClose, onConfirm, suggestion, assets }) => {
    
    const tradeDetails = useMemo(() => {
        if (!suggestion) return null;

        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
        const asset = assets.find(a => a.ticker === suggestion.ticker);
        let amount = 0;

        if (suggestion.action === 'BUY') {
            amount = totalValue * 0.05; // Simulate buying an amount equal to 5% of portfolio value
        } else if (suggestion.action === 'SELL' && asset) {
            amount = asset.value * 0.25; // Simulate selling 25% of the holding
        }

        return {
            ...suggestion,
            amount,
        };
    }, [suggestion, assets]);
    
    if (!isOpen || !tradeDetails) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    Confirm Trade Execution
                </h2>
                
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Action</span>
                        <span className={`font-semibold ${tradeDetails.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{tradeDetails.action}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Ticker</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{tradeDetails.ticker}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Amount</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(tradeDetails.amount)}</span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                    Note: Trade amounts are simulated for demonstration purposes. This will update portfolio values.
                </p>

                <div className="flex justify-end gap-3 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={() => onConfirm(tradeDetails.amount)} 
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Confirm {tradeDetails.action}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeConfirmationModal;
