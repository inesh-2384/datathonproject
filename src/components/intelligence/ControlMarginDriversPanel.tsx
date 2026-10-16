import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';

export const ControlMarginDriversPanel: React.FC = () => {
  const { intelligenceAssessment, controlState } = useSystemStore();
  const contrib = intelligenceAssessment?.contributions;

  const baseline = contrib?.baseline_margin || 91;
  const deltaDep = contrib?.delta_dependency_concentration || 0;
  const deltaProp = contrib?.delta_propagation_depth || 0;
  const deltaInfra = contrib?.delta_infrastructure_stress || 0;
  const deltaHerd = contrib?.delta_decision_convergence || 0;
  const deltaRec = contrib?.delta_recovery_capacity || 0;
  const netMargin = contrib?.net_control_margin || controlState.control_margin_percent || 91;

  const drivers = [
    { label: 'Oracle & Dependency Concentration', value: deltaDep, color: 'text-rose-400', barBg: 'bg-rose-500/30' },
    { label: 'Multi-Hop Cascade Depth', value: deltaProp, color: 'text-amber-400', barBg: 'bg-amber-500/30' },
    { label: 'Core Infrastructure Outage', value: deltaInfra, color: 'text-red-400', barBg: 'bg-red-500/30' },
    { label: 'Collective Decision Herding', value: deltaHerd, color: 'text-purple-400', barBg: 'bg-purple-500/30' },
    { label: 'Active Recovery Capacity', value: deltaRec, color: 'text-emerald-400', barBg: 'bg-emerald-500/30', isPositive: true },
  ];

  return (
    <div className="bg-[#0a1322]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Control Margin Contribution Analysis
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          M(t) = M₀ + Σ ΔMᵢ
        </span>
      </div>

      <div className="flex items-center justify-between bg-[#060a12]/80 border border-slate-800/60 rounded-lg p-2.5 mb-3 font-mono text-xs">
        <div>
          <span className="text-slate-400">Baseline M₀:</span>
          <span className="ml-1.5 font-bold text-slate-200">{baseline}%</span>
        </div>
        <div className="text-slate-500">→</div>
        <div>
          <span className="text-slate-400">Current Margin M(t):</span>
          <span className={`ml-1.5 font-bold ${netMargin < 30 ? 'text-rose-400' : netMargin < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {netMargin}%
          </span>
        </div>
      </div>

      {/* Contribution Rows */}
      <div className="space-y-2">
        {drivers.map(d => {
          const formattedVal = d.isPositive ? `+${d.value}%` : `${d.value}%`;
          const widthPct = Math.min(100, Math.abs(d.value) * 3);

          return (
            <div key={d.label} className="bg-slate-900/40 rounded p-1.5 border border-slate-800/40">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">{d.label}</span>
                <span className={`font-mono font-semibold ${d.color}`}>
                  {formattedVal}
                </span>
              </div>
              <div className="w-full bg-slate-800/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${d.barBg} transition-all duration-500`}
                  style={{ width: `${Math.max(2, widthPct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/40 flex justify-between text-[10px] text-slate-400">
        <span>PRIMARY DRIVER:</span>
        <span className="text-slate-300 font-medium">
          {contrib?.primary_driver_category || 'Equilibrium'}
        </span>
      </div>
    </div>
  );
};
