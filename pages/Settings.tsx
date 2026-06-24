
import React, { useState, useEffect, useCallback } from 'react';
import UserIcon from '../components/icons/UserIcon.tsx';
import BellIcon from '../components/icons/BellIcon.tsx';
import KeyIcon from '../components/icons/KeyIcon.tsx';
import SunIcon from '../components/icons/SunIcon.tsx';
import MoonIcon from '../components/icons/MoonIcon.tsx';
import DesktopIcon from '../components/icons/DesktopIcon.tsx';
import ToggleSwitch from '../components/ToggleSwitch.tsx';

type Theme = 'light' | 'dark' | 'system';

const SettingsCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Settings: React.FC = () => {
    const [profile, setProfile] = useState({ name: 'Femi Adebayo', email: 'femi.adebayo@assetai.ng' });
    const [notifications, setNotifications] = useState({
        marketAlerts: true,
        portfolioUpdates: true,
        complianceWarnings: false,
        reportReady: true,
    });
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
    const [apiKeyStatus, setApiKeyStatus] = useState({ configured: false, maskedKey: '' });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        // This check simulates reading process.env at runtime.
        const key = process.env.API_KEY;
        if (key && key !== "mock_api_key") {
            setApiKeyStatus({
                configured: true,
                maskedKey: `sk-****...**${key.slice(-4)}`
            });
        } else {
            setApiKeyStatus({ configured: false, maskedKey: '' });
        }
    }, []);

    const applyTheme = useCallback((themeToApply: Theme) => {
        if (themeToApply === 'dark' || (themeToApply === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('theme', theme);
        applyTheme(theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme(theme);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const handleSave = () => {
        setSaveStatus('saving');
        // Simulate API call
        setTimeout(() => {
            console.log('Settings saved:', { profile, notifications, theme });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    const getSaveButtonText = () => {
        if (saveStatus === 'saving') return 'Saving...';
        if (saveStatus === 'saved') return 'Saved!';
        return 'Save Settings';
    };


    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                        Manage your account settings, notifications, and preferences.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveStatus !== 'idle'}
                    className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors w-32 ${
                        saveStatus === 'saved'
                            ? 'bg-green-500'
                            : 'bg-primary hover:bg-primary/90 disabled:opacity-50'
                    }`}
                >
                    {getSaveButtonText()}
                </button>
            </div>

            <SettingsCard icon={<UserIcon className="w-6 h-6 text-primary dark:text-blue-400" />} title="Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-primary" />
                    </div>
                </div>
            </SettingsCard>
            
            <SettingsCard icon={<BellIcon className="w-6 h-6 text-primary dark:text-blue-400" />} title="Notifications">
                 <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Market Alerts</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for significant market movements.</p>
                        </div>
                        <ToggleSwitch id="marketAlerts" checked={notifications.marketAlerts} onChange={() => handleNotificationChange('marketAlerts')} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Portfolio Updates</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get summaries of your portfolio's performance.</p>
                        </div>
                        <ToggleSwitch id="portfolioUpdates" checked={notifications.portfolioUpdates} onChange={() => handleNotificationChange('portfolioUpdates')} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Compliance Warnings</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Be notified of any potential compliance issues.</p>
                        </div>
                        <ToggleSwitch id="complianceWarnings" checked={notifications.complianceWarnings} onChange={() => handleNotificationChange('complianceWarnings')} />
                    </div>
                     <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Report Ready</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Notify me when a client report is ready.</p>
                        </div>
                        <ToggleSwitch id="reportReady" checked={notifications.reportReady} onChange={() => handleNotificationChange('reportReady')} />
                    </div>
                </div>
            </SettingsCard>
            
             <SettingsCard icon={<KeyIcon className="w-6 h-6 text-primary dark:text-blue-400" />} title="API Key Status">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    {apiKeyStatus.configured ? (
                        <>
                            <div>
                               <p className="font-semibold text-slate-800 dark:text-white">Gemini API Key</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{apiKeyStatus.maskedKey}</p>
                            </div>
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Connected</span>
                        </>
                    ) : (
                        <>
                            <div>
                               <p className="font-semibold text-slate-800 dark:text-white">Gemini API Key</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400">Key not found in environment variables.</p>
                            </div>
                             <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Mock Mode</span>
                        </>
                    )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The API key must be configured in the environment variables. The application cannot directly manage the API key.</p>
            </SettingsCard>

            <SettingsCard icon={<SunIcon className="w-6 h-6 text-primary dark:text-blue-400" />} title="Appearance">
                <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'system'] as Theme[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`p-3 rounded-lg border-2 transition-colors ${theme === t ? 'border-primary' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-2 justify-center">
                                    {t === 'light' && <SunIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
                                    {t === 'dark' && <MoonIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
                                    {t === 'system' && <DesktopIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
                                    <span className="capitalize font-semibold text-sm text-slate-800 dark:text-white">{t}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

export default Settings;
