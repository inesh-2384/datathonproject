/**
 * FINANCIAL IMMUNE SYSTEM - CAPABILITY MATURITY TAG
 * Section 22: Data Truth Principle
 * Explicitly marks maturity level of features.
 */

import React from 'react';
import { CapabilityMaturity, CAPABILITY_MATURITY_MAP } from '@shared/constants/capabilities';

interface CapabilityTagProps {
  maturity: CapabilityMaturity;
  className?: string;
}

export const CapabilityTag: React.FC<CapabilityTagProps> = ({ maturity, className = '' }) => {
  const meta = CAPABILITY_MATURITY_MAP[maturity] || CAPABILITY_MATURITY_MAP.ARCHITECTED;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${meta.badgeClass} ${className}`}
      title={meta.tooltip}
    >
      {meta.label}
    </span>
  );
};
