import React, { useState } from 'react';
import { Shield, FileText, Mail, ExternalLink } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';

export const Footer: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">GuardPHI</h3>
                <p className="text-sm text-slate-600">HIPAA Compliance Scanner</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Automated HIPAA compliance scanning for healthcare applications. 
              Your code is secure, private, and never stored.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-bold">Zero Storage • Encrypted • Private</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Security</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Security Guarantee
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  SOC 2 Report
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="mailto:support@guardphi.com" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  support@guardphi.com
                </a>
              </li>
              <li>
                <a href="mailto:privacy@guardphi.com" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  privacy@guardphi.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Status Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2024 GuardPHI. All rights reserved. Built with security and privacy by design.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>🔒 SOC 2 Compliant</span>
            <span>🛡️ GDPR Ready</span>
            <span>⚡ Zero Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};