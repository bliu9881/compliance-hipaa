
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  FileCode,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { getScanById } from '../services/scanService';
import { Severity, Finding, ScanResult } from '../types';

interface ReportProps {
  scanId: string | null;
  onBack: () => void;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = {
    [Severity.CRITICAL]: 'bg-red-100 text-red-700 border-red-200',
    [Severity.HIGH]: 'bg-orange-100 text-orange-700 border-orange-200',
    [Severity.MEDIUM]: 'bg-amber-100 text-amber-700 border-amber-200',
    [Severity.LOW]: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const FindingCard: React.FC<{ finding: Finding }> = ({ finding }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(finding.codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-emerald-500/20 border-emerald-500/40 shadow-lg' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${finding.severity === Severity.CRITICAL ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            {finding.severity === Severity.CRITICAL ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-slate-900">{finding.title}</h4>
              <SeverityBadge severity={finding.severity} />
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{finding.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {finding.file && (
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded max-w-[150px] truncate">
              {finding.file}:{finding.line || '??'}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
          <div className="space-y-2">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> Issue Description
            </h5>
            <p className="text-sm text-slate-600 leading-relaxed">{finding.description}</p>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Recommended Action
            </h5>
            <p className="text-sm text-slate-600 leading-relaxed">{finding.recommendation}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-500" /> Secure Code Implementation
              </h5>
              <button 
                onClick={copyCode}
                className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
              </button>
            </div>
            <div className="relative group">
              <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto">
                <code className="text-sm text-emerald-400 mono">
                  {finding.codeExample}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Report: React.FC<ReportProps> = ({ scanId, onBack }) => {
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scanId) {
      const fetchData = async () => {
        const data = await getScanById(scanId);
        if (data) setScan(data);
        setLoading(false);
      };
      fetchData();
    }
  }, [scanId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!scan) return <div className="text-center py-20">Report not found.</div>;

  const total = scan.findings.length;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Audit Logs
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-white shadow-sm transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 truncate max-w-md">{scan.sourceName}</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Audit completed on {new Date(scan.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-tighter">
                Completed
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-6 border-y border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-black text-red-600">{scan.summary.critical}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Critical</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-2xl font-black text-orange-500">{scan.summary.high}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">High</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-2xl font-black text-amber-500">{scan.summary.medium}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Medium</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-2xl font-black text-blue-500">{scan.summary.low}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Low</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                Analysis Results ({total} findings)
              </h3>
              {scan.findings.length > 0 ? (
                scan.findings.map(finding => (
                  <FindingCard key={finding.id} finding={finding} />
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900">Clean Scan</h4>
                  <p className="text-sm text-slate-500">No HIPAA compliance issues were detected.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Audit Metadata</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Source Type</span>
                <span className="font-semibold text-slate-900 capitalize">{scan.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Storage</span>
                <span className="font-semibold text-slate-900">Supabase Cloud</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Engine Version</span>
                <span className="font-semibold text-slate-900">GuardPHI v2.5 (AI)</span>
              </div>
              {scan.lastCommitHash && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Commit Hash</span>
                  <span className="font-mono text-emerald-600 font-bold truncate ml-2">{scan.lastCommitHash.substring(0, 8)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <h3 className="font-bold text-lg mb-2">Need a BAA?</h3>
            <p className="text-emerald-100 text-sm leading-relaxed mb-6">
              Our automated system can help you generate a compliant Business Associate Agreement in minutes.
            </p>
            <button className="w-full bg-white text-emerald-700 py-2.5 rounded-lg font-bold hover:bg-emerald-50 transition-colors">
              Generate BAA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
