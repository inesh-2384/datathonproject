/**
 * FINANCIAL IMMUNE SYSTEM - CAPABILITY MATURITY REGISTRY
 * Aligned with Reference Image Panel 12 Component Status Legend:
 * - Implemented (Green)
 * - IBM Integrated (Blue)
 * - Simulated (Cyan)
 * - Architected (Yellow)
 * - Future (Gray)
 * 
 * Strict Data Truth Principle:
 * "No UI element may imply a capability that does not exist."
 */

export type CapabilityMaturity = 
  | 'IMPLEMENTED'
  | 'IBM_INTEGRATED'
  | 'SIMULATED'
  | 'ARCHITECTED'
  | 'FUTURE';

export interface CapabilityLabelMeta {
  code: CapabilityMaturity;
  label: string;
  badgeClass: string;
  dotColor: string;
  tooltip: string;
}

export const CAPABILITY_MATURITY_MAP: Record<CapabilityMaturity, CapabilityLabelMeta> = {
  IMPLEMENTED: {
    code: 'IMPLEMENTED',
    label: 'IMPLEMENTED',
    badgeClass: 'bg-emerald-950/70 text-emerald-400 border-emerald-600/50',
    dotColor: '#10b981',
    tooltip: 'Functional code running in Phase 1 with active state and real transitions.'
  },
  IBM_INTEGRATED: {
    code: 'IBM_INTEGRATED',
    label: 'IBM-INTEGRATED',
    badgeClass: 'bg-blue-950/70 text-blue-400 border-blue-600/50',
    dotColor: '#3b82f6',
    tooltip: 'Hardware-enforced execution via IBM Z / LinuxONE confidential computing enclaves (Phase 3).'
  },
  SIMULATED: {
    code: 'SIMULATED',
    label: 'SIMULATED',
    badgeClass: 'bg-cyan-950/70 text-cyan-400 border-cyan-600/50',
    dotColor: '#06b6d4',
    tooltip: 'Deterministic mathematical model executing reproducible pseudo-random scenario.'
  },
  ARCHITECTED: {
    code: 'ARCHITECTED',
    label: 'ARCHITECTED',
    badgeClass: 'bg-amber-950/70 text-amber-400 border-amber-600/50',
    dotColor: '#f59e0b',
    tooltip: 'Domain contracts, schemas, state transitions, and extension points defined for Phase 2/3.'
  },
  FUTURE: {
    code: 'FUTURE',
    label: 'FUTURE',
    badgeClass: 'bg-slate-900/80 text-slate-400 border-slate-700/50',
    dotColor: '#64748b',
    tooltip: 'Long-term systemic resilience research and production deployment.'
  }
};
