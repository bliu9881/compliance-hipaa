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

        <div className="p-6 space-y-6">
          {/* How It Works */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600" />
              How Our Scanner Works
            </h4>
            
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Code Upload:</strong> Your code is sent to our analysis API via HTTPS
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>AI Analysis:</strong> AWS Bedrock AI models analyze your code for HIPAA compliance issues
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Results:</strong> Only compliance findings and metadata are returned and stored
                </div>
              </div>
            </div>
          </div>

          {/* Current Security Measures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-green-900">HTTPS Encryption</h4>
              </div>
              <p className="text-sm text-green-800 leading-relaxed">
                Your code is transmitted using <strong>HTTPS encryption</strong> during upload and analysis.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-blue-900">Cloud Processing</h4>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Analysis is performed using <strong>AWS Bedrock AI</strong> in secure cloud infrastructure.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-purple-900">Findings Only</h4>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                We store <strong>compliance findings and metadata</strong>, not your source code content.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-orange-900">Limited Access</h4>
              </div>
              <p className="text-sm text-orange-800 leading-relaxed">
                Only you can access your scan results through your authenticated account.
              </p>
            </div>
          </div>

          {/* What We Store */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              What We Store vs. What We Don't
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  We Don't Store
                </h5>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• Your actual source code content</li>
                  <li>• Variable names or function implementations</li>
                  <li>• Comments or proprietary business logic</li>
                  <li>• Complete file contents</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  We Do Store
                </h5>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• Compliance finding descriptions</li>
                  <li>• File names and line numbers</li>
                  <li>• Severity levels and categories</li>
                  <li>• Scan timestamps and metadata</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Limitations */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-900 mb-2">Important Considerations</h4>
                <div className="space-y-3 text-sm text-red-800 leading-relaxed">
                  <p>
                    <strong>This is a development tool:</strong> While we use HTTPS and don't intentionally store 
                    source code, this scanner is designed for development and testing purposes.
                  </p>
                  <p>
                    <strong>Best practices:</strong> Remove any hardcoded secrets, API keys, passwords, 
                    or sensitive credentials before scanning.
                  </p>
                  <p>
                    <strong>Production code:</strong> Consider using test/development code for initial scans 
                    rather than production systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              Third-Party Services Used
            </h4>
            
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>AWS Bedrock:</strong> AI analysis is performed using Amazon's Bedrock service, 
                which has its own security and privacy policies.
              </div>
              <div>
                <strong>Vercel/Hosting:</strong> Application is hosted on cloud infrastructure with 
                standard security measures.
              </div>
              <div>
                <strong>Supabase:</strong> Scan results and user data are stored in Supabase database.
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