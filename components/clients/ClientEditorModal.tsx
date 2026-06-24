
import React, { useState, useEffect } from 'react';
import { Client, RiskProfile } from '../../types.ts';

interface ClientEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Client) => void;
    clientToEdit: Client | null;
}

const initialFormState: Client = {
    id: '',
    name: '',
    email: '',
    avatarUrl: 'https://i.pravatar.cc/150?u=newclient',
    kycStatus: 'Pending',
    riskProfile: {
        investmentGoals: '',
        riskAppetite: 'Moderate',
        investmentHorizon: 'Medium-term',
        behavioralRiskScore: 0.5,
    }
};

const ClientEditorModal: React.FC<ClientEditorModalProps> = ({ isOpen, onClose, onSave, clientToEdit }) => {
    const [formData, setFormData] = useState<Client>(initialFormState);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (clientToEdit) {
                setFormData(clientToEdit);
            } else {
                setFormData({
                    ...initialFormState,
                    id: `client-${Date.now()}`,
                    avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
                });
            }
            setError('');
        }
    }, [isOpen, clientToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleRiskProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            riskProfile: {
                ...prev.riskProfile,
                [name]: name === 'behavioralRiskScore' ? parseFloat(value) : value,
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.riskProfile.investmentGoals) {
            setError('Please fill in Name, Email, and Investment Goals.');
            return;
        }
        setError('');
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    {clientToEdit ? 'Edit Client' : 'Add New Client'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                    <fieldset className="p-4 border dark:border-slate-700 rounded-lg">
                        <legend className="px-2 font-semibold text-slate-700 dark:text-slate-300">Personal Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Avatar URL</label>
                                <input type="text" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="kycStatus" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">KYC Status</label>
                                <select name="kycStatus" id="kycStatus" value={formData.kycStatus} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary">
                                    <option>Pending</option>
                                    <option>Verified</option>
                                    <option>Rejected</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className="p-4 border dark:border-slate-700 rounded-lg">
                        <legend className="px-2 font-semibold text-slate-700 dark:text-slate-300">Risk Profile</legend>
                        <div className="space-y-4 pt-2">
                             <div>
                                <label htmlFor="investmentGoals" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Investment Goals</label>
                                <textarea name="investmentGoals" id="investmentGoals" value={formData.riskProfile.investmentGoals} onChange={handleRiskProfileChange} rows={3} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="riskAppetite" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Risk Appetite</label>
                                    <select name="riskAppetite" id="riskAppetite" value={formData.riskProfile.riskAppetite} onChange={handleRiskProfileChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary">
                                        <option>Conservative</option>
                                        <option>Moderate</option>
                                        <option>Aggressive</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="investmentHorizon" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Investment Horizon</label>
                                    <select name="investmentHorizon" id="investmentHorizon" value={formData.riskProfile.investmentHorizon} onChange={handleRiskProfileChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary">
                                        <option>Short-term</option>
                                        <option>Medium-term</option>
                                        <option>Long-term</option>
                                    </select>
                                </div>
                            </div>
                             <div>
                                <label htmlFor="behavioralRiskScore" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Behavioral Risk Score: {formData.riskProfile.behavioralRiskScore.toFixed(2)}</label>
                                <input type="range" name="behavioralRiskScore" id="behavioralRiskScore" value={formData.riskProfile.behavioralRiskScore} onChange={handleRiskProfileChange} min="0" max="1" step="0.01" className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110" />
                            </div>
                        </div>
                    </fieldset>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                            {clientToEdit ? 'Save Changes' : 'Create Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientEditorModal;
