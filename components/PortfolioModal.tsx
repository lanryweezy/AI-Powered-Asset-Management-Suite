
import React, { useState, useEffect } from 'react';
import { PortfolioAsset } from '../types.ts';

type PortfolioFormData = {
    name: string;
    ticker: string;
    value: string;
    sector: string;
    riskScore: string;
}

interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: PortfolioAsset) => void;
    assetToEdit?: PortfolioAsset | null;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose, onSave, assetToEdit }) => {
    const [formData, setFormData] = useState<PortfolioFormData>({ name: '', ticker: '', value: '', sector: '', riskScore: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (assetToEdit) {
            setFormData({
                name: assetToEdit.name,
                ticker: assetToEdit.ticker,
                value: assetToEdit.value.toString(),
                sector: assetToEdit.sector,
                riskScore: assetToEdit.riskScore.toString(),
            });
        } else {
            setFormData({ name: '', ticker: '', value: '', sector: '', riskScore: '' });
        }
        setError('');
    }, [assetToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, ticker, value, sector, riskScore } = formData;
        const numericValue = parseFloat(value);
        const numericRiskScore = parseFloat(riskScore);

        if (!name || !ticker || !value || isNaN(numericValue) || numericValue <= 0 || !sector || riskScore === '' || isNaN(numericRiskScore) || numericRiskScore < 0 || numericRiskScore > 1) {
            setError('Please fill in all fields with valid data. Risk Score must be between 0 and 1.');
            return;
        }

        const newAsset: PortfolioAsset = {
            id: assetToEdit?.id || new Date().toISOString(),
            name,
            ticker: ticker.toUpperCase(),
            value: numericValue,
            change: assetToEdit?.change ?? 0,
            allocation: assetToEdit?.allocation ?? 0, // Placeholder, will be recalculated
            sector,
            riskScore: numericRiskScore,
            volatility: assetToEdit?.volatility ?? 0.3,
            liquidityScore: assetToEdit?.liquidityScore ?? 0.85,
            marketCorrelation: assetToEdit?.marketCorrelation ?? 0.75,
        };

        onSave(newAsset);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    {assetToEdit ? 'Edit Asset' : 'Add New Asset'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Asset Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., Dangote Cement PLC"
                        />
                    </div>
                    <div>
                        <label htmlFor="ticker" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Ticker</label>
                        <input
                            type="text"
                            id="ticker"
                            name="ticker"
                            value={formData.ticker}
                            onChange={handleChange}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., DANGCEM"
                        />
                    </div>
                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Total Value (NGN)</label>
                        <input
                            type="number"
                            id="value"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., 45000000"
                        />
                    </div>
                     <div>
                        <label htmlFor="sector" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Sector</label>
                        <input
                            type="text"
                            id="sector"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., Industrials"
                        />
                    </div>
                    <div>
                        <label htmlFor="riskScore" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Risk Score (0-1)</label>
                        <input
                            type="number"
                            id="riskScore"
                            name="riskScore"
                            value={formData.riskScore}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            max="1"
                            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., 0.4"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                            {assetToEdit ? 'Save Changes' : 'Add Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortfolioModal;
