import React, { useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { 
  Info, 
  X, 
  ArrowRight, 
  AlertTriangle, 
  Database, 
  Cpu, 
  ShieldAlert,
  HelpCircle,
  TrendingDown,
  Layers,
  GitBranch,
  CheckCircle2
} from 'lucide-react';

export type CDIInspectionMode = 'WHY' | 'DRILL_DOWN' | 'ROOT_CAUSE' | null;

export const CollectiveDiversityWidget: React.FC = () => {
  const { intelligenceAssessment, controlState, scenarioState, activeIncident, simulationClock, selectEntity, setCurrentRoute } = useSystemStore();
  const [activeMode, setActiveMode] = useState<CDIInspectionMode>(null);

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const isUnverifiedFailure = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED';
  const isRestored = !isAttack && controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90;
  const isPropagating = isAttack && simulationClock.tick >= 1 && !isUnverifiedFailure;

  const signal = intelligenceAssessment?.collective_decision_signal;

  // Derive authoritative phase-coherent CDI metrics
  const observed = signal?.observed_model_diversity ?? 0.88;
  const effective = isUnverifiedFailure
    ? 0.34
    : isPropagating
    ? 0.12
    : isAttack
    ? (signal?.effective_decision_diversity ?? 0.15)
    : isRestored
    ? 0.58
    : 0.61;

  const synchrony = isUnverifiedFailure
    ? 58
    : isPropagating
    ? 94
    : isAttack
    ? (signal?.decision_synchrony_percent ?? 91)
    : isRestored
    ? 22
    : 18;

  const herding = isUnverifiedFailure
    ? 0.61
    : isPropagating
    ? 0.92
    : isAttack
    ? (signal?.herding_correlation_index ?? 0.89)
    : isRestored
    ? 0.25
    : 0.22;

  const oracleHhi = isUnverifiedFailure
    ? 0.64
    : isAttack
    ? 0.73
    : isRestored
    ? 0.48
    : 0.57;

  const alignment = isUnverifiedFailure
    ? 'LATENT_MODEL_C_CLUSTERING'
    : isAttack
    ? (signal?.recommendation_alignment ?? 'CONVERGED_SYNCHRONIZED')
    : isRestored
    ? 'DIVERGENT_RESTORED'
    : 'DIVERGENT';

  const getAlignmentStyle = (align: string) => {
    if (align.includes('CONVERGED')) return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
    if (align.includes('LATENT') || align.includes('CORRELATED')) return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
    return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
  };

  return (
    <div className="bg-[#0a1322]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md relative space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Collective Decision Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-purple-950/40 border-purple-800/40 text-purple-300">
            EXPERIMENTAL
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getAlignmentStyle(alignment)}`}>
            {alignment.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Apparent vs Effective Diversity Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#060a12]/70 border border-slate-800/60 rounded-lg p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Observed Diversity
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
              INVARIANT (8 VENDORS)
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {observed.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            NO MATERIAL INCREMENTAL CDI VENDOR CHANGE (Static 8 vendors, EDD = 0.15 / 1.2 effective independent strategies)
          </p>
        </div>

        {/* Interactive Effective Diversity Card with WHY? and Drill Down Controls */}
        <div 
          className={`bg-[#060a12]/70 border rounded-lg p-2.5 transition-all relative ${
            effective < 0.20 
              ? 'border-rose-900/60 bg-rose-950/10' 
              : effective < 0.40 
                ? 'border-amber-900/60 bg-amber-950/10' 
                : 'border-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Effective Diversity
            </span>
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'WHY' ? null : 'WHY')}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-0.5 transition-all ${
                activeMode === 'WHY'
                  ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                  : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50 hover:bg-cyan-900/80 hover:text-cyan-200'
              }`}
              title="Inspect mathematical calculation and parameter explanation for Effective Decision Diversity"
            >
              <HelpCircle className="w-2.5 h-2.5" />
              <span>WHY?</span>
            </button>
          </div>
          <div className={`text-xl font-bold font-mono ${effective < 0.20 ? 'text-rose-400' : effective < 0.40 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {effective.toFixed(2)}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[10px] text-slate-400">Discounted for shared oracles (1.2 independent strategies)</p>
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'DRILL_DOWN' ? null : 'DRILL_DOWN')}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all ${
                activeMode === 'DRILL_DOWN'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-cyan-400 hover:underline'
              }`}
            >
              Drill Down →
            </button>
          </div>
        </div>
      </div>

      {/* Decision Synchrony & Herding Metrics */}
      <div className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300">Decision Synchrony (Temporal Clustering)</span>
            <span className={`font-mono font-semibold ${synchrony > 75 ? 'text-rose-400' : synchrony > 40 ? 'text-amber-400' : 'text-slate-200'}`}>
              {synchrony}%
            </span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${synchrony > 75 ? 'bg-rose-500' : synchrony > 40 ? 'bg-amber-500' : 'bg-purple-500'} transition-all duration-500`}
              style={{ width: `${synchrony}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300">Pairwise Herding Correlation</span>
            <span className={`font-mono font-semibold ${herding > 0.70 ? 'text-amber-400' : 'text-slate-200'}`}>
              {herding.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${herding > 0.70 ? 'bg-amber-500' : 'bg-cyan-500'} transition-all duration-500`}
              style={{ width: `${herding * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Bar: WHY?, Drill Down, Explain Root Cause */}
      <div className="pt-2 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            data-testid="cdi-why-btn"
            onClick={() => setActiveMode('WHY')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeMode === 'WHY'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500'
            }`}
          >
            WHY? (Formula)
          </button>
          <button
            type="button"
            data-testid="cdi-drilldown-btn"
            onClick={() => setActiveMode('DRILL_DOWN')}
            className={`px-2 py-1 rounded border transition-colors ${
              activeMode === 'DRILL_DOWN'
                ? 'bg-purple-600 text-white border-purple-400 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-500'
            }`}
          >
            Drill Down (Dependencies)
          </button>
        </div>
        <button
          type="button"
          data-testid="cdi-rootcause-btn"
          onClick={() => setActiveMode(activeMode === 'ROOT_CAUSE' ? null : 'ROOT_CAUSE')}
          className={`px-2.5 py-1 rounded border font-mono flex items-center gap-1 transition-colors ${
            activeMode === 'ROOT_CAUSE'
              ? 'bg-blue-600 text-white border-blue-400 font-bold'
              : 'bg-blue-950/60 hover:bg-blue-900 border-blue-800/60 text-cyan-300'
          }`}
        >
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Explain Root Cause</span>
        </button>
      </div>

      {/* =========================================================================
          STATE-AWARE INLINE INSPECTION PANEL (SECTION 9: WHY? / DRILL DOWN / ROOT CAUSE)
          ========================================================================= */}
      {activeMode === 'WHY' && (
        <div className="p-3 rounded-lg bg-[#050914] border border-cyan-700/60 space-y-2 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-cyan-400 font-bold uppercase text-[11px]">
              WHY EFFECTIVE DIVERSITY COLLAPSED DESPITE 8 OBSERVED VENDORS — Mathematical & Dependency Calculation
            </span>
            <button type="button" onClick={() => setActiveMode(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 text-[11px]">
            EDD = D_raw ({observed.toFixed(2)}) × (1 - Synchrony { (synchrony / 100).toFixed(2) }) × (1 - HHI_oracle {oracleHhi.toFixed(2)}) = <strong>{effective.toFixed(2)}</strong>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Current Metric</div>
              <div className="text-white font-bold">EDD = {effective.toFixed(2)}</div>
              <div className="text-slate-500">Baseline: 0.61</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Oracle Concentration</div>
              <div className="text-amber-400 font-bold">HHI = {oracleHhi.toFixed(2)}</div>
              <div className="text-slate-500">Hub: DATA-X</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Evidence Context</div>
              <div className="text-emerald-400 font-bold">TRC-RN-2026-0041</div>
              <div className="text-slate-500">Tick #{simulationClock.tick}</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 font-sans">
            {isUnverifiedFailure
              ? 'Although primary DATA-X feed isolation reduced synchrony from 91% to 58%, MODEL-C still shares cached swap covariance weights, holding Effective Diversity at 0.34 (below the 0.45 safe threshold).'
              : isAttack
              ? '8 distinct AI model vendors appear diversified on paper (D_raw = 0.88), but 91% temporal synchrony and 0.73 DATA-X oracle concentration collapse Effective Decision Diversity to ' + effective.toFixed(2) + '.'
              : isRestored
              ? 'Following secondary MODEL-C quarantine and fallback oracle activation, HHI dropped to 0.48 and Synchrony fell to 22%, restoring Effective Decision Diversity to 0.58.'
              : 'At nominal baseline, institutional models operate with independent feature weights (Synchrony 18%, EDD = 0.61).'}
          </div>
        </div>
      )}

      {activeMode === 'DRILL_DOWN' && (
        <div className="p-3 rounded-lg bg-[#050914] border border-purple-700/60 space-y-2 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-purple-300 font-bold uppercase text-[11px]">
              INSTITUTION-BY-INSTITUTION SYNCHRONY DRILL-DOWN — Dependency Structure & Contributing Factors
            </span>
            <button type="button" onClick={() => setActiveMode(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Dependency Structure:</span>
              <span className="text-white font-bold">DATA-X → [MODEL-A (52% wt), MODEL-C (48% wt)] → 8 G-SIBs</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Contributing Factors:</span>
              <span className="text-amber-300 font-bold">
                {isUnverifiedFailure
                  ? 'Cached Swap Covariance Matrix in MODEL-C (58% Synchrony)'
                  : isAttack
                  ? 'Shared Upstream Oracle (91%) + Volatility Loss Heuristic (82%)'
                  : 'Diversified Multi-Oracle Quorum Active (24% Dependency)'}
              </span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Evidence Lineage & Scenario Linkage:</span>
              <span className="text-cyan-300 font-bold">
                {activeIncident?.incident_id || 'RN-2026-0041'} • {controlState.scenario_name}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => selectEntity('DATA-X')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[10px]"
            >
              Inspect DATA-X Oracle
            </button>
            <button
              type="button"
              onClick={() => setCurrentRoute('system-map')}
              className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
            >
              Open Dependency Map (04) →
            </button>
          </div>
        </div>
      )}

      {activeMode === 'ROOT_CAUSE' && (
        <div className="p-3 rounded-lg bg-[#050914] border border-blue-600/70 space-y-2.5 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-blue-300 font-bold uppercase text-[11px]">
              ROOT CAUSE ATTRIBUTION: SHARED ORACLE COVARIANCE LOCK — State-Derived Causal Chain ({isUnverifiedFailure ? 'LATENT MODEL-C PHASE' : isAttack ? 'ACTIVE SHOCK PHASE' : isRestored ? 'RESTORED PHASE' : 'NOMINAL BASELINE'})
            </span>
            <button type="button" onClick={() => setActiveMode(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 rounded bg-slate-900/90 border-l-2 border-red-500 flex items-center justify-between">
              <span className="text-red-400 font-bold">1. DATA-X ORACLE</span>
              <span className="text-slate-200">
                {isUnverifiedFailure
                  ? 'Primary feed isolated at gateway, but prior +18.4% drift cached'
                  : isAttack
                  ? 'Broadcasts +18.4% corrupted swap rate tensor across oracle bus'
                  : isRestored
                  ? 'Quarantined; fallback secondary oracle feed active'
                  : 'Broadcasting verified swap rates (±0.12% variance)'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/90 border-l-2 border-amber-500 flex items-center justify-between">
              <span className="text-amber-400 font-bold">2. SHARED UPSTREAM SIGNAL</span>
              <span className="text-slate-200">
                {isUnverifiedFailure
                  ? 'MODEL-C retains unpurged cross-currency swap covariance state'
                  : isAttack
                  ? '91% of institutional models ingest identical corrupted tensor'
                  : 'Models ingesting independent multi-source pricing feeds'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/90 border-l-2 border-purple-500 flex items-center justify-between">
              <span className="text-purple-400 font-bold">3. CORRELATED MODEL RESPONSE</span>
              <span className="text-slate-200">
                {isUnverifiedFailure
                  ? 'Effective Diversity held at 0.34 (58% Synchrony across credit desks)'
                  : isAttack
                  ? `Effective Diversity collapses to ${effective.toFixed(2)} (${synchrony}% Synchrony)`
                  : `Effective Diversity maintained at ${effective.toFixed(2)} (${synchrony}% Synchrony)`}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/90 border-l-2 border-cyan-500 flex items-center justify-between">
              <span className="text-cyan-400 font-bold">4. SYNCHRONIZED INSTITUTIONAL ACTION</span>
              <span className="text-slate-200">
                {isUnverifiedFailure
                  ? 'BANK-C & CCP continue variation margin calls (€310M residual drain)'
                  : isAttack
                  ? '8 G-SIBs simultaneously dispatch one-way SELL liquidations (€800M)'
                  : 'Balanced two-way institutional order flow across G-SIBs'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/90 border-l-2 border-rose-500 flex items-center justify-between">
              <span className="text-rose-400 font-bold">5. SYSTEMIC PROPAGATION</span>
              <span className="text-slate-200">
                {isUnverifiedFailure
                  ? 'Control Margin stuck at 42% (< 65% gate) → Reassessment Required'
                  : isAttack
                  ? `Degrades Control Margin M(t) to ${controlState.control_margin_percent}%`
                  : `Systemic Control Margin stable at ${controlState.control_margin_percent}%`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
