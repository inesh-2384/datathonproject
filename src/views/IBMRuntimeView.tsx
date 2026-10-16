/**
 * FINANCIAL IMMUNE SYSTEM - IBM Z / LINUXONE RUNTIME VIEW
 * Phase 5 Enterprise Execution Substrate, Capability Matrix & Runtime Truth
 * 
 * Strict Data Truth:
 * - Architecture is NOT implementation.
 * - Simulation is NOT live hardware connection.
 * - IBM Z does NOT independently solve systemic risk.
 * - Honest labeling: ARCHITECTED, SIMULATED, IMPLEMENTED, IBM_INTEGRATED.
 */

import React, { useEffect } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { CapabilityTag } from '../components/common/CapabilityTag';
import { Server, ArrowRight, ShieldCheck, Terminal, Cpu, Database, Lock, CheckCircle2, HardDrive, Layers } from 'lucide-react';

export const IBMRuntimeView: React.FC = () => {
  const ibmRuntimeTruth = useSystemStore(state => state.ibmRuntimeTruth);
  const fetchAssuranceState = useSystemStore(state => state.fetchAssuranceState);

  useEffect(() => {
    fetchAssuranceState();
  }, [fetchAssuranceState]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Header */}
      <div className="fis-panel p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base font-sans text-white flex items-center gap-2">
              IBM Z & LINUXONE RUNTIME CONTEXT
              <CapabilityTag maturity="IMPLEMENTED" />
            </div>
            <div className="text-[11px] text-blue-400">
              Enterprise Execution Substrate, Hardware Cryptography & Truth Mapping
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Runtime Mode: <strong className="text-cyan-400 font-bold">LOCAL SIMULATION</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">IBM Z Architecture</span>
        </div>
      </div>

      {/* Section 28: IBM Runtime Truth Panel */}
      <div className="fis-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            IBM Z / LinuxONE Runtime Truth Panel (Transparency Audit)
          </h3>
          <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 font-bold">
            TRUTH AUDIT ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Runtime Mode</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.runtimeMode || 'LOCAL_SIMULATION'}</div>
            <div className="text-[9px] text-slate-500 mt-1">Prototype Enclave</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Data Source</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.dataSource || 'SIMULATED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">Deterministic Graph</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Event Stream</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.eventStream || 'SIMULATED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">SSE Transport</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">AI Inference</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.aiInference || 'SIMULATED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">In-Memory Engine</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Enterprise Data</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.enterpriseData || 'SIMULATED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">Db2 Architected</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Hardware</span>
            <div className="text-xs font-bold text-amber-400">{ibmRuntimeTruth?.hardware || 'ARCHITECTED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">s390x Target</div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[9px] uppercase text-slate-500 block mb-1">Attestation</span>
            <div className="text-xs font-bold text-cyan-400">{ibmRuntimeTruth?.attestation || 'SIMULATED'}</div>
            <div className="text-[9px] text-slate-500 mt-1">Demo Enclave Token</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Architecture Diagram & Component Capability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enterprise Execution Environment Architecture */}
        <div className="lg:col-span-2 fis-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Enterprise Execution Environment Architecture
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Confidential Enclave</span>
          </div>

          {/* Visual Architecture Flow Diagram */}
          <div className="bg-[#070b14] p-5 rounded-lg border border-slate-800 space-y-5">
            {/* Layer 1: Financial Ingress & Hardware Crypto Substrate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded bg-blue-950/30 border border-blue-700/40 space-y-1">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                  Financial Clients Ingress
                </span>
                <div className="text-xs font-semibold text-white">Trade Feeds, Market Oracles & RTGS Rails</div>
                <div className="text-[11px] text-slate-400 font-mono">mTLS / Encrypted Ingress Enclave</div>
              </div>

              <div className="p-3.5 rounded bg-indigo-950/30 border border-indigo-700/40 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                  IBM Z / LinuxONE Hardware Substrate
                </span>
                <div className="text-xs font-semibold text-white">Core Banking & Swift Transaction Co-Location</div>
                <div className="text-[11px] text-slate-400 font-mono">CPACF Silicon Cryptographic Acceleration</div>
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex justify-center text-blue-500">
              <div className="h-4 w-0.5 bg-blue-500" />
            </div>

            {/* Layer 2: LinuxONE / OpenShift (FIS Services) */}
            <div className="p-4 rounded bg-slate-900/60 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Red Hat OpenShift on LinuxONE (FIS Service Layer)</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  CONTAINERIZED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                  <Cpu className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold">Graph Intelligence</div>
                  <div className="text-[9px] text-slate-500">(Dependency & HHI)</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                  <Database className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold">AI/ML Inference</div>
                  <div className="text-[9px] text-slate-500">(Telum Matrix Accelerator)</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold">Control Foundry</div>
                  <div className="text-[9px] text-slate-500">(Governed Action Bus)</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold">Independent Verifier</div>
                  <div className="text-[9px] text-slate-500">(Tamper-Evident Enclave)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 30: IBM Z-First Rationale */}
          <div className="p-4 rounded bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              Technical Substrate Justification (Why IBM Z / LinuxONE?)
            </h4>
            <div className="text-[11px] text-slate-400 font-sans leading-relaxed space-y-1.5">
              <p>
                <strong>Zero-Egress Data Proximity:</strong> 70%+ of global banking transactions touch IBM Z mainframes. 
                Running the Financial Immune System on LinuxONE eliminates cloud network latency when calculating real-time liquidity shocks.
              </p>
              <p>
                <strong>Hardware Cryptographic Acceleration (CPACF):</strong> Silicon-level SHA-256 computation enables continuous 
                cryptographic verification of every evidence block and authorization token without CPU degradation.
              </p>
              <p>
                <strong>Confidential Enclaves [TARGET]:</strong> IBM Secure Execution is architected to ensure that cross-firm liquidity exposures can be computed 
                without exposing proprietary trading positions to unauthorized host hypervisors.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: IBM Technology Mapping Table */}
        <div className="fis-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Technology Mapping Matrix
            </span>
            <span className="text-blue-400 font-mono text-xs">Maturity Map</span>
          </div>

          <div className="space-y-3">
            {ibmRuntimeTruth?.capabilities.map(item => (
              <div
                key={item.capability}
                className="p-3 rounded bg-slate-950/80 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs">{item.capability}</span>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                    item.truthState === 'IMPLEMENTED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : item.truthState === 'SIMULATED'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                        : 'bg-amber-950 text-amber-400 border-amber-700'
                  }`}>
                    {item.truthState}
                  </span>
                </div>
                <div className="text-[10px] text-blue-300 font-bold">{item.ibmTechnology}</div>
                <div className="text-[10px] text-slate-400 font-sans">{item.rationale}</div>
              </div>
            ))}
          </div>

          {/* Maturity Legend */}
          <div className="pt-3 border-t border-slate-800 text-[10px] space-y-1.5">
            <span className="text-slate-500 uppercase block">Truth Status Legend:</span>
            <div className="grid grid-cols-2 gap-1.5 text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> IMPLEMENTED</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> IBM_INTEGRATED</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> SIMULATED</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> ARCHITECTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
