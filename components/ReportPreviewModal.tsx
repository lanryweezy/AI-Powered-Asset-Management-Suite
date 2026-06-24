
import React from 'react';
import { ClientReport, PortfolioAsset } from '../types.ts';
import PortfolioValueChart from './charts/PortfolioValueChart.tsx';
import AssetAllocationChart from './charts/AssetAllocationChart.tsx';
import PdfIcon from './icons/PdfIcon.tsx';
import SendIcon from './icons/SendIcon.tsx';

interface ReportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: ClientReport | null;
    assets: PortfolioAsset[];
}

const markdownToHtml = (text: string) => {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
};

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, report, assets }) => {
    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div 
                className="bg-background dark:bg-dark rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col m-4" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {report.reportType}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">For: {report.clientName} | Period: {report.reportingPeriod}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                            <PdfIcon className="w-5 h-5 text-red-500"/> Download PDF
                        </button>
                         <button className="flex items-center gap-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors">
                            <SendIcon className="w-5 h-5"/> Send to Client
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">AI-Generated Executive Summary</h3>
                        <div 
                            className="text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(report.summary) }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <PortfolioValueChart assets={assets} />
                         <AssetAllocationChart assets={assets} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReportPreviewModal;
