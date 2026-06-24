
import React, { useState } from 'react';
import { Client, PortfolioAsset, Transaction } from '../types.ts';
import ClientDetailPanel from '../components/clients/ClientDetailPanel.tsx';
import ClientEditorModal from '../components/clients/ClientEditorModal.tsx';
import ClientsIcon from '../components/icons/ClientsIcon.tsx';
import UserPlusIcon from '../components/icons/UserPlusIcon.tsx';

interface ClientsProps {
    clients: Client[];
    onSaveClient: (client: Client) => void;
    assets: PortfolioAsset[];
    transactions: Transaction[];
}

const Clients: React.FC<ClientsProps> = ({ clients, onSaveClient, assets, transactions }) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const handleOpenEditor = (client: Client | null) => {
        setClientToEdit(client);
        setIsEditorOpen(true);
    };
    
    const handleCloseEditor = () => {
        setClientToEdit(null);
        setIsEditorOpen(false);
    };
    
    const handleSaveClient = (client: Client) => {
        onSaveClient(client);
        // If it was a new client, select them. If it was an edit, update the view.
        if (!clientToEdit) {
            setSelectedClient(client);
        } else {
            setSelectedClient(prev => prev?.id === client.id ? client : prev);
        }
        handleCloseEditor();
    };

    return (
        <>
            <ClientEditorModal 
                isOpen={isEditorOpen}
                onClose={handleCloseEditor}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
            />
            <div className="flex h-full -m-6 lg:-m-8">
                <div className="w-1/3 max-w-sm bg-white dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Clients ({clients.length})</h2>
                            <button 
                                onClick={() => handleOpenEditor(null)}
                                className="p-2 rounded-full text-slate-500 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Add New Client"
                            >
                                <UserPlusIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <input type="text" placeholder="Search clients..." className="mt-2 w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                    <ul className="flex-1 overflow-y-auto">
                        {clients.map(client => (
                            <li key={client.id}>
                                <button 
                                    onClick={() => setSelectedClient(client)}
                                    className={`w-full text-left p-4 flex items-center gap-4 border-l-4 ${selectedClient?.id === client.id ? 'bg-primary/5 dark:bg-blue-500/10 border-primary' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <img src={client.avatarUrl} alt={client.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white">{client.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{client.email}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {selectedClient ? (
                        <ClientDetailPanel
                            key={selectedClient.id} // Re-mount when client changes
                            client={selectedClient}
                            assets={assets}
                            transactions={transactions}
                            onEdit={() => handleOpenEditor(selectedClient)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                            <ClientsIcon className="w-16 h-16 mb-4" />
                            <h2 className="text-xl font-semibold">Select a client</h2>
                            <p>Choose a client from the list or add a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Clients;
