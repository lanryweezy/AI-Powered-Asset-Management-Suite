
import React, { useState, useEffect, useMemo } from 'react';
import { ModelPortfolio } from '../types.ts';
import { mockStockUniverse } from '../data/mockData.ts';
import TrashIcon from './icons/TrashIcon.tsx';
import PlusIcon from './icons/PlusIcon.tsx';

interface ModelEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (model: ModelPortfolio) => void;
    modelToEdit: ModelPortfolio | null;
}

const ModelEditorModal: React.FC<ModelEditorModalProps> = ({ isOpen, onClose, onSave, modelToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [riskLevel, setRiskLevel] = useState<ModelPortfolio['riskLevel']>('Medium');
    const [constituents, setConstituents] = useState<{ ticker: string, weight: string }[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (modelToEdit) {
                setName(modelToEdit.name);
                setDescription(modelToEdit.description);
                setRiskLevel(modelToEdit.riskLevel);
                setConstituents(modelToEdit.constituents.map(c => ({ ...c, weight: c.weight.toString() })));
            } else {
                setName('');
                setDescription('');
                setRiskLevel('Medium');
                setConstituents([]);
            }
            setError('');
        }
    }, [isOpen, modelToEdit]);

    const totalWeight = useMemo(() => {
        return constituents.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
    }, [constituents]);
    
    const availableTickers = useMemo(() => {
        const selected = constituents.map(c => c.ticker);
        return mockStockUniverse.filter(s => !selected.includes(s.ticker));
    }, [constituents]);

    const handleConstituentChange = (index: number, field: 'ticker' | 'weight', value: string) => {
        const newConstituents = [...constituents];
        newConstituents[index][field] = value;
        setConstituents(newConstituents);
    };

    const addConstituent = () => {
        if(availableTickers.length > 0){
             setConstituents([...constituents, { ticker: availableTickers[0].ticker, weight: '0' }]);
        }
    };
    
    const removeConstituent = (index: number) => {
        setConstituents(constituents.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Math.abs(totalWeight - 100) > 0.01) {
            setError('Total weight must be exactly 100%.');
            return;
        }
        if (!name || !description) {
            setError('Please fill in the model name and description.');
            return;
        }
        setError('');

        const finalConstituents = constituents.map(c => ({
            ticker: c.ticker,
            weight: parseFloat(c.weight)
        })).filter(c => c.weight > 0);

        const savedModel: ModelPortfolio = {
            id: modelToEdit?.id || `model-${Date.now()}`,
            name,
            description,
            riskLevel,
            constituents: finalConstituents
        };
        onSave(savedModel);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    {modelToEdit ? 'Edit Model Portfolio' : 'Create New Model Portfolio'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Model Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="e.g., Nigerian Growth Leaders" />
                        </div>
                        <div>
                            <label htmlFor="riskLevel" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Risk Level</label>
                            <select id="riskLevel" value={riskLevel} onChange={e => setRiskLevel(e.target.value as any)} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                        <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="A brief strategy description" />
                    </div>
                    
                    <div>
                        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-2">Constituents</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                           {constituents.map((c, index) => (
                               <div key={index} className="flex items-center gap-2">
                                   <select value={c.ticker} onChange={e => handleConstituentChange(index, 'ticker', e.target.value)} className="flex-grow bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary">
                                       <option value={c.ticker}>{c.ticker}</option>
                                       {availableTickers.map(s => <option key={s.ticker} value={s.ticker}>{s.ticker}</option>)}
                                   </select>
                                   <input type="number" value={c.weight} onChange={e => handleConstituentChange(index, 'weight', e.target.value)} className="w-24 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="Weight %" step="0.01" />
                                   <button type="button" onClick={() => removeConstituent(index)} className="p-2 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5"/></button>
                               </div>
                           ))}
                        </div>
                        <button type="button" onClick={addConstituent} disabled={availableTickers.length === 0} className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                            <PlusIcon className="w-4 h-4" /> Add Constituent
                        </button>
                    </div>

                    <div className={`p-2 rounded-lg text-center font-semibold text-sm ${Math.abs(totalWeight - 100) > 0.01 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        Total Weight: {totalWeight.toFixed(2)}%
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                        <button type="submit" disabled={Math.abs(totalWeight - 100) > 0.01} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {modelToEdit ? 'Save Changes' : 'Create Model'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModelEditorModal;
