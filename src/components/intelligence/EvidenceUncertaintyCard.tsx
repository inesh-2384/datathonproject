import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';

export const EvidenceUncertaintyCard: React.FC = () => {
  const { intelligenceAssessment } = useSystemStore();
  const evidence = intelligenceAssessment?.evidence_quality;

  const sufficiency = evidence?.evidence_sufficiency_score ?? 0.94;
  const confidence = evidence?.confidence_rating ?? 'HIGH';
  const conflict = evidence?.conflict_detected ?? false;
  const gaps = evidence?.observation_gaps ?? [];

  const getConfidenceBadge = (conf: string) => {
    switch (conf) {
      case 'HIGH':
      case 'CRYPTOGRAPHIC_PROOF':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      case 'MEDIUM':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'LOW':
      case 'VERY_LOW':
      default:
        return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
    }
  };

  return (
    <div className="bg-[#0a1322]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Evidence Quality & Epistemic Uncertainty
          </h3>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getConfidenceBadge(confidence)}`}>
          CONFIDENCE: {confidence}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#060a12]/70 border border-slate-800/60 rounded-lg p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Sufficiency Score
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {Math.round(sufficiency * 100)}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Telemetry coverage depth</p>
        </div>

        <div className="bg-[#060a12]/70 border border-slate-800/60 rounded-lg p-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Telemetry Freshness
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {evidence?.average_freshness_seconds ?? 1.2}s
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Virtual timestamp lag</p>
        </div>
      </div>

      {/* Conflict Alert */}
      {conflict && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-lg p-2.5 mb-2.5 flex items-start gap-2">
          <span className="text-rose-400 font-bold text-xs mt-0.5">⚠️</span>
          <div>
            <div className="text-[10px] font-mono text-rose-300 uppercase font-semibold">
              Telemetry Conflict Detected
            </div>
            <p className="text-[11px] text-slate-300">
              {evidence?.conflict_description || 'Surface telemetry contradicts underlying collateral stress.'}
            </p>
          </div>
        </div>
      )}

      {/* Observation Gaps */}
      {gaps.length > 0 ? (
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
            Observation Gaps ({gaps.length})
          </div>
          {gaps.map((gap, idx) => (
            <div key={idx} className="text-[11px] text-slate-300 bg-slate-900/50 px-2 py-1 rounded border border-slate-800/40 flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">▪</span>
              <span>{gap}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900/30 px-2 py-1.5 rounded border border-slate-800/40">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Zero observation gaps; all enclave telemetry streams attested.</span>
        </div>
      )}
    </div>
  );
};
