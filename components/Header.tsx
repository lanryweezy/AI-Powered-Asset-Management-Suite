import React from 'react';
import UserIcon from './icons/UserIcon.tsx';
import BellIcon from './icons/BellIcon.tsx';
import SearchIcon from './icons/SearchIcon.tsx';
import { Notification } from '../types.ts';

interface HeaderProps {
  title: string;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ title, notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">{title}</h2>
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets, clients..."
            className="bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 rounded-lg py-2 pl-11 pr-6 text-sm w-72 transition-all placeholder:text-slate-400"
          />
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <BellIcon className="w-5 h-5 text-slate-500" />
          {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900"></span>
          )}
        </button>
        <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
            FA
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
