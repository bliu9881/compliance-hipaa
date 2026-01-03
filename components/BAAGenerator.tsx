import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Save, 
  Calendar,
  Building,
  Users,
  Shield,
  Cloud,
  Brain,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { baaService, BAAGenerationOptions, GeneratedBAA } from '../services/baaService';

interface BAAGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BAAGenerator: React.FC<BAAGeneratorProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'preview' | 'generated'>('form');
  const [loading, setLoading] = useState(false);
  const [generatedBAA, setGeneratedBAA] = useState<GeneratedBAA | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard-2024');
  
  const [formData, setFormData] = useState<BAAGenerationOptions>({
    coveredEntityName: '',
    businessAssociateName: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    servicesDescription: '',
    includeSubcontractors: true,
    includeCloudServices: false,
    includeAIProcessing: false,
    customClauses: []
  });

  const templates = baaService.getTemplates();

  const handleInputChange = (field: keyof BAAGenerationOptions, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.coveredEntityName || !formData.businessAssociateName || !formData.servicesDescription) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const baa = await baaService.generateBAA(formData, selectedTemplate);
      setGeneratedBAA(baa);
      setStep('generated');
    } catch (error) {
      console.error('Failed to generate BAA:', error);
      alert('Failed to generate BAA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (generatedBAA) {
      await baaService.saveBAA(generatedBAA);
      alert('BAA saved successfully!');
    }
  };

  const handleDownload = () => {
    if (generatedBAA) {
      baaService.downloadBAA(generatedBAA);
    }
  };

  const handleClose = () => {
    setStep('form');
    setGeneratedBAA(null);
    setFormData({
      coveredEntityName: '',
      businessAssociateName: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      servicesDescription: '',
      includeSubcontractors: true,
      includeCloudServices: false,
      includeAIProcessing: false,
      customClauses: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Generate Business Associate Agreement</h2>
              <p className="text-sm text-slate-500">Create HIPAA-compliant BAA documents</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'form' && (
            <div className="p-6 space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">BAA Template</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        selectedTemplate === template.id 
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {template.id.includes('cloud') && <Cloud className="w-4 h-4 text-blue-500" />}
                        {template.id.includes('ai') && <Brain className="w-4 h-4 text-purple-500" />}
                        {template.id.includes('standard') && <Shield className="w-4 h-4 text-emerald-500" />}
                        <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Covered Entity Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.coveredEntityName}
                      onChange={(e) => handleInputChange('coveredEntityName', e.target.value)}
                      placeholder="Your Healthcare Organization"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Business Associate Name *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.businessAssociateName}
                      onChange={(e) => handleInputChange('businessAssociateName', e.target.value)}
                      placeholder="Service Provider Company"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Effective Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Services Description *
                </label>
                <textarea
                  value={formData.servicesDescription}
                  onChange={(e) => handleInputChange('servicesDescription', e.target.value)}
                  placeholder="Describe the services that will involve PHI processing..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900">Additional Provisions</h4>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeSubcontractors}
                    onChange={(e) => handleInputChange('includeSubcontractors', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Include subcontractor provisions</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeCloudServices}
                    onChange={(e) => handleInputChange('includeCloudServices', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Include cloud services provisions</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeAIProcessing}
                    onChange={(e) => handleInputChange('includeAIProcessing', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Include AI/ML processing provisions</span>
                </label>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate BAA
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'generated' && generatedBAA && (
            <div className="p-6 space-y-6">
              {/* Success Message */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-semibold text-emerald-900">BAA Generated Successfully</h4>
                  <p className="text-sm text-emerald-700">Your Business Associate Agreement is ready for review</p>
                </div>
              </div>

              {/* Document Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-900">Document Preview</h4>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                    {generatedBAA.content.substring(0, 2000)}...
                  </pre>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900">Legal Review Required</h4>
                  <p className="text-sm text-amber-700">This document is a template and should be reviewed by qualified legal counsel before execution. Ensure all provisions meet your specific requirements and applicable state laws.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Generate Another
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 border border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save BAA
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download BAA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};