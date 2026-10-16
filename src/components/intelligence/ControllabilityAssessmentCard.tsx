import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { ControllabilityState } from '@shared/types/intelligence';

export const ControllabilityAssessmentCard: React.FC = () => {
  const { intelligenceAssessment, controlState } = useSystemStore();

  const assessment = intelligenceAssessment || controlState.intelligence;
  const state: ControllabilityState = assessment?.controllability_state || controlState.controllability_state || 'CONTROL_STABLE';
  const windowSec = assessment?.estimated_intervention_window_sec || controlState.intervention_window_seconds || 120;

  const getStateBadge = (st: ControllabilityState) => {
    switch (st) {
      case 'CONTROL_STABLE':
        return { label: 'CONTROL STABLE', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
      case 'CONTROL_DEGRADING':
        return { label: 'CONTROL DEGRADING', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
      case 'CONTROL_CRITICAL':
        return { label: 'CONTROL CRITICAL', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };
      case 'CONTROL_COLLAPSING':
        return { label: 'CONTROL COLLAPSING', bg: 'bg-red-600/20 border-red-500/50 text-red-300' };
      case 'CONTROL_RECOVERING':
        return { label: 'CONTROL RECOVERING', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400' };
      case 'CONTROL_RESTORED':
        return { label: 'CONTROL RESTORED', bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' };
      case 'CONTROL_UNVERIFIED':
        return { label: 'CONTROL UNVERIFIED (RESIDUAL RISK)', bg: 'bg-purple-500/15 border-purple-500/40 text-purple-300' };
      default:
        return { label: 'CONTROL STABLE', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
    }
  };

  const badge = getStateBadge(state);

  return (
    <div className="bg-[#0a1322]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Systemic Controllability Assessment
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-900 border-slate-700 text-slate-400">
            MODEL {assessment?.model_versions.control_margin_model || 'CM-0.2'}
          </span>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${badge.bg}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#060a12]/70 border border-slate-800/60 rounded-lg p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Intervention Window
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-100">{windowSec}s</span>
            <span className="text-[10px] font-mono text-amber-400/90">[SIMULATED]</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Remaining influence capacity envelope</p>
        </div>

        <div className="bg-[#060a12]/70 border border-slate-800/60 rounded-lg p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Propagation Scope
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-100">
              {assessment?.propagation_intelligence.scope || 'LOCALIZED'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({assessment?.propagation_intelligence.breadth_affected_nodes || 0} nodes)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Depth: {assessment?.propagation_intelligence.maximum_depth_hops || 0} hops @ {assessment?.propagation_intelligence.cascade_velocity_nodes_per_sec || 0} n/s
          </p>
        </div>
      </div>

      {/* Primary Driver */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-2.5 mb-2">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-0.5">
          Primary Controllability Driver
        </div>
        <p className="text-xs text-slate-200 font-medium">
          {assessment?.primary_driver || 'System in baseline equilibrium. All dependency and clearing rails operational.'}
        </p>
      </div>

      {/* Secondary & Protective Factors */}
      <div className="space-y-1.5 text-[11px]">
        {assessment?.secondary_drivers && assessment.secondary_drivers.length > 0 && (
          <div className="flex items-start gap-1.5 text-slate-300">
            <span className="text-amber-400 text-xs mt-0.5">▸</span>
            <span><strong className="text-slate-400">Amplifier:</strong> {assessment.secondary_drivers[0]}</span>
          </div>
        )}
        {assessment?.protective_factors && assessment.protective_factors.length > 0 && (
          <div className="flex items-start gap-1.5 text-slate-300">
            <span className="text-emerald-400 text-xs mt-0.5">✓</span>
            <span><strong className="text-slate-400">Protective Factor:</strong> {assessment.protective_factors[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};
