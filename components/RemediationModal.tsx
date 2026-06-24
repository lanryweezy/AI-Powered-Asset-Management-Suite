
import React, { useState, useEffect } from 'react';
import { ComplianceCheck } from '../types.ts';
import { getComplianceRemediation } from '../services/geminiService.ts';
import LightbulbIcon from './icons/LightbulbIcon.tsx';

interface RemediationModalProps {
    isOpen: boolean;
    onClose: () => void;
    check: ComplianceCheck | null;
}

const markdownToHtml = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
};

const RemediationModal: React.FC<RemediationModalProps> = ({ isOpen, onClose, check }) => {
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (check) {
            const fetchSuggestion = async () => {
                setLoading(true);
                try {
                    const result = await getComplianceRemediation(check);
                    setSuggestion(result);
                } catch (err) {
                    setSuggestion('Failed to load suggestion. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            fetchSuggestion();
        }
    }, [check]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        Remediation Suggestion
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Failed Rule</p>
                        <p className="text-md text-slate-800 dark:text-white">{check?.rule}</p>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Details</p>
                        <p className="text-md text-slate-800 dark:text-white">{check?.details}</p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="flex items-center gap-2 text-md font-semibold text-slate-800 dark:text-white mb-3">
                        <LightbulbIcon className="w-6 h-6 text-yellow-500" />
                        AI-Powered Action Plan
                    </h4>
                    {loading ? (
                         <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <div 
                            className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(suggestion) }}
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemediationModal;
