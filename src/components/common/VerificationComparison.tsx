/**
 * FINANCIAL IMMUNE SYSTEM - VERIFICATION DIFFERENTIAL COMPARISON
 * Section 20: Verification UI & The Hero Moment
 * 
 * Strict Principle:
 * TECHNICAL EXECUTION SUCCESS ≠ SYSTEMIC CONTROLLABILITY OUTCOME
 * 
 * Shows:
 * 1. EXPECTED (Counterfactual Projection)
 * 2. OBSERVED (Independent Enclave Observation)
 * 3. VERDICT (VERIFIED_EFFECTIVE vs VERIFIED_FAILED)
 * 4. DISCREPANCY & RESIDUAL THREAT VECTOR
 * 5. AUTOMATED EMERGENCY ESCALATION ACTION
 */

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Activity,
  Layers,
  Lock
} from 'lucide-react';

interface VerificationComparisonProps {
  candidateId?: string;
  candidateName?: string;
  preMargin?: number;
  expectedMarginDelta?: number;
  observedMarginDelta?: number;
  expectedMargin?: number;
  observedMargin?: number;
  verdict: 'VERIFIED_EFFECTIVE' | 'VERIFIED_FAILED' | 'VERIFIED_DIVERGENT' | 'PENDING';
  residualThreatId?: string | null;
  residualThreatDescription?: string | null;
  onEscalate?: () => void;
  className?: string;
}

export const VerificationComparison: React.FC<VerificationComparisonProps> = ({
  candidateId = 'CAND-RN-2026-0041-DEP-ISOLATION',
  candidateName = 'Targeted Dependency Isolation (DATA-X -> Tier-1 G-SIBs)',
  preMargin = 35,
  expectedMarginDelta = 39,
  observedMarginDelta = 7,
  expectedMargin = 74,
  observedMargin = 42,
  verdict = 'VERIFIED_FAILED',
  residualThreatId = 'DEP_MODEL_C_ASSET_17',
  residualThreatDescription = 'Latent synthetic correlation in pricing weights (MODEL-C) remains active across shadow nodes.',
  onEscalate,
  className = ''
}) => {
  const isFailed = verdict === 'VERIFIED_FAILED';
  const isEffective = verdict === 'VERIFIED_EFFECTIVE';
  const discrepancy = observedMarginDelta - expectedMarginDelta;
  const modeledBoundary = 65;

  return (
    <div className={`fis-panel p-4 sm:p-5 border ${isFailed ? 'border-red-600/70 bg-gradient-to-b from-[#180a10] to-[#0c060a]' : 'border-emerald-600/70 bg-gradient-to-b from-[#081810] to-[#050d09]'} ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2a1520] text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isFailed ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="font-bold uppercase tracking-wider text-white">
            Independent Verification [Target: IBM Z Enclave]
          </span>
          <span className="text-[10px] text-slate-400">
            [SHA-256 INTEGRITY DIGEST // IBM Z TARGET ARCHITECTURE]
          </span>
        </div>

        {/* Verdict Badge */}
        <div className={`px-2.5 py-1 rounded text-xs font-bold font-mono border flex items-center gap-1.5 ${
          isFailed 
            ? 'bg-red-950 text-red-300 border-red-700 shadow-glow-red animate-pulse' 
            : 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-glow-emerald'
        }`}>
          {isFailed ? <XCircle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{verdict.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Candidate Reference */}
      <div className="py-2.5 text-xs font-mono text-slate-300">
        <span className="text-slate-500">Evaluated Intervention: </span>
        <strong className="text-white">{candidateName}</strong>
        <span className="text-slate-500 ml-1.5">[{candidateId}]</span>
      </div>

      {/* Side-by-Side Comparison: EXPECTED vs OBSERVED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {/* EXPECTED (Counterfactual Simulation Projection) */}
        <div className="p-3 rounded bg-[#090e1c] border border-[#17253d] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider">
            <span>Counterfactual Expected</span>
            <span className="text-blue-400 text-[10px]">FOUNDRY PROJECTION</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            +{expectedMarginDelta} <span className="text-xs text-slate-500 font-normal">pts M(t)</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Projected Margin: <strong className="text-blue-400">{expectedMargin}%</strong>{' '}
            <span className="text-[10px] text-slate-500">({preMargin}% baseline + {expectedMarginDelta} pts)</span>
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Simulation assumption: Single-origin oracle isolation
          </div>
        </div>

        {/* OBSERVED (Independent Verifier Telemetry) */}
        <div className={`p-3 rounded border space-y-1.5 font-mono ${
          isFailed 
            ? 'bg-[#14080e] border-red-900/60' 
            : 'bg-[#08140c] border-emerald-900/60'
        }`}>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
            <span className={isFailed ? 'text-red-400' : 'text-emerald-400'}>Independent Observed</span>
            <span className="text-slate-400 text-[10px]">SIMULATED TELEMETRY</span>
          </div>
          <div className={`text-2xl font-black tabular-nums ${isFailed ? 'text-red-400' : 'text-emerald-400'}`}>
            +{observedMarginDelta} <span className="text-xs text-slate-500 font-normal">pts M(t)</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Actual Net Margin: <strong className={isFailed ? 'text-red-400' : 'text-emerald-400'}>{observedMargin}%</strong>{' '}
            <span className="text-[10px] text-slate-500">({preMargin}% baseline + {observedMarginDelta} pts)</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Restoration Gap:</span>
            <strong className={isFailed ? 'text-red-400' : 'text-emerald-400'}>
              {discrepancy} pts delta
            </strong>
          </div>
        </div>
      </div>

      {/* Mathematical Accounting Transparency Box */}
      <div className="p-3 rounded bg-[#060b16] border border-[#17253d] font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
          <span>Mathematical Accounting & Controllability Margin Formula</span>
          <span className="text-slate-500">M(t) = w_L·L(t) + w_S·S(t) + w_V·V(t)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-1.5 rounded bg-[#091122] border border-[#1b2b48]">
            <div className="text-slate-400">Pre-Action Margin:</div>
            <div className="text-white font-bold text-xs">{preMargin}% M(t)</div>
          </div>
          <div className="p-1.5 rounded bg-[#091122] border border-[#1b2b48]">
            <div className="text-slate-400">Modeled Boundary:</div>
            <div className="text-amber-400 font-bold text-xs">{modeledBoundary}% (Policy)</div>
          </div>
          <div className="p-1.5 rounded bg-[#091122] border border-[#1b2b48]">
            <div className="text-slate-400">Restoration Gap:</div>
            <div className={`font-bold text-xs ${isFailed ? 'text-red-400' : 'text-emerald-400'}`}>
              {discrepancy} pts
            </div>
          </div>
          <div className="p-1.5 rounded bg-[#091122] border border-[#1b2b48]">
            <div className="text-slate-400">Boundary Status:</div>
            <div className={`font-bold text-xs ${observedMargin >= modeledBoundary ? 'text-emerald-400' : 'text-red-400'}`}>
              {observedMargin >= modeledBoundary ? `+${observedMargin - modeledBoundary} pts Above` : `${observedMargin - modeledBoundary} pts Deficit`}
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy & Residual Threat Analysis Banner */}
      {isFailed && (
        <div className="p-3 rounded bg-red-950/60 border border-red-800/80 text-xs font-mono space-y-2 mt-2">
          <div className="flex items-center gap-2 text-red-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>HERO FAILURE MOMENT: Latent Contagion Detected</span>
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Technical gateway execution was <strong className="text-emerald-400 font-mono">100% SUCCESSFUL</strong>, but independent verifier observation detected unmitigated latent contagion. Modeled Control Margin remains <strong className="text-red-400 font-mono">CRITICAL ({observedMargin}% vs {modeledBoundary}% Modeled Boundary)</strong>.
          </div>
          {residualThreatId && (
            <div className="p-2 rounded bg-red-900/40 border border-red-700/60 flex items-start gap-2 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-red-300 font-bold">Residual Threat: {residualThreatId}</span>
                <p className="text-slate-400 text-[10px] mt-0.5">{residualThreatDescription}</p>
              </div>
            </div>
          )}

          {/* Action: Trigger Emergency Escalation */}
          {onEscalate && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onEscalate}
                className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
              >
                <span>Trigger Emergency Reassessment (11)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {isEffective && (
        <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800/80 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Modeled Controllability Successfully Restored (M(t) ≥ {modeledBoundary}% Modeled Boundary)</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero active residual critical propagation paths remaining</span>
        </div>
      )}
    </div>
  );
};
