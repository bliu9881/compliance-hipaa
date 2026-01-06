import React, { useState } from 'react';
import { X, Copy, CheckCircle, Share2, Link } from 'lucide-react';
import { ScanResult } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scan: ScanResult;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, scan }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate shareable link with encoded scan data
  const generateShareLink = () => {
    const encodedData = btoa(JSON.stringify(scan));
    return `${window.location.origin}/shared/${encodedData}`;
  };

  const shareLink = generateShareLink();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Share Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 truncate">
                    {shareLink}
                  </span>
                </div>
              </div>
              <button
                onClick={copyLink}
                className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-100 text-amber-600 rounded">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">
                  Share Responsibly
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This link contains your scan results. Only share with trusted parties who need access to this compliance information.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Report Summary</h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="font-medium">{scan.sourceName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Findings:</span>
                <span className="font-medium">{scan.findings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Issues:</span>
                <span className="font-medium text-red-600">{scan.summary.critical}</span>
              </div>
              <div className="flex justify-between">
                <span>Scan Date:</span>
                <span className="font-medium">{new Date(scan.timestamp).toLocaleDateString()}</span>
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
          <button
            onClick={copyLink}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};