
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants.tsx';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-72'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActivePage(item.label);
            }}
            title={collapsed ? item.label : undefined}
            className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
              activePage === item.label
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} ${activePage === item.label ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            <span className={`${collapsed ? 'hidden' : 'block'} transition-opacity duration-300`}>{item.label}</span>
          </a>
        ))}
      </nav>
      {!collapsed && (
        <div className="px-6 pb-8">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Need Help?</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Contact our support team for any assistance.</p>
                <button className="mt-3 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-bold py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-colors shadow-sm">
                    Contact Support
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;