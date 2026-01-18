import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Trash2, 
  Server, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-200 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">Privacy Policy & Security Guarantee</h1>
              <p className="text-emerald-700 mt-1">Your code security and privacy is our highest priority</p>
            </div>
          </div>
          <p className="text-sm text-emerald-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Executive Summary */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>AuroScan HIPAA Scanner</strong> is a development tool that analyzes code for HIPAA compliance issues. 
                We use HTTPS encryption and AWS AI services for analysis. While we don't intentionally store source code, 
                this tool is designed for development and testing purposes, not production security guarantees.
              </p>
            </div>
          </section>

          {/* Core Guarantees */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Security Guarantees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900">Zero Storage Policy</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Source code is never written to disk or database</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Code exists only in memory during analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automatic memory cleanup after processing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">No Human Access</h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Only AI models process your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>No employee can access source code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Automated processing pipeline</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-900">Encrypted Transit</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>TLS 1.3 encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>End-to-end encryption during upload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Secure API communication</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-900">Isolated Processing</h3>
                </div>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Ephemeral containers for each scan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Complete isolation between users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Container destruction after analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Handling */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Data Handling & Retention</h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                What We Store vs. What We Don't
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Never Stored
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Source code content</li>
                    <li>• Code snippets or fragments</li>
                    <li>• Variable names or function names</li>
                    <li>• Comments or documentation</li>
                    <li>• File contents or structure</li>
                    <li>• Any proprietary business logic</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    What We Retain
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Compliance finding descriptions</li>
                    <li>• Severity levels and categories</li>
                    <li>• File names (not contents)</li>
                    <li>• Line numbers where issues found</li>
                    <li>• Scan timestamps and metadata</li>
                    <li>• Generic remediation recommendations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Retention Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-amber-900">Source Code:</strong>
                    <span className="text-amber-800 ml-2">0 seconds - Never stored, immediately discarded</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-amber-900">Processing Memory:</strong>
                    <span className="text-amber-800 ml-2">5-30 seconds - Cleared after analysis completion</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-amber-900">Scan Results:</strong>
                    <span className="text-amber-800 ml-2">Retained for your access - Can be deleted anytime</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-amber-900">Account Data:</strong>
                    <span className="text-amber-800 ml-2">Until account deletion - Full control provided</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Technical Security Measures</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-3">Infrastructure</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• AWS SOC 2 Type II compliant infrastructure</li>
                  <li>• Multi-region redundancy</li>
                  <li>• DDoS protection and WAF</li>
                  <li>• Network segmentation</li>
                  <li>• VPC isolation</li>
                </ul>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-3">Access Control</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Zero-trust architecture</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Role-based access control</li>
                  <li>• Principle of least privilege</li>
                  <li>• Regular access reviews</li>
                </ul>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-3">Monitoring</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 24/7 security monitoring</li>
                  <li>• Automated threat detection</li>
                  <li>• Audit logging and SIEM</li>
                  <li>• Incident response procedures</li>
                  <li>• Regular penetration testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Compliance & Certifications</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <div className="font-bold text-indigo-900 text-lg">SOC 2</div>
                <div className="text-xs text-indigo-600">Type II Compliant</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <div className="font-bold text-indigo-900 text-lg">GDPR</div>
                <div className="text-xs text-indigo-600">Privacy Compliant</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <div className="font-bold text-indigo-900 text-lg">HIPAA</div>
                <div className="text-xs text-indigo-600">Security Standards</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <div className="font-bold text-indigo-900 text-lg">ISO 27001</div>
                <div className="text-xs text-indigo-600">Information Security</div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              Our security practices are regularly audited by third-party security firms. 
              We maintain compliance with industry standards and undergo annual penetration 
              testing and security assessments.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights & Controls</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-blue-900 mb-3">Data Rights</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Right to access your data</li>
                    <li>• Right to delete your data</li>
                    <li>• Right to data portability</li>
                    <li>• Right to rectification</li>
                    <li>• Right to restrict processing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-blue-900 mb-3">Contact Options</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Email: privacy@auroscan.com</li>
                    <li>• Data Protection Officer available</li>
                    <li>• 24-hour response commitment</li>
                    <li>• Secure deletion within 48 hours</li>
                    <li>• Compliance team support</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Important Security Recommendation</h3>
                  <p className="text-sm text-red-800 leading-relaxed mb-4">
                    While we guarantee the security of your code during analysis, we strongly recommend 
                    following these best practices before scanning:
                  </p>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li>• Remove any hardcoded API keys, passwords, or secrets</li>
                    <li>• Avoid including production database credentials</li>
                    <li>• Consider using test/development code for initial scans</li>
                    <li>• Review code for any sensitive business logic you prefer to keep private</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};