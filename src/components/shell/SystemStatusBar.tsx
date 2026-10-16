/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEM STATUS FOOTER
 * Section 21: Observability Foundation
 * Section 22: Data Truth Principle
 */

import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { CapabilityTag } from '../common/CapabilityTag';
import { Cpu, Server, ShieldCheck, Database } from 'lucide-react';

export const SystemStatusBar: React.FC = () => {
  const simulationConfig = useSystemStore(state => state.simulationConfig);
  const simulationClock = useSystemStore(state => state.simulationClock);
  const connectionState = useSystemStore(state => state.connectionState);
  const connectionLatencyMs = useSystemStore(state => state.connectionLatencyMs);

  return (
    <footer className="h-8 border-t border-[#1a2942] bg-[#070b14] px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">IBM Z / LinuxONE ENCLAVE:</span>
          <CapabilityTag maturity="ARCHITECTED" />
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CRYPTOGRAPHIC LINEAGE:</span>
          <span className="text-slate-400">SHA-256 ACTIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <span>SEED:</span> <span className="text-blue-400">{simulationConfig.seed}</span>
        </div>

        <div className="hidden md:block">
          <span>TICK:</span> <span className="text-slate-300">{simulationClock.tick}</span>
        </div>

        <div>
          <span>TRANSPORT:</span> <span className="text-emerald-400">SSE ({connectionLatencyMs}ms)</span>
        </div>
      </div>
    </footer>
  );
};
