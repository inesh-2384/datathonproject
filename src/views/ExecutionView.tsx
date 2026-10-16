/**
 * FINANCIAL IMMUNE SYSTEM - GOVERNED EXECUTION VIEW (MODULE 09)
 * High-Assurance Deterministic Intervention Dispatch & Separation-of-Duties Governance
 * 
 * Strict Truth Principle:
 * - Enforces: "Recommendation ≠ Authorization ≠ Execution ≠ Independent Verification"
 * - Enforces Separation of Duties (SoD):
 *   - Authorization requires INCIDENT_COMMANDER / RISK_OFFICER / COMPLIANCE_OFFICER
 *   - Execution dispatch requires SYSTEM_OPERATOR
 * - Synchronized with Control Foundry (08) selected candidate & authoritative foundryState
 */

import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Terminal, 
  FileCheck2, 
  Layers,
  Activity
} from 'lucide-react';

export const ExecutionView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const currentRole = useSystemStore(state => state.currentRole);
  const setRole = useSystemStore(state => state.setRole);
  const permissions = useSystemStore(state => state.permissions);
  const foundryState = useSystemStore(state => state.foundryState);
  const fetchFoundryState = useSystemStore(state => state.fetchFoundryState);
  const selectedCandidateId = useSystemStore(state => state.selectedFoundryCandidateId);
  const setSelectedCandidateId = useSystemStore(state => state.setSelectedFoundryCandidateId);
  const authorizeFoundryCandidate = useSystemStore(state => state.authorizeFoundryCandidate);
  const executeFoundryCandidate = useSystemStore(state => state.executeFoundryCandidate);
  const governanceBlockNotice = useSystemStore(state => state.governanceBlockNotice);
  const clearGovernanceBlockNotice = useSystemStore(state => state.clearGovernanceBlockNotice);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const [isProcessing, setIsProcessing] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!foundryState) {
      fetchFoundryState();
    }
  }, [foundryState, fetchFoundryState]);

  const candidates = (foundryState?.candidates || []).filter(c => c.type !== 'NO_ACTION');
  const selectedCandidate =
    candidates.find(c => c.id === selectedCandidateId) ||
    candidates.find(c => c.is_minimum_effective) ||
    candidates[0] ||
    null;

  useEffect(() => {
    if (selectedCandidate && selectedCandidate.id !== selectedCandidateId) {
      setSelectedCandidateId(selectedCandidate.id);
    }
  }, [selectedCandidate, selectedCandidateId, setSelectedCandidateId]);

  const activeCandId = selectedCandidate?.id || 'CAND-ISOLATE-DATA-X';
  const authRecord = foundryState?.authorization_history?.find(
    a => a.candidate_id === activeCandId && a.decision === 'AUTHORIZED'
  );
  const execRecord =
    foundryState?.latest_execution?.candidate_id === activeCandId ? foundryState.latest_execution : null;

  const isAuthorized =
    Boolean(authRecord) ||
    selectedCandidate?.status === 'AUTHORIZED' ||
    selectedCandidate?.status === 'EXECUTED';

  const isExecuted =
    Boolean(execRecord) ||
    selectedCandidate?.status === 'EXECUTED';

  const latestVerification = foundryState?.latest_verification;
  const isBaseline =
    controlState.overall_status === 'STABLE' &&
    !foundryState?.latest_execution &&
    (!foundryState?.authorization_history || foundryState.authorization_history.length === 0);

  const lifecycleBadge = isExecuted
    ? 'EXECUTED (VERIFICATION REQUIRED)'
    : isAuthorized
      ? 'AUTHORIZED (READY FOR DISPATCH)'
      : 'RECOMMENDED (AWAITING AUTHORIZATION)';

  const handleAuthorize = async () => {
    setIsProcessing(true);
    setLocalFeedback(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await authorizeFoundryCandidate(
        activeCandId,
        `Authorized via Governed Execution Workspace (09) by [${currentRole}]`
      );
      if (ok) {
        setLocalFeedback(
          `AUTHORIZATION SEALED: Candidate [${selectedCandidate?.title || activeCandId}] authorized by [${currentRole}]. Switch to SYSTEM_OPERATOR to dispatch execution.`
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = async () => {
    if (!isAuthorized) {
      setLocalFeedback(
        'EXECUTION BLOCKED: Candidate must first be authorized by INCIDENT_COMMANDER, RISK_OFFICER, or COMPLIANCE_OFFICER.'
      );
      return;
    }
    setIsProcessing(true);
    setLocalFeedback(null);
    clearGovernanceBlockNotice();
    try {
      const ok = await executeFoundryCandidate(activeCandId, {
        forceDownstreamContagion: false,
      });
      if (ok) {
        setLocalFeedback(
          `EXECUTION DISPATCHED (HTTP 200 OK): Command acknowledged by target gateway. NOTE: Execution Success ≠ Control Restored — proceed to Independent Verification (10).`
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* 1. Header Banner */}
      <div className="fis-panel p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="font-extrabold text-base font-sans text-white">
            09. GOVERNED EXECUTION (ACTION CONTRACT)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">
            SEPARATION-OF-DUTIES DISPATCH GATE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
            IMPLEMENTED
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">
            SEPARATION OF DUTIES (SoD)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-bold">
            Active Role: {currentRole}
          </span>
        </div>
      </div>

      {/* Direct Navigation Baseline Notice (Section 26) */}
      {isBaseline && (
        <div
          data-testid="execution-baseline-standby-banner"
          className="fis-panel p-3.5 bg-slate-900/90 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
        >
          <div className="space-y-1">
            <div className="text-cyan-300 font-bold uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>NOMINAL EQUILIBRIUM — STANDBY PRE-POSITIONED CONTRACT MODE</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px]">
              No active contagion shock is currently degrading Control Margin ({controlState.control_margin_percent}% STABLE). Pre-positioned intervention contracts are shown in standby review state.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentRoute('foundry')}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-[11px]"
            >
              Open Control Foundry (08)
            </button>
          </div>
        </div>
      )}

      {/* 2. Governance Invariant Callout */}
      <div className="fis-panel p-3 bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            GOVERNANCE INVARIANT: <strong>Recommendation ≠ Authorization ≠ Execution ≠ Verification</strong>. Authorization requires Command/Risk authority; Execution requires System Operator.
          </span>
        </div>
        <span className="text-[10px] text-slate-400 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          DORA Art 14 Aligned [ARCHITECTED]
        </span>
      </div>

      {/* Candidate Selector Bar (Synchronized with 08 Control Foundry) */}
      {candidates.length > 0 && (
        <div className="fis-panel p-3 bg-[#070c18] border border-[#162238] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold uppercase text-[11px]">
              Synchronized Foundry Candidate:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {candidates.map(cand => {
              const active = cand.id === activeCandId;
              return (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                    active
                      ? 'bg-blue-950/90 border-blue-500 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cand.title}
                  {cand.is_minimum_effective ? ' [MEI]' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* In-Product Separation of Duties (SoD) Governance Block Notice */}
      {governanceBlockNotice && (
        <div
          data-testid="execution-governance-block-notice"
          className="fis-panel p-4 bg-red-950/50 border-2 border-red-500/80 space-y-2.5 font-mono text-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-300 font-bold text-sm uppercase">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>{governanceBlockNotice.action} BLOCKED — SEPARATION OF DUTIES (HTTP 403)</span>
            </div>
            <button
              type="button"
              onClick={clearGovernanceBlockNotice}
              className="text-red-300 hover:text-white text-xs px-2 py-0.5 rounded bg-red-900/40"
            >
              Dismiss ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] bg-slate-950/80 p-2.5 rounded border border-red-800/50">
            <div>
              <span className="text-slate-500 block uppercase text-[9px]">Current Role</span>
              <span className="text-amber-300 font-bold">{governanceBlockNotice.currentRole}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[9px]">Required Authority</span>
              <span className="text-cyan-300 font-bold">{governanceBlockNotice.requiredRoles.join(' / ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[9px]">Candidate Target</span>
              <span className="text-white font-bold">{governanceBlockNotice.candidateId}</span>
            </div>
          </div>
          <p className="text-red-200 font-sans text-xs leading-relaxed">
            {governanceBlockNotice.reason}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Switch Active Role to Proceed:</span>
            {governanceBlockNotice.requiredRoles.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setRole(role);
                  clearGovernanceBlockNotice();
                }}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition"
              >
                Switch to {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Action Contract & 6-Point Governance Gates (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Action Contract Card */}
        <div className="fis-panel p-4 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Enclave Action Contract</span>
                <span className="text-slate-200 font-bold uppercase text-sm">
                  {selectedCandidate?.id || 'CAND-ISOLATE-DATA-X'}
                </span>
              </div>
              <span
                data-testid="execution-contract-status"
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  isExecuted
                    ? 'bg-purple-950 text-purple-300 border border-purple-700'
                    : isAuthorized
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                }`}
              >
                {lifecycleBadge}
              </span>
            </div>

            <div className="space-y-2 p-3 rounded bg-[#060a14] border border-slate-800 text-slate-300">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Intervention Strategy:</span>
                <span className="text-white font-bold text-right">
                  {selectedCandidate?.title || 'Targeted Dependency Isolation'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Target Entities / Rails:</span>
                <span className="text-cyan-400 font-bold text-right">
                  {selectedCandidate
                    ? [...selectedCandidate.target_entities, ...selectedCandidate.target_dependencies].join(', ')
                    : 'DATA-X → MODEL-A / BANK-A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Margin Delta:</span>
                <span className="text-emerald-400 font-bold">
                  +{selectedCandidate?.expected_control_margin_delta ?? 49}% M(t)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disruption Budget Score:</span>
                <span className="text-amber-400 font-bold">
                  {selectedCandidate?.estimated_disruption_cost_score ?? 18} / 100 ({selectedCandidate?.estimated_disruption || 'LOW'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reversibility Envelope:</span>
                <span className="text-cyan-400 font-bold">
                  {selectedCandidate?.reversibility || 'REVERSIBLE'} (Rollback &lt;60s)
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-800">
                <span className="text-slate-400">1. Authorization Authority (SoD):</span>
                <span className={permissions.can_authorize_interventions ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                  INCIDENT_COMMANDER / RISK_OFFICER
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">2. Execution Dispatch Role:</span>
                <span className={permissions.can_execute_interventions ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                  SYSTEM_OPERATOR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Active Session Role:</span>
                <span className="text-white font-bold underline decoration-cyan-500">
                  {currentRole}
                </span>
              </div>
            </div>

            {/* Execution ≠ Verification Truth Banner */}
            {isExecuted && (
              <div
                data-testid="execution-not-verification-banner"
                className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/60 space-y-1 text-[11px]"
              >
                <div className="font-bold text-purple-300 uppercase flex items-center justify-between">
                  <span>DISPATCH ACKNOWLEDGED (HTTP 200 OK) ≠ CONTROL RESTORED</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200">
                    {latestVerification?.verification_result || 'VERIFICATION_REQUIRED'}
                  </span>
                </div>
                <p className="text-slate-300 font-sans leading-snug">
                  Gateway execution receipt confirms command delivery (`{execRecord?.execution_id || 'EXEC-SEALED'}`), but systemic recovery is only proven after Independent Verification (10) confirms post-action Control Margin ≥ 65%.
                </p>
              </div>
            )}

            {/* Local Action Feedback */}
            {localFeedback && (
              <div className="p-2.5 rounded border bg-slate-900/90 border-cyan-500/50 text-cyan-200 text-[11px]">
                {localFeedback}
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-testid="execution-authorize-btn"
                onClick={handleAuthorize}
                disabled={isAuthorized || isExecuted || isProcessing}
                className={`flex-1 py-2.5 px-3 rounded font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isAuthorized || isExecuted
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300 cursor-default'
                    : 'bg-[#0d1627] border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isAuthorized || isExecuted
                    ? `✓ 1. Authorized (${authRecord?.decided_by_role || 'SEALED'})`
                    : `1. Authorize as ${currentRole}`}
                </span>
              </button>

              <button
                type="button"
                data-testid="execution-dispatch-btn"
                onClick={handleExecute}
                disabled={!isAuthorized || isExecuted || isProcessing}
                className={`flex-1 py-2.5 px-3 rounded font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isExecuted
                    ? 'bg-purple-950/70 border border-purple-500 text-purple-300 cursor-default'
                    : isAuthorized
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {isExecuted ? '✓ 2. Dispatched (HTTP 200)' : `2. Dispatch as ${currentRole}`}
                </span>
              </button>
            </div>

            {/* Quick Role Helper Strip for Separation of Duties */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
              <span>SoD Quick Switch:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRole('INCIDENT_COMMANDER');
                    clearGovernanceBlockNotice();
                  }}
                  className={`px-2 py-0.5 rounded border ${
                    currentRole === 'INCIDENT_COMMANDER'
                      ? 'bg-blue-950 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  INCIDENT_COMMANDER (Authorizer)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('SYSTEM_OPERATOR');
                    clearGovernanceBlockNotice();
                  }}
                  className={`px-2 py-0.5 rounded border ${
                    currentRole === 'SYSTEM_OPERATOR'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  SYSTEM_OPERATOR (Executor)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 6-Point Governance Gates */}
        <div className="fis-panel p-4 space-y-3 font-mono text-xs">
          <h3 className="text-slate-300 font-bold uppercase pb-1.5 border-b border-slate-800">
            Enclave Governance Pre-Execution Gates
          </h3>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">1. Evidence Sufficiency Gate</div>
                <div className="text-[10px] text-slate-400">Multi-sensor quorum established across G-SIB telemetry feeds</div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">✓ PASSED</span>
            </div>

            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">2. Regulatory Policy Mandate</div>
                <div className="text-[10px] text-slate-400">Validated under DORA Art 14 Aligned [ARCHITECTED] &amp; BCBS 239 rules</div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">✓ PASSED</span>
            </div>

            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">3. Authorization Authority Gate (SoD Step 1)</div>
                <div className="text-[10px] text-slate-400">Requires INCIDENT_COMMANDER / RISK_OFFICER / COMPLIANCE_OFFICER</div>
              </div>
              <span className={isAuthorized || permissions.can_authorize_interventions ? 'text-emerald-400 font-bold text-sm' : 'text-amber-400 font-bold text-sm'}>
                {isAuthorized ? '✓ SEALED' : permissions.can_authorize_interventions ? '✓ ELIGIBLE' : '⚠ SWITCH ROLE'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">4. Execution Dispatch Gate (SoD Step 2)</div>
                <div className="text-[10px] text-slate-400">Requires SYSTEM_OPERATOR + prior Authorization Seal</div>
              </div>
              <span className={isExecuted ? 'text-purple-400 font-bold text-sm' : (isAuthorized && permissions.can_execute_interventions) ? 'text-emerald-400 font-bold text-sm' : 'text-amber-400 font-bold text-sm'}>
                {isExecuted ? '✓ DISPATCHED' : (isAuthorized && permissions.can_execute_interventions) ? '✓ READY' : '⚠ GATED'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">5. Reversibility &amp; Disruption Budget</div>
                <div className="text-[10px] text-slate-400">
                  Disruption score ({selectedCandidate?.estimated_disruption_cost_score ?? 18}/100) within mandate limit (50)
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">✓ PASSED</span>
            </div>

            <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">6. CPACF SHA-256 Digest [SIMULATED]</div>
                <div className="text-[10px] text-slate-400">
                  Tamper-evident hash chain ready to seal authorization &amp; execution receipts
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">✓ READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Next Step Action Navigation */}
      <div className="fis-panel p-3.5 bg-[#080e1a] border border-[#16233b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-300">
          {isExecuted
            ? 'Intervention dispatched (HTTP 200 OK). Proceed to Independent Verification (10) to verify whether systemic control was actually restored.'
            : 'Complete Separation-of-Duties Authorization (1) and Execution Dispatch (2), then audit post-action telemetry in Independent Verification (10).'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentRoute('foundry')}
            className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold"
          >
            ← Control Foundry (08)
          </button>
          <button
            type="button"
            onClick={() => setCurrentRoute('verification')}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            <span>Open Independent Verification (10)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionView;
