import React, { useState } from 'react';
import { Shield, Info } from 'lucide-react';
import { SecurityGuarantee } from './SecurityGuarantee';

interface SecurityBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ 
  variant = 'compact', 
  className = '' 
}) => {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-xs font-bold ${className}`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>How It Works</span>
        </button>
        
        <SecurityGuarantee
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAccept={() => setShowModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 mb-1">How We Handle Your Code</h4>
            <p className="text-sm text-blue-800 leading-relaxed mb-3">
              Your code is analyzed via HTTPS using AWS AI services. We store compliance findings, 
              not your source code content.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 underline flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              View Details & Best Practices
            </button>
          </div>
        </div>
      </div>
      
      <SecurityGuarantee
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAccept={() => setShowModal(false)}
      />
    </>
  );
};