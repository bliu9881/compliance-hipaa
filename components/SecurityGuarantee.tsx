import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Trash2, 
  Server, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Clock,
  X,
  Info
} from 'lucide-react';

interface SecurityGuaranteeProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const SecurityGuarantee: React.FC<SecurityGuaranteeProps> = ({ 
  isOpen, 
  onClose, 
  onAccept 
}) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">Code Scanning Notice</h3>
              <p className="text-sm text-blue-700">Please review before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* How It Works */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              Your code is sent via <strong>HTTPS</strong> to AWS Bedrock for AI analysis. We store only 
              <strong> compliance findings and metadata</strong>, not your source code. Remove any hardcoded 
              secrets before scanning.
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-green-600" />
                <h5 className="font-bold text-green-900 text-sm">HTTPS Encrypted</h5>
              </div>
              <p className="text-xs text-green-800">Secure transmission</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-blue-600" />
                <h5 className="font-bold text-blue-900 text-sm">AWS Bedrock</h5>
              </div>
              <p className="text-xs text-blue-800">Cloud AI analysis</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h5 className="font-bold text-purple-900 text-sm">Findings Only</h5>
              </div>
              <p className="text-xs text-purple-800">No source code stored</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-orange-600" />
                <h5 className="font-bold text-orange-900 text-sm">Private Access</h5>
              </div>
              <p className="text-xs text-orange-800">Only you can view</p>
            </div>
          </div>

          {/* Important Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 leading-relaxed">
                  <strong>Development tool:</strong> Remove hardcoded secrets, API keys, and passwords before scanning. 
                  Use test/development code rather than production systems.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div className="text-sm text-slate-700 leading-relaxed">
                I understand how the scanner works and acknowledge that I should 
                <strong> remove any sensitive credentials or secrets</strong> from my code before scanning. 
                I understand this is a development tool and should be used appropriately.
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            I Understand - Continue
          </button>
        </div>
      </div>
    </div>
  );
};