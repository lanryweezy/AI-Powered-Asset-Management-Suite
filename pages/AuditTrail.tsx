
import React, { useState } from 'react';
import type { AuditLog } from '../types.ts';
import ScrollTextIcon from '../components/icons/ScrollTextIcon.tsx';

const getActionChipColor = (action: string) => {
    if (action.includes('LOGIN') || action.includes('VIEW')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (action.includes('DELETE') || action.includes('FAIL')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (action.includes('CREATE') || action.includes('GENERATE') || action.includes('BUY') || action.includes('SELL')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
};

interface AuditTrailProps {
    auditLogs: AuditLog[];
}

const AuditTrail: React.FC<AuditTrailProps> = ({ auditLogs }) => {

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Trail</h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    An immutable log of all significant actions taken within the platform.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900/70 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                       <ScrollTextIcon className="w-6 h-6 text-primary dark:text-blue-400" /> System & User Activity
                    </h3>
                    <input
                        type="text"
                        placeholder="Filter logs..."
                        className="bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm w-64 transition-all focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-l-lg">Timestamp</th>
                                <th scope="col" className="px-6 py-3">User/System</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3 rounded-r-lg">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLogs.map(log => (
                                <tr key={log.id} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{log.user}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full font-mono ${getActionChipColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.details}</td>
                                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{log.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditTrail;
