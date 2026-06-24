
import React, { useState, useEffect } from 'react';
import { PortfolioAsset, PortfolioDoctorReport } from '../types.ts';
import { getPortfolioDoctorAnalysis } from '../services/geminiService.ts';
import StethoscopeIcon from './icons/StethoscopeIcon.tsx';
import CheckCircleIcon from './icons/CheckCircleIcon.tsx';
import XCircleIcon from './icons/XCircleIcon.tsx';

interface PortfolioDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    assets: PortfolioAsset[];
}

const PortfolioDoctorModal: React.FC<PortfolioDoctorModalProps> = ({ isOpen, onClose, assets }) => {
    const [report, setReport] = useState<PortfolioDoctorReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchReport = async () => {
                setLoading(true);
                setError(null);
                setReport(null);
                try {
                    const result = await getPortfolioDoctorAnalysis(assets);
                    setReport(result);
                } catch (err) {
                    setError('Failed to get AI analysis. Please try again.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchReport();
        }
    }, [isOpen, assets]);
    
    if (!isOpen) return null;

    const getScoreColor = (score: number) => {
        if (score < 50) return 'text-red-500';
        if (score < 75) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <StethoscopeIcon className="w-8 h-8 text-primary dark:text-blue-400" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Portfolio Doctor Report</h2>
                             <p className="text-sm text-slate-500 dark:text-slate-400">A holistic health check of your portfolio.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="mt-6">
                    {loading && (
                         <div className="space-y-4 animate-pulse text-center p-8">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full mt-4"></div>
                        </div>
                    )}
                    {error && <p className="text-center text-red-500 p-8">{error}</p>}
                    {report && (
                        <div className="space-y-6">
                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Portfolio Score</p>
                                <p className={`text-5xl font-bold ${getScoreColor(report.overallScore)}`}>{report.overallScore}<span className="text-2xl text-slate-400">/100</span></p>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Summary</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{report.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <h4 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300 mb-2"><CheckCircleIcon className="w-5 h-5"/> Strengths</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-200">
                                        {report.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <h4 className="flex items-center gap-2 font-semibold text-yellow-800 dark:text-yellow-300 mb-2"><XCircleIcon className="w-5 h-5"/> Areas for Improvement</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-200">
                                        {report.areasForImprovement.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioDoctorModal;
