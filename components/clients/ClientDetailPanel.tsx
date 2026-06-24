
import React, { useMemo } from 'react';
import { Client, PortfolioAsset, Transaction } from '../../types.ts';
import { formatCurrency } from '../../utils.ts';
import AIProfileSummary from './AIProfileSummary.tsx';
import CheckCircleIcon from '../icons/CheckCircleIcon.tsx';
import ClockIcon from '../icons/ClockIcon.tsx';
import XCircleIcon from '../icons/XCircleIcon.tsx';
import TargetIcon from '../icons/TargetIcon.tsx';
import BrainCircuitIcon from '../icons/BrainCircuitIcon.tsx';
import PortfolioIcon from '../icons/PortfolioIcon.tsx';
import RiskIcon from '../icons/RiskIcon.tsx';
import AnalyticsIcon from '../icons/AnalyticsIcon.tsx';
import TransactionArrowIcon from '../icons/TransactionArrowIcon.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import ReportsIcon from '../icons/ReportsIcon.tsx';


const KYCStatusBadge = ({ status }: { status: Client['kycStatus']}) => {
    const styles = {
        'Verified': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    const icons = {
        'Verified': <CheckCircleIcon className="w-4 h-4" />,
        'Pending': <ClockIcon className="w-4 h-4" />,
        'Rejected': <XCircleIcon className="w-4 h-4" />,
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    )
};

const ProfileCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            {icon}
            {title}
        </h4>
        <div className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
            {children}
        </div>
    </div>
);

const StatCard = ({ icon, title, value, change, changeColor }: { icon: React.ReactNode, title: string, value: string, change?: string, changeColor?: string }) => (
    <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">{icon}</div>
            <div>
                 <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">{value}</h3>
            </div>
        </div>
        {change && <p className={`mt-2 text-sm font-semibold ${changeColor}`}>{change}</p>}
    </div>
);

interface ClientDetailPanelProps {
    client: Client;
    assets: PortfolioAsset[];
    transactions: Transaction[];
    onEdit: () => void;
}

const ClientDetailPanel: React.FC<ClientDetailPanelProps> = ({ client, assets, transactions, onEdit }) => {

    const portfolioSummary = useMemo(() => {
        const totalValue = assets.filter(a => a.sector !== 'Cash').reduce((sum, asset) => sum + asset.value, 0);
        const dayChangeValue = assets.filter(a => a.sector !== 'Cash').reduce((acc, asset) => acc + (asset.value * (asset.change / 100)), 0);
        const dayChangePercent = totalValue > 0 ? (dayChangeValue / totalValue) * 100 : 0;
        return { totalValue, dayChangeValue, dayChangePercent };
    }, [assets]);
    
    // For demonstration, we assume the global assets/transactions belong to the client.
    const clientHoldings = useMemo(() => assets.filter(a => a.sector !== 'Cash').slice(0, 5), [assets]);
    const recentTransactions = useMemo(() => transactions.slice(0, 4), [transactions]);


    return (
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-4 justify-between items-start">
                <div className="flex items-center gap-6">
                    <img src={client.avatarUrl} alt={client.name} className="w-20 h-20 rounded-full shadow-md" />
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{client.name}</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400">{client.email}</p>
                        <div className="mt-2">
                            <KYCStatusBadge status={client.kycStatus} />
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                        <EditIcon className="w-4 h-4" /> Edit Profile
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors">
                        <ReportsIcon className="w-4 h-4"/> Generate Report
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Portfolio Value"
                    value={formatCurrency(portfolioSummary.totalValue)}
                    icon={<PortfolioIcon className="w-5 h-5 text-primary dark:text-blue-400" />}
                />
                <StatCard 
                    title="Day's Gain/Loss"
                    value={formatCurrency(portfolioSummary.dayChangeValue)}
                    change={`${portfolioSummary.dayChangePercent.toFixed(2)}%`}
                    changeColor={portfolioSummary.dayChangeValue >= 0 ? "text-green-500" : "text-red-500"}
                    icon={<AnalyticsIcon className="w-5 h-5 text-primary dark:text-blue-400" />}
                />
                 <StatCard 
                    title="Risk Appetite"
                    value={client.riskProfile.riskAppetite}
                    icon={<RiskIcon className="w-5 h-5 text-primary dark:text-blue-400" />}
                />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top Holdings</h3>
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                             <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                <tr>
                                    <th className="text-left font-medium p-2">Asset</th>
                                    <th className="text-right font-medium p-2">Value</th>
                                    <th className="text-right font-medium p-2">Allocation</th>
                                </tr>
                             </thead>
                             <tbody>
                                {clientHoldings.map(asset => (
                                    <tr key={asset.id} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="p-2">
                                            <div className="font-semibold text-slate-800 dark:text-white">{asset.ticker}</div>
                                            <div className="text-xs text-slate-500">{asset.name}</div>
                                        </td>
                                        <td className="p-2 text-right font-medium">{formatCurrency(asset.value)}</td>
                                        <td className="p-2 text-right font-medium">{asset.allocation.toFixed(2)}%</td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
                    <ul className="space-y-4">
                        {recentTransactions.map(tx => (
                            <li key={tx.id} className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'Buy' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                    <TransactionArrowIcon type={tx.type} className={`w-4 h-4 ${tx.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{tx.type} {tx.ticker}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(tx.amount)}</p>
                                </div>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Client Risk Profile</h3>
                <div className="space-y-4">
                    <ProfileCard icon={<TargetIcon className="w-5 h-5 text-green-500" />} title="Investment Profile">
                        <p><strong>Goals:</strong> {client.riskProfile.investmentGoals}</p>
                        <p><strong>Appetite:</strong> {client.riskProfile.riskAppetite}</p>
                        <p><strong>Horizon:</strong> {client.riskProfile.investmentHorizon}</p>
                    </ProfileCard>

                    <ProfileCard icon={<BrainCircuitIcon className="w-5 h-5 text-purple-500" />} title="Behavioral Risk Score">
                        <p>
                            The client's behavioral score is <strong>{client.riskProfile.behavioralRiskScore.toFixed(2)} / 1.00</strong>, indicating a 
                            {client.riskProfile.behavioralRiskScore > 0.6 ? ' higher tendency for emotional decision-making.' : client.riskProfile.behavioralRiskScore > 0.3 ? ' balanced and disciplined approach.' : ' highly cautious and analytical nature.'}
                        </p>
                    </ProfileCard>

                    <AIProfileSummary client={client} />
                </div>
            </div>
        </div>
    );
};

export default ClientDetailPanel;
