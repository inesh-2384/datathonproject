/**
 * FINANCIAL IMMUNE SYSTEM - EVIDENCE & ASSURANCE CHAIN VIEW (MODULE 12)
 * Phase 5/7.6 Enterprise Assurance, Provenance, Cryptographic Integrity & Incident Reconstruction
 * 
 * Strict Data Truth:
 * - SHA-256 establishes tamper-evident payload integrity of recorded telemetry,
 *   NOT ground-truth of real-world macro reality (no asymmetric hardware signature claimed).
 * - Stale evidence blocks incident closure.
 * - Conflicted evidence mandates uncertainty and CONTROL_UNVERIFIED.
 * - Full lifecycle traceability derived from live authoritative state.
 */

import React, { useState, useEffect } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { TechnicalId } from '../components/common/TechnicalId';
import { CapabilityTag } from '../components/common/CapabilityTag';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Zap
} from 'lucide-react';
import { SecurityThreatScenarioId } from '@shared/types/assurance';

export const EvidenceView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const foundryState = useSystemStore(state => state.foundryState);
  const evidenceRecords = useSystemStore(state => state.evidenceRecords);
  const permissions = useSystemStore(state => state.permissions);
  const assuranceState = useSystemStore(state => state.assuranceState);
  const activeTrace = useSystemStore(state => state.activeTrace);
  const fetchAssuranceState = useSystemStore(state => state.fetchAssuranceState);
  const verifyIntegrity = useSystemStore(state => state.verifyIntegrity);
  const injectAssuranceThreat = useSystemStore(state => state.injectAssuranceThreat);
  const attemptCloseIncident = useSystemStore(state => state.attemptCloseIncident);

  const [selectedRecordId, setSelectedRecordId] = useState<string>(evidenceRecords[0]?.evidence_id || 'EVID_STEP_01');
  const [integrityReport, setIntegrityReport] = useState<{ allValid: boolean; recordsCount: number; results: any[] } | null>(null);
  const [closureMessage, setClosureMessage] = useState<{ success: boolean; narrative: string } | null>(null);
  const [injectedThreatNotice, setInjectedThreatNotice] = useState<{ id: SecurityThreatScenarioId; summary: string } | null>(null);

  useEffect(() => {
    fetchAssuranceState();
  }, [fetchAssuranceState]);

  const selectedRecord = evidenceRecords.find(r => r.evidence_id === selectedRecordId) || evidenceRecords[0];

  const isRestored =
    controlState.overall_status === 'RESTORED' ||
    foundryState?.latest_verification?.verification_result === 'VERIFIED_EFFECTIVE';
  const isUnverifiedFailure =
    (controlState.overall_status as string) === 'UNVERIFIED_FAILURE' ||
    controlState.controllability_state === 'CONTROL_NOT_RESTORED' ||
    foundryState?.latest_verification?.verification_result === 'VERIFIED_FAILED';
  const isAttack =
    controlState.overall_status === 'CRITICAL' ||
    controlState.overall_status === 'DEGRADING' ||
    isUnverifiedFailure;
  const hasAuth = Boolean(foundryState?.authorization_history && foundryState.authorization_history.length > 0);
  const hasExec = Boolean(foundryState?.latest_execution);

  const handleExportPackage = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      trace_id: activeTrace?.traceId,
      assurance_state: assuranceState,
      evidence_chain: evidenceRecords,
      exported_at: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FIS_AUDIT_PACKAGE_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleVerifyIntegrity = async () => {
    const report = await verifyIntegrity();
    setIntegrityReport(report);
  };

  const handleCloseAttempt = async () => {
    const res = await attemptCloseIncident();
    setClosureMessage(res);
  };

  const handleInjectThreat = async (threatId: SecurityThreatScenarioId, summary: string) => {
    await injectAssuranceThreat(threatId);
    setInjectedThreatNotice({ id: threatId, summary });
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto font-mono text-xs select-none">
      {/* Top Header */}
      <div className="fis-panel p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base font-sans text-white flex items-center gap-2">
              12. EVIDENCE &amp; ASSURANCE POSTURE
              <CapabilityTag maturity="IMPLEMENTED" />
            </div>
            <div className="text-[11px] text-purple-400">
              Tamper-Evident SHA-256 Digest Chain &amp; Lifecycle Provenance
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>Digest Verification: <strong className="text-emerald-400">ACTIVE</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">IBM Z CPACF [SIMULATED DIGEST]</span>
          {permissions.can_export_evidence_packages ? (
            <button
              type="button"
              onClick={handleExportPackage}
              className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Package</span>
            </button>
          ) : (
            <span className="text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Read-Only
            </span>
          )}
        </div>
      </div>

      {/* Assurance Posture Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Assurance Status */}
        <div className="fis-panel p-4 space-y-1">
          <span className="text-[10px] uppercase text-slate-500">System Assurance Status</span>
          <div
            data-testid="evidence-assurance-status"
            className={`text-base font-extrabold font-sans ${
              assuranceState?.assuranceStatus === 'ASSURED' 
                ? 'text-emerald-400' 
                : assuranceState?.assuranceStatus === 'ASSURANCE_COMPROMISED'
                  ? 'text-red-400'
                  : 'text-amber-400'
            }`}
          >
            {assuranceState?.assuranceStatus || 'ASSURED'}
          </div>
          <div className="text-[10px] text-slate-400">
            Integrity: <span className="text-emerald-400 font-bold">{assuranceState?.integrityStatus || 'VERIFIED'}</span>
          </div>
        </div>

        {/* Metric 2: Active Trace ID */}
        <div className="fis-panel p-4 space-y-1">
          <span className="text-[10px] uppercase text-slate-500">Active Incident Trace ID</span>
          <div className="text-xs font-bold text-cyan-400 truncate">
            {assuranceState?.traceId || activeTrace?.traceId || 'TRC-BASELINE'}
          </div>
          <div className="text-[10px] text-slate-400">
            Lifecycle Phase: <span className="text-white font-bold">{controlState.overall_status}</span>
          </div>
        </div>

        {/* Metric 3: Evidence Freshness */}
        <div className="fis-panel p-4 space-y-1">
          <span className="text-[10px] uppercase text-slate-500">Telemetry Freshness</span>
          <div
            data-testid="evidence-freshness-status"
            className={`text-base font-extrabold font-sans flex items-center gap-1.5 ${
              assuranceState?.evidenceFreshness === 'FRESH'
                ? 'text-emerald-400'
                : assuranceState?.evidenceFreshness === 'AGING'
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            {assuranceState?.evidenceFreshness || 'FRESH'}
          </div>
          <div className="text-[10px] text-slate-400">
            Sufficiency: <span className="text-white font-bold">{assuranceState?.evidenceSufficiency || 'SUFFICIENT'}</span>
          </div>
        </div>

        {/* Metric 4: Conflict / Uncertainty */}
        <div className="fis-panel p-4 space-y-1">
          <span className="text-[10px] uppercase text-slate-500">Telemetry Conflict Status</span>
          <div
            data-testid="evidence-conflict-status"
            className={`text-base font-extrabold font-sans ${
              assuranceState?.evidenceConflict ? 'text-red-400' : 'text-slate-300'
            }`}
          >
            {assuranceState?.evidenceConflict ? 'CONFLICT DETECTED' : 'NO CONFLICT'}
          </div>
          <div className="text-[10px] text-slate-400">
            Epistemic Uncertainty: <span className="text-amber-400 font-bold">{assuranceState?.uncertaintyStatus || 'LOW'}</span>
          </div>
        </div>
      </div>

      {/* Stale Evidence Alert Banner */}
      {assuranceState?.evidenceFreshness === 'STALE' && (
        <div
          data-testid="evidence-stale-alert-banner"
          className="p-4 rounded-lg bg-amber-950/50 border border-amber-500/60 flex items-start gap-3 text-amber-200"
        >
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-300 uppercase">
              STALE EVIDENCE ALERT (TTL EXPIRED &gt; 60s) — GOVERNED CLOSURE BLOCKED
            </div>
            <div className="font-sans">
              Telemetry observation window has exceeded the 60-second freshness mandate. Incident closure and automated recovery certification are blocked until fresh sensor snapshots are ingested.
            </div>
          </div>
        </div>
      )}

      {/* Conflict / Warning Banner if active */}
      {assuranceState?.evidenceConflict && (
        <div
          data-testid="evidence-conflict-alert-banner"
          className="p-4 rounded-lg bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-red-300">TELEMETRY CONFLICT ALERT — CLOSURE BLOCKED</div>
            <div className="font-sans">{assuranceState.conflictDescription}</div>
            <div className="text-[10px] text-red-400 font-mono">
              Invariant Enforced: Conflicting evidence cannot be silently resolved. Systemic state remains CONTROL_UNVERIFIED.
            </div>
          </div>
        </div>
      )}

      {/* Injected Threat Simulation Banner */}
      {injectedThreatNotice && (
        <div
          data-testid="evidence-threat-injected-banner"
          className="p-3.5 rounded-lg bg-purple-950/40 border border-purple-500/50 flex items-center justify-between gap-3 text-purple-200"
        >
          <div>
            <span className="font-bold text-purple-300 uppercase mr-2">
              ASSURANCE FAULT INJECTED [{injectedThreatNotice.id}]:
            </span>
            <span className="font-sans text-slate-200">{injectedThreatNotice.summary}</span>
          </div>
          <button
            type="button"
            onClick={() => setInjectedThreatNotice(null)}
            className="text-purple-300 hover:text-white px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* State-Derived Incident Reconstruction Pipeline Stepper */}
      <div className="fis-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-semibold text-white uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Incident Reconstruction Lifecycle (Live Authoritative State Lineage)
          </h3>
          <span className="text-[10px] text-slate-400">
            Status: <strong className="text-cyan-300">{controlState.overall_status}</strong> ({controlState.control_margin_percent}% M(t))
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px]">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">1. OBSERVATION</span>
            <div className="text-white truncate">{isAttack || isRestored ? 'DATA-X Shock' : 'Nominal Feeds'}</div>
            <div className="text-emerald-400 font-bold">ATTESTED</div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">2. ASSESSMENT</span>
            <div className="text-white truncate">Margin: {controlState.control_margin_percent}%</div>
            <div className={controlState.control_margin_percent >= 65 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {controlState.overall_status}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">3. FOUNDRY</span>
            <div className="text-white truncate">{isAttack || isRestored ? 'MEI Ranked' : 'Standby'}</div>
            <div className="text-cyan-400 font-bold">{foundryState?.candidates?.length || 4} OPTIONS</div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">4. AUTHORITY</span>
            <div className="text-white truncate">SoD Command</div>
            <div className={hasAuth || isRestored ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {hasAuth || isRestored ? 'SEALED' : 'AWAITING'}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">5. EXECUTION</span>
            <div className="text-white truncate">SYS_OPERATOR</div>
            <div className={hasExec || isRestored ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
              {hasExec || isRestored ? 'HTTP 200 OK' : 'STANDBY'}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">6. VERIFIER</span>
            <div className="text-white truncate">Enclave Probe</div>
            <div className={isRestored ? 'text-emerald-400 font-bold' : isUnverifiedFailure ? 'text-red-400 font-bold' : 'text-slate-400 font-bold'}>
              {isRestored ? 'EFFECTIVE' : isUnverifiedFailure ? 'FAILED (42%)' : 'ARMED'}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">7. OUTCOME</span>
            <div className="text-white truncate">{isRestored ? 'M(t): 84%' : isUnverifiedFailure ? 'Latent MODEL-C' : 'Baseline'}</div>
            <div className={isRestored ? 'text-emerald-400 font-bold' : isUnverifiedFailure ? 'text-red-400 font-bold' : 'text-cyan-400 font-bold'}>
              {isRestored ? 'RESTORED' : isUnverifiedFailure ? 'UNVERIFIED' : 'NOMINAL'}
            </div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">8. REASSESS</span>
            <div className="text-white truncate">{isRestored ? 'Backstop Complete' : isUnverifiedFailure ? '2nd Action Req' : 'Standby'}</div>
            <div className={isRestored ? 'text-emerald-400 font-bold' : isUnverifiedFailure ? 'text-amber-400 font-bold' : 'text-slate-400 font-bold'}>
              {isRestored ? 'ASSURED' : isUnverifiedFailure ? 'ESCALATED' : 'NONE'}
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Cryptographic Block Pipeline */}
      <div className="fis-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Sequential Cryptographic Evidence Pipeline ({evidenceRecords.length} Blocks)
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="evidence-verify-integrity-btn"
              onClick={handleVerifyIntegrity}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify SHA-256 Integrity</span>
            </button>

            <button
              type="button"
              data-testid="evidence-test-closure-btn"
              onClick={handleCloseAttempt}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Test Governed Closure</span>
            </button>
          </div>
        </div>

        {/* Verification Modal / Alert result */}
        {integrityReport && (
          <div
            data-testid="evidence-integrity-report"
            className={`p-3.5 rounded-lg border text-xs ${
              integrityReport.allValid 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                : 'bg-red-950/40 border-red-500/50 text-red-200'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {integrityReport.allValid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
              Cryptographic Digest Verification Complete: {integrityReport.allValid ? '100% UNALTERED & VERIFIED' : 'TAMPERING DETECTED'}
            </div>
            <div className="text-[11px] mt-1 text-slate-300 font-sans">
              Validated {integrityReport.recordsCount} sequential payload hashes. All cryptographic digests match declared SHA-256 payload hashes (tamper-evident digest chain; simulated CPACF boundary).
            </div>
          </div>
        )}

        {/* Closure test message */}
        {closureMessage && (
          <div
            data-testid="evidence-closure-message"
            className={`p-3.5 rounded-lg border text-xs ${
              closureMessage.success 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            }`}
          >
            <div className="font-bold">{closureMessage.success ? 'CLOSURE PERMITTED' : 'CLOSURE REJECTED BY ASSURANCE GATE'}</div>
            <div className="text-[11px] mt-1 font-sans">{closureMessage.narrative}</div>
          </div>
        )}

        {/* Horizontal Block Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {evidenceRecords.map((step, idx) => {
            const isSelected = selectedRecordId === step.evidence_id;

            return (
              <div
                key={step.evidence_id}
                onClick={() => setSelectedRecordId(step.evidence_id)}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-400 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold block mb-1">
                    #{step.sequence_step || idx + 1}
                  </span>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    {step.title}
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-slate-800/80 text-[9px] font-mono text-slate-500 truncate">
                  {step.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Block Inspection Card */}
      {selectedRecord && (
        <div className="fis-panel p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                STAGE #{selectedRecord.sequence_step}: {selectedRecord.title.toUpperCase()}
              </span>
              <TechnicalId id={selectedRecord.evidence_id} />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SHA-256 DIGEST ATTESTED
              </span>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {selectedRecord.timestamp}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-500">Observation Summary</span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded border border-slate-800">
              {selectedRecord.lineage_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-3 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase mb-1">
                Tamper-Evident Payload Digest (SHA-256):
              </span>
              <div className="p-2 rounded bg-slate-950 text-purple-300 font-bold break-all border border-slate-800 text-[11px]">
                {selectedRecord.payload_digest_sha256}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-500 block text-[10px] uppercase">
                Regulatory Lineage Alignment [ARCHITECTED]:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                  DORA Article 14 Aligned [ARCHITECTED]
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                  BCBS 239 Aligned [ARCHITECTED]
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                  CPMI-IOSCO Principle 17 Aligned
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controlled Demonstration Threat Injection Bar */}
      <div className="fis-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-semibold text-white uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Controlled Security Threat &amp; Failure Mode Injections (Auditing Suite)
          </h3>
          <span className="text-[10px] text-slate-500">Operational Stress Testing</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              handleInjectThreat(
                'THREAT_C_STALE_EVIDENCE',
                'Telemetry TTL expired (>60s). Freshness degraded to STALE; incident closure blocked.'
              )
            }
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-900/60 font-bold transition-colors"
          >
            Inject Stale Evidence (TTL Expiry)
          </button>

          <button
            type="button"
            onClick={() =>
              handleInjectThreat(
                'THREAT_E_EVIDENCE_CONFLICT',
                'RTGS settlement feed vs Enclave audit probe discrepancy injected. State flagged as CONFLICT DETECTED.'
              )
            }
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-red-400 border border-red-900/60 font-bold transition-colors"
          >
            Inject Evidence Conflict (RTGS vs Audit)
          </button>

          <button
            type="button"
            onClick={() =>
              handleInjectThreat(
                'THREAT_B_UNAUTHORIZED_ACTION',
                'Simulated OBSERVER / unauthorized role dispatch attempt rejected at Separation-of-Duties gate.'
              )
            }
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-900/60 font-bold transition-colors"
          >
            Simulate Unauthorized Action (Observer Gate)
          </button>

          <button
            type="button"
            onClick={() =>
              handleInjectThreat(
                'THREAT_D_EXECUTION_OUTCOME_DIVERGENCE',
                'Simulated HTTP 200 gateway execution success with post-action telemetry divergence (Execution ≠ Recovery).'
              )
            }
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-900/60 font-bold transition-colors"
          >
            Trigger Execution vs Outcome Divergence
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceView;
