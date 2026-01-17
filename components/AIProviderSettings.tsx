import React, { useState, useEffect } from 'react';
import { Settings, Zap, Brain, Loader2 } from 'lucide-react';
import { AIProvider, getSelectedProvider, setSelectedProvider } from '../services/aiProviderService';
import { useAuth } from '../services/AuthContext';

interface AIProviderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelected] = useState<AIProvider>('bedrock');
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadProvider();
    }
  }, [isOpen, isAuthenticated]);

  const loadProvider = async () => {
    const provider = await getSelectedProvider();
    setSelected(provider);
  };

  const handleProviderChange = async (provider: AIProvider) => {
    setSelected(provider);
    setIsSaving(true);
    try {
      await setSelectedProvider(provider);
    } catch (error) {
      console.error('Failed to save provider:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900">AI Model Settings</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-6">
            Choose which AI model to use for HIPAA compliance analysis:
          </p>

          {/* Bedrock Option */}
          <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
            style={{
              borderColor: selectedProvider === 'bedrock' ? '#10b981' : '#e2e8f0',
              backgroundColor: selectedProvider === 'bedrock' ? '#f0fdf4' : '#f8fafc',
              opacity: isSaving ? 0.6 : 1
            }}>
            <input
              type="radio"
              name="provider"
              value="bedrock"
              checked={selectedProvider === 'bedrock'}
              onChange={() => handleProviderChange('bedrock')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">AWS Bedrock (Claude 3.5 Sonnet)</h3>
              </div>
              <p className="text-sm text-slate-600">
                Server-side analysis with AWS credentials. Recommended for production use.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Server-side</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Secure</span>
              </div>
            </div>
          </label>

          {/* Gemini Option */}
          <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
            style={{
              borderColor: selectedProvider === 'gemini' ? '#10b981' : '#e2e8f0',
              backgroundColor: selectedProvider === 'gemini' ? '#f0fdf4' : '#f8fafc',
              opacity: isSaving ? 0.6 : 1
            }}>
            <input
              type="radio"
              name="provider"
              value="gemini"
              checked={selectedProvider === 'gemini'}
              onChange={() => handleProviderChange('gemini')}
              disabled={isSaving}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-slate-900">Google Gemini 3</h3>
              </div>
              <p className="text-sm text-slate-600">
                Client-side analysis using Gemini API. Requires GEMINI_API_KEY environment variable.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Client-side</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Fast</span>
              </div>
            </div>
          </label>

          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving preference...
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
