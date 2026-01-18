
import React from 'react';
import { Bell, Search, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { SecurityBadge } from './SecurityBadge';

interface HeaderProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, menuOpen = false }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search findings..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <SecurityBadge variant="compact" />
        
        <button className="relative text-slate-400 hover:text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 md:gap-3 pl-4 md:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-500/20">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
