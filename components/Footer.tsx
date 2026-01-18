import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-emerald-600 font-semibold hover:underline"
        >
          ← Back
        </button>
        <div className="prose prose-sm max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing and using AuroScan, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-600 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on AuroScan for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on AuroScan</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
            <p className="text-slate-600 mb-4">
              The materials on AuroScan are provided on an 'as is' basis. AuroScan makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Limitations</h2>
            <p className="text-slate-600 mb-4">
              In no event shall AuroScan or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AuroScan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-slate-600 mb-4">
              The materials appearing on AuroScan could include technical, typographical, or photographic errors. AuroScan does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Links</h2>
            <p className="text-slate-600 mb-4">
              AuroScan has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AuroScan of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Modifications</h2>
            <p className="text-slate-600 mb-4">
              AuroScan may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which AuroScan operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Contact Information</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at support@auroscan.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const Footer: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />;
  }

  if (showTermsOfService) {
    return <TermsOfService onBack={() => setShowTermsOfService(false)} />;
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Legal Section */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-emerald-600 transition-colors font-medium"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowTermsOfService(true)}
                  className="hover:text-emerald-600 transition-colors font-medium"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Get in Touch</h4>
            <a 
              href="mailto:support@auroscan.com" 
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@auroscan.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2024 AuroScan. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>🔒 Secure</span>
            <span>🛡️ Private</span>
            <span>⚡ Fast</span>
          </div>
        </div>
      </div>
    </footer>
  );
};