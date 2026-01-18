
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  ShieldCheck, 
  FileText,
  LogOut,
  Settings,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { AIProviderSettings } from './AIProviderSettings';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen = true, onClose }) => {
  const { logout } = useAuth();
  const [showAISettings, setShowAISettings] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'New Scan', icon: ScanSearch },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'baa-generator', label: 'Generate BAA', icon: FileText },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (onClose) onClose();
  };

  return (
    <>
      <div className={`fixed md:static w-64 h-full bg-slate-900 text-white flex flex-col z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 flex items-center gap-3">
          <ShieldCheck className="text-emerald-400 w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">AuroScan</span>
        </div>
        
        <nav className="flex-1 px-4 mt-6">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activePage === item.id 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setShowAISettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">AI Model</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <AIProviderSettings 
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </>
  );
};
