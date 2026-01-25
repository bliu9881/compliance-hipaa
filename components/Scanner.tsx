
import React, { useState } from 'react';
import { 
  Github, 
  Upload, 
  ScanSearch, 
  Loader2, 
  ChevronRight, 
  Info,
  History,
  AlertCircle,
  X,
  FileCode,
  Trash2,
  Shield
} from 'lucide-react';
import { performGitHubScan, performFileUploadScan } from '../services/scanService';
import { SecurityGuarantee } from './SecurityGuarantee';
import { SecurityBadge } from './SecurityBadge';

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'github' | 'upload' | null>(null);
  const [scanProgress, setScanProgress] = useState<{ fileName: string; current: number; total: number; percentage: number } | null>(null);
  const [shouldStopScan, setShouldStopScan] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  const handleGitHubScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    // Show security guarantee modal first
    setPendingAction('github');
    setShowSecurityModal(true);
  };

  const proceedWithGitHubScan = async () => {
    setIsScanning(true);
    setScanStage('Connecting to GitHub API...');
    setScanProgress(null);
    setShouldStopScan(false);
    setError('');
    
    try {
      // Small timeout to show stages
      setTimeout(() => setScanStage('Fetching file tree and commit history...'), 800);
      const result = await performGitHubScan(repoUrl, isIncremental, (progress) => {
        if (shouldStopScan) {
          throw new Error('Scan cancelled by user');
        }
        setScanStage(`Analyzing: ${progress.fileName}`);
        setScanProgress(progress);
      });
      
      if (result.findings.length === 0 && isIncremental) {
        setScanStage('No changes detected since last scan.');
        setTimeout(() => onScanComplete(result.id), 1000);
      } else {
        setScanStage('Analyzing code with AI...');
        onScanComplete(result.id);
      }
    } catch (err: any) {
      if (err.message === 'Scan cancelled by user') {
        setError('Scan cancelled by user.');
      } else {
        setError(err.message || 'Failed to scan repository. Ensure it is public and the URL is correct.');
      }
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsScanning(true);
    setScanStage(`Reading ${files.length} uploaded file${files.length > 1 ? 's' : ''}...`);
    setScanProgress(null);
    setShouldStopScan(false);
    setError('');

    try {
      const result = await performFileUploadScan(files, (progress) => {
        if (shouldStopScan) {
          throw new Error('Scan cancelled by user');
        }
        setScanStage(`Analyzing: ${progress.fileName}`);
        setScanProgress(progress);
      });
      setScanStage('Analyzing code with AI...');
      onScanComplete(result.id);
    } catch (err: any) {
      if (err.message === 'Scan cancelled by user') {
        setError('Scan cancelled by user.');
      } else {
        setError('Failed to scan files.');
      }
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  const startScan = async () => {
    if (selectedFiles.length === 0) return;
    
    // Show security guarantee modal first
    setPendingAction('upload');
    setShowSecurityModal(true);
  };

  const proceedWithFileUpload = async () => {
    await handleFileUpload(selectedFiles);
  };

  const handleSecurityAccept = () => {
    setShowSecurityModal(false);
    
    if (pendingAction === 'github') {
      proceedWithGitHubScan();
    } else if (pendingAction === 'upload') {
      proceedWithFileUpload();
    }
    
    setPendingAction(null);
  };

  const handleSecurityCancel = () => {
    setShowSecurityModal(false);
    setPendingAction(null);
  };

  const handleStopScanClick = () => {
    setShowStopConfirmation(true);
  };

  const confirmStopScan = () => {
    setShouldStopScan(true);
    setShowStopConfirmation(false);
  };

  const cancelStopScan = () => {
    setShowStopConfirmation(false);
  };

  const handleFileSelection = (files: File[]) => {
    // Filter for code files
    const codeFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['js', 'ts', 'tsx', 'jsx', 'py', 'go', 'java', 'php', 'rb', 'sql', 'c', 'cpp', 'cs', 'swift', 'kt', 'scala', 'rs'].includes(extension || '');
    });

    if (codeFiles.length === 0) {
      setError('No supported code files found. Please upload JS, TS, Python, Go, Java, PHP, Ruby, SQL, C/C++, C#, Swift, Kotlin, Scala, or Rust files.');
      return;
    }

    setSelectedFiles(codeFiles);
    setError('');
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("📂 File input change - files selected:", files.length);
    console.log("📂 File names:", files.map(f => f.name));
    handleFileSelection(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Drag enter");
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Drag leave");
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🎯 Drag over");
  };

  const handleDrop = async (e: React.DragEvent) => {
    console.log("🎯 Drop event triggered");
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isScanning) {
      console.log("🎯 Scanning in progress, ignoring drop");
      return;
    }

    console.log("🎯 Processing dropped files...");
    console.log("🎯 DataTransfer object:", e.dataTransfer);
    console.log("🎯 DataTransfer.files:", e.dataTransfer.files);
    console.log("🎯 DataTransfer.files.length:", e.dataTransfer.files.length);
    console.log("🎯 DataTransfer.items:", e.dataTransfer.items);
    console.log("🎯 DataTransfer.types:", e.dataTransfer.types);

    const files = Array.from(e.dataTransfer.files);
    console.log("🎯 Drag and drop - files dropped:", files.length);
    
    if (files.length === 0) {
      console.log("🎯 No files in dataTransfer.files, trying items...");
      
      // Try using dataTransfer.items as fallback
      const items = Array.from(e.dataTransfer.items);
      const fileItems = items.filter(item => item.kind === 'file');
      console.log("🎯 File items found:", fileItems.length);
      
      const filesFromItems = fileItems.map(item => item.getAsFile()).filter(file => file !== null);
      console.log("🎯 Files from items:", filesFromItems.length);
      
      if (filesFromItems.length > 0) {
        console.log("🎯 Using files from items");
        handleFileSelection(filesFromItems as File[]);
        return;
      }
    }
    
    console.log("🎯 File names:", files.map(f => f.name));
    handleFileSelection(files);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI-Powered Compliance Audit</h1>
        <p className="text-slate-500 mt-2">Choose an asset source to start your HIPAA audit scan with advanced AI analysis.</p>
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

              {/* Progress Bar */}
              {isScanning && scanProgress && (
                <div className="mt-6 space-y-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900">Processing Files</p>
                      <p className="text-xs text-emerald-700 mt-1 truncate">{scanProgress.fileName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">{scanProgress.percentage}%</p>
                      <p className="text-xs text-emerald-600">{scanProgress.current}/{scanProgress.total}</p>
                    </div>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${scanProgress.percentage}%` }}
                    />
                  </div>
                  <button
                    onClick={handleStopScanClick}
                    className="w-full mt-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Stop Scan
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isScanning 
                    ? 'opacity-50 border-slate-200' 
                    : isDragOver 
                      ? 'border-emerald-500 bg-emerald-50 scale-105' 
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                  isDragOver ? 'bg-emerald-100 scale-110' : 'bg-slate-100'
                }`}>
                  <Upload className={`w-8 h-8 transition-all ${
                    isDragOver ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>
                <h4 className={`text-lg font-bold transition-all ${
                  isDragOver ? 'text-emerald-900' : 'text-slate-900'
                }`}>
                  {isDragOver ? 'Drop files here!' : 'Drag & drop files or folders'}
                </h4>
                <p className={`text-sm mt-2 mb-6 transition-all ${
                  isDragOver ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  Support for JS, TS, Python, Go, Java, PHP, Ruby, SQL, C/C++, C#, Swift, Kotlin, Scala, and Rust files
                </p>
                <label className={`cursor-pointer border px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm ${
                  isDragOver 
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}>
                  Browse Files
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileInputChange}
                    disabled={isScanning}
                    accept=".js,.ts,.tsx,.jsx,.py,.go,.java,.php,.rb,.sql,.c,.cpp,.cs,.swift,.kt,.scala,.rs"
                  />
                </label>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-emerald-600" />
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <button
                      onClick={clearAllFiles}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      disabled={isScanning}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => {
                      const extension = file.name.split('.').pop()?.toLowerCase();
                      const sizeKB = (file.size / 1024).toFixed(1);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                                extension === 'js' || extension === 'jsx' ? 'bg-yellow-500' :
                                extension === 'ts' || extension === 'tsx' ? 'bg-blue-500' :
                                extension === 'py' ? 'bg-green-500' :
                                extension === 'go' ? 'bg-cyan-500' :
                                extension === 'java' ? 'bg-orange-500' :
                                extension === 'php' ? 'bg-purple-500' :
                                extension === 'rb' ? 'bg-red-500' :
                                extension === 'sql' ? 'bg-indigo-500' :
                                'bg-slate-500'
                              }`}>
                                {extension?.toUpperCase() || 'FILE'}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{file.name}</p>
                              <p className="text-xs text-slate-500">{sizeKB} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="flex-shrink-0 p-1 text-slate-400 hover:text-red-600 transition-colors"
                            disabled={isScanning}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={startScan}
                    disabled={isScanning || selectedFiles.length === 0}
                    className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {scanStage}
                      </>
                    ) : (
                      <>
                        <ScanSearch className="w-6 h-6" />
                        Start Compliance Audit ({selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''})
                      </>
                    )}
                  </button>

                  {/* Progress Bar */}
                  {isScanning && scanProgress && (
                    <div className="mt-6 space-y-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-emerald-900">Processing Files</p>
                          <p className="text-xs text-emerald-700 mt-1 truncate">{scanProgress.fileName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">{scanProgress.percentage}%</p>
                          <p className="text-xs text-emerald-600">{scanProgress.current}/{scanProgress.total}</p>
                        </div>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-300"
                          style={{ width: `${scanProgress.percentage}%` }}
                        />
                      </div>
                      <button
                        onClick={handleStopScanClick}
                        className="w-full mt-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Stop Scan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isScanning && selectedFiles.length === 0 && (
                <div className="flex flex-col items-center gap-4 text-emerald-600 py-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="font-bold">{scanStage}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
          <div className="flex items-start gap-4 mb-4">
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
          
          {/* Security Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Secure scanning:</span> We analyze code with HTTPS and AWS AI, storing only findings—not source code. Remove secrets before scanning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Guarantee Modal */}
      <SecurityGuarantee
        isOpen={showSecurityModal}
        onClose={handleSecurityCancel}
        onAccept={handleSecurityAccept}
      />

      {/* Stop Scan Confirmation Modal */}
      {showStopConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Stop Scan?</h3>
            </div>
            
            <p className="text-slate-600 text-sm">
              Are you sure you want to stop the current scan? Any findings analyzed so far will be discarded.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelStopScan}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-all"
              >
                Continue Scan
              </button>
              <button
                onClick={confirmStopScan}
                className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Stop Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
