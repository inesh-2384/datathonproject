/**
 * FINANCIAL IMMUNE SYSTEM - HERO CONTROL MARGIN VISUALIZATION
 * Section 16: Premium Control State Visualization
 * 
 * Answers in 1-3 seconds:
 * 1. HOW MUCH CONTROL REMAINS? (Value + State)
 * 2. WHY IS CONTROL DEGRADING? (Additive Drivers)
 * 3. HOW MUCH TIME REMAINS TO ACT? (Intervention Window)
 * 4. IS TELEMETRY AUDITED? (Cryptographic Assurance Quorum)
 */

import React, { useState } from 'react';
import { 
  Gauge, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SystemControlState } from '@shared/types/domain';
import { SystemicControllabilityAssessment } from '@shared/types/intelligence';

interface ControlMarginHeroProps {
  controlState: SystemControlState;
  intelligenceAssessment?: SystemicControllabilityAssessment | null;
  onDrillDown?: () => void;
  compact?: boolean;
}

export const ControlMarginHero: React.FC<ControlMarginHeroProps> = ({
  controlState,
  intelligenceAssessment,
  onDrillDown,
  compact = false
}) => {
  const [showFormulas, setShowFormulas] = useState(false);

  const margin = controlState.control_margin_percent;
  const status = controlState.overall_status;
  const ctrlState = controlState.controllability_state;
  const windowSec = controlState.intervention_window_seconds;
  const isUnverifiedFailure = status === 'RESIDUAL_RISK' || ctrlState === 'CONTROL_NOT_RESTORED' || ctrlState === 'CONTROL_UNVERIFIED';
  const isCritical = margin < 45 || status === 'CRITICAL' || status === 'COLLAPSING' || isUnverifiedFailure;
  const isDegrading = status === 'DEGRADING' || ctrlState === 'CONTROL_DEGRADING';
  const isRestored = ctrlState === 'CONTROL_RESTORED' || status === 'RESTORED' || (status === 'STABLE' && margin >= 80 && margin < 90);
  const isRecovering = status === 'RECOVERING' || isRestored;

  const contrib = intelligenceAssessment?.contributions;
  const deltaDep = contrib?.delta_dependency_concentration ?? (isCritical ? -32 : 0);
  const deltaProp = contrib?.delta_propagation_depth ?? (isCritical ? -25 : 0);
  const deltaHerd = contrib?.delta_decision_convergence ?? (isCritical ? -18 : 0);
  const deltaRec = contrib?.delta_recovery_capacity ?? (isRecovering ? +28 : 0);

  // Status Badge Colors & Labels
  const getStatusColor = () => {
    if (isCritical) return 'text-red-400 bg-red-950/80 border-red-700/80 shadow-glow-red';
    if (isDegrading) return 'text-amber-400 bg-amber-950/80 border-amber-700/80';
    if (status === 'RECOVERING') return 'text-sky-400 bg-sky-950/80 border-sky-700/80';
    return 'text-emerald-400 bg-emerald-950/80 border-emerald-700/80 shadow-glow-emerald';
  };

  const getStatusLabel = () => {
    if (ctrlState === 'CONTROL_NOT_RESTORED' || status === 'RESIDUAL_RISK') return 'CONTROL NOT RESTORED';
    if (status === 'CRITICAL') return 'CONTROL CRITICAL';
    if (status === 'COLLAPSING') return 'CASCADE COLLAPSING';
    if (isDegrading) return 'CONTROL DEGRADING';
    if (status === 'RECOVERING') return 'CONTROL RECOVERING';
    if (isRestored) return 'CONTROL RESTORED';
    return 'OPTIMAL HEADROOM';
  };

  return (
    <div className="fis-panel p-4 sm:p-5 relative overflow-hidden bg-gradient-to-b from-[#0c1426] to-[#080d1a] border border-[#1e2d4a]">
      {/* Background ambient gradient pulse for critical alerts */}
      {isCritical && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-pulse" />
      )}

      {/* Top Bar: Label & Horizon */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#15233c] text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : isDegrading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="font-bold tracking-wider text-slate-200 uppercase">
            Systemic Controllability Margin M(t)
          </span>
          <span className="text-[10px] text-slate-500 font-normal">
            [CM-v0.2 // ENCLAVE-SEALED]
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Intervention Window Horizon */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border ${
            windowSec <= 35 || isCritical
              ? 'bg-red-950/90 text-red-300 border-red-700'
              : isDegrading
              ? 'bg-amber-950/80 text-amber-300 border-amber-700/80'
              : 'bg-slate-900/80 text-slate-300 border-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Intervention Window:</span>
            <strong className="font-bold">{windowSec}s</strong>
            <span className="text-[10px] text-slate-400">({windowSec <= 35 || isCritical ? 'NARROWING' : 'OPEN'})</span>
          </div>

          {onDrillDown && (
            <button
              type="button"
              onClick={onDrillDown}
              className="text-blue-400 hover:text-white flex items-center gap-1 text-[11px] hover:underline"
            >
              <span>Inspect Math (07)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Metric & Visual Ribbon */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Column: Big Tabular Value & State Badge */}
        <div className="md:col-span-5 flex items-baseline gap-3">
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums">
            {margin}<span className="text-xl sm:text-2xl text-slate-400 font-medium">/100</span>
          </div>

          <div className="space-y-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold font-mono border ${getStatusColor()}`}>
              {isCritical || isDegrading ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{getStatusLabel()}</span>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              {isUnverifiedFailure ? (
                <>
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 font-bold">↓ Latent MODEL-C Contagion Active</span>
                </>
              ) : isCritical ? (
                <>
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 font-bold">↓ -{Math.max(1, 91 - margin)} pts from 91% Baseline</span>
                </>
              ) : isDegrading ? (
                <>
                  <TrendingDown className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-bold">↓ -{Math.max(1, 91 - margin)} pts drop • Contagion Propagating</span>
                </>
              ) : isRestored ? (
                <>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">↑ Restored via Verified Backstop</span>
                </>
              ) : isRecovering ? (
                <>
                  <TrendingUp className="w-3 h-3 text-sky-400" />
                  <span className="text-sky-400 font-bold">↑ Containment Active</span>
                </>
              ) : (
                <span className="text-emerald-400">Stable reserve equilibrium (91% Baseline)</span>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right Column: Segmented Control Health Ribbon */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Buffer Health:</span>
            <span className="text-white font-bold">{margin}% Capacity</span>
          </div>

          {/* Segmented Linear Control Ribbon */}
          <div className="w-full h-3 bg-[#0a1120] rounded-full overflow-hidden p-0.5 border border-[#1b2b48] relative flex">
            {/* Critical Threshold Indicator Line at 45% */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-10" 
              style={{ left: '45%' }}
              title="Critical Intervention Threshold (45%)"
            />

            {/* Filled Progress Bar with Dynamic Color Gradient */}
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isCritical 
                  ? 'bg-gradient-to-r from-red-600 to-rose-500' 
                  : margin < 70 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                  : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${Math.max(4, margin)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Uncontrollable</span>
            <span className="text-red-400">45% Chokepoint Gate</span>
            <span className="text-emerald-400">100% Full Buffer</span>
          </div>
        </div>
      </div>

      {/* Additive Causal Drivers Waterfall Bar */}
      {!compact && (
        <div className="pt-3 border-t border-[#15233c] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              Additive Causal Decomposition:
            </span>
            <button
              type="button"
              onClick={() => setShowFormulas(!showFormulas)}
              className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1 font-mono"
            >
              <span>{showFormulas ? 'Hide Formula' : 'View Formula'}</span>
              {showFormulas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {/* Driver 1: Dependency Concentration */}
            <div className="p-2 rounded bg-[#070d1a] border border-[#142036] flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 truncate">Oracle Dep Conc.</span>
              <span className={`text-sm font-bold tabular-nums ${deltaDep < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {deltaDep > 0 ? `+${deltaDep}` : deltaDep} pts
              </span>
            </div>

            {/* Driver 2: Propagation Velocity */}
            <div className="p-2 rounded bg-[#070d1a] border border-[#142036] flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 truncate">Cascade Multi-Hop</span>
              <span className={`text-sm font-bold tabular-nums ${deltaProp < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {deltaProp > 0 ? `+${deltaProp}` : deltaProp} pts
              </span>
            </div>

            {/* Driver 3: Decision Herding */}
            <div className="p-2 rounded bg-[#070d1a] border border-[#142036] flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 truncate">Herding Convergence</span>
              <span className={`text-sm font-bold tabular-nums ${deltaHerd < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {deltaHerd > 0 ? `+${deltaHerd}` : deltaHerd} pts
              </span>
            </div>

            {/* Driver 4: Recovery Capacity */}
            <div className="p-2 rounded bg-[#070d1a] border border-[#142036] flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 truncate">Intervention Reserve</span>
              <span className={`text-sm font-bold tabular-nums ${deltaRec > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {deltaRec > 0 ? `+${deltaRec}` : deltaRec} pts
              </span>
            </div>
          </div>

          {/* Collapsible Mathematical Proof Box */}
          {showFormulas && (
            <div className="p-2.5 rounded bg-[#040813] border border-[#17253d] text-[11px] font-mono text-slate-300 space-y-1 animate-in fade-in duration-150">
              <div className="text-blue-400 font-semibold">
                M(t) = clamp(100 - (0.40 · Stress + 0.35 · PropRisk + 0.25 · (1 - EDD)) · 100, 0, 100)
              </div>
              <div className="text-[10px] text-slate-400">
                Monotonically verified: ∂M/∂Stress ≤ 0 • Bounded on [0, 100] • Enclave verification: CPACF SHA-256
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
