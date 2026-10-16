/**
 * FINANCIAL IMMUNE SYSTEM - TECHNICAL IDENTIFIER COMPONENT
 * Section 11: Typography - Technical Identifiers
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface TechnicalIdProps {
  id: string;
  type?: string;
  copyable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TechnicalId: React.FC<TechnicalIdProps> = ({
  id,
  type,
  copyable = true,
  clickable = false,
  onClick,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 font-mono text-xs text-blue-300 font-medium ${
        clickable ? 'cursor-pointer hover:border-blue-500 hover:text-blue-200 transition-colors' : ''
      } ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {type && <span className="text-[10px] text-slate-500 uppercase">{type}:</span>}
      <span className="truncate max-w-[200px]" title={id}>{id}</span>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          title="Copy ID"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
};
