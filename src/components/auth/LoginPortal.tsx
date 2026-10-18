/**
 * FINANCIAL IMMUNE SYSTEM - DEDICATED ENTRY EXPERIENCE
 * Sections 4A, 4B & 5: Full Landing Environment, Role Personas & Enclave Initialization
 * 
 * Flow:
 * LANDING (The Financial Ecosystem Before You Enter It)
 *   ↓
 * ENTER CONTROL ENVIRONMENT (or DEMONSTRATION MODE)
 *   ↓
 * ROLE SELECTION (Observer, Risk Analyst, Operator, Incident Commander, Compliance Officer)
 *   ↓
 * SYSTEM INITIALIZATION (Enclave Boot Sequence & CPACF Handshake)
 *   ↓
 * CONTROL CENTER
 */

import React, { useState, useEffect } from 'react';
import fisLogo from '../../assets/fis_logo.png';
import { useSystemStore } from '../../store/useSystemStore';
import { FinancialGlobe } from '../globe/FinancialGlobe';
import { UserRole, ROLE_DEFINITIONS } from '@shared/types/roles';
import { 
  Eye, 
  Shield, 
  BarChart3, 
  FileCheck, 
  ArrowRight, 
  Activity, 
  GitBranch, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Server, 
  Cpu, 
  Layers, 
  Terminal, 
  RotateCcw,
  AlertTriangle,
  Play,
  Check,
  ChevronRight,
  Info,
  ShieldCheck,
  Building2,
  Share2
} from 'lucide-react';

interface LoginPortalProps {
  onComplete: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onComplete }) => {
  // Navigation sub-stages for the entrance experience
  const [stage, setStage] = useState<'LANDING' | 'ROLE_SELECT' | 'INITIALIZING'>('LANDING');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SYSTEM_OPERATOR');
  const [initStep, setInitStep] = useState<number>(0);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);

  const institutions = useSystemStore(state => state.institutions);
  const dependencies = useSystemStore(state => state.dependencies);
  const dataProviders = useSystemStore(state => state.dataProviders);
  const infrastructureNodes = useSystemStore(state => state.infrastructureNodes);
  const controlState = useSystemStore(state => state.controlState);
  const login = useSystemStore(state => state.login);

  // 5 Operational Personas with explicit Separation of Duties (SOD) governance authorities
  const rolePersonas = [
    {
      role: 'SYSTEM_OPERATOR' as UserRole,
      title: 'System Operator',
      level: 'TIER-1 EXECUTION AUTHORITY',
      purpose: 'Dispatch authorized enclave interventions, isolate dependencies, and operate systemic circuit-breakers under Separation of Duties.',
      icon: <Shield className="w-5 h-5" />,
      tag: 'EXECUTION (SOD)',
      permissions: [
        { label: 'Live Telemetry Stream', allowed: true },
        { label: 'Propose Interventions', allowed: true },
        { label: 'Authorize & Sign (SOD)', allowed: false },
        { label: 'Execute Dispatch (SOD)', allowed: true },
        { label: 'Unmasked Audit Records', allowed: false }
      ]
    },
    {
      role: 'RISK_ANALYST' as UserRole,
      title: 'Risk Analyst',
      level: 'ANALYTICS & STRESS TESTING',
      purpose: 'Monitor systemic contagion propagation, evaluate counterfactuals, and stress-test ablation baselines.',
      icon: <BarChart3 className="w-5 h-5" />,
      tag: 'ANALYTICS',
      permissions: [
        { label: 'Live Telemetry Stream', allowed: true },
        { label: 'Propose Interventions', allowed: true },
        { label: 'Authorize & Sign (SOD)', allowed: false },
        { label: 'Execute Dispatch (SOD)', allowed: false },
        { label: 'Unmasked Audit Records', allowed: false }
      ]
    },
    {
      role: 'INCIDENT_COMMANDER' as UserRole,
      title: 'Incident Commander',
      level: 'AUTHORIZATION & OVERRIDE',
      purpose: 'Authorize and cryptographically sign emergency intervention contracts under Separation of Duties.',
      icon: <AlertTriangle className="w-5 h-5" />,
      tag: 'AUTHORIZER (SOD)',
      permissions: [
        { label: 'Live Telemetry Stream', allowed: true },
        { label: 'Propose Interventions', allowed: true },
        { label: 'Authorize & Sign (SOD)', allowed: true },
        { label: 'Crisis Command Override', allowed: true },
        { label: 'Unmasked Audit Records', allowed: false }
      ]
    },
    {
      role: 'COMPLIANCE_OFFICER' as UserRole,
      title: 'Compliance / Auditor',
      level: 'REGULATORY & AUDIT QUORUM',
      purpose: 'Inspect tamper-evident cryptographic evidence chains, co-sign compliance gates, and audit DORA Art 14 logs.',
      icon: <FileCheck className="w-5 h-5" />,
      tag: 'AUDIT & SIGNER',
      permissions: [
        { label: 'Live Telemetry Stream', allowed: true },
        { label: 'Authorize & Sign (SOD)', allowed: true },
        { label: 'Execute Dispatch (SOD)', allowed: false },
        { label: 'Audit SHA-256 Lineage', allowed: true },
        { label: 'Unmasked Audit Records', allowed: true }
      ]
    },
    {
      role: 'OBSERVER' as UserRole,
      title: 'Observer',
      level: 'READ-ONLY DEMONSTRATION',
      purpose: 'Observe ecosystem dynamics without authorization to propose, sign, or execute state-altering actions.',
      icon: <Eye className="w-5 h-5" />,
      tag: 'READ-ONLY',
      permissions: [
        { label: 'Live Telemetry Stream', allowed: true },
        { label: 'Propose Interventions', allowed: false },
        { label: 'Authorize & Sign (SOD)', allowed: false },
        { label: 'Execute Dispatch (SOD)', allowed: false },
        { label: 'Unmasked Audit Records', allowed: false }
      ]
    }
  ];

  // System Initialization Handshake Simulation Sequence
  const initSequence = [
    { label: 'Validating CPACF Cryptographic Keystore & Secure Execution Boundary...', icon: <Lock className="w-4 h-4 text-cyan-400" /> },
    { label: 'Loading Authoritative Financial Topology (20 Institutions, 102 Dependencies)...', icon: <Share2 className="w-4 h-4 text-blue-400" /> },
    { label: 'Establishing Real-Time Server-Sent Events (SSE) Enclave Stream on Port 3001...', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { label: `Issuing Role-Governed Token for [${selectedRole}] (#enc_tok_7f9c)...`, icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
    { label: 'Deterministic Baseline Equilibrium Confirmed: M(0) = 89% STABLE. Enclave Ready.', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> }
  ];

  const handleStartLogin = async (roleToUse: UserRole) => {
    setSelectedRole(roleToUse);
    setStage('INITIALIZING');
    setInitStep(0);

    // Step through the initialization sequence
    for (let i = 0; i < initSequence.length; i++) {
      setInitStep(i);
      await new Promise(r => setTimeout(r, 450));
    }

    // Perform authoritative login in store
    await login(roleToUse);
    await new Promise(r => setTimeout(r, 350));
    onComplete();
  };

  const handleQuickDemo = () => {
    handleStartLogin('SYSTEM_OPERATOR');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12] flex flex-col justify-between overflow-hidden select-none font-sans text-slate-100">
      {/* 1. Global Navigation Top Bar */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-[#142036] bg-[#070c16]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Official FIS Logo */}
          <div className="h-7 w-auto shrink-0 flex items-center">
            <img src={fisLogo} alt="Financial Immune System" className="h-7 w-auto object-contain" />
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="font-extrabold tracking-tight text-white text-sm">
              FINANCIAL IMMUNE SYSTEM
            </span>
            <span className="text-slate-500 text-xs ml-2 font-mono">| MISSION CONTROL GATEWAY</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE SYSTEM
          </span>
        </div>
      </header>

      {/* 2. Interactive Backdrop: 3D Financial Globe */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center">
        <FinancialGlobe
          institutions={institutions}
          dependencies={dependencies}
          dataProviders={dataProviders}
          infrastructureNodes={infrastructureNodes}
          interactive={false}
          autoRotateSpeed={0.0016}
          className="w-full h-full max-h-[850px]"
        />
      </div>

      {/* 3. Stage Dispatcher */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-6xl mx-auto w-full overflow-y-auto">
        
        {/* =========================================================================
            STAGE A: LANDING / ENTRY SCREEN ("The Ecosystem Before You Enter It")
            ========================================================================= */}
        {stage === 'LANDING' && (
          <div className="space-y-8 max-w-3xl w-full my-auto animate-fade-in flex flex-col items-center">
            {/* FIS Logo & Brand Identity */}
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <img 
                  src={fisLogo} 
                  alt="Financial Immune System" 
                  className="h-20 w-auto object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.35)]" 
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  FINANCIAL IMMUNE SYSTEM
                </h1>
                <p className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold tracking-wider uppercase max-w-xl mx-auto">
                  SYSTEMIC CONTROL INTELLIGENCE FOR AI-ENABLED FINANCIAL ECOSYSTEMS
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
                An authoritative mission-control environment designed to detect informational and infrastructural fragility, compute counterfactual minimum effective interventions, and enforce independent closed-loop verification across interconnected financial ecosystems.
              </p>
            </div>

            {/* 4 Cybernetic Loop Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full text-left">
              <div className="p-3 rounded-lg bg-[#070d18]/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>1. SENSE</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Real-time telemetry ingestion & sentinel anomaly detection across interbank rails.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#070d18]/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>2. UNDERSTAND</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Causal multi-hop propagation, chokepoint saturation & decision diversity analysis.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#070d18]/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>3. INTERVENE</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Counterfactual Control Foundry evaluating Minimum Effective Interventions.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#070d18]/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>4. VERIFY</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Independent Enclave verification catching latent drift with closed-loop reassessment.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStage('ROLE_SELECT')}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>ENTER CONTROL ENVIRONMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowArchModal(true)}
                className="px-6 py-3 rounded-lg bg-[#0c1527] hover:bg-[#121f38] text-slate-300 border border-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-2"
              >
                <Server className="w-4 h-4 text-blue-400" />
                <span>VIEW SYSTEM ARCHITECTURE</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="px-6 py-3 rounded-lg bg-[#0c1527] hover:bg-[#121f38] text-emerald-400 border border-emerald-800 font-mono text-xs font-bold transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>DEMONSTRATION MODE</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE B: ROLE SELECTION & IDENTITY PORTAL
            ========================================================================= */}
        {stage === 'ROLE_SELECT' && (
          <div className="space-y-5 max-w-5xl w-full my-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                  SECURITY DOMAIN: ENCLAVE ACCESS CONTROL
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Identity & Operational Role Selection
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Select an authenticated persona. Permissions and intervention authority are strictly enforced by the backend Enclave.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStage('LANDING')}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded bg-slate-900 border border-slate-800"
              >
                ← Back to Landing
              </button>
            </div>

            {/* 5 Persona Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
              {rolePersonas.map((persona) => {
                const isSelected = selectedRole === persona.role;
                return (
                  <div
                    key={persona.role}
                    onClick={() => setSelectedRole(persona.role)}
                    className={`p-3.5 rounded-lg cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/70 border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-400'
                        : 'bg-[#080e1a]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0c1527]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-1.5 rounded ${isSelected ? 'text-blue-400 bg-blue-900/50' : 'text-slate-400 bg-slate-800'}`}>
                          {persona.icon}
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          isSelected ? 'bg-blue-900 text-blue-200' : 'bg-slate-900 text-slate-500'
                        }`}>
                          {persona.tag}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white">{persona.title}</div>
                        <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">{persona.level}</div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug font-sans">
                        {persona.purpose}
                      </p>

                      {/* Permissions Checklist */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono">
                        {persona.permissions.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                            {p.allowed ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-3 h-3 text-red-500 text-center font-bold shrink-0">✕</span>
                            )}
                            <span className="truncate">{p.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-right">
                      {isSelected ? (
                        <span className="text-blue-400 font-bold">SELECTED ✓</span>
                      ) : (
                        <span className="text-slate-500">Click to Select</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Enclave Button */}
            <div className="pt-3 flex justify-center">
              <button
                type="button"
                onClick={() => handleStartLogin(selectedRole)}
                className="px-10 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>INITIALIZE ENCLAVE AS {selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE C: SYSTEM INITIALIZATION SEQUENCE (Enclave Boot Sequence)
            ========================================================================= */}
        {stage === 'INITIALIZING' && (
          <div className="space-y-5 max-w-xl w-full my-auto animate-fade-in text-left">
            <div className="fis-panel p-6 bg-[#070c18] border border-blue-500/60 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Terminal className="w-4 h-4 animate-pulse" />
                  <span>IBM Z ENCLAVE INITIALIZATION HANDSHAKE</span>
                </div>
                <span className="text-[10px] text-slate-400">SESSION: #ENC-{Date.now().toString(36).toUpperCase()}</span>
              </div>

              {/* Console Boot Steps */}
              <div className="space-y-3">
                {initSequence.map((item, idx) => {
                  const isDone = idx < initStep;
                  const isCurrent = idx === initStep;

                  return (
                    <div 
                      key={idx}
                      className={`flex items-start gap-3 p-2 rounded transition-colors ${
                        isCurrent ? 'bg-blue-950/40 text-cyan-300 font-bold' :
                        isDone ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin block" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-700 block" />
                        )}
                      </div>
                      <div className="leading-relaxed">
                        <span className="text-[10px] text-slate-500 mr-2">[{`0${idx + 1}/05`}]</span>
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
                <span>Cryptographic Digest: sha256:7c9e1b2d4f6c8e0a3</span>
                <button
                  type="button"
                  onClick={onComplete}
                  className="text-blue-400 hover:text-white underline"
                >
                  Skip Animation →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Architectural System Blueprint Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fis-panel max-w-4xl w-full p-6 border border-blue-500/80 shadow-2xl relative max-h-[90vh] overflow-y-auto font-mono text-xs space-y-4">
            <button
              type="button"
              onClick={() => setShowArchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-700"
            >
              ✕ CLOSE
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Financial Immune System — 4-Plane Architecture Dossier
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Technical Blueprint & IBM Z / LinuxONE Substrate Co-Location
              </p>
            </div>

            <div className="space-y-3">
              {/* Plane 1 */}
              <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>PLANE 1: SENSORY & ECOSYSTEM TOPOLOGY PLANE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">IMPLEMENTED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Maintains continuous ingestion across 20 institutions and 102 interbank channels. Incorporates rates oracles (DATA-X), settlement rails (INFRA-1 RTGS / INFRA-2 CCP), and autonomous trading models.
                </p>
              </div>

              {/* Plane 2 */}
              <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span>PLANE 2: SYSTEMIC CONTROLLABILITY INTELLIGENCE PLANE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">IMPLEMENTED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Computes multi-hop cascade depth, velocity, and Effective Decision Diversity (EDD). Dynamically derives Control Margin M(t) with mathematical provenance decomposition across dependency, propagation, and collective herding.
                </p>
              </div>

              {/* Plane 3 */}
              <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>PLANE 3: CONTROL FOUNDRY & GOVERNED ACTION BUS</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">IMPLEMENTED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Synthesizes counterfactual intervention candidates, identifies the Minimum Effective Intervention (MEI), enforces role-governed authorization, and executes state-altering isolations.
                </p>
              </div>

              {/* Plane 4 */}
              <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-purple-400 font-bold">
                  <span>PLANE 4: ASSURANCE, PRIVACY & IBM Z RUNTIME PLANE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">ARCHITECTED / SIMULATED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Houses Independent Enclave Verification to detect false recoveries, seals 9-step tamper-evident SHA-256 evidence packages under CPACF hardware acceleration, and enforces zero-knowledge role privacy boundaries.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowArchModal(false);
                  setStage('ROLE_SELECT');
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Proceed to Identity Selection →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Persistent Footer */}
      <footer className="relative z-20 px-6 py-3 border-t border-[#142036] bg-[#070c16]/90 text-center text-xs font-mono text-slate-500 shrink-0">
        REAL-TIME AI FOR CRITICAL DECISIONS
      </footer>
    </div>
  );
};

export default LoginPortal;
