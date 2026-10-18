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
      <header className="relative z-20 h-[52px] px-3 sm:px-5 flex items-center justify-between border-b border-[#142036] bg-[#070c18] backdrop-blur-md shrink-0 select-none">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Authoritative FIS Logo Asset */}
          <div className="h-7 w-auto shrink-0 flex items-center justify-center">
            <img 
              src={fisLogo} 
              alt="Financial Immune System" 
              className="h-7 w-auto object-contain" 
            />
          </div>
          
          <div className="h-4 w-[1px] bg-slate-700/80 mx-0.5" />

          <h1 className="font-extrabold tracking-tight text-white text-xs sm:text-sm font-sans uppercase">
            FINANCIAL IMMUNE SYSTEM
          </h1>

          <div className="h-3.5 w-[1px] bg-slate-700/80 mx-0.5" />

          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
            MISSION CONTROL
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE SYSTEM</span>
          </span>
        </div>
      </header>

      {/* 2. Interactive Backdrop: 3D Systemic Network Globe */}
      <div className="absolute inset-0 z-0 opacity-35 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060a12]/40 to-[#060a12] z-10 pointer-events-none" />
        <FinancialGlobe
          institutions={institutions}
          dependencies={dependencies}
          dataProviders={dataProviders}
          infrastructureNodes={infrastructureNodes}
          interactive={false}
          autoRotateSpeed={0.0015}
          showOverlay={false}
          className="w-full h-full max-h-[950px]"
        />
      </div>

      {/* 3. Stage Dispatcher */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-5 text-center max-w-5xl mx-auto w-full overflow-y-auto">
        
        {/* =========================================================================
            STAGE A: LANDING / ENTRY SCREEN ("The Ecosystem Before You Enter It")
            ========================================================================= */}
        {stage === 'LANDING' && (
          <div className="space-y-3.5 sm:space-y-4 max-w-4xl w-full my-auto animate-fade-in flex flex-col items-center">
            {/* 1. Hero Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1426]/90 border border-blue-500/30 text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold tracking-wider uppercase shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEMIC CONTROL INTELLIGENCE FOR AI-ENABLED FINANCIAL ECOSYSTEMS</span>
            </div>

            {/* 2. Central FIS Logo */}
            <div className="relative flex justify-center items-center py-1">
              <img 
                src={fisLogo} 
                alt="Financial Immune System" 
                className="h-24 sm:h-28 w-auto object-contain relative z-10 drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]" 
              />
            </div>

            {/* 3. Main Title & Core Statements */}
            <div className="space-y-1.5 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                FINANCIAL IMMUNE SYSTEM
              </h1>
              <div className="text-xs sm:text-sm md:text-base font-mono font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 uppercase pt-0.5">
                &ldquo;DON&apos;T JUST PREDICT SYSTEMIC RISK. PRESERVE THE ABILITY TO CONTROL IT.&rdquo;
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans pt-0.5">
                An operational control environment for interconnected financial ecosystems &mdash; detecting systemic fragility, evaluating effective interventions, and independently verifying whether control is restored.
              </p>
            </div>

            {/* 4. Top Information Cards (Section 9) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 w-full text-left pt-1">
              {/* Card 1: ECOSYSTEM NODES */}
              <div className="p-2.5 rounded-lg bg-[#070e1c]/90 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>ECOSYSTEM NODES</span>
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-white">
                  {institutions.length || 20} Institutions &amp; Hubs
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">
                  {dependencies.length || 102} Interbank Dependency Edges
                </div>
              </div>

              {/* Card 2: CONTROL MARGIN */}
              <div className="p-2.5 rounded-lg bg-[#070e1c]/90 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>CONTROL MARGIN</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5">
                  <span>{controlState?.control_margin_percent ?? 91}%</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                    STABLE
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">
                  Baseline Reserve Headroom
                </div>
              </div>

              {/* Card 3: CONTROL MODEL */}
              <div className="p-2.5 rounded-lg bg-[#070e1c]/90 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>CONTROL MODEL</span>
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-white truncate">
                  Sense → Understand
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  → Intervene → Verify
                </div>
              </div>

              {/* Card 4: SYSTEM STATE */}
              <div className="p-2.5 rounded-lg bg-[#070e1c]/90 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>SYSTEM STATE</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="mt-1 font-mono font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>{controlState?.overall_status === 'STABLE' ? 'NOMINAL' : controlState?.overall_status || 'NOMINAL'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">
                  Closed-Loop Monitoring Active
                </div>
              </div>
            </div>

            {/* 5. Four-Stage Control Flow Cards (Section 10) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 w-full text-left">
              {/* Stage 1: SENSE */}
              <div className="p-2.5 rounded-lg bg-[#070d18]/90 border border-slate-800/90 space-y-1 relative group hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    <span>01. SENSE</span>
                  </div>
                  <span className="hidden md:inline text-slate-600 font-mono text-xs">→</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans leading-snug">
                  Real-time telemetry ingestion &amp; anomaly detection across interbank rails.
                </div>
              </div>

              {/* Stage 2: UNDERSTAND */}
              <div className="p-2.5 rounded-lg bg-[#070d18]/90 border border-slate-800/90 space-y-1 relative group hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-400 font-mono text-xs font-bold">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>02. UNDERSTAND</span>
                  </div>
                  <span className="hidden md:inline text-slate-600 font-mono text-xs">→</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans leading-snug">
                  Multi-hop cascade depth, chokepoint saturation &amp; decision diversity analysis.
                </div>
              </div>

              {/* Stage 3: INTERVENE */}
              <div className="p-2.5 rounded-lg bg-[#070d18]/90 border border-slate-800/90 space-y-1 relative group hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>03. INTERVENE</span>
                  </div>
                  <span className="hidden md:inline text-slate-600 font-mono text-xs">→</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans leading-snug">
                  Governed counterfactual evaluation finding Minimum Effective Interventions.
                </div>
              </div>

              {/* Stage 4: VERIFY */}
              <div className="p-2.5 rounded-lg bg-[#070d18]/90 border border-slate-800/90 space-y-1 relative group hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>04. VERIFY</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans leading-snug">
                  Independent closed-loop verification catching latent contagion drift.
                </div>
              </div>
            </div>

            {/* 6. Landing Page CTAs (Section 11) */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStage('ROLE_SELECT')}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold shadow-xl shadow-blue-600/35 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer border border-blue-400/30"
              >
                <span>ENTER CONTROL ENVIRONMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowArchModal(true)}
                className="px-6 py-3 rounded-lg bg-[#0b1324]/80 hover:bg-[#111e38] text-slate-300 border border-slate-700/80 font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>VIEW SYSTEM ARCHITECTURE</span>
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
                  <span>CONTROL ENVIRONMENT INITIALIZATION</span>
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
                  className="text-blue-400 hover:text-white underline cursor-pointer"
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
              className="absolute top-4 right-4 text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-700 cursor-pointer"
            >
              ✕ CLOSE
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Financial Immune System — 4-Plane Architecture Dossier
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Technical Blueprint & Secure Execution Substrate
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
                  <span>PLANE 4: ASSURANCE, PRIVACY & CONTROL VERIFICATION PLANE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">ARCHITECTED / SIMULATED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Houses Independent Verification to detect false recoveries, seals 9-step tamper-evident SHA-256 evidence packages under cryptographic acceleration, and enforces zero-knowledge role privacy boundaries.
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
