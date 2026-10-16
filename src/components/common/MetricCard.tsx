/**
 * FINANCIAL IMMUNE SYSTEM - STANDARDIZED METRIC CARD
 * Section 11: Typography & Numbers
 * Section 13: Reusable Components
 */

import React from 'react';
import { SystemSemanticStatus } from '@shared/types/domain';
import { StatusBadge } from './StatusBadge';
import { CapabilityTag } from './CapabilityTag';
import { CapabilityMaturity } from '@shared/constants/capabilities';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  status?: SystemSemanticStatus;
  maturity?: CapabilityMaturity;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  deltaDirection = 'neutral',
  status,
  maturity,
  subtitle,
  icon,
  className = ''
}) => {
  return (
    <div className={`fis-panel p-4 flex flex-col justify-between transition-all hover:border-blue-500/40 ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400 text-sm">{icon}</span>}
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400 font-medium">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {status && <StatusBadge status={status} size="sm" showPulse={false} />}
          {maturity && <CapabilityTag maturity={maturity} />}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-sm font-mono text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
        <span className="truncate">{subtitle || 'Live telemetry'}</span>
        {delta && (
          <span
            className={`font-mono text-[11px] font-semibold ${
              deltaDirection === 'down'
                ? 'text-amber-400'
                : deltaDirection === 'up'
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
