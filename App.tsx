
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Portfolio from './pages/Portfolio.tsx';
import Analytics from './pages/Analytics.tsx';
import Compliance from './pages/Compliance.tsx';
import ClientReports from './pages/ClientReports.tsx';
import Settings from './pages/Settings.tsx';
import RiskAssessment from './pages/RiskAssessment.tsx';
import MarketIntelligence from './pages/MarketIntelligence.tsx';
import Research from './pages/Research.tsx';
import Clients from './pages/Clients.tsx';
import AuditTrail from './pages/AuditTrail.tsx';
import ModelPortfolios from './pages/ModelPortfolios.tsx';
import AIChatAssistant from './components/AIChatAssistant.tsx';
import { PageContainer } from './components/shared/PageContainer.tsx';
import { NAV_ITEMS } from './constants.tsx';
import { mockAssets, mockClients, mockTransactions, mockAuditLogs, modelPortfolios as mockModelPortfolios } from './data/mockData.ts';
import type { PortfolioAsset, Client, Transaction, AuditLog, ModelPortfolio, Notification } from './types.ts';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('Clients');

  // Centralized state management
  const [assets, setAssets] = useState<PortfolioAsset[]>(mockAssets);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [modelPortfolios, setModelPortfolios] = useState<ModelPortfolio[]>(mockModelPortfolios);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Predictive alert: detect risk deviation
    const newAlerts = assets
        .filter(asset => asset.riskScore > 7)
        .map(asset => ({
            id: `alert-${asset.ticker}-${Date.now()}`,
            title: 'Predictive Risk Alert',
            message: `${asset.ticker} risk score (${asset.riskScore}) has deviated from benchmark.`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning' as const,
            read: false,
        }));
    
    if (newAlerts.length > 0) {
        setNotifications(prev => [...newAlerts, ...prev]);
    }
  }, [assets]);


  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  const onSaveClient = useCallback((client: Client) => {
    setClients(prevClients => {
        const existing = prevClients.some(c => c.id === client.id);
        if (existing) {
            addAuditLog({ user: 'Femi Adebayo', action: 'UPDATE_CLIENT', details: `Updated client profile: ${client.name}`, ipAddress: '192.168.1.1' });
            return prevClients.map(c => c.id === client.id ? client : c);
        } else {
            addAuditLog({ user: 'Femi Adebayo', action: 'CREATE_CLIENT', details: `Created new client: ${client.name}`, ipAddress: '192.168.1.1' });
            return [client, ...prevClients];
        }
    });
  }, [addAuditLog]);


  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard setActivePage={setActivePage} assets={assets} transactions={transactions} />;
      case 'Clients':
        return <Clients 
                  clients={clients} 
                  onSaveClient={onSaveClient}
                  assets={assets}
                  transactions={transactions}
               />;
      case 'Portfolio Management':
        return <Portfolio 
                  assets={assets} 
                  setAssets={setAssets} 
                  addTransaction={addTransaction}
                  addAuditLog={addAuditLog}
                />;
      case 'Model Portfolios':
        return <ModelPortfolios 
                  models={modelPortfolios}
                  setModelPortfolios={setModelPortfolios}
                  addAuditLog={addAuditLog}
                />;
      case 'AI Analytics':
        return <Analytics assets={assets} />;
      case 'Market Research':
        return <Research />;
      case 'Compliance Monitor':
        return <Compliance />;
      case 'Client Reports':
        return <ClientReports assets={assets} />;
      case 'Risk Assessment':
        return <RiskAssessment assets={assets} setAssets={setAssets} />;
      case 'Market Intelligence':
        return <MarketIntelligence />;
      case 'Audit Trail':
        return <AuditTrail auditLogs={auditLogs} />;
      case 'Settings':
        return <Settings />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{activePage}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">This page is under construction.</p>
          </div>
        );
    }
  };

  const activePageTitle = NAV_ITEMS.find(item => item.label === activePage)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-background dark:bg-dark text-slate-800 dark:text-slate-200">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activePageTitle} notifications={notifications} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-dark p-6 lg:p-8">
          <PageContainer>
            {renderPage()}
          </PageContainer>
        </main>
      </div>
      <AIChatAssistant />
    </div>
  );
};

export default App;
