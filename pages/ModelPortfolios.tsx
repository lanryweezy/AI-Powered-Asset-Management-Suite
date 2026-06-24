
import React, { useState, useEffect, useCallback } from 'react';
import type { ModelPortfolio, ModelPortfolioAnalysis, AuditLog } from '../types.ts';
import { getModelPortfolioAnalysis } from '../services/geminiService.ts';
import PlusIcon from '../components/icons/PlusIcon.tsx';
import CompassIcon from '../components/icons/CompassIcon.tsx';
import EditIcon from '../components/icons/EditIcon.tsx';
import TrashIcon from '../components/icons/TrashIcon.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';
import ModelEditorModal from '../components/ModelEditorModal.tsx';
import ModelPerformanceChart from '../components/charts/ModelPerformanceChart.tsx';
import SparklesIcon from '../components/icons/SparklesIcon.tsx';

interface ModelPortfoliosProps {
    models: ModelPortfolio[];
    setModelPortfolios: React.Dispatch<React.SetStateAction<ModelPortfolio[]>>;
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const RiskBadge = ({ level }: { level: ModelPortfolio['riskLevel'] }) => {
    const styles = {
        'High': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Low': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[level]}`}>
            {level} Risk
        </span>
    );
};

const ModelPortfolios: React.FC<ModelPortfoliosProps> = ({ models, setModelPortfolios, addAuditLog }) => {
    const [selectedModel, setSelectedModel] = useState<ModelPortfolio | null>(models.length > 0 ? models[0] : null);
    const [analysis, setAnalysis] = useState<ModelPortfolioAnalysis | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisError, setAnalysisError] = useState('');

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [modelToEdit, setModelToEdit] = useState<ModelPortfolio | null>(null);

    useEffect(() => {
        // Reset analysis when model changes
        setAnalysis(null);
        setAnalysisError('');
        setLoadingAnalysis(false);
    }, [selectedModel]);
    
    const fetchAnalysis = useCallback(async () => {
        if (!selectedModel) return;
        setLoadingAnalysis(true);
        setAnalysis(null);
        setAnalysisError('');
        try {
            const result = await getModelPortfolioAnalysis(selectedModel);
            setAnalysis(result);
        } catch (error) {
            console.error("Failed to load model analysis:", error);
            setAnalysisError('Failed to load model analysis. Please try again.');
        } finally {
            setLoadingAnalysis(false);
        }
    }, [selectedModel]);

    const handleOpenEditor = (model?: ModelPortfolio) => {
        setModelToEdit(model || null);
        setIsEditorOpen(true);
    };

    const handleSaveModel = (savedModel: ModelPortfolio) => {
        const isNew = !models.some(m => m.id === savedModel.id);
        if (isNew) {
            setModelPortfolios([...models, savedModel]);
            setSelectedModel(savedModel);
            addAuditLog({ user: 'Femi Adebayo', action: 'CREATE_MODEL', details: `Created model: ${savedModel.name}`, ipAddress: '192.168.1.1' });
        } else {
            const updatedModels = models.map(m => m.id === savedModel.id ? savedModel : m);
            setModelPortfolios(updatedModels);
            setSelectedModel(savedModel);
            addAuditLog({ user: 'Femi Adebayo', action: 'UPDATE_MODEL', details: `Updated model: ${savedModel.name}`, ipAddress: '192.168.1.1' });
        }
        setIsEditorOpen(false);
        setModelToEdit(null);
    };

    const handleDeleteModel = (modelId: string) => {
        const modelToDelete = models.find(m => m.id === modelId);
        if (window.confirm(`Are you sure you want to delete the "${modelToDelete?.name}" model?`)) {
            const updatedModels = models.filter(m => m.id !== modelId);
            setModelPortfolios(updatedModels);
            if (selectedModel?.id === modelId) {
                setSelectedModel(updatedModels.length > 0 ? updatedModels[0] : null);
            }
             addAuditLog({ user: 'Femi Adebayo', action: 'DELETE_MODEL', details: `Deleted model: ${modelToDelete?.name}`, ipAddress: '192.168.1.1' });
        }
    };

    return (
        <>
            <ModelEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveModel}
                modelToEdit={modelToEdit}
            />
            <div className="flex h-full -m-6 lg:-m-8">
                {/* Left Pane: Model List */}
                <div className="w-1/3 max-w-xs bg-white dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Model Strategies</h2>
                        <button
                            onClick={() => handleOpenEditor()}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Create New Model
                        </button>
                    </div>
                    <ul className="flex-1 overflow-y-auto">
                        {models.map(model => (
                            <li key={model.id}>
                                <button
                                    onClick={() => setSelectedModel(model)}
                                    className={`w-full text-left p-4 border-l-4 transition-colors ${selectedModel?.id === model.id ? 'bg-primary/5 dark:bg-blue-500/10 border-primary' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-slate-800 dark:text-white truncate">{model.name}</p>
                                        <RiskBadge level={model.riskLevel} />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{model.constituents.length} constituents</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Right Pane: Detail View */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        {selectedModel ? (
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedModel.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{selectedModel.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => handleOpenEditor(selectedModel)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteModel(selectedModel.id)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    <div className="lg:col-span-3 bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Constituents ({selectedModel.constituents.length})</h4>
                                        <div className="overflow-y-auto max-h-60">
                                            <table className="w-full text-sm">
                                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                                    <tr>
                                                        <th className="text-left py-2 px-2">Ticker</th>
                                                        <th className="text-right py-2 px-2">Target Weight</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedModel.constituents.map(c => (
                                                        <tr key={c.ticker} className="border-t border-slate-100 dark:border-slate-800">
                                                            <td className="py-2 px-2 font-mono text-slate-700 dark:text-slate-300">{c.ticker}</td>
                                                            <td className="py-2 px-2 text-right font-semibold text-slate-800 dark:text-white">{c.weight.toFixed(2)}%</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 bg-white dark:bg-slate-900/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                        <h4 className="font-semibold text-slate-800 dark:text-white">Key Metrics</h4>
                                        {loadingAnalysis && <p className="text-sm text-slate-500">Loading analysis...</p>}
                                        {analysis && <>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Projected Return (Ann.)</p>
                                                <p className="text-xl font-bold text-green-500">{analysis.projectedReturn.toFixed(2)}%</p>
                                            </div>
                                             <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Est. Max Drawdown</p>
                                                <p className="text-xl font-bold text-red-500">{analysis.maxDrawdown.toFixed(2)}%</p>
                                            </div>
                                        </>}
                                        {!analysis && !loadingAnalysis && (
                                            <p className="text-sm text-slate-500">Run AI analysis to see key metrics.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 dark:bg-blue-900/20 dark:border-blue-500/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="flex items-center gap-2 text-md font-semibold text-primary dark:text-blue-300">
                                            <LightbulbIcon className="w-6 h-6" /> AI Strategic Analysis
                                        </h4>
                                        <button onClick={fetchAnalysis} disabled={loadingAnalysis} className="text-xs font-semibold text-primary dark:text-blue-400 hover:underline flex items-center gap-1 disabled:opacity-50">
                                            <SparklesIcon className={`w-4 h-4 ${loadingAnalysis ? 'animate-pulse' : ''}`} />
                                            {loadingAnalysis ? 'Analyzing...' : 'Analyze Strategy'}
                                        </button>
                                    </div>
                                    {loadingAnalysis ? (
                                        <div className="space-y-2 animate-pulse"><div className="h-3 bg-slate-400/30 rounded w-full"></div><div className="h-3 bg-slate-400/30 rounded w-5/6"></div></div>
                                    ) : analysis ? (
                                        <p className="text-sm text-primary/80 dark:text-blue-200/90 leading-relaxed">{analysis.summary}</p>
                                    ) : analysisError ? (
                                         <p className="text-sm text-red-400">{analysisError}</p>
                                    ) : (
                                         <p className="text-sm text-primary/70 dark:text-blue-200/70">Click "Analyze Strategy" for an AI-powered analysis of this model.</p>
                                    )}
                                </div>
                                <ModelPerformanceChart model={selectedModel} />

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                                <CompassIcon className="w-16 h-16 mb-4" />
                                <h2 className="text-xl font-semibold">Welcome to the Model Portfolio Architect</h2>
                                <p>Select a model to view its details, or create a new one to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModelPortfolios;
