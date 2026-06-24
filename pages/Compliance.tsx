
import React, { useState, useMemo } from 'react';
import { ComplianceCheck } from '../types.ts';
import RemediationModal from '../components/RemediationModal.tsx';
import ComplianceIcon from '../components/icons/ComplianceIcon.tsx';
import CheckCircleIcon from '../components/icons/CheckCircleIcon.tsx';
import XCircleIcon from '../components/icons/XCircleIcon.tsx';
import ClockIcon from '../components/icons/ClockIcon.tsx';

const initialComplianceChecks: ComplianceCheck[] = [
    { id: '1', rule: 'Portfolio concentration limit (single stock < 20%)', status: 'Passed', details: 'Max concentration is 18% (MTNN)' },
    { id: '2', rule: 'SEC Nigeria - Minimum Capital Requirement', status: 'Passed', details: 'Capital reserve well above minimum threshold.' },
    { id: '3', rule: 'Foreign Investment Limit (Regulation 4.2)', status: 'Pending', details: 'Awaiting updated filings for Q3.' },
    { id: '4', rule: 'Anti-Money Laundering (AML) Check', status: 'Passed', details: 'All transactions for the last 30 days verified.' },
    { id: '5', rule: 'PENCOM Investment Guideline Compliance', status: 'Failed', details: 'Investment in unquoted securities exceeds 5% limit.' },
    { id: '6', rule: 'Client Mandate Alignment Check', status: 'Pending', details: 'Scheduled for verification end of week.'}
];

const getStatusChipColor = (status: 'Passed' | 'Failed' | 'Pending') => {
    switch(status) {
        case 'Passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
}

const SummaryCard = ({ title, value, icon, colorClass }) => (
    <div className={`bg-white dark:bg-slate-900/70 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass.bg}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass.text}` })}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const Compliance: React.FC = () => {
    const [checks, setChecks] = useState<ComplianceCheck[]>(initialComplianceChecks);
    const [loadingChecks, setLoadingChecks] = useState(false);
    const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const summary = useMemo(() => {
        return {
            total: checks.length,
            passed: checks.filter(c => c.status === 'Passed').length,
            failed: checks.filter(c => c.status === 'Failed').length,
            pending: checks.filter(c => c.status === 'Pending').length
        };
    }, [checks]);

    const handleRunChecks = () => {
        setLoadingChecks(true);
        setTimeout(() => {
            const updatedChecks = checks.map(c => {
                if (c.status === 'Pending') {
                    const newStatus: 'Passed' | 'Failed' = Math.random() > 0.4 ? 'Passed' : 'Failed';
                    return { 
                        ...c, 
                        status: newStatus, 
                        details: newStatus === 'Passed' 
                            ? 'Check automatically verified and passed.' 
                            : 'New data triggered a failure during the automated check.'
                    };
                }
                return c;
            });
            setChecks(updatedChecks);
            setLoadingChecks(false);
        }, 1500);
    };

    const handleOpenModal = (check: ComplianceCheck) => {
        setSelectedCheck(check);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCheck(null);
    };

    return (
        <div className="space-y-8">
            <RemediationModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                check={selectedCheck}
            />
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Compliance Monitor</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Automated tracking of regulatory and internal compliance rules.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Checks" value={summary.total} icon={<ComplianceIcon />} colorClass={{bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-300'}} />
                <SummaryCard title="Passed" value={summary.passed} icon={<CheckCircleIcon />} colorClass={{bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-500'}} />
                <SummaryCard title="Failed" value={summary.failed} icon={<XCircleIcon />} colorClass={{bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-500'}} />
                <SummaryCard title="Pending" value={summary.pending} icon={<ClockIcon />} colorClass={{bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-500'}} />
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Compliance Status</h3>
                     <button 
                        onClick={handleRunChecks}
                        disabled={loadingChecks}
                        className="flex items-center justify-center gap-2 w-36 bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingChecks ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <ComplianceIcon className="w-5 h-5" />
                        )}
                        {loadingChecks ? 'Running...' : 'Run Checks'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-l-lg">Compliance Rule</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3 rounded-r-lg text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checks.map(check => (
                                <tr key={check.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{check.rule}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusChipColor(check.status)}`}>
                                            {check.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{check.details}</td>
                                    <td className="px-6 py-4 text-center">
                                        {check.status === 'Failed' && (
                                            <button 
                                                onClick={() => handleOpenModal(check)}
                                                className="font-semibold text-primary dark:text-blue-400 hover:underline text-xs"
                                            >
                                                Get AI Suggestion
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
