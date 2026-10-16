/**
 * FINANCIAL IMMUNE SYSTEM - UNIVERSAL STATUS LANGUAGE
 * Section 12: Design System - Status Language
 * Aligned with Reference Image Panels 2, 3, 4, 7, 10
 */

import { SystemSemanticStatus } from '../types/domain';

export interface StatusMeta {
  code: SystemSemanticStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  glowColor: string;
  description: string;
}

export const SYSTEM_STATUS_MAP: Record<SystemSemanticStatus, StatusMeta> = {
  STABLE: {
    code: 'STABLE',
    label: 'STABLE',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    description: 'Systemic equilibrium maintained. Control margin within acceptable range (91/100).'
  },
  COMPROMISED: {
    code: 'COMPROMISED',
    label: 'COMPROMISED',
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-400 font-bold',
    badgeBorder: 'border-red-500/80',
    dotColor: 'bg-red-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    description: 'Critical dependency or information provider corrupted by external shock.'
  },
  DEGRADING: {
    code: 'DEGRADING',
    label: 'DEGRADING',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/40',
    dotColor: 'bg-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    description: 'Control margin experiencing continuous erosion. Intervention window narrowing.'
  },
  CRITICAL: {
    code: 'CRITICAL',
    label: 'CRITICAL',
    badgeBg: 'bg-red-950/70',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/50',
    dotColor: 'bg-red-500',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    description: 'Immediate systemic breach. Control margin below critical threshold (<40).'
  },
  COLLAPSING: {
    code: 'COLLAPSING',
    label: 'COLLAPSING',
    badgeBg: 'bg-purple-950/70',
    badgeText: 'text-purple-400',
    badgeBorder: 'border-purple-500/50',
    dotColor: 'bg-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    description: 'Multi-node cascade underway. Self-propagating systemic feedback loop.'
  },
  RECOVERING: {
    code: 'RECOVERING',
    label: 'RECOVERING',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/40',
    dotColor: 'bg-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    description: 'Intervention dispatched. Positive control margin recovery trajectory observed.'
  },
  RESTORED: {
    code: 'RESTORED',
    label: 'RESTORED',
    badgeBg: 'bg-sky-950/60',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/40',
    dotColor: 'bg-sky-400',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    description: 'Post-intervention stabilization verified across systemic channels.'
  },
  UNVERIFIED: {
    code: 'UNVERIFIED',
    label: 'UNVERIFIED',
    badgeBg: 'bg-zinc-900/70',
    badgeText: 'text-zinc-400',
    badgeBorder: 'border-zinc-700/50',
    dotColor: 'bg-zinc-400',
    glowColor: 'rgba(113, 113, 122, 0.2)',
    description: 'Intervention executed but awaiting empirical telemetry observation.'
  },
  CONFLICTED: {
    code: 'CONFLICTED',
    label: 'CONFLICTED',
    badgeBg: 'bg-orange-950/60',
    badgeText: 'text-orange-400',
    badgeBorder: 'border-orange-500/40',
    dotColor: 'bg-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.25)',
    description: 'Contradictory telemetry signals or dual-oracle price dispersion detected.'
  },
  OBSERVATION_GAP: {
    code: 'OBSERVATION_GAP',
    label: 'OBSERVATION GAP',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/40',
    dotColor: 'bg-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    description: 'Blind spot in systemic telemetry coverage or delayed counterparty reporting.'
  },
  RESIDUAL_RISK: {
    code: 'RESIDUAL_RISK',
    label: 'RESIDUAL RISK',
    badgeBg: 'bg-yellow-950/60',
    badgeText: 'text-yellow-400',
    badgeBorder: 'border-yellow-500/40',
    dotColor: 'bg-yellow-400',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    description: 'Primary threat halted; secondary latent propagation pathways detected.'
  }
};
