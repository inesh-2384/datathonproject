/**
 * FINANCIAL IMMUNE SYSTEM - UNIVERSAL STATUS BADGE
 * Section 12: Universal Semantic Status System
 */

import React from 'react';
import { SystemSemanticStatus } from '@shared/types/domain';
import { SYSTEM_STATUS_MAP } from '@shared/constants/status';

interface StatusBadgeProps {
  status: SystemSemanticStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = true,
  className = ''
}) => {
  const meta = SYSTEM_STATUS_MAP[status] || SYSTEM_STATUS_MAP.STABLE;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider font-mono font-medium',
    md: 'text-xs px-2.5 py-1 tracking-wider font-mono font-medium',
    lg: 'text-sm px-3 py-1.5 tracking-wider font-mono font-semibold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${sizeClasses[size]} ${className}`}
      title={meta.description}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {showPulse && (status === 'DEGRADING' || status === 'CRITICAL' || status === 'COLLAPSING') && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${meta.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${meta.dotColor} ${dotSizes[size]}`} />
      </span>
      <span>{meta.label}</span>
    </span>
  );
};
