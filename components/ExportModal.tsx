import React, { useState } from 'react';
import { X, Download, FileText, File, Code, CheckCircle } from 'lucide-react';
import { ScanResult } from '../types';
import { exportToPDF, exportToHTML, exportToJSON } from '../services/reportExportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: ScanResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, scan }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (format: 'pdf' | 'html' | 'json') => {
    setExporting(format);
    setExported(null);

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(scan);
          break;
        case 'html':
          await exportToHTML(scan);
          break;
        case 'json':
          await exportToJSON(scan);
          break;
      }
      
      setExported(format);
      setTimeout(() => setExported(null), 3000);
    } catch (error) {
      console.error(`Export to ${format} failed:`, error);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      format: 'pdf' as const,
      title: 'PDF Report',
      description: 'Professional report with charts and formatting',
      icon: FileText,
      color: 'text-red-600 bg-red-100',
      recommended: true
    },
    {
      format: 'html' as const,
      title: 'HTML Report',
      description: 'Web-friendly format for sharing online',
      icon: File,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      format: 'json' as const,
      title: 'JSON Data',
      description: 'Raw data for integration with other tools',
      icon: Code,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Export Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Report Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="block text-slate-500">Source</span>
                <span className="font-medium">{scan.sourceName}</span>
              </div>
              <div>
                <span className="block text-slate-500">Findings</span>
                <span className="font-medium">{scan.findings.length} issues</span>
              </div>
              <div>
                <span className="block text-slate-500">Critical</span>
                <span className="font-medium text-red-600">{scan.summary.critical}</span>
              </div>
              <div>
                <span className="block text-slate-500">Date</span>
                <span className="font-medium">{new Date(scan.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Choose Export Format</h4>
            
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isExporting = exporting === option.format;
              const isExported = exported === option.format;
              
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={exporting !== null}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all hover:border-emerald-300 hover:bg-emerald-50 ${
                    option.recommended ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'
                  } ${exporting !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      {isExporting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isExported ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900">{option.title}</h5>
                        {option.recommended && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                      {isExporting && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          Generating {option.format.toUpperCase()}...
                        </p>
                      )}
                      {isExported && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          ✓ Downloaded successfully!
                        </p>
                      )}
                    </div>
                    <Download className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 text-blue-600 rounded">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">
                  Export Tips
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• PDF format is best for formal reports and presentations</li>
                  <li>• HTML format works well for web sharing and email</li>
                  <li>• JSON format is ideal for integration with other tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};