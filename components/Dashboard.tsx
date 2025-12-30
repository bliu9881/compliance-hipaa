
import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus,
  ArrowRight,
  FileText,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { getScans } from '../services/scanService';
import { ScanResult, Severity } from '../types';

interface DashboardProps {
  onStartScan: () => void;
  onViewReport: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartScan, onViewReport }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getScans();
      setScans(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalFindings = scans.reduce((acc, s) => acc + s.findings.length, 0);
  const criticalFindings = scans.reduce((acc, s) => acc + s.summary.critical, 0);

  const stats = [
    { label: 'Total Scans', value: scans.length, icon: Clock, color: 'blue' },
    { label: 'Critical Issues', value: criticalFindings, icon: ShieldAlert, color: 'red' },
    { label: 'Total Findings', value: totalFindings, icon: AlertTriangle, color: 'amber' },
    { label: 'Compliant Assets', value: scans.filter(s => s.findings.length === 0).length, icon: CheckCircle2, color: 'emerald' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Health</h1>
          <p className="text-slate-500 mt-1">Overview of your HIPAA compliance posture.</p>
        </div>
        <button 
          onClick={onStartScan}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Run New Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Audit History</h2>
              <button className="text-emerald-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {scans.length > 0 ? scans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${scan.source === 'github' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 truncate max-w-xs">{scan.sourceName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                      {scan.summary.critical > 0 && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {scan.summary.critical} CRITICAL
                        </span>
                      )}
                      {scan.summary.high > 0 && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {scan.summary.high} HIGH
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => onViewReport(scan.id)}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400">No audits found. Start your first scan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl shadow-slate-200">
            <h3 className="text-lg font-bold">HIPAA Readiness</h3>
            <div className="mt-6 flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={364 * (1 - 0.75)}
                    className="text-emerald-400"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">75%</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-4 text-center">Your infrastructure is 75% compliant with current standards.</p>
            </div>
            <button className="w-full mt-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-bold transition-colors">
              Improve Score
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-sm text-emerald-600 hover:underline">
                <FileText className="w-4 h-4" /> HIPAA Technical Safeguards Guide
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-emerald-600 hover:underline">
                <ShieldCheck className="w-4 h-4" /> BAA Agreement Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
