
import React, { useState } from 'react';
import { 
  Github, 
  Upload, 
  ScanSearch, 
  Loader2, 
  ChevronRight, 
  Info,
  History,
  AlertCircle
} from 'lucide-react';
import { performGitHubScan, performFileUploadScan } from '../services/scanService';

interface ScannerProps {
  onScanComplete: (id: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [method, setMethod] = useState<'github' | 'upload'>('github');
  const [repoUrl, setRepoUrl] = useState('');
  const [isIncremental, setIsIncremental] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [error, setError] = useState('');

  const handleGitHubScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    setIsScanning(true);
    setScanStage('Connecting to GitHub API...');
    setError('');
    
    try {
      // Small timeout to show stages
      setTimeout(() => setScanStage('Fetching file tree and commit history...'), 800);
      const result = await performGitHubScan(repoUrl, isIncremental);
      
      if (result.findings.length === 0 && isIncremental) {
        setScanStage('No changes detected since last scan.');
        setTimeout(() => onScanComplete(result.id), 1000);
      } else {
        setScanStage('Analyzing code with Gemini AI...');
        onScanComplete(result.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan repository. Ensure it is public and the URL is correct.');
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsScanning(true);
    setScanStage('Reading uploaded files...');
    setError('');

    try {
      const result = await performFileUploadScan(files);
      setScanStage('Analyzing code with Gemini AI...');
      onScanComplete(result.id);
    } catch (err) {
      setError('Failed to scan files.');
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compliance Audit</h1>
        <p className="text-slate-500 mt-2">Choose an asset source to start your HIPAA audit scan.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setMethod('github')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors ${method === 'github' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Github className="w-5 h-5" />
            GitHub Repository
          </button>
          <button 
            onClick={() => setMethod('upload')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors ${method === 'upload' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Upload className="w-5 h-5" />
            File Upload
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {method === 'github' ? (
            <form onSubmit={handleGitHubScan} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Public Repository URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Github className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/facebook/react"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Incremental Check</h4>
                    <p className="text-xs text-slate-500">Compare latest commit SHA to skip redundant audits.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isIncremental}
                    onChange={(e) => setIsIncremental(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <button 
                disabled={isScanning}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {scanStage}
                  </>
                ) : (
                  <>
                    <ScanSearch className="w-6 h-6" />
                    Start Compliance Audit
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center transition-all ${isScanning ? 'opacity-50' : 'hover:border-emerald-400 hover:bg-emerald-50'}`}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Drag & drop files or folders</h4>
                <p className="text-sm text-slate-500 mt-2 mb-6">Support for JS, TS, Python, Go, and SQL files</p>
                <label className="cursor-pointer bg-white border border-slate-200 px-6 py-2.5 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  Browse Files
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isScanning}
                  />
                </label>
              </div>

              {isScanning && (
                <div className="flex flex-col items-center gap-4 text-emerald-600 py-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="font-bold">{scanStage}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div className="flex items-start gap-4">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">Our HIPAA scanner checks for:</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1 list-disc pl-4">
                <li>Protected Health Information (PHI) leaks</li>
                <li>Encryption-in-transit (SSL/TLS)</li>
                <li>Audit logging and tracking</li>
                <li>Access control implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
