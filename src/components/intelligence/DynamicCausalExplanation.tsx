import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';

export const DynamicCausalExplanation: React.FC = () => {
  const { intelligenceAssessment } = useSystemStore();
  const chain = intelligenceAssessment?.causal_explanation_chain || [
    'System operating within normal baseline equilibrium; no active origin failure detected.'
  ];

  return (
    <div className="bg-[#0a1322]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            State-Derived Causal Progression Chain
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          PROVENANCE MODEL {intelligenceAssessment?.model_versions.propagation_model || 'PROP-0.2'}
        </span>
      </div>

      <div className="space-y-2.5">
        {chain.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono text-[10px] font-bold">
                {idx + 1}
              </div>
              {idx < chain.length - 1 && (
                <div className="w-0.5 h-4 bg-slate-800/80 my-0.5" />
              )}
            </div>
            <div className="flex-1 bg-slate-900/40 border border-slate-800/50 rounded-lg p-2 text-xs text-slate-200">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
