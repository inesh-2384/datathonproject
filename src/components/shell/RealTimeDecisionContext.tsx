/**
 * FINANCIAL IMMUNE SYSTEM - REAL-TIME CONTROL INTELLIGENCE CONTEXT LAYER
 * 
 * Theme: "REAL-TIME AI FOR CRITICAL DECISIONS"
 * Primary Contextual Label: REAL-TIME CONTROL INTELLIGENCE
 * Supporting Descriptor: LIVE SYSTEM STATE • EVENT-DRIVEN • CONTINUOUSLY REASSESSED
 * 
 * Demonstrates the 7-Phase Closed-Loop Operational Chain:
 * REAL-TIME DATA (01)
 *       ↓
 * AI / ML INTERPRETATION (02)
 *       ↓
 * SYSTEMIC CONTROL ASSESSMENT (03)
 *       ↓
 * CRITICAL DECISION (04)
 *       ↓
 * GOVERNED ACTION (05)
 *       ↓
 * INDEPENDENT VERIFICATION (06) [EXECUTION ≠ RECOVERY]
 *       ↓
 * CONTINUOUS REASSESSMENT (07)
 * 
 * Strictly derived from authoritative system state (no parallel state, no extra polling).
 */

import React, { useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { 
  Radio, 
  Cpu, 
  Sliders, 
  AlertTriangle, 
  Zap, 
  FileCheck2, 
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight
} from 'lucide-react';

export const RealTimeDecisionContext: React.FC = () => {
  const currentRouteId = useSystemStore(state => state.currentRouteId);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const controlState = useSystemStore(state => state.controlState);
  const authoritativeEvents = useSystemStore(state => state.authoritativeEvents);
  const foundryState = useSystemStore(state => state.foundryState);
  const inspectEvent = useSystemStore(state => state.inspectEvent);

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Authoritative State Derivations
  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const latestExec = foundryState?.latest_execution || null;
  const latestVerif = foundryState?.latest_verification || null;
  const crp = latestVerif?.restoration_assessment || null;
  const authorizedAudit = foundryState?.audit_trail?.find(a => a.event_type === 'AUTHORIZATION_GRANTED');

  const isResidual = controlState.overall_status === 'RESIDUAL_RISK' || 
    controlState.controllability_state === 'CONTROL_NOT_RESTORED' || 
    crp?.restoration_state === 'CONTROL_NOT_RESTORED' ||
    latestVerif?.verification_result === 'VERIFIED_FAILED';

  const isRestored = !isAttack && (
    (controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90) ||
    crp?.restoration_state === 'VERIFIED_RESTORATION' ||
    latestVerif?.verification_result === 'VERIFIED_EFFECTIVE'
  );

  const margin = controlState.control_margin_percent;
  const synchrony = controlState.key_metrics?.decision_synchrony_pct ?? (isAttack ? 73 : 18);
  const edd = controlState.effective_decision_diversity ?? (isAttack ? 0.15 : 0.61);
  const windowSec = controlState.intervention_window_seconds ?? 41;

  // Active Phase Identification
  const getActivePhaseIndex = (): number => {
    if (isRestored) return 6; // 07 Continuous Reassessment
    if (isResidual) return 5; // 06 Verification Failed / Residual Reassessment
    if (latestVerif) return 5; // 06 Independent Verification
    if (latestExec) return 5; // 06 Awaiting Verification
    if (authorizedAudit) return 4; // 05 Governed Action
    if (isAttack) {
      if (currentRouteId === 'control-foundry') return 3; // 04 Critical Decision
      if (currentRouteId === 'control-margin') return 2; // 03 Systemic Assessment
      if (currentRouteId === 'collective-intelligence') return 1; // 02 AI/ML Interpretation
      return 0; // 01 Real-Time Data
    }
    return 0;
  };

  const activePhase = getActivePhaseIndex();

  // 7 Phases Definition
  const decisionPhases = [
    {
      id: 'event-detection',
      step: '01',
      title: 'REAL-TIME DATA',
      icon: <Radio className="w-3.5 h-3.5 text-cyan-400" />,
      metric: isAttack ? 'DATA-X Latency +52ms' : isResidual ? 'DATA-X Isolated (Quorum)' : isRestored ? 'Sovereign Quorum (1.4ms)' : '102 Feeds Synchronized',
      detail: isAttack ? 'Rates Oracle payload corruption' : isResidual ? 'Primary severed; fallback active' : isRestored ? 'Consensus quorum 100% healthy' : 'Sub-2ms nominal feed latency',
      status: isAttack ? 'SHOCK DETECTED' : isResidual ? 'ISOLATED' : isRestored ? 'SYNCHRONIZED' : 'NOMINAL',
      statusColor: isAttack ? 'text-red-400 border-red-800 bg-red-950/60' : isResidual ? 'text-cyan-400 border-cyan-800 bg-cyan-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : 'text-slate-400 border-slate-700 bg-slate-900/60',
      action: () => inspectEvent()
    },
    {
      id: 'collective-intelligence',
      step: '02',
      title: 'AI/ML INTERPRETATION',
      icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
      metric: isAttack ? `Coupling S(t)=${synchrony}%` : isResidual ? 'MODEL-C Latent Vector' : isRestored ? `Decoupled (EDD=${edd})` : `Model Diversity E(t)=${edd}`,
      detail: isAttack ? `Decision diversity collapsed: EDD=${edd}` : isResidual ? 'Unpurged swap drift on ASSET-17' : isRestored ? 'Cross-model correlation baseline 18%' : 'Independent models nominal',
      status: isAttack ? 'HERD CONVERGENCE' : isResidual ? 'LATENT CONTAGION' : isRestored ? 'DIVERSIFIED' : 'DISTRIBUTED',
      statusColor: isAttack ? 'text-rose-400 border-rose-800 bg-rose-950/60' : isResidual ? 'text-rose-400 border-rose-800 bg-rose-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : 'text-slate-400 border-slate-700 bg-slate-900/60',
      action: () => setCurrentRoute('collective-intelligence')
    },
    {
      id: 'control-margin',
      step: '03',
      title: 'SYSTEMIC ASSESSMENT',
      icon: <Sliders className="w-3.5 h-3.5 text-amber-400" />,
      metric: isAttack ? `Margin Collapse: 91% → ${margin}%` : isResidual ? `Stalled Margin: ${margin}%` : isRestored ? `Restored Margin: ${margin}%` : `Control Margin: ${margin}%`,
      detail: isAttack ? `Horizon: ${windowSec}s to unrecoverable breach` : isResidual ? 'Sub-80% threshold blocks restoration' : isRestored ? 'Resilience buffer rebuilt > 80%' : 'Optimal resilience capacity reserve',
      status: isAttack ? 'CRITICAL DEPLETION' : isResidual ? 'BELOW THRESHOLD' : isRestored ? 'RESILIENT' : 'OPTIMAL',
      statusColor: isAttack ? 'text-red-400 border-red-800 bg-red-950/60' : isResidual ? 'text-amber-400 border-amber-800 bg-amber-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      action: () => setCurrentRoute('control-margin')
    },
    {
      id: 'control-foundry',
      step: '04',
      title: 'CRITICAL DECISION',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
      metric: isAttack ? 'INTERVENTION REQUIRED' : isResidual ? 'ESCALATION MANDATED' : isRestored ? 'REMEDIATION ACHIEVED' : 'NOMINAL SURVEILLANCE',
      detail: isAttack ? 'Candidate: CAND-RN-2026-0041 synthesized' : isResidual ? 'Candidate: CAND-INT-02 synthesized' : isRestored ? 'Target resilience reached; 0 hazards' : 'No countermeasure threshold exceeded',
      status: isAttack ? 'ACTION MANDATED' : isResidual ? 'SECOND ACTION' : isRestored ? 'STANDBY' : 'PASSIVE',
      statusColor: isAttack ? 'text-amber-300 border-amber-700 bg-amber-950/60' : isResidual ? 'text-amber-300 border-amber-700 bg-amber-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : 'text-slate-400 border-slate-700 bg-slate-900/60',
      action: () => setCurrentRoute('control-foundry')
    },
    {
      id: 'execution',
      step: '05',
      title: 'GOVERNED ACTION',
      icon: <Zap className="w-3.5 h-3.5 text-blue-400" />,
      metric: latestExec ? `Dispatched: HTTP 200 OK` : authorizedAudit ? 'Dual-Key Authorized' : isAttack ? 'Awaiting Authorization' : isRestored ? 'Actions Dispatched' : 'Dual-Key Armed',
      detail: latestExec ? `Signed by ${authorizedAudit?.actor_role || 'INCIDENT_COMMANDER'}` : authorizedAudit ? 'Cryptographic signature verified' : isAttack ? 'Enforces Commander + Risk Officer quorum' : isRestored ? 'INT-01 + INT-02 chained & sealed' : 'Zero unauthenticated state mutators',
      status: latestExec ? 'DISPATCHED' : authorizedAudit ? 'AUTHORIZED' : isAttack ? 'GATE LOCKED' : isRestored ? 'COMPLETED' : 'ARMED',
      statusColor: latestExec ? 'text-cyan-400 border-cyan-800 bg-cyan-950/60' : authorizedAudit ? 'text-purple-400 border-purple-800 bg-purple-950/60' : isAttack ? 'text-amber-400 border-amber-800 bg-amber-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : 'text-slate-400 border-slate-700 bg-slate-900/60',
      action: () => setCurrentRoute('execution')
    },
    {
      id: 'verification',
      step: '06',
      title: 'INDEPENDENT VERIFICATION',
      icon: <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />,
      metric: isResidual ? 'CONTROL NOT RESTORED (42%)' : isRestored ? `VERIFIED RESTORATION (${margin}%)` : latestExec ? 'EXECUTION ≠ RECOVERY' : isAttack ? 'Verifier Armed' : 'Attestation Verified',
      detail: isResidual ? 'EXECUTION ≠ RECOVERY: MODEL-C Contagion' : isRestored ? 'Enclave verified 0 residual vectors' : latestExec ? 'Auditing post-action telemetry' : isAttack ? 'Awaiting post-dispatch telemetry' : 'Continuous CPACF SHA-256 seal',
      status: isResidual ? 'VERIFICATION FAILED' : isRestored ? 'VERIFIED EFFECTIVE' : latestExec ? 'UNVERIFIED' : isAttack ? 'ARMED' : 'VERIFIED STABLE',
      statusColor: isResidual ? 'text-red-400 border-red-800 bg-red-950/60' : isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : latestExec ? 'text-amber-400 border-amber-800 bg-amber-950/60' : 'text-slate-400 border-slate-700 bg-slate-900/60',
      action: () => setCurrentRoute('verification')
    },
    {
      id: 'reassessment',
      step: '07',
      title: 'CONTINUOUS REASSESSMENT',
      icon: <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />,
      metric: isRestored ? 'System State: STABILIZED' : isResidual ? 'Reassessing Latent Drift' : isAttack ? 'Horizon Tracking Active' : 'Closed Loop Active',
      detail: isRestored ? `Reassessment confirms M(t)=${margin}% sustained` : isResidual ? 'Closed loop mandates Second Intervention' : isAttack ? '100ms state updates track cascade velocity' : 'Deterministic monitoring across 102 channels',
      status: isRestored ? 'STABLE' : isResidual ? 'REASSESSING' : isAttack ? 'TRACKING' : 'ACTIVE',
      statusColor: isRestored ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : isResidual ? 'text-purple-400 border-purple-800 bg-purple-950/60' : isAttack ? 'text-amber-400 border-amber-800 bg-amber-950/60' : 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      action: () => setCurrentRoute('reassessment')
    }
  ];

  return (
    <div className="border-t border-[#15233c] pt-1.5 space-y-1.5">
      {/* Context Layer Banner Header */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isResidual ? 'bg-amber-400' : isAttack ? 'bg-red-400' : isRestored ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isResidual ? 'bg-amber-500' : isAttack ? 'bg-red-500' : isRestored ? 'bg-emerald-500' : 'bg-blue-500'
              }`} />
            </span>
            <span className="text-white font-bold tracking-wider text-[11px]">REAL-TIME CONTROL INTELLIGENCE</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <span className="text-slate-400 text-[10px] tracking-wide hidden md:inline">
            LIVE SYSTEM STATE • EVENT-DRIVEN • CONTINUOUSLY REASSESSED
          </span>
        </div>

        {/* Current State Pill + Expand/Collapse Button */}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isResidual
              ? 'bg-rose-950/70 border-rose-800 text-rose-300'
              : isAttack
              ? 'bg-red-950/70 border-red-800 text-red-300 animate-pulse'
              : isRestored
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              : 'bg-[#0d172c] border-[#1d2f50] text-slate-300'
          }`}>
            {isResidual ? (
              <span>LATENT CONTAGION • REASSESSMENT MANDATED</span>
            ) : isAttack ? (
              <span>CRITICAL DECISION THRESHOLD EXCEEDED</span>
            ) : isRestored ? (
              <span>CONTROL VERIFIED RESTORED • REASSESSED STABLE</span>
            ) : (
              <span>NOMINAL EQUILIBRIUM • SURVEILLANCE ACTIVE</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0b1324] hover:bg-[#121f3a] border border-[#1b2b48] text-slate-300 hover:text-white text-[10px] font-mono transition-colors"
            title={isExpanded ? 'Collapse Decision Chain' : 'Expand Decision Chain'}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'MINIMIZE' : 'EXPAND CHAIN'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded 7-Phase Causal Operational Chain */}
      {isExpanded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-1.5 text-xs font-mono">
          {decisionPhases.map((phase, idx) => {
            const isCurrentView = currentRouteId === phase.id;
            const isPhaseActive = activePhase === idx;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={phase.action}
                className={`p-2 rounded text-left transition-all relative flex flex-col justify-between ${
                  isCurrentView
                    ? 'bg-[#0f1d38] border-2 border-blue-500 shadow-md shadow-blue-500/20'
                    : isPhaseActive
                    ? 'bg-[#0a1428] border border-blue-400/80 shadow-sm shadow-blue-500/10 hover:border-blue-400'
                    : 'bg-[#070d1a] border border-[#142036] hover:border-[#203456] hover:bg-[#0a1224]'
                }`}
                title={`Navigate to Module ${phase.step}: ${phase.title}`}
              >
                {/* Header: Step number, icon, title */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1">
                      {phase.icon}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{phase.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold">{phase.step}</span>
                  </div>

                  {/* Primary Metric / Value */}
                  <div className="text-white font-bold text-[11px] truncate" title={phase.metric}>
                    {phase.metric}
                  </div>

                  {/* Contextual Technical Detail */}
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2" title={phase.detail}>
                    {phase.detail}
                  </div>
                </div>

                {/* Footer: Semantic Status Badge */}
                <div className="mt-1.5 pt-1 border-t border-[#132038] flex items-center justify-between">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${phase.statusColor}`}>
                    {phase.status}
                  </span>

                  {idx < decisionPhases.length - 1 && (
                    <span className="text-slate-600 text-[10px] hidden xl:inline">→</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Collapsed Single-Line Summary Ribbon */
        <div className="flex flex-wrap items-center gap-1.5 py-0.5 text-[10px] font-mono text-slate-400">
          {decisionPhases.map((phase, idx) => (
            <React.Fragment key={phase.id}>
              <button
                type="button"
                onClick={phase.action}
                className="hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#070d1a] border border-[#142036] hover:border-blue-500 transition-colors"
                title={`${phase.title}: ${phase.metric}`}
              >
                <span className="text-[8px] text-slate-500 font-bold">{phase.step}</span>
                <span className="font-semibold text-slate-300">{phase.title}:</span>
                <span className="text-cyan-300 font-bold truncate max-w-[130px]">{phase.metric}</span>
              </button>
              {idx < decisionPhases.length - 1 && (
                <span className="text-slate-700">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealTimeDecisionContext;
