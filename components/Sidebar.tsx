
import React from 'react';
import { 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  ShieldCheck, 
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'New Scan', icon: ScanSearch },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'baa-generator', label: 'Generate BAA', icon: FileText },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="text-emerald-400 w-8 h-8" />
        <span className="font-bold text-xl tracking-tight">GuardPHI</span>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
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

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
