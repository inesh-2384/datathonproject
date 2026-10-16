/**
 * FINANCIAL IMMUNE SYSTEM - CONTROL FOUNDRY WORKSPACE (PHASE 4)
 * Sections 41, 42, 43, 44, 45, 46, 47: Governed Operational Control, Independent Verification & Reassessment
 * 
 * Closed Loop Implementation:
 * SYSTEM STATE -> CONTROL CONDITION -> INTERVENTION WINDOW -> AVAILABLE CANDIDATES
 * -> COUNTERFACTUAL EVALUATION -> MINIMUM EFFECTIVE INTERVENTION -> POLICY CHECK
 * -> AUTHORIZATION -> GOVERNED EXECUTION -> INDEPENDENT VERIFICATION -> REASSESSMENT
 */

import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Terminal, 
  Lock, 
  Check, 
  XCircle, 
  RefreshCw,
  Layers,
  Cpu,
  FileCheck2,
  Server,
  Activity,
  History,
  AlertCircle
} from 'lucide-react';
import { InterventionCandidate, CounterfactualEvaluation } from '@shared/types/foundry';

export const ControlFoundryView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const currentRole = useSystemStore(state => state.currentRole);
  const setRole = useSystemStore(state => state.setRole);
  const foundryState = useSystemStore(state => state.foundryState);
  const activeScenarioId = useSystemStore(state => state.activeScenarioId);
  const selectedCandidateId = useSystemStore(state => state.selectedFoundryCandidateId);
  const setSelectedCandidateId = useSystemStore(state => state.setSelectedFoundryCandidateId);
  const governanceBlockNotice = useSystemStore(state => state.governanceBlockNotice);
  const clearGovernanceBlockNotice = useSystemStore(state => state.clearGovernanceBlockNotice);

  const fetchFoundryState = useSystemStore(state => state.fetchFoundryState);
  const evaluateFoundryCandidates = useSystemStore(state => state.evaluateFoundryCandidates);
  const requestFoundryAuthorization = useSystemStore(state => state.requestFoundryAuthorization);
  const authorizeFoundryCandidate = useSystemStore(state => state.authorizeFoundryCandidate);
  const executeFoundryCandidate = useSystemStore(state => state.executeFoundryCandidate);
  const rollbackFoundryCandidate = useSystemStore(state => state.rollbackFoundryCandidate);
  const reassessFoundry = useSystemStore(state => state.reassessFoundry);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const [isRequestingAuth, setIsRequestingAuth] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  
  // Demonstration test toggles
  const [forceTechnicalFailure, setForceTechnicalFailure] = useState(false);
  const [forceStaleEvidence, setForceStaleEvidence] = useState(false);
  const [forceConflictingTelemetry, setForceConflictingTelemetry] = useState(false);
  const [forceDownstreamContagion, setForceDownstreamContagion] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Fetch or refresh workspace state on load
  useEffect(() => {
    fetchFoundryState();
  }, [fetchFoundryState, controlState.control_margin_percent, activeScenarioId]);

  // Set default selected candidate to the recommended Minimum Effective Intervention
  useEffect(() => {
    if (foundryState?.candidates && foundryState.candidates.length > 0) {
      const exists = selectedCandidateId && foundryState.candidates.some(c => c.id === selectedCandidateId);
      if (!exists) {
        const recommended = foundryState.candidates.find(c => c.is_minimum_effective);
        if (recommended) {
          setSelectedCandidateId(recommended.id);
        } else {
          setSelectedCandidateId(foundryState.candidates[0].id);
        }
      }
    }
  }, [foundryState, selectedCandidateId, setSelectedCandidateId]);

  const rawCandidates = foundryState?.candidates || [];
  // Sort so Minimum Effective Intervention is always first, active alternatives next, and NO_ACTION baseline last
  const candidates = [...rawCandidates].sort((a, b) => {
    if (a.is_minimum_effective && !b.is_minimum_effective) return -1;
    if (!a.is_minimum_effective && b.is_minimum_effective) return 1;
    if (a.type === 'NO_ACTION' && b.type !== 'NO_ACTION') return 1;
    if (a.type !== 'NO_ACTION' && b.type === 'NO_ACTION') return -1;
    return 0;
  });
  const evaluations = foundryState?.evaluations || {};
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0] || null;
  const selectedEval: CounterfactualEvaluation | null = selectedCandidate ? (evaluations[selectedCandidate.id] || null) : null;
  const noActionCandidate = candidates.find(c => c.type === 'NO_ACTION') || null;
  const noActionEval = noActionCandidate ? evaluations[noActionCandidate.id] : null;

  const authDecision = foundryState?.authorization_history?.find(a => a.candidate_id === selectedCandidate?.id) || null;
  const isAuthorized = authDecision?.decision === 'AUTHORIZED' || selectedCandidate?.status === 'AUTHORIZED' || selectedCandidate?.status === 'EXECUTED';
  const isExecuted = selectedCandidate?.status === 'EXECUTED' || foundryState?.latest_execution?.candidate_id === selectedCandidate?.id;
  const verification = foundryState?.latest_verification;
  const observation = foundryState?.latest_observation;
  const reassessment = foundryState?.active_reassessment;
  const auditTrail = foundryState?.audit_trail || [];

  // Handle Request Auth Button
  const handleRequestAuth = async () => {
    if (!selectedCandidate) return;
    setIsRequestingAuth(true);
    setActionSuccessMsg(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await requestFoundryAuthorization(selectedCandidate.id);
      if (ok) {
        setActionSuccessMsg(`Authorization requested by [${currentRole}]. Submitted to incident governance queue.`);
      }
    } finally {
      setIsRequestingAuth(false);
    }
  };

  // Handle Authorize Button
  const handleAuthorize = async () => {
    if (!selectedCandidate) return;
    setIsAuthorizing(true);
    setActionSuccessMsg(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await authorizeFoundryCandidate(selectedCandidate.id, `Manual operations authorization granted by [${currentRole}].`);
      if (ok) {
        setActionSuccessMsg(`Authorization Granted by [${currentRole}] with tamper-evident SHA-256 seal.`);
      }
    } finally {
      setIsAuthorizing(false);
    }
  };

  // Handle Execute Button
  const handleExecute = async () => {
    if (!selectedCandidate) return;
    setIsExecuting(true);
    setActionSuccessMsg(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await executeFoundryCandidate(selectedCandidate.id, {
        forceFailure: forceTechnicalFailure,
        forceStaleEvidence: forceStaleEvidence,
        forceConflictingTelemetry: forceConflictingTelemetry,
        forceDownstreamContagion: forceDownstreamContagion
      });
      if (ok) {
        setActionSuccessMsg(`Intervention dispatched across target rails by [${currentRole}]. Independent verification telemetry updated.`);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle Rollback Button
  const handleRollback = async () => {
    if (!selectedCandidate) return;
    setIsRollingBack(true);
    setActionSuccessMsg(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await rollbackFoundryCandidate(selectedCandidate.id, `Operational rollback executed by [${currentRole}].`);
      if (ok) {
        setActionSuccessMsg(`Intervention rolled back. State deltas reverted to previous baseline.`);
      }
    } finally {
      setIsRollingBack(false);
    }
  };

  // Handle Reassessment Escalation
  const handleReassess = async () => {
    if (!reassessment?.escalated_candidate_id) return;
    await reassessFoundry(reassessment.escalated_candidate_id);
    if (reassessment.escalated_candidate_id !== 'NONE') {
      setSelectedCandidateId(reassessment.escalated_candidate_id);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050811] text-slate-100 font-sans">
      {/* 1. TOP HEADER BAR: CONTROL CONDITION & INTERVENTION WINDOW */}
      <div className="px-4 py-3 border-b border-[#162238] bg-[#090f1d]/90 shrink-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h1 className="text-base sm:text-lg font-bold tracking-tight font-mono text-white">
                08. CONTROL FOUNDRY
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300">
                Governed Control Enclave
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/60 text-purple-300">
                Role: {currentRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Closed Loop: Counterfactual Evaluation → Minimum Effective Intervention → Separation-of-Duties Authorization → Governed Execution → Independent Verification
            </p>
          </div>

          {/* Top Status Indicators */}
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            {/* Control Margin Status */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase">Control Margin:</span>
              <span className={`font-bold text-sm ${
                controlState.control_margin_percent >= 80 ? 'text-emerald-400' :
                controlState.control_margin_percent >= 45 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {controlState.control_margin_percent}%
              </span>
              <span className="text-[10px] text-slate-400">
                ({controlState.controllability_state || 'STABLE'})
              </span>
            </div>

            {/* Intervention Window Remaining */}
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded border ${
              (foundryState?.intervention_window?.remaining_seconds || 60) < 20 
                ? 'bg-red-950/40 border-red-800/60 text-red-300 animate-pulse'
                : 'bg-slate-900/90 border-slate-800 text-slate-300'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-slate-400 uppercase">Window:</span>
              <span className="font-bold text-xs">
                {foundryState?.intervention_window?.remaining_seconds || controlState.intervention_window_seconds || 60}s
              </span>
            </div>

            {/* Active Incident Tag */}
            <div className="px-2.5 py-1.5 rounded bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] text-slate-400 uppercase">Scope:</span>
              <span className="font-bold text-white text-xs truncate max-w-[130px]">
                {foundryState?.active_incident_id || 'SYSTEMIC_EQUILIBRIUM'}
              </span>
            </div>

            {/* Refresh / Re-evaluate */}
            <button
              onClick={() => evaluateFoundryCandidates()}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Re-evaluate Candidates"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="mt-2 px-3 py-1.5 bg-emerald-950/70 border border-emerald-600/60 rounded text-xs text-emerald-300 font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              {actionSuccessMsg}
            </span>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* 2. MAIN WORKSPACE: 3-COLUMN CONTROL DESK (NO CLIPPED INTERNAL SCROLLBARS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3.5 sm:px-5 sm:py-3.5">
        
        {/* COLUMN A: INTERVENTION CANDIDATES & CATALOGUE (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#162238] text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Intervention Candidates</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {candidates.length} synthesized (MEI ranked first)
            </span>
          </div>

          <div className="space-y-2 max-h-[395px] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const isSelected = cand.id === selectedCandidateId;
              const isNoAction = cand.type === 'NO_ACTION';

              return (
                <div
                  key={cand.id}
                  data-testid={`foundry-cand-${cand.id}`}
                  data-cand-type={cand.type}
                  data-is-mei={cand.is_minimum_effective ? 'true' : 'false'}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-2.5 rounded-lg border transition cursor-pointer text-left font-mono relative ${
                    isSelected 
                      ? 'bg-[#0f172a] border-blue-500 shadow-md shadow-blue-950/50 ring-1 ring-blue-500/40' 
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                      {cand.type}
                    </span>

                    {/* Minimum Effective Badge */}
                    {cand.is_minimum_effective && (
                      <div className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>MINIMUM EFFECTIVE</span>
                      </div>
                    )}

                    {isNoAction && (
                      <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">
                        BASELINE (NO ACTION)
                      </div>
                    )}
                  </div>
                  
                  <div className="font-bold text-white text-xs mb-0.5 line-clamp-1">
                    {cand.title}
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mb-1.5">
                    {cand.description}
                  </p>

                  {/* Quantitative Delta Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-800/80 text-[10px]">
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px]">Exp. Delta</span>
                      <span className={`font-bold ${cand.expected_control_margin_delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {cand.expected_control_margin_delta >= 0 ? `+${cand.expected_control_margin_delta}%` : `${cand.expected_control_margin_delta}%`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px]">Disruption</span>
                      <span className={`font-bold ${
                        cand.estimated_disruption === 'NONE' ? 'text-slate-400' :
                        cand.estimated_disruption === 'LOW' ? 'text-emerald-400' :
                        cand.estimated_disruption === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {cand.estimated_disruption}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px]">Reversibility</span>
                      <span className="font-bold text-cyan-300">
                        {cand.reversibility}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN B: COUNTERFACTUAL ASSESSMENT & IMPACT (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#162238] text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Counterfactual Projections</span>
            </div>
            <span className="text-[10px] text-slate-400">
              vs No Action Baseline
            </span>
          </div>

          <div className="fis-panel p-3.5 space-y-2.5 flex-1">
            {selectedCandidate && (
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase block">Selected Strategy</span>
                    <h3 className="text-xs sm:text-sm font-bold text-white font-mono">
                      {selectedCandidate.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border shrink-0 ${
                    selectedCandidate.status === 'EXECUTED' ? 'bg-purple-950 border-purple-600 text-purple-300' :
                    selectedCandidate.status === 'AUTHORIZED' ? 'bg-emerald-950 border-emerald-600 text-emerald-300' :
                    selectedCandidate.status === 'REJECTED' ? 'bg-red-950 border-red-600 text-red-300' :
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {selectedCandidate.status}
                  </span>
                </div>

                {/* Counterfactual Delta Matrix */}
                {selectedEval && (
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[9px] uppercase block">Projected M(t) Post-Action</span>
                        <span className="text-base font-bold text-emerald-400">
                          {selectedEval.projected_control_margin}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          vs {noActionEval?.projected_control_margin || 18}% (No Action)
                        </span>
                      </div>

                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[9px] uppercase block">Cascade Depth Prevented</span>
                        <span className="text-base font-bold text-blue-400">
                          {selectedEval.comparison_vs_no_action.propagation_hops_prevented} hops halted
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Saves {selectedEval.comparison_vs_no_action.affected_nodes_saved} downstream nodes
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-500 block">Stability Index</span>
                        <span className="font-bold text-slate-200">{selectedEval.projected_stability_index}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-500 block">Est. Cost</span>
                        <span className="font-bold text-slate-200">${selectedCandidate.estimated_cost_usd_m}M USD</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-500 block">Est. Latency</span>
                        <span className="font-bold text-slate-200">{selectedCandidate.estimated_latency_sec}s</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Target Scope & Authority Gate */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 text-[9px] block uppercase">Disruption Impact</span>
                    <span className="font-bold text-amber-400 text-xs">
                      {selectedCandidate.estimated_disruption} ({selectedCandidate.estimated_disruption_cost_score}/100)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Collateral: {selectedCandidate.collateral_exposure_pct}%
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 text-[9px] block uppercase">Authority Gate (SOD)</span>
                    <span className="font-bold text-cyan-400 text-xs">
                      {selectedCandidate.authority_required}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Targets: {[...selectedCandidate.target_entities, ...selectedCandidate.target_dependencies].join(', ') || 'None'}
                    </span>
                  </div>
                </div>

                {/* Risk Consequence Decomposition */}
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>Consequence Decomposition</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-snug font-sans">
                    <span className="font-bold text-slate-400 font-mono">If Executed: </span> 
                    {selectedCandidate.risk_if_executed || 'Temporary operational overhead.'}
                  </div>
                  <div className="text-[11px] text-red-300/90 leading-snug font-sans">
                    <span className="font-bold text-red-400 font-mono">If NOT Executed: </span>
                    {selectedCandidate.risk_if_not_executed || 'Uncontrolled cascade contagion.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN C: DECISION RATIONALE & GOVERNED CONTROLS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#162238] text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Governed Execution Pipeline</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Separation of Duties (SOD)
            </span>
          </div>

          <div className="fis-panel p-3.5 space-y-2.5 flex-1">
            {/* Minimum Effective Intervention Callout (Compact) */}
            {selectedCandidate?.is_minimum_effective ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-emerald-300 font-bold text-[11px] uppercase font-mono">
                    MINIMUM EFFECTIVE INTERVENTION (RECOMMENDED)
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-snug font-sans mt-0.5">
                    Restores control (≥65%) while minimizing collateral market disruption and irreversible exposure.
                  </p>
                </div>
              </div>
            ) : selectedCandidate?.type === 'NO_ACTION' ? (
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 space-y-1">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>PASSIVE CONTAGION RISK</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug font-sans">
                  Electing passive observation results in multi-hop transmission across connected bilateral credit lines.
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-300 font-bold text-xs uppercase font-mono">
                  ALTERNATIVE INTERVENTION
                </div>
                <p className="text-[11px] text-slate-400 leading-snug font-sans">
                  Effective, but carries higher collateral disruption than the recommended minimum action.
                </p>
              </div>
            )}

            {/* In-Product Separation of Duties (SoD) Governance Block Notice */}
            {governanceBlockNotice && (
              <div
                data-testid="foundry-governance-block-notice"
                className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/70 space-y-1.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-red-300 font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    {governanceBlockNotice.action} BLOCKED — SEPARATION OF DUTIES
                  </span>
                  <button
                    type="button"
                    onClick={clearGovernanceBlockNotice}
                    className="text-[10px] text-red-300 hover:text-white px-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-[10px] text-slate-300 space-y-0.5">
                  <div>Current Role: <strong className="text-amber-300">{governanceBlockNotice.currentRole}</strong></div>
                  <div>Required Authority: <strong className="text-cyan-300">{governanceBlockNotice.requiredRoles.join(' / ')}</strong></div>
                  <div className="text-red-200/90 font-sans pt-0.5">{governanceBlockNotice.reason}</div>
                </div>
                <div className="pt-1 border-t border-red-800/50 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] text-slate-400 uppercase">Switch Role:</span>
                  {governanceBlockNotice.requiredRoles.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setRole(role);
                        clearGovernanceBlockNotice();
                      }}
                      className="px-2 py-0.5 rounded bg-blue-900/80 hover:bg-blue-700 border border-blue-500 text-white font-bold text-[9px] transition"
                    >
                      Switch to {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Governed Controls Action Box */}
            {selectedCandidate && selectedCandidate.type !== 'NO_ACTION' && (
              <div className="space-y-2">
                {/* Step 1: Request Authorization */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={isAuthorized || isRequestingAuth || foundryState?.active_authorization_request?.candidate_id === selectedCandidate.id}
                    onClick={handleRequestAuth}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                      foundryState?.active_authorization_request?.candidate_id === selectedCandidate.id
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                        : isAuthorized
                        ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : 'bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-700'
                    }`}
                  >
                    <span>1. REQUEST AUTHORIZATION</span>
                  </button>
                </div>

                {/* Step 2: Authorize Button */}
                <div className="space-y-1">
                  <button
                    disabled={isAuthorized || isAuthorizing}
                    onClick={handleAuthorize}
                    className={`w-full py-2 px-3 rounded text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                      isAuthorized
                        ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40'
                    }`}
                  >
                    {isAuthorized ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>AUTHORIZATION SEALED (SHA-256)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>2. AUTHORIZE AS {currentRole}</span>
                      </>
                    )}
                  </button>

                  <div className="text-[10px] font-mono text-slate-400 flex flex-wrap justify-between gap-1 px-1">
                    <span>Auth Gate (SoD): <strong className="text-cyan-400">INCIDENT_COMMANDER / RISK_OFFICER</strong></span>
                    <span>Dispatch Gate: <strong className="text-emerald-400">SYSTEM_OPERATOR</strong></span>
                  </div>
                </div>

                {/* Step 3: Execution Button */}
                <div>
                  <button
                    disabled={!isAuthorized || isExecuted || isExecuting}
                    onClick={handleExecute}
                    className={`w-full py-2 px-3 rounded text-xs font-bold font-mono transition flex items-center justify-center gap-2 ${
                      isExecuted
                        ? 'bg-purple-950/70 border border-purple-500 text-purple-300 cursor-default'
                        : isAuthorized
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/50'
                        : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>3. DISPATCHED (AWAITING INDEPENDENT VERIFICATION)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>3. EXECUTE GOVERNED INTERVENTION</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cross-Workspace Handoff Links */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentRoute('execution')}
                    className="py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-cyan-300 flex items-center justify-center gap-1 transition"
                  >
                    <span>Inspect Contract (09)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentRoute('verification')}
                    className="py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-emerald-300 flex items-center justify-center gap-1 transition"
                  >
                    <span>Verify Telemetry (10)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Demonstration Failure Modes Toggle */}
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px] font-mono text-slate-300">
                  <div className="font-bold text-slate-400 uppercase text-[9px]">Verification Gate Fault-Injection Toggles:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900/70 px-2 py-1 rounded border border-slate-800 hover:border-amber-700/60">
                      <input
                        type="checkbox"
                        checked={forceDownstreamContagion}
                        onChange={e => setForceDownstreamContagion(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3 h-3"
                      />
                      <span className="text-amber-300 font-bold">Simulate Residual Contagion (Scenario 2)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900/70 px-2 py-1 rounded border border-slate-800">
                      <input
                        type="checkbox"
                        checked={forceTechnicalFailure}
                        onChange={e => setForceTechnicalFailure(e.target.checked)}
                        className="rounded border-slate-700 text-red-500 focus:ring-0 w-3 h-3"
                      />
                      <span>Gateway Tech Failure</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900/70 px-2 py-1 rounded border border-slate-800">
                      <input
                        type="checkbox"
                        checked={forceStaleEvidence}
                        onChange={e => setForceStaleEvidence(e.target.checked)}
                        className="rounded border-slate-700 text-purple-500 focus:ring-0 w-3 h-3"
                      />
                      <span>Stale Evidence (&gt;60s)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900/70 px-2 py-1 rounded border border-slate-800">
                      <input
                        type="checkbox"
                        checked={forceConflictingTelemetry}
                        onChange={e => setForceConflictingTelemetry(e.target.checked)}
                        className="rounded border-slate-700 text-blue-500 focus:ring-0 w-3 h-3"
                      />
                      <span>Telemetry Conflict</span>
                    </label>
                  </div>
                </div>

                {/* Rollback Control */}
                {isExecuted && selectedCandidate.reversibility !== 'IRREVERSIBLE' && (
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      disabled={isRollingBack}
                      onClick={handleRollback}
                      className="flex-1 py-1.5 px-3 rounded text-xs font-bold font-mono transition flex items-center justify-center gap-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-700 text-amber-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ROLLBACK INTERVENTION</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. SECTION 45 & 46: INDEPENDENT VERIFICATION & REASSESSMENT DUAL-COLUMN DECK */}
      <div className="px-3.5 py-3 sm:px-5 border-t border-[#162238] bg-[#070b16] space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          
          {/* LEFT: INDEPENDENT VERIFICATION (SECTION 45: EXPECTED VS OBSERVED) */}
          <div className="lg:col-span-7 rounded-lg bg-slate-950 border border-slate-800 p-3 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>INDEPENDENT VERIFICATION (EXPECTED VS OBSERVED)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                verification?.verification_result === 'VERIFIED_EFFECTIVE' ? 'bg-emerald-950 border-emerald-600 text-emerald-300' :
                verification?.verification_result === 'VERIFIED_PARTIAL' ? 'bg-amber-950 border-amber-600 text-amber-300' :
                verification?.verification_result === 'VERIFIED_FAILED' ? 'bg-red-950 border-red-600 text-red-300' :
                verification?.verification_result === 'VERIFIED_UNCERTAIN' ? 'bg-purple-950 border-purple-600 text-purple-300' :
                'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {verification?.verification_result || 'AWAITING_EXECUTION'}
              </span>
            </div>

            {/* 2-Column Comparison Table */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Column 1: EXPECTED */}
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] text-cyan-400 uppercase font-bold flex items-center justify-between">
                  <span>EXPECTED EFFECT</span>
                  <span>COUNTERFACTUAL</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Restoration:</span>
                    <span className="font-bold">≥65% M(t)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Margin:</span>
                    <span className="font-bold text-cyan-300">{verification?.expected_margin || selectedEval?.projected_control_margin || 84}% M(t)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Depth:</span>
                    <span className="font-bold">≤1 Hop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cascade Velocity:</span>
                    <span className="font-bold text-emerald-400">0.0 Nodes/s</span>
                  </div>
                </div>
              </div>

              {/* Column 2: OBSERVED */}
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="text-[10px] text-purple-400 uppercase font-bold flex items-center justify-between">
                  <span>OBSERVED TELEMETRY</span>
                  <span>ENCLAVE PROBE</span>
                </div>
                {verification ? (
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Observed Margin:</span>
                      <span className={`font-bold ${
                        verification.post_intervention_margin >= 65 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {verification.post_intervention_margin}% M(t)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discrepancy:</span>
                      <span className={`font-bold ${verification.margin_discrepancy < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {verification.margin_discrepancy > 0 ? `+${verification.margin_discrepancy}%` : `${verification.margin_discrepancy}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Observed Depth:</span>
                      <span className="font-bold">{observation?.observed_propagation_depth ?? 1} Hops</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Evidence Status:</span>
                      <span className={`font-bold ${
                        verification.evidence_freshness_status === 'FRESH' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {verification.evidence_freshness_status} ({observation?.evidence_freshness_sec || 12}s)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Observed Margin:</span>
                      <span className="font-bold text-slate-400">STANDBY (Pre-Action: {controlState.control_margin_percent}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discrepancy:</span>
                      <span className="text-slate-500">— (Not Yet Dispatched)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Observed Depth:</span>
                      <span className="text-slate-500">— (Awaiting Probe)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Probe Status:</span>
                      <span className="text-amber-400 font-bold">ARMED FOR POST-EXECUTION</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-sans leading-snug border-t border-slate-800 pt-1.5">
              <span className="font-bold font-mono text-slate-300">Independent Verifier Audit: </span>
              {verification?.verification_report || 'Enclave verifier armed. Post-execution empirical telemetry will be sampled independently of gateway HTTP 200 ACK.'}
            </div>
          </div>

          {/* RIGHT: REASSESSMENT & NEXT ACTION (SECTION 46) */}
          <div className="lg:col-span-5 rounded-lg bg-slate-950 border border-slate-800 p-3 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>OUTCOME & REASSESSMENT</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                verification?.observed_outcome === 'CONTROL_RESTORED' ? 'bg-emerald-950 border-emerald-600 text-emerald-300' :
                verification?.observed_outcome === 'CONTROL_NOT_RESTORED' ? 'bg-red-950 border-red-600 text-red-300' :
                'bg-amber-950 border-amber-600 text-amber-300'
              }`}>
                {verification?.observed_outcome || controlState.controllability_state || 'CONTROL_DEGRADING'}
              </span>
            </div>

            {/* Before -> Intervention -> After Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">
                  {verification ? 'PRE-ACTION M(t)' : 'CURRENT M(t)'}
                </span>
                <span className="font-bold text-amber-400 text-sm">
                  {verification ? `${verification.pre_intervention_margin}%` : `${controlState.control_margin_percent}%`}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">INTERVENTION</span>
                <span className="font-bold text-cyan-300 text-[11px] truncate block mt-0.5">
                  {selectedCandidate?.title.slice(0, 16) || 'ACTION'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">
                  {verification ? 'OBSERVED M(t)' : 'PROJECTED M(t)'}
                </span>
                <span className={`font-bold text-sm ${
                  verification
                    ? (verification.post_intervention_margin >= 65 ? 'text-emerald-400' : 'text-red-400')
                    : 'text-cyan-400'
                }`}>
                  {verification
                    ? `${verification.post_intervention_margin}%`
                    : `${selectedEval?.projected_control_margin || 84}% (Est)`}
                </span>
              </div>
            </div>

            {/* Residual Hazard & Next Action */}
            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-slate-500 uppercase">Post-Execution Reassessment Status:</div>
              <div className="text-[11px] text-amber-300/90 font-sans leading-snug">
                {verification
                  ? (reassessment?.residual_threat_vector || 'Equilibrium restored; no secondary hazard active.')
                  : 'Awaiting governed intervention dispatch and independent verification.'}
              </div>
            </div>

            {reassessment && reassessment.status === 'ACTIVE' && (
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-400">
                  Escalation Target: <span className="text-cyan-400 font-bold">{reassessment.escalated_candidate_id}</span>
                </div>
                <button
                  onClick={() => setCurrentRoute('reassessment')}
                  className="py-1 px-3 rounded bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold font-mono transition"
                >
                  OPEN REASSESSMENT →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. SECTION 47: CHRONOLOGICAL AUDIT RAIL */}
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-2.5 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>CHRONOLOGICAL GOVERNANCE AUDIT LINEAGE</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {auditTrail.length} Authoritative Events Recorded
            </span>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
            {auditTrail.length > 0 ? (
              auditTrail.slice(0, 6).map((evt) => (
                <div key={evt.audit_id} className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-bold text-cyan-400">{evt.event_type}</span>
                    <span className="text-slate-300 font-sans truncate max-w-md">{evt.details}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="text-purple-400">{evt.actor_role}</span>
                    <span className="text-slate-500 truncate max-w-[100px]">{evt.evidence_digest || evt.audit_id}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-slate-500 py-1.5 text-center">
                No governance events recorded in this session. Authorize and execute an intervention to populate the immutable audit rail.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
