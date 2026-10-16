/**
 * FINANCIAL IMMUNE SYSTEM - UNIFIED MISSION CONTROL COMMAND WALL
 * Section 8 & Section 28: Direct Reconstruction of Reference Prototype Architecture
 * 
 * Houses all 16 synchronized operational modules in a dense, high-assurance command wall:
 * 01 LOGIN & ROLE SELECTION (Identity Posture)
 * 02 CONTROL CENTER (Normal State / Active Posture)
 * 03 EVENT DETECTION (Attack Triggered)
 * 04 SYSTEM MAP (Dependency Graph)
 * 05 COLLECTIVE DECISION INTELLIGENCE
 * 06 PROPAGATION ANALYSIS
 * 07 CONTROL MARGIN (Degrading)
 * 08 CONTROL FOUNDRY (Intervention Options & Counterfactuals)
 * 09 GOVERNED EXECUTION (Action Contract)
 * 10 INDEPENDENT VERIFICATION (Latent Drift & Contagion Verification)
 * 11 REASSESSMENT & SECOND INTERVENTION
 * 12 IBM Z / LINUXONE RUNTIME
 * 13 INCIDENT REPLAY
 * 14 EVIDENCE & ASSURANCE CHAIN
 * 15 PRIVACY BOUNDARY
 * 16 BENCHMARK & EVALUATION
 */

import React, { useState } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { ROLE_DEFINITIONS, UserRole } from '@shared/types/roles';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause, 
  StepForward, 
  ExternalLink,
  Lock,
  Server,
  Activity,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Clock,
  Radio,
  FileText,
  User,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CommandBoardWall: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const currentRole = useSystemStore(state => state.currentRole);
  const setRole = useSystemStore(state => state.setRole);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);
  const authoritativeEvents = useSystemStore(state => state.authoritativeEvents);
  const institutions = useSystemStore(state => state.institutions);
  const dependencies = useSystemStore(state => state.dependencies);
  const dataProviders = useSystemStore(state => state.dataProviders);
  const aiModels = useSystemStore(state => state.aiModels);
  const simulationClock = useSystemStore(state => state.simulationClock);
  const replayTimeline = useSystemStore(state => state.replayTimeline);
  const scrubToTick = useSystemStore(state => state.scrubToTick);
  const stepSimulation = useSystemStore(state => state.stepSimulation);
  const foundryState = useSystemStore(state => state.foundryState);
  const authorizeFoundryCandidate = useSystemStore(state => state.authorizeFoundryCandidate);
  const executeFoundryCandidate = useSystemStore(state => state.executeFoundryCandidate);
  const verifyIntegrity = useSystemStore(state => state.verifyIntegrity);
  const activeTrace = useSystemStore(state => state.activeTrace);
  const assuranceState = useSystemStore(state => state.assuranceState);

  // Local interactive states for live walkthrough
  const [selectedNodeId, setSelectedNodeId] = useState<string>('DATA-X');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('CAND-RN-2026-0041-DEP-ISOLATION');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStatusText, setExecutionStatusText] = useState<string>('Ready for Authorization');
  const [actionContractStatus, setActionContractStatus] = useState<'PENDING' | 'AUTHORIZED' | 'EXECUTED'>('PENDING');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [integrityVerifying, setIntegrityVerifying] = useState<boolean>(false);
  const [integrityResult, setIntegrityResult] = useState<string | null>(null);

  const isAttack = scenarioState === 'ATTACK_TRIGGERED' || activeIncident !== null;
  const marginVal = controlState.control_margin_percent;
  const isOperator = currentRole === 'SYSTEM_OPERATOR';

  // SVG Gauge Calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (marginVal / 100) * circumference;

  // Handle Authorize
  const handleAuthorize = async () => {
    if (!isOperator) {
      alert(`AUTHORIZATION REJECTED: Role [${currentRole}] lacks required authority. Please switch to SYSTEM_OPERATOR.`);
      return;
    }
    const success = await authorizeFoundryCandidate(selectedCandidateId, 'Authorized from Mission Control Console');
    if (success) {
      setActionContractStatus('AUTHORIZED');
      setExecutionStatusText('Intervention Authorized • Ready to Execute');
    }
  };

  // Handle Execute
  const handleExecute = async () => {
    if (actionContractStatus !== 'AUTHORIZED') {
      alert('EXECUTION BLOCKED: Intervention must be authorized by SYSTEM_OPERATOR first.');
      return;
    }
    setIsExecuting(true);
    setExecutionStatusText('Executing Isolation Packet across G-SIB Gateways...');
    setTimeout(async () => {
      const success = await executeFoundryCandidate(selectedCandidateId, false);
      setIsExecuting(false);
      if (success) {
        setActionContractStatus('EXECUTED');
        setExecutionStatusText('Intervention Executed • Verifying Systemic Contagion...');
      }
    }, 1000);
  };

  // Handle Integrity Check
  const handleVerifyIntegrity = async () => {
    setIntegrityVerifying(true);
    const res = await verifyIntegrity();
    setIntegrityVerifying(false);
    setIntegrityResult(res.allValid ? `ALL ${res.recordsCount} RECORDS VERIFIED (SHA-256 VALID)` : 'INTEGRITY ANOMALY DETECTED');
  };

  return (
    <div className="w-full bg-[#050811] text-[#f1f5f9] font-sans p-3 space-y-3">

      {/* =========================================================================
          ROW 1: MODULES 01, 02, 03
          01. Login & Role Selection / Identity Posture
          02. Control Center (Normal State / Active Posture)
          03. Event Detection (Attack Triggered)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* -------------------------------------------------------------
            MODULE 01: LOGIN & ROLE SELECTION (IDENTITY POSTURE)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">1.</span>
              <span className="font-bold text-white uppercase tracking-wider">LOGIN & ROLE SELECTION</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-blue-500 font-bold">IBM</span>
              <span>AI | TRUST | RESILIENCE</span>
            </div>
          </div>

          <div className="my-2 space-y-2">
            <div className="text-center py-1">
              <div className="text-sm font-extrabold tracking-wide text-white">FINANCIAL IMMUNE SYSTEM</div>
              <div className="text-[9px] font-mono text-slate-400">Systemic Control Intelligence for AI-Enabled Financial Ecosystems</div>
            </div>

            {/* SENSE, UNDERSTAND, INTERVENE, VERIFY Flow */}
            <div className="grid grid-cols-4 gap-1 text-center py-1 bg-[#050914] rounded border border-[#121c2e]">
              <div className="p-1">
                <div className="text-[10px] font-bold text-blue-400">SENSE</div>
                <div className="text-[8px] text-slate-500 truncate">Real-time state</div>
              </div>
              <div className="p-1 border-l border-[#121c2e]">
                <div className="text-[10px] font-bold text-cyan-400">UNDERSTAND</div>
                <div className="text-[8px] text-slate-500 truncate">Dependencies</div>
              </div>
              <div className="p-1 border-l border-[#121c2e]">
                <div className="text-[10px] font-bold text-amber-400">INTERVENE</div>
                <div className="text-[8px] text-slate-500 truncate">Min effective</div>
              </div>
              <div className="p-1 border-l border-[#121c2e]">
                <div className="text-[10px] font-bold text-emerald-400">VERIFY</div>
                <div className="text-[8px] text-slate-500 truncate">Independent</div>
              </div>
            </div>

            {/* Role Selection Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {ROLE_DEFINITIONS.map(r => {
                const isSelected = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setRole(r.role)}
                    className={`p-2 rounded text-left transition-all border font-mono ${
                      isSelected
                        ? 'bg-blue-600/25 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.25)]'
                        : 'bg-[#091120] border-[#15233c] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-white flex items-center justify-between">
                      <span>{r.title}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">{r.tagline}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#142036] flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>Powered by IBM Z | LinuxONE | AI</span>
            <span className="text-blue-400 font-semibold">Active: {currentRole}</span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 02: CONTROL CENTER (NORMAL STATE / ACTIVE POSTURE)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">2.</span>
              <span className="font-bold text-white uppercase tracking-wider">
                CONTROL CENTER ({isAttack ? 'DEGRADED STATE' : 'NORMAL STATE'})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </span>
              <span className="text-slate-500 font-mono">14:20:12 UTC</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            {/* System Control State */}
            <div className="p-2.5 rounded bg-[#060a14] border border-[#142036] flex flex-col justify-between">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">System Control State</span>
              <div className="my-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono inline-block ${
                  isAttack ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse' : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                }`}>
                  {isAttack ? 'CRITICAL' : 'STABLE'}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 leading-tight">
                {isAttack ? 'Contagion propagating across oracles' : 'All systems within acceptable range'}
              </span>
            </div>

            {/* Circular Control Margin Gauge */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] flex flex-col items-center justify-center relative">
              <span className="text-[9px] font-mono uppercase text-slate-400 absolute top-1.5">Control Margin</span>
              <div className="relative w-20 h-20 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} stroke="#132034" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r={radius} 
                    stroke={isAttack ? '#ef4444' : '#10b981'} 
                    strokeWidth="8" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent" 
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className={`text-xl font-extrabold ${isAttack ? 'text-red-400' : 'text-emerald-400'}`}>
                    {marginVal}
                  </span>
                  <span className="text-[8px] text-slate-400">/ 100</span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-slate-500 absolute bottom-1">M(t) Reserve</span>
            </div>

            {/* Ecosystem Overview */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] space-y-1 text-[10px] font-mono">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block pb-1 border-b border-[#121c2e]">
                Ecosystem Overview
              </span>
              <div className="flex justify-between text-slate-400">
                <span>Institutions:</span> <span className="text-white font-bold">{institutions.length || 20}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dependencies:</span> <span className="text-white font-bold">{dependencies.length || 102}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Events / sec:</span> <span className="text-cyan-400 font-bold">842</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Incidents:</span> <span className={isAttack ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {isAttack ? '1' : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Systemic Metrics */}
          <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-[#142036] text-[9px] font-mono">
            <div className="bg-[#050914] p-1.5 rounded border border-[#101928]">
              <div className="text-slate-500 truncate">Propagation</div>
              <div className={`font-bold ${isAttack ? 'text-red-400' : 'text-slate-300'}`}>{isAttack ? '68%' : '12%'}</div>
            </div>
            <div className="bg-[#050914] p-1.5 rounded border border-[#101928]">
              <div className="text-slate-500 truncate">Synchrony</div>
              <div className={`font-bold ${isAttack ? 'text-red-400' : 'text-slate-300'}`}>{isAttack ? '91%' : '18%'}</div>
            </div>
            <div className="bg-[#050914] p-1.5 rounded border border-[#101928]">
              <div className="text-slate-500 truncate">Model Conc</div>
              <div className={`font-bold ${isAttack ? 'text-red-400' : 'text-slate-300'}`}>{isAttack ? '82%' : '22%'}</div>
            </div>
            <div className="bg-[#050914] p-1.5 rounded border border-[#101928]">
              <div className="text-slate-500 truncate">Infra Stress</div>
              <div className="text-slate-300 font-bold">{isAttack ? '76%' : '26%'}</div>
            </div>
            <div className="bg-[#050914] p-1.5 rounded border border-[#101928]">
              <div className="text-slate-500 truncate">Sufficiency</div>
              <div className="text-emerald-400 font-bold">94%</div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 03: EVENT DETECTION (ATTACK TRIGGERED)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">3.</span>
              <span className="font-bold text-white uppercase tracking-wider">EVENT DETECTION</span>
              {isAttack && (
                <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-700 text-[9px] font-bold animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-mono">Scenario: Common Data Attack</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* Event Alert Banner */}
          <div className="my-2">
            {isAttack ? (
              <div className="p-2.5 rounded bg-red-950/70 border border-red-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-red-900/60 border border-red-500 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-wide">
                      MAJOR EVENT DETECTED: Common Information Provider Compromised
                    </div>
                    <div className="text-[9px] font-mono text-red-300">
                      Event ID: RN-2026-0041 • Source: DATA-X • Affected: 8 / 20 Institutions
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentRoute('system-map')}
                  className="px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-[10px] font-mono font-bold shrink-0 ml-2"
                >
                  View Details
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-[#060d1a] border border-[#142036] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-wide">
                      SYSTEM NOMINAL • CONTINUOUS ENCLAVE INGESTION ACTIVE
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      Zero uncontained transmission anomalies across 102 interbank edges
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  HEALTHY
                </span>
              </div>
            )}
          </div>

          {/* Real-Time Event Stream Table */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Real-Time Event Stream</span>
              <span className="text-slate-500">Latest Authoritative Ticks</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto font-mono text-[9px] pr-1">
              {(authoritativeEvents.length > 0 ? authoritativeEvents.slice(0, 4) : [
                { time: '14:24:05', source: 'DATA-X', desc: 'Data integrity anomaly detected', sev: 'HIGH' },
                { time: '14:24:06', source: 'BANK-A', desc: 'Unusual model input detected', sev: 'HIGH' },
                { time: '14:24:07', source: 'BANK-B', desc: 'Similar pattern detected in rates', sev: 'HIGH' },
                { time: '14:24:08', source: 'MODEL-A', desc: 'Input distribution shift identified', sev: 'HIGH' }
              ]).map((evt: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-1 rounded bg-[#050914] border border-[#101928]">
                  <span className="text-slate-500">{evt.simulation_timestamp ? evt.simulation_timestamp.slice(11, 19) : evt.time}</span>
                  <span className="text-cyan-400 font-bold">{evt.event_type || evt.source}</span>
                  <span className="text-slate-300 truncate max-w-[140px]">{evt.description || evt.desc}</span>
                  <span className={`px-1 py-0.2 rounded font-bold ${
                    (evt.severity === 'CRITICAL' || evt.sev === 'HIGH') ? 'text-red-400 bg-red-950/80' : 'text-emerald-400 bg-emerald-950/80'
                  }`}>
                    {evt.severity || evt.sev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 2: MODULES 04, 05, 06
          04. System Map (Dependency Graph)
          05. Collective Decision Intelligence
          06. Propagation Analysis
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* -------------------------------------------------------------
            MODULE 04: SYSTEM MAP (DEPENDENCY GRAPH)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">4.</span>
              <span className="font-bold text-white uppercase tracking-wider">SYSTEM MAP (DEPENDENCY GRAPH)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400">14:24:20 UTC</span>
              <span className="text-blue-500 font-bold">IBM</span>
              <button 
                type="button" 
                onClick={() => setCurrentRoute('system-map')}
                className="text-slate-400 hover:text-white"
                title="Expand to Full System Map"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            {/* SVG Interactive Topology Visualization */}
            <div className="col-span-2 relative h-36 bg-[#040710] rounded border border-[#121c2e] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 240 140">
                {/* Edges radiating from central DATA-X */}
                <line x1="120" y1="70" x2="45" y2="40" stroke={isAttack ? '#ef4444' : '#1e3a5f'} strokeWidth="1.5" strokeDasharray={isAttack ? '3,3' : 'none'} />
                <line x1="120" y1="70" x2="195" y2="40" stroke={isAttack ? '#ef4444' : '#1e3a5f'} strokeWidth="1.5" strokeDasharray={isAttack ? '3,3' : 'none'} />
                <line x1="120" y1="70" x2="45" y2="100" stroke={isAttack ? '#ef4444' : '#1e3a5f'} strokeWidth="1.5" strokeDasharray={isAttack ? '3,3' : 'none'} />
                <line x1="120" y1="70" x2="195" y2="100" stroke={isAttack ? '#ef4444' : '#1e3a5f'} strokeWidth="1.5" strokeDasharray={isAttack ? '3,3' : 'none'} />
                <line x1="120" y1="70" x2="120" y2="20" stroke="#1e3a5f" strokeWidth="1.2" />
                <line x1="120" y1="70" x2="120" y2="120" stroke="#1e3a5f" strokeWidth="1.2" />

                {/* Satellite Nodes */}
                <circle cx="45" cy="40" r="12" fill="#091830" stroke={isAttack ? '#f59e0b' : '#3b82f6'} strokeWidth="2" />
                <text x="45" y="43" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">BANK-A</text>

                <circle cx="195" cy="40" r="12" fill="#091830" stroke={isAttack ? '#f59e0b' : '#3b82f6'} strokeWidth="2" />
                <text x="195" y="43" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">BANK-B</text>

                <circle cx="45" cy="100" r="12" fill="#091830" stroke="#3b82f6" strokeWidth="2" />
                <text x="45" y="103" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">BANK-C</text>

                <circle cx="195" cy="100" r="12" fill="#091830" stroke="#3b82f6" strokeWidth="2" />
                <text x="195" y="103" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">BANK-D</text>

                <circle cx="120" cy="20" r="10" fill="#0a192f" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="120" y="23" textAnchor="middle" fill="#c4b5fd" fontSize="7" fontFamily="monospace">MODEL-A</text>

                <circle cx="120" cy="120" r="10" fill="#0a192f" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="120" y="123" textAnchor="middle" fill="#67e8f9" fontSize="7" fontFamily="monospace">INFRA-1</text>

                {/* Central Compromised Node: DATA-X */}
                <circle 
                  cx="120" cy="70" r="16" 
                  fill={isAttack ? '#7f1d1d' : '#064e3b'} 
                  stroke={isAttack ? '#ef4444' : '#10b981'} 
                  strokeWidth="2.5" 
                  className={isAttack ? 'animate-pulse' : ''}
                />
                <text x="120" y="73" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">DATA-X</text>
              </svg>

              <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-slate-500">
                12 Interbank Rails • Active Topology
              </div>
            </div>

            {/* Selected Node Details Card */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] flex flex-col justify-between text-[9px] font-mono">
              <div>
                <div className="text-[10px] font-bold text-white flex items-center justify-between">
                  <span>DATA-X</span>
                  <span className={`px-1 py-0.2 rounded ${isAttack ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
                    {isAttack ? 'COMPROMISED' : 'NOMINAL'}
                  </span>
                </div>
                <div className="text-slate-400 text-[8px]">Information Provider</div>
              </div>

              <div className="space-y-1 text-slate-400 my-1">
                <div className="flex justify-between"><span>Criticality:</span> <span className="text-red-400 font-bold">HIGH</span></div>
                <div className="flex justify-between"><span>Shared by:</span> <span className="text-white font-bold">4 G-SIBs</span></div>
                <div className="flex justify-between"><span>Dependencies:</span> <span className="text-white font-bold">12</span></div>
                <div className="flex justify-between"><span>Affected Nodes:</span> <span className="text-amber-400 font-bold">{isAttack ? '8' : '0'}</span></div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentRoute('system-map')}
                className="w-full py-1 rounded bg-[#0e1728] border border-blue-500/40 text-[9px] font-mono text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-center"
              >
                Inspect Node
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            <span>Legends: Financial • AI Model • Data Provider • Infra</span>
            <span className="text-cyan-400">Centricity Index: 0.88</span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 05: COLLECTIVE DECISION INTELLIGENCE
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">5.</span>
              <span className="font-bold text-white uppercase tracking-wider">COLLECTIVE DECISION INTELLIGENCE</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400">Scenario: Post-Event</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            {/* Market Decision Distribution Donut */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] flex items-center justify-around">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" strokeDasharray="238" strokeDashoffset="210" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" strokeDasharray="238" strokeDashoffset="170" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" strokeDasharray="238" strokeDashoffset="70" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-xs font-extrabold text-red-400">{isAttack ? '70%' : '15%'}</span>
                  <span className="text-[7px] text-slate-400">SELL</span>
                </div>
              </div>
              <div className="text-[8px] font-mono space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 12% BUY</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 18% HOLD</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {isAttack ? '70%' : '15%'} SELL</div>
              </div>
            </div>

            {/* Effective Decision Diversity Big Stat */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] flex flex-col justify-between">
              <span className="text-[8px] font-mono text-slate-400 uppercase">Effective Decision Diversity</span>
              <div>
                <div className="text-xl font-extrabold font-mono text-red-400">
                  {isAttack ? '0.23' : '0.61'}
                </div>
                <div className="text-[9px] font-mono text-red-400 flex items-center gap-1 font-semibold">
                  <span>▼ Degrading</span>
                  <span>({isAttack ? '-62%' : 'Nominal'})</span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-slate-500">
                Observed: 0.61 • Adjusted: {isAttack ? '0.23' : '0.61'}
              </span>
            </div>
          </div>

          {/* Decision Synchronization Bars */}
          <div className="space-y-1 text-[8px] font-mono pt-1 border-t border-[#142036]">
            <div className="flex justify-between items-center text-slate-400">
              <span>Model Concentration:</span>
              <span className="text-red-400 font-bold">{isAttack ? '82%' : '22%'}</span>
            </div>
            <div className="w-full bg-[#101928] h-1 rounded overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: isAttack ? '82%' : '22%' }} />
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Data Dependency Exposure:</span>
              <span className="text-red-400 font-bold">{isAttack ? '91%' : '24%'}</span>
            </div>
            <div className="w-full bg-[#101928] h-1 rounded overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: isAttack ? '91%' : '24%' }} />
            </div>
          </div>

          <div className="p-1.5 rounded bg-[#050914] border border-[#101928] text-[8px] font-mono text-slate-400 mt-1">
            Insight: 71% of observed decisions appear independent at action level, but dependency analysis reveals common oracle risk.
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 06: PROPAGATION ANALYSIS
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">6.</span>
              <span className="font-bold text-white uppercase tracking-wider">PROPAGATION ANALYSIS</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400">Scenario: In Progress</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* Propagation Metrics Grid */}
          <div className="grid grid-cols-4 gap-1.5 my-2 text-[9px] font-mono">
            <div className="p-1.5 rounded bg-[#060a14] border border-[#121c2e]">
              <div className="text-slate-500 truncate">Affected Nodes</div>
              <div className="text-white font-bold text-xs">{isAttack ? '8 / 20' : '0 / 20'}</div>
            </div>
            <div className="p-1.5 rounded bg-[#060a14] border border-[#121c2e]">
              <div className="text-slate-500 truncate">Max Depth</div>
              <div className="text-amber-400 font-bold text-xs">{isAttack ? '4 hops' : '0'}</div>
            </div>
            <div className="p-1.5 rounded bg-[#060a14] border border-[#121c2e]">
              <div className="text-slate-500 truncate">Velocity</div>
              <div className="text-red-400 font-bold text-xs">{isAttack ? '0.31 n/s' : '0.00'}</div>
            </div>
            <div className="p-1.5 rounded bg-[#060a14] border border-[#121c2e]">
              <div className="text-slate-500 truncate">Blast Radius</div>
              <div className="text-red-400 font-bold text-xs">{isAttack ? '37%' : '0%'}</div>
            </div>
          </div>

          {/* Propagation Timeline */}
          <div className="space-y-1 text-[8px] font-mono text-slate-400 bg-[#050914] p-2 rounded border border-[#101928] max-h-24 overflow-y-auto">
            <div className="text-slate-500 font-bold pb-1 border-b border-[#121c2e] uppercase">Propagation Milestones</div>
            <div className="flex items-center gap-1.5"><span className="text-cyan-400 font-bold">T+0s:</span> DATA-X corrupted via telemetry rail injection</div>
            <div className="flex items-center gap-1.5"><span className="text-cyan-400 font-bold">T+2s:</span> BANK-A alters risk models based on biased rates</div>
            <div className="flex items-center gap-1.5"><span className="text-cyan-400 font-bold">T+4s:</span> BANK-B follows due to correlated model tensor</div>
            <div className="flex items-center gap-1.5"><span className="text-cyan-400 font-bold">T+8s:</span> Bilateral liquidity pressure accumulates across CCP</div>
            <div className="flex items-center gap-1.5"><span className="text-cyan-400 font-bold">T+15s:</span> Secondary asset market nodes trigger panic orders</div>
          </div>

          {/* Visual Cascade Stage Pipeline */}
          <div className="flex items-center justify-between pt-1 border-t border-[#142036] text-[8px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">Origin</span>
            <span className="text-slate-600">→</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">Direct (G-SIBs)</span>
            <span className="text-slate-600">→</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Secondary (CCP)</span>
            <span className="text-slate-600">→</span>
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300">Systemic</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 3: MODULES 07, 08, 09
          07. Control Margin (Degrading)
          08. Control Foundry (Intervention Options & Counterfactuals)
          09. Governed Execution (Action Contract)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* -------------------------------------------------------------
            MODULE 07: CONTROL MARGIN (DEGRADING)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">7.</span>
              <span className="font-bold text-white uppercase tracking-wider">CONTROL MARGIN (DEGRADING)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-mono">Scenario: Active</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            {/* Large Gauge */}
            <div className="p-2.5 rounded bg-[#060a14] border border-[#142036] flex flex-col items-center justify-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Current Control Margin</span>
              <div className="text-3xl font-extrabold font-mono text-red-400 my-1">
                {marginVal} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-700 text-[9px] font-bold">
                {isAttack ? 'CRITICAL RESERVE' : 'STABLE'}
              </span>
            </div>

            {/* Why is Control Degrading? Drivers list */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] text-[8px] font-mono space-y-1">
              <div className="text-slate-400 font-bold uppercase pb-0.5 border-b border-[#121c2e]">
                Why is Control Degrading?
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shared info dependency:</span>
                <span className="text-red-400 font-bold">HIGH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Decision synchrony:</span>
                <span className="text-red-400 font-bold">HIGH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Propagation velocity:</span>
                <span className="text-amber-400 font-bold">MEDIUM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Available interventions:</span>
                <span className="text-amber-400 font-bold">LOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Evidence sufficiency:</span>
                <span className="text-emerald-400 font-bold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reversibility budget:</span>
                <span className="text-cyan-400 font-bold">MEDIUM</span>
              </div>
            </div>
          </div>

          {/* Control vs Risk Scatter / Breakdown */}
          <div className="p-1.5 rounded bg-[#050914] border border-[#101928] text-[8px] font-mono text-slate-400 flex items-center justify-between">
            <span>Mathematical Version: CM-v0.3 [SIMULATED_VARIABLE]</span>
            <span className="text-cyan-400">M(t) = M0 + Σ ΔMi</span>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 08: CONTROL FOUNDRY (INTERVENTION OPTIONS)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">8.</span>
              <span className="font-bold text-white uppercase tracking-wider">CONTROL FOUNDRY (OPTIONS)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-amber-400 font-bold">Window: 41 sec</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* Candidate Interventions Table */}
          <div className="space-y-1 my-1 max-h-32 overflow-y-auto font-mono text-[8px]">
            <div className="grid grid-cols-6 gap-1 text-slate-500 font-bold px-1 pb-0.5 border-b border-[#121c2e]">
              <span className="col-span-2">Intervention</span>
              <span>Proj M</span>
              <span>Disrupt</span>
              <span>Latency</span>
              <span>Action</span>
            </div>

            {[
              { id: 'CAND-NO-ACTION', name: 'No Action (Baseline)', margin: 20, disrupt: '0%', latency: '0s', rec: false },
              { id: 'CAND-GLOBAL-SHUTDOWN', name: 'Global Clearing Halt', margin: 86, disrupt: '91%', latency: '4s', rec: false },
              { id: 'CAND-BROAD-THROTTLE', name: 'Broad Risk Throttle', margin: 52, disrupt: '52%', latency: '7s', rec: false },
              { id: 'CAND-DATA-QUARANTINE', name: 'Data Feed Quarantine', margin: 68, disrupt: '19%', latency: '3s', rec: false },
              { id: 'CAND-RN-2026-0041-DEP-ISOLATION', name: 'Targeted Dep Isolation', margin: 76, disrupt: '14%', latency: '6s', rec: true },
              { id: 'CAND-MODEL-DIV', name: 'Model Diversification', margin: 72, disrupt: '9%', latency: '12s', rec: false }
            ].map(cand => {
              const isSelected = selectedCandidateId === cand.id;
              return (
                <div 
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`grid grid-cols-6 gap-1 p-1 rounded cursor-pointer transition-colors items-center ${
                    isSelected ? 'bg-blue-600/20 border border-blue-500/50 text-white' : 'bg-[#050914] text-slate-300 hover:bg-[#0c1424]'
                  }`}
                >
                  <span className="col-span-2 truncate font-bold">{cand.name}</span>
                  <span className="text-emerald-400 font-bold">+{cand.margin}%</span>
                  <span className="text-amber-400">{cand.disrupt}</span>
                  <span className="text-slate-400">{cand.latency}</span>
                  <span>
                    {cand.rec ? (
                      <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold text-[7px]">
                        RECOMMENDED
                      </span>
                    ) : (
                      <span className="text-slate-500 hover:text-blue-400">Simulate</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendation Banner & Action Trigger */}
          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-700/60 flex items-center justify-between text-[8px] font-mono mt-1">
            <div>
              <div className="font-bold text-emerald-300 uppercase">
                MINIMUM EFFECTIVE INTERVENTION: Targeted Dependency Isolation
              </div>
              <div className="text-slate-400 text-[7px]">
                Restores control margin to 76% (+56 pts vs No Action) with lowest disruption (14%).
              </div>
            </div>
            <button
              type="button"
              onClick={handleAuthorize}
              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] shrink-0 ml-2"
            >
              Proceed to Auth →
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 09: GOVERNED EXECUTION (ACTION CONTRACT)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">9.</span>
              <span className="font-bold text-white uppercase tracking-wider">GOVERNED EXECUTION</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400">Action Contract</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* Action Contract Box */}
          <div className="p-2 rounded bg-[#060a14] border border-[#142036] my-1 text-[8px] font-mono space-y-1">
            <div className="flex justify-between items-center pb-1 border-b border-[#121c2e]">
              <span className="text-slate-400 uppercase font-bold">Action Contract #ACT-8842</span>
              <span className={`px-1 py-0.2 rounded font-bold ${
                actionContractStatus === 'AUTHORIZED' ? 'bg-emerald-950 text-emerald-400' : 
                actionContractStatus === 'EXECUTED' ? 'bg-blue-950 text-blue-400' : 'bg-amber-950 text-amber-400'
              }`}>
                {actionContractStatus}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-slate-500">Action:</span> <span className="text-white font-bold">Targeted Dependency Isolation</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target Rail:</span> <span className="text-cyan-400 font-bold">DATA-X → Tier-1 G-SIBs</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Expected Margin:</span> <span className="text-emerald-400 font-bold">34% → 76%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Authority Required:</span> <span className="text-indigo-400 font-bold">SYSTEM_OPERATOR</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Execution Status:</span> <span className="text-amber-300 font-bold">{executionStatusText}</span></div>
          </div>

          {/* Governance 7-Point Checklist */}
          <div className="grid grid-cols-2 gap-1 text-[7px] font-mono text-slate-400 bg-[#050914] p-1.5 rounded border border-[#101928]">
            <div className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✓</span> Evidence Check</div>
            <div className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✓</span> Policy Check</div>
            <div className="flex items-center gap-1"><span className={isOperator ? 'text-emerald-400 font-bold' : 'text-red-400'}>
              {isOperator ? '✓ Authority Available' : '✕ Role Lacks Auth'}
            </span></div>
            <div className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✓</span> Reversibility Budget</div>
            <div className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✓</span> Disruption Limit</div>
            <div className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✓</span> Tamper Seal Ready</div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#142036]">
            <button
              type="button"
              onClick={handleAuthorize}
              disabled={actionContractStatus === 'AUTHORIZED' || actionContractStatus === 'EXECUTED'}
              className="flex-1 py-1 rounded bg-[#0e1728] border border-blue-500 text-[9px] font-mono font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-40"
            >
              1. Authorize & Sign
            </button>
            <button
              type="button"
              onClick={handleExecute}
              disabled={actionContractStatus !== 'AUTHORIZED' || isExecuting}
              className="flex-1 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[9px] font-mono font-bold text-white transition-all shadow-md shadow-blue-600/30 disabled:opacity-40"
            >
              {isExecuting ? 'Executing...' : '2. Execute Intervention'}
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 4: MODULES 10, 11, 12
          10. Independent Verification (First Intervention Failed / Latent Drift)
          11. Reassessment & Second Intervention
          12. IBM Z / LinuxONE Runtime
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* -------------------------------------------------------------
            MODULE 10: INDEPENDENT VERIFICATION (FIRST INTERVENTION)
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">10.</span>
              <span className="font-bold text-white uppercase tracking-wider">INDEPENDENT VERIFICATION</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-1 py-0.2 rounded bg-red-950 text-red-400 font-bold border border-red-800 text-[8px]">
                LATENT DRIFT CATCH
              </span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-[8px] font-mono">
            {/* Technical Execution Success */}
            <div className="p-2 rounded bg-[#060a14] border border-[#142036] space-y-1">
              <div className="text-slate-400 uppercase">Intervention Gateway</div>
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                <span>✓</span> SUCCESSFUL
              </div>
              <div className="text-slate-500 text-[7px]">Action ID: ACT-8842 • Dispatch: 14:28:52 UTC</div>
              <div className="text-slate-400 text-[7px] pt-1 border-t border-[#121c2e]">
                Isolation packet acknowledged by transport gateway.
              </div>
            </div>

            {/* Systemic Verifier Catches Latent Contagion */}
            <div className="p-2 rounded bg-red-950/40 border border-red-700/60 space-y-1">
              <div className="text-red-300 uppercase font-bold">Systemic Verifier</div>
              <div className="text-red-400 font-bold text-sm flex items-center gap-1">
                <span>✕</span> NOT RESTORED
              </div>
              <div className="text-red-300 text-[7px]">Hidden propagation path detected via MODEL-C!</div>
              <div className="text-slate-400 text-[7px] pt-1 border-t border-red-900/60">
                Control Margin: 34% → 41% (Insufficient). Status: CONTROL_UNVERIFIED.
              </div>
            </div>
          </div>

          {/* Verification Metrics Comparison */}
          <div className="p-1.5 rounded bg-[#050914] border border-[#101928] text-[8px] font-mono text-slate-400 space-y-0.5">
            <div className="flex justify-between"><span>Propagation velocity:</span> <span className="text-red-400">0.31 → 0.28 (still high)</span></div>
            <div className="flex justify-between"><span>Decision synchrony:</span> <span className="text-red-400">0.91 → 0.79 (still high)</span></div>
            <div className="flex justify-between"><span>Verification Confidence:</span> <span className="text-amber-400 font-bold">63%</span></div>
          </div>

          <div className="text-[8px] font-mono text-amber-400 pt-1 border-t border-[#142036] flex items-center justify-between">
            <span>Mandatory Reassessment Required</span>
            <button 
              type="button" 
              onClick={() => setCurrentRoute('verification')}
              className="text-blue-400 hover:text-white"
            >
              Audit Details →
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 11: REASSESSMENT & SECOND INTERVENTION
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">11.</span>
              <span className="font-bold text-white uppercase tracking-wider">REASSESSMENT & 2ND INTERVENTION</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-mono">Closed Loop</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* 4-Step Reassessment Progression */}
          <div className="grid grid-cols-4 gap-1 text-center text-[7px] font-mono my-1">
            <div className="p-1 rounded bg-[#060a14] border border-[#121c2e] text-slate-400">1 Maintain</div>
            <div className="p-1 rounded bg-[#060a14] border border-[#121c2e] text-slate-400">2 Re-Model</div>
            <div className="p-1 rounded bg-[#060a14] border border-blue-500 text-blue-300">3 Recalculate</div>
            <div className="p-1 rounded bg-[#060a14] border border-[#121c2e] text-slate-400">4 Intervene 2</div>
          </div>

          {/* Updated Assessment Table */}
          <div className="space-y-1 my-1 text-[8px] font-mono bg-[#050914] p-1.5 rounded border border-[#101928]">
            <div className="text-slate-400 font-bold uppercase pb-0.5 border-b border-[#121c2e]">
              Updated Threat Assessment
            </div>
            <div className="flex justify-between"><span className="text-slate-400">DATA-X:</span> <span className="text-red-400 font-bold">COMPROMISED (-22%)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">MODEL-C:</span> <span className="text-amber-400 font-bold">LATENT CONTAGION (-18%)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">INFRA-2:</span> <span className="text-slate-300">MEDIUM (-9%)</span></div>
          </div>

          {/* Recommended Second Intervention */}
          <div className="p-2 rounded bg-indigo-950/40 border border-indigo-700/60 flex items-center justify-between text-[8px] font-mono">
            <div>
              <div className="text-indigo-300 font-bold uppercase">
                2nd Action: Enclave Model-C Quarantine
              </div>
              <div className="text-slate-400 text-[7px]">
                Restores effective diversity above 0.70 • Projected M(t): 82%
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentRoute('control-foundry')}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[8px] shrink-0 ml-1"
            >
              Authorize 2nd →
            </button>
          </div>

          <div className="text-[8px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            Proves core invariant: Execution Success ≠ Systemic Recovery
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 12: IBM Z / LINUXONE RUNTIME ARCHITECTURE
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-400">12.</span>
              <span className="font-bold text-white uppercase tracking-wider">IBM Z / LINUXONE RUNTIME</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="text-slate-400 font-mono">14:29:30 UTC</span>
              <span className="text-blue-500 font-bold">IBM</span>
            </div>
          </div>

          {/* Architecture Substrate Mapping */}
          <div className="p-2 rounded bg-[#060a14] border border-[#142036] my-1 text-[8px] font-mono space-y-1">
            <div className="text-slate-400 uppercase font-bold pb-0.5 border-b border-[#121c2e]">
              Hardware Substrate Mapping Matrix
            </div>
            <div className="flex justify-between items-center">
              <span>LinuxONE III / OpenShift:</span>
              <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[7px]">IMPLEMENTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>CPACF SHA-256 Digest Offload:</span>
              <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[7px]">IMPLEMENTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>z16 Telum AI Accelerator:</span>
              <span className="px-1 py-0.2 rounded bg-yellow-950 text-yellow-400 border border-yellow-800 text-[7px]">SIMULATED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Crypto Express 8S HSM:</span>
              <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[7px]">ARCHITECTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span>GDPS Multi-Site Active-Active:</span>
              <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[7px]">ARCHITECTED</span>
            </div>
          </div>

          <div className="p-1 rounded bg-[#050914] border border-[#101928] text-[7px] font-mono text-slate-400 flex items-center justify-between">
            <span>Runtime Truth: LOCAL_SIMULATION (Zero fake mainframe claims)</span>
            <button 
              type="button" 
              onClick={() => setCurrentRoute('ibm-runtime')}
              className="text-blue-400 hover:text-white"
            >
              Substrate Specs →
            </button>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            <span>Legend: Implemented (green) • Simulated (yellow) • Architected (cyan)</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ROW 5: MODULES 13, 14, 15, 16
          13. Incident Replay Scrubber Bar
          14. Evidence & Assurance Chain
          15. Privacy Boundary
          16. Benchmark & Evaluation
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

        {/* -------------------------------------------------------------
            MODULE 13: INCIDENT REPLAY SCRUBBER
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-blue-400">13.</span>
              <span className="font-bold text-white uppercase text-[10px]">INCIDENT REPLAY</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">Tick: {simulationClock.tick}</span>
          </div>

          <div className="my-2 space-y-1.5">
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
              <button 
                type="button" 
                onClick={() => scrubToTick(0)}
                className="hover:text-blue-400 text-slate-500"
              >
                00:00 Normal
              </button>
              <button 
                type="button" 
                onClick={() => scrubToTick(1)}
                className="hover:text-blue-400 text-amber-400 font-bold"
              >
                00:15 Attack
              </button>
              <button 
                type="button" 
                onClick={() => scrubToTick(2)}
                className="hover:text-blue-400 text-red-400 font-bold"
              >
                00:25 Failed
              </button>
              <button 
                type="button" 
                onClick={() => scrubToTick(3)}
                className="hover:text-blue-400 text-emerald-400 font-bold"
              >
                00:40 Restored
              </button>
            </div>

            <input 
              type="range"
              min="0"
              max={Math.max(4, replayTimeline.length)}
              value={simulationClock.tick}
              onChange={(e) => scrubToTick(Number(e.target.value))}
              className="w-full h-1 bg-[#15233c] rounded accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            <span>Deterministic Bit-for-Bit Replay</span>
            <button 
              type="button" 
              onClick={() => stepSimulation()}
              className="px-1.5 py-0.5 rounded bg-[#101b30] text-blue-400 hover:text-white"
            >
              Step Tick →
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 14: EVIDENCE & ASSURANCE CHAIN
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-blue-400">14.</span>
              <span className="font-bold text-white uppercase text-[10px]">EVIDENCE CHAIN</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">SHA-256</span>
          </div>

          <div className="my-1.5 space-y-1 text-[8px] font-mono">
            <div className="text-slate-400 truncate">
              Trace: <span className="text-cyan-400 font-bold">{activeTrace?.traceId || 'TRC-RN-2026-0041-DHAC'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Integrity:</span>
              <span className="text-emerald-400 font-bold">TAMPER-EVIDENT VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Freshness:</span>
              <span className="text-emerald-400 font-bold">FRESH (1.6s TTL)</span>
            </div>
          </div>

          <div className="pt-1 border-t border-[#142036] flex items-center justify-between">
            <button
              type="button"
              onClick={handleVerifyIntegrity}
              className="w-full py-1 rounded bg-[#0e1728] border border-blue-500/40 text-[8px] font-mono text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-center"
            >
              {integrityVerifying ? 'Verifying SHA-256...' : (integrityResult || 'Verify SHA-256 Digests')}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 15: PRIVACY BOUNDARY
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-blue-400">15.</span>
              <span className="font-bold text-white uppercase text-[10px]">PRIVACY BOUNDARY</span>
            </div>
            <span className="text-[8px] font-mono text-slate-500">DORA Art 16</span>
          </div>

          <div className="my-1.5 space-y-1 text-[8px] font-mono">
            <div className="text-slate-400">Order Book Depth USD:</div>
            <div className="p-1 rounded bg-[#050914] border border-[#101928] text-amber-400 font-bold truncate">
              {currentRole === 'OBSERVER' 
                ? '[RESTRICTED_MASKED]' 
                : '$4,850M (Institutional Raw)'}
            </div>
            <div className="text-slate-500 text-[7px]">
              TRF-001 ZK Range Proof protects 48 raw fields
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            <span>Role-Based Redaction</span>
            <button 
              type="button" 
              onClick={() => setCurrentRoute('privacy')}
              className="text-blue-400 hover:text-white"
            >
              Inspect Matrix →
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODULE 16: BENCHMARK & EVALUATION
            ------------------------------------------------------------- */}
        <div className="fis-panel p-3 bg-[#080e1a] border border-[#16233b] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#142036] text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-blue-400">16.</span>
              <span className="font-bold text-white uppercase text-[10px]">BENCHMARK & EVAL</span>
            </div>
            <span className="text-[8px] font-mono text-cyan-400">B0 - B5</span>
          </div>

          <div className="my-1 space-y-0.5 text-[7px] font-mono">
            <div className="grid grid-cols-4 gap-1 text-slate-500 font-bold border-b border-[#121c2e] pb-0.5">
              <span>Model</span>
              <span>Detect</span>
              <span>Intervene</span>
              <span>Recovery</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-slate-400">
              <span>B0 Raw</span> <span>42s</span> <span>71s</span> <span className="text-red-400">12%</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-slate-400">
              <span>B1 Rule</span> <span>31s</span> <span>54s</span> <span className="text-amber-400">38%</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-slate-300">
              <span>B4 (v1)</span> <span>14s</span> <span>35s</span> <span className="text-emerald-400">64%</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-emerald-400 font-bold bg-[#0c1830] p-0.5 rounded">
              <span>B5 Full</span> <span>11s (-21%)</span> <span>27s (-29%)</span> <span>79% (+34%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-slate-500 pt-1 border-t border-[#142036]">
            <span>Closed-Loop vs Static Baselines</span>
            <button 
              type="button" 
              onClick={() => setCurrentRoute('benchmark')}
              className="text-blue-400 hover:text-white"
            >
              Full Study →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
