/**
 * FINANCIAL IMMUNE SYSTEM - STANDARDIZED ENTERPRISE PANEL SURFACE
 * Section 3 & Section 7: Information Hierarchy & Structural Surfaces
 * 
 * Enforces Level 1 through 5 Hierarchy across all 16 workspaces:
 * LEVEL 1: Primary Operational State
 * LEVEL 2: Causal Context / Explanation
 * LEVEL 3: Supporting Evidence / Verification
 * LEVEL 4: Available Governed Action
 * LEVEL 5: Forensic Audit / Debug Telemetry
 */

import React, { ReactNode } from 'react';
import { CapabilityMaturity } from '@shared/constants/capabilities';
import { CapabilityTag } from './CapabilityTag';

export type HierarchyLevel = 1 | 2 | 3 | 4 | 5;

interface PanelSurfaceProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  level?: HierarchyLevel;
  moduleNumber?: string;
  maturity?: CapabilityMaturity;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const LEVEL_CONFIG: Record<HierarchyLevel, { label: string; badgeClass: string }> = {
  1: { label: 'L1 STATE', badgeClass: 'bg-blue-950 text-blue-400 border-blue-700/60' },
  2: { label: 'L2 CAUSAL', badgeClass: 'bg-purple-950 text-purple-400 border-purple-700/60' },
  3: { label: 'L3 EVIDENCE', badgeClass: 'bg-cyan-950 text-cyan-400 border-cyan-700/60' },
  4: { label: 'L4 ACTION', badgeClass: 'bg-amber-950 text-amber-400 border-amber-700/60' },
  5: { label: 'L5 AUDIT', badgeClass: 'bg-slate-900 text-slate-400 border-slate-700/60' }
};

export const PanelSurface: React.FC<PanelSurfaceProps> = ({
  title,
  subtitle,
  icon,
  level,
  moduleNumber,
  maturity,
  headerAction,
  children,
  footer,
  className = '',
  contentClassName = ''
}) => {
  return (
    <section className={`fis-panel flex flex-col justify-between overflow-hidden ${className}`}>
      {/* Panel Header */}
      <div className="p-3 sm:p-3.5 border-b border-[#15233c] bg-[#080e1c] flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-blue-400 shrink-0">{icon}</span>}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                {title}
              </h2>
              {moduleNumber && (
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  [{moduleNumber}]
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {maturity && <CapabilityTag maturity={maturity} />}
          {headerAction}
        </div>
      </div>

      {/* Panel Body */}
      <div className={`p-3 sm:p-4 flex-1 ${contentClassName}`}>
        {children}
      </div>

      {/* Optional Panel Footer */}
      {footer && (
        <div className="px-3.5 py-2 border-t border-[#15233c] bg-[#070c18] text-[10px] font-mono text-slate-500">
          {footer}
        </div>
      )}
    </section>
  );
};
