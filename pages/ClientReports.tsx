
import React, { useState } from 'react';
import { ClientReport, PortfolioAsset } from '../types.ts';
import { generateReportSummary } from '../services/geminiService.ts';
import ReportPreviewModal from '../components/ReportPreviewModal.tsx';
import ReportsIcon from '../components/icons/ReportsIcon.tsx';
import ViewIcon from '../components/icons/ViewIcon.tsx';

const initialReports: ClientReport[] = [
    {
        id: 'rep1',
        clientName: 'Aliko Dangote',
        reportType: 'Quarterly Performance Review',
        reportingPeriod: 'Q3 2024',
        generationDate: 'October 5, 2024',
        summary: 'This quarterly summary for Aliko Dangote highlights robust performance, primarily driven by the Industrials sector. DANGCEM showed significant strength. The portfolio is well-diversified, mitigating risks and positioning for continued growth.'
    },
    {
        id: 'rep2',
        clientName: 'Femi Otedola',
        reportType: 'Annual Summary',
        reportingPeriod: '2023',
        generationDate: 'January 15, 2024',
        summary: 'The annual review for Femi Otedola shows a strong year-end result. Financial sector investments, particularly GTCO, provided stable returns. The portfolio has demonstrated resilience in a fluctuating market.'
    }
];

interface ClientReportsProps {
    assets: PortfolioAsset[];
}

const ClientReports: React.FC<ClientReportsProps> = ({ assets }) => {
    const [reports, setReports] = useState<ClientReport[]>(initialReports);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentReport, setCurrentReport] = useState<ClientReport | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [clientName, setClientName] = useState('');
    const [reportType, setReportType] = useState('Quarterly Performance Review');
    const [reportingPeriod, setReportingPeriod] = useState('');
    const [error, setError] = useState('');

    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !reportType || !reportingPeriod) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        setIsGenerating(true);

        try {
            const summary = await generateReportSummary(clientName, reportType, reportingPeriod, assets);
            
            const newReport: ClientReport = {
                id: new Date().toISOString(),
                clientName,
                reportType,
                reportingPeriod,
                generationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                summary
            };

            setReports(prev => [newReport, ...prev]);
            setCurrentReport(newReport);
            setIsModalOpen(true);
            
            // Reset form
            setClientName('');
            setReportingPeriod('');

        } catch (err) {
            console.error(err);
            setError('Failed to generate AI summary. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleViewReport = (report: ClientReport) => {
        setCurrentReport(report);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <ReportPreviewModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                report={currentReport}
                assets={assets}
            />
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Client Reports</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Generate and manage professional client performance reports.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Generate New Report</h3>
                        <form onSubmit={handleGenerateReport} className="space-y-4">
                             <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Client Name</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g., Ada Okoro"
                                />
                            </div>
                             <div>
                                <label htmlFor="reportType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Report Type</label>
                                <select 
                                    id="reportType" 
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option>Quarterly Performance Review</option>
                                    <option>Annual Summary</option>
                                    <option>Portfolio Snapshot</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="reportingPeriod" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Reporting Period</label>
                                <input
                                    type="text"
                                    id="reportingPeriod"
                                    value={reportingPeriod}
                                    onChange={(e) => setReportingPeriod(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g., Q4 2024"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button 
                                type="submit"
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <ReportsIcon className="w-5 h-5" />
                                )}
                                {isGenerating ? 'Generating...' : 'Generate Report'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-slate-900/70 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Reports</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-l-lg">Client Name</th>
                                        <th scope="col" className="px-6 py-3">Report Type</th>
                                        <th scope="col" className="px-6 py-3">Generated On</th>
                                        <th scope="col" className="px-6 py-3 rounded-r-lg text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map(report => (
                                        <tr key={report.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{report.clientName}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{report.reportType}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{report.generationDate}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleViewReport(report)} className="font-semibold text-primary dark:text-blue-400 hover:underline text-xs flex items-center gap-1 mx-auto">
                                                   <ViewIcon className="w-4 h-4" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {reports.length === 0 && (
                                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    No reports generated yet. Use the form to create one.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientReports;
