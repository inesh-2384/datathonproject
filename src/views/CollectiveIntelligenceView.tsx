/**
 * FINANCIAL IMMUNE SYSTEM - COLLECTIVE DECISION INTELLIGENCE VIEW (MODULE 05)
 * Algorithmic Herding, Decision Synchrony & Effective Decision Diversity Analysis
 * 
 * Strict Truth Principle:
 * - Solves the core question: "Are AI-enabled decisions becoming systemically correlated?"
 * - Embeds live CollectiveDiversityWidget and state-derived covariance signals across all 5 lifecycle phases:
 *   Baseline (91%) -> DATA-X Shock (65%) -> Propagation -> Latent MODEL-C (42%) -> Restored (84%)
 */

import React from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { CollectiveDiversityWidget } from '../components/intelligence/CollectiveDiversityWidget';
import { 
  Cpu, 
  Terminal, 
  ArrowRight
} from 'lucide-react';

export const CollectiveIntelligenceView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const simulationClock = useSystemStore(state => state.simulationClock);
  const intelligenceAssessment = useSystemStore(state => state.intelligenceAssessment);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const isUnverifiedFailure = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED';
  const isRestored = !isAttack && controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90;
  const isPropagating = isAttack && simulationClock.tick >= 1 && !isUnverifiedFailure;

  const signal = intelligenceAssessment?.collective_decision_signal;

  const synchrony = isUnverifiedFailure
    ? 58
    : isPropagating
    ? 94
    : isAttack
    ? (signal?.decision_synchrony_percent ?? 91)
    : isRestored
    ? 22
    : 18;

  const modelConc = isUnverifiedFailure
    ? 54
    : isPropagating
    ? 86
    : isAttack
    ? 82
    : isRestored
    ? 26
    : 22;

  const dataDep = isUnverifiedFailure
    ? 64
    : isPropagating
    ? 93
    : isAttack
    ? 91
    : isRestored
    ? 28
    : 24;

  const sellPct = isUnverifiedFailure
    ? 48
    : isPropagating
    ? 78
    : isAttack
    ? 70
    : isRestored
    ? 17
    : 15;

  const buyPct = isUnverifiedFailure
    ? 24
    : isPropagating
    ? 8
    : isAttack
    ? 12
    : isRestored
    ? 42
    : 45;

  const holdPct = 100 - sellPct - buyPct;

  const eddVal = isUnverifiedFailure
    ? 0.34
    : isPropagating
    ? 0.12
    : isAttack
    ? (signal?.effective_decision_diversity ?? 0.15)
    : isRestored
    ? 0.58
    : 0.61;

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto select-none">
      {/* 1. Header Banner */}
      <div className="fis-panel p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="font-extrabold text-base font-sans text-white">
            05. COLLECTIVE DECISION INTELLIGENCE
          </span>
          <span className="text-slate-600">|</span>
          <span className={isAttack ? 'text-red-400 font-bold' : isUnverifiedFailure ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
            {isUnverifiedFailure
              ? 'RESIDUAL CLUSTERING: Latent MODEL-C Covariance Drift (EDD = 0.34)'
              : isPropagating
              ? `MULTI-HOP CONVERGENCE: Cascade Tick #${simulationClock.tick} (EDD = 0.12)`
              : isAttack
              ? 'CONVERGENCE SHOCK: Common Oracle Correlation (EDD = 0.15)'
              : isRestored
              ? 'DIVERSITY RESTORED: Secondary Backstop Active (EDD = 0.58)'
              : 'NOMINAL BASELINE: Autonomous Equilibrium (EDD = 0.61)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
            EXPERIMENTAL PROTOTYPE METRIC
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
            IMPLEMENTED
          </span>
          <span className="text-blue-400 font-bold">EDD-0.1</span>
        </div>
      </div>

      {/* 2. Mathematical Contract Callout */}
      <div className="fis-panel p-3 bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            MATHEMATICAL CONTRACT: Effective Decision Diversity (EDD) discounts apparent institutional model vendor counts for shared oracle feature weights and temporal synchrony:
            <strong className="text-white ml-1">EDD = D_raw · (1 - Synchrony) · (1 - HHI_oracle)</strong>
          </span>
        </div>
        <span className="text-[10px] text-cyan-400 font-bold whitespace-nowrap">
          Current M(t): {controlState.control_margin_percent}%
        </span>
      </div>

      {/* 3. Primary Intelligence Dashboard (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Collective Diversity Widget Component */}
        <CollectiveDiversityWidget />

        {/* Right: Market Decision Distribution & Herding Donut */}
        <div className="fis-panel p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-300 uppercase font-bold">
                Institutional Decision Distribution
              </span>
              <span className="text-cyan-400 font-mono font-bold">
                {isUnverifiedFailure ? 'Post-Action 1 (Latent Drift)' : isPropagating ? `Propagating (Tick #${simulationClock.tick})` : isAttack ? 'Initial Shock (Tick #0)' : isRestored ? 'Restored Equilibrium' : 'Nominal Baseline'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-4">
              {/* Donut Chart */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" strokeDasharray="238" strokeDashoffset={isAttack || isUnverifiedFailure ? "210" : "70"} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" strokeDasharray="238" strokeDashoffset={isAttack ? "170" : "120"} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" strokeDasharray="238" strokeDashoffset={isAttack ? "70" : isUnverifiedFailure ? "125" : "210"} fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className={`text-2xl font-bold ${isAttack ? 'text-red-400' : isUnverifiedFailure ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isAttack || isUnverifiedFailure ? `${sellPct}%` : `${buyPct}%`}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase">
                    {isAttack ? 'HERD SELL' : isUnverifiedFailure ? 'LATENT SELL' : 'BUY FLOW'}
                  </span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>{buyPct}% BUY (Uncorrelated Capital)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>{holdPct}% HOLD (Liquidity Reserve Buffer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                  <span className={isAttack ? 'text-red-400 font-bold' : isUnverifiedFailure ? 'text-amber-400 font-bold' : ''}>
                    {sellPct}% SELL ({isAttack ? 'Synchronized Liquidation' : isUnverifiedFailure ? 'Residual MODEL-C Liquidation' : 'Normal Rebalancing'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Correlation Metrics */}
          <div className="space-y-2 text-xs font-mono bg-[#050914] p-3 rounded border border-slate-800">
            <div className="flex justify-between items-center text-slate-300">
              <span>Model Output Concentration:</span>
              <span className={`font-bold ${modelConc > 50 ? 'text-red-400' : 'text-emerald-400'}`}>{modelConc}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Shared Oracle Dependency (DATA-X / Cache):</span>
              <span className={`font-bold ${dataDep > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{dataDep}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Decision Synchrony Index:</span>
              <span className={`font-bold ${synchrony > 50 ? 'text-red-400' : 'text-emerald-400'}`}>{synchrony}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep Causal Explanation: State-Derived Causal Transmission Vector */}
      <div className="fis-panel p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <h3 className="text-xs uppercase font-bold text-slate-300">
            State-Derived Causal Transmission Vector
          </h3>
          <span className="text-[10px] text-cyan-400 font-bold">
            Active Phase: {isUnverifiedFailure ? 'LATENT MODEL-C CONTAGION (42%)' : isPropagating ? `CASCADE PROPAGATION (TICK #${simulationClock.tick})` : isAttack ? 'INITIAL ORACLE SHOCK (65%)' : isRestored ? 'POST-BACKSTOP RECOVERY (84%)' : 'NOMINAL BASELINE (91%)'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded bg-[#060a14] border border-slate-800 space-y-1">
            <span className="text-[10px] text-red-400 font-bold">STAGE 1: UPSTREAM SIGNAL</span>
            <div className="text-white font-bold">
              {isUnverifiedFailure ? 'DATA-X Isolated / Cache Active' : isAttack ? 'DATA-X Oracle Compromise' : isRestored ? 'Fallback Oracle Quorum' : 'Verified Multi-Oracle Feed'}
            </div>
            <div className="text-slate-400 text-[10px]">
              {isUnverifiedFailure
                ? 'Primary DATA-X feed severed, but MODEL-C retains unpurged swap drift tensor.'
                : isAttack
                ? 'Rates feed broadcasts poisoned price vector (+18.4% drift) across shared data bus.'
                : isRestored
                ? 'Secondary verified oracle quorum active; poisoned tensors flushed.'
                : 'Oracle variance within ±0.12% normal corridor across 20 G-SIBs.'}
            </div>
          </div>

          <div className="p-3 rounded bg-[#060a14] border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold">STAGE 2: FEATURE INGEST</span>
            <div className="text-white font-bold">
              {isUnverifiedFailure ? 'MODEL-C Covariance Drift' : isAttack ? 'Common Tensor Ingestion' : 'Independent Feature Weights'}
            </div>
            <div className="text-slate-400 text-[10px]">
              {isUnverifiedFailure
                ? 'MODEL-A decoupled after Action 1, but MODEL-C credit engine continues correlated haircuts.'
                : isAttack
                ? 'MODEL-A, MODEL-B, MODEL-C ingest poisoned rates into risk weights simultaneously.'
                : 'Institutional AI models evaluate uncorrelated feature distributions.'}
            </div>
          </div>

          <div className="p-3 rounded bg-[#060a14] border border-slate-800 space-y-1">
            <span className="text-[10px] text-purple-400 font-bold">STAGE 3: COLLECTIVE RESPONSE</span>
            <div className="text-white font-bold">Effective Diversity {eddVal.toFixed(2)}</div>
            <div className="text-slate-400 text-[10px]">
              {isUnverifiedFailure
                ? 'Partial diversity rebound (0.15 → 0.34), yet 58% synchrony persists across credit desks.'
                : isAttack
                ? `Apparent vendor diversity (0.88) collapses to ${eddVal.toFixed(2)}; ${synchrony}% synchronized SELL flow.`
                : `Effective Decision Diversity maintained at ${eddVal.toFixed(2)} (${synchrony}% synchrony).`}
            </div>
          </div>

          <div className="p-3 rounded bg-[#060a14] border border-slate-800 space-y-1">
            <span className="text-[10px] text-rose-400 font-bold">STAGE 4: CONTROL IMPACT</span>
            <div className="text-white font-bold">Control Margin M(t) = {controlState.control_margin_percent}%</div>
            <div className="text-slate-400 text-[10px]">
              {isUnverifiedFailure
                ? 'Latent MODEL-C run holds M(t) at 42% (< 65% gate), requiring Reassessment.'
                : isAttack
                ? `Synchronized runs degrade Control Margin to ${controlState.control_margin_percent}% (${controlState.intervention_window_seconds}s window).`
                : `Systemic controllability buffer healthy at ${controlState.control_margin_percent}%.`}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Next Step Action Navigation */}
      <div className="fis-panel p-3.5 bg-[#080e1a] border border-[#16233b] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">
          {isUnverifiedFailure
            ? 'Latent MODEL-C correlation identified as cause of Verification Failure. Proceed to Reassessment.'
            : isAttack
            ? 'Collective AI convergence confirmed. Proceed to evaluate multi-hop cascade propagation across clearing rails.'
            : 'Collective decision diversity nominal. Inspect propagation or control margin.'}
        </span>
        <button
          type="button"
          onClick={() => setCurrentRoute(isUnverifiedFailure ? 'reassessment' : 'propagation')}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
        >
          <span>{isUnverifiedFailure ? 'Open Reassessment (11)' : 'Trace Cascade Propagation (06)'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CollectiveIntelligenceView;
