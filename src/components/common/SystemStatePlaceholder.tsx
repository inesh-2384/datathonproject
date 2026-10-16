/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEM STATE PLACEHOLDER
 * Section 7: Application Routing
 * Section 22: Data Truth Principle
 * 
 * Used for architected modules awaiting engine implementation in subsequent phases.
 * Communicates technical intent and architectural contracts without fake charts.
 */

import React from 'react';
import { CapabilityTag } from './CapabilityTag';
import { StatusBadge } from './StatusBadge';
import { Layers, Terminal, ArrowRight, ShieldCheck, Database } from 'lucide-react';

interface SystemStatePlaceholderProps {
  title: string;
  moduleCode: string;
  category: string;
  description: string;
  targetPhase: string;
  mathematicalContract: string;
  domainInputs: string[];
  expectedOutputs: string[];
  icon?: React.ReactNode;
}

export const SystemStatePlaceholder: React.FC<SystemStatePlaceholderProps> = ({
  title,
  moduleCode,
  category,
  description,
  targetPhase,
  mathematicalContract,
  domainInputs,
  expectedOutputs,
  icon
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="fis-panel p-6 border-l-4 border-l-blue-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-950/60 border border-blue-600/40 rounded-lg text-blue-400">
              {icon || <Layers className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {category} MODULE
                </span>
                <span className="text-xs font-mono text-slate-600">/</span>
                <span className="text-xs font-mono text-blue-400">{moduleCode}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="STABLE" size="sm" showPulse={false} />
            <CapabilityTag maturity="ARCHITECTED" />
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          {description}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2 text-amber-400">
            <Terminal className="w-4 h-4" />
            MODULE INITIALIZING &mdash; Architectural contract verified. Full engine active in {targetPhase}.
          </span>
          <span className="text-slate-500">FIS-ARCH-SPEC v1.0</span>
        </div>
      </div>

      {/* Grid of Contracts & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mathematical & Algorithmic Contract */}
        <div className="fis-panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3>Algorithmic & Mathematical Contract</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-950/60 p-3 rounded border border-slate-800">
            {mathematicalContract}
          </p>
          <div className="text-[11px] text-slate-500">
            * Formal proof specifications bound to shared domain models in <code className="text-blue-400">shared/types/domain.ts</code>.
          </div>
        </div>

        {/* Input/Output Data Pipelines */}
        <div className="fis-panel p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3>Domain Boundary Interfaces</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider block mb-1.5">
                Ingested Domain Inputs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {domainInputs.map((input, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-300"
                  >
                    {input}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider block mb-1.5">
                Governed Verification Outputs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {expectedOutputs.map((output, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-blue-950/50 border border-blue-700/50 font-mono text-[11px] text-blue-300"
                  >
                    {output}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Point Notice */}
      <div className="fis-panel p-4 bg-slate-950/40 border border-dashed border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>
            Zero fake visual metrics policy active. This module surface is ready for Phase {targetPhase.slice(-1)} calculation pipelines without application restructuring.
          </span>
        </div>
        <span className="font-mono text-slate-500 uppercase text-[10px]">Deterministic Hook Ready</span>
      </div>
    </div>
  );
};
