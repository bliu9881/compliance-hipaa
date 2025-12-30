
import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Github, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Trash2,
  History as HistoryIcon,
  Loader2
} from 'lucide-react';
import { getScans, clearScans } from '../services/scanService';
import { ScanResult } from '../types';

interface HistoryProps {
  onViewReport: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onViewReport }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getScans();
      setScans(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all scan history?')) {
      await clearScans();
      setScans([]);
    }
  };

  const filteredScans = scans.filter(s => 
    s.sourceName.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 mt-1">Review and manage past compliance reports from the cloud.</p>
        </div>
        <button 
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 transition-colors font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by source name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Findings</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScans.length > 0 ? filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${scan.source === 'github' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                        {scan.source === 'github' ? <Github className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      </div>
                      <div className="max-w-[200px] truncate">
                        <p className="font-bold text-slate-900 truncate">{scan.sourceName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{scan.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" /> COMPLETED
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {scan.summary.critical > 0 && <span className="w-6 h-6 rounded flex items-center justify-center bg-red-100 text-red-700 text-[10px] font-black">{scan.summary.critical}</span>}
                      {scan.summary.high > 0 && <span className="w-6 h-6 rounded flex items-center justify-center bg-orange-100 text-orange-700 text-[10px] font-black">{scan.summary.high}</span>}
                      {scan.findings.length === 0 && <span className="text-xs text-slate-400 font-medium">No issues found</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewReport(scan.id)}
                      className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm hover:translate-x-1 transition-all"
                    >
                      Report <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                      <HistoryIcon className="w-12 h-12" />
                      <p className="font-bold text-slate-900 text-lg">No audit history found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
