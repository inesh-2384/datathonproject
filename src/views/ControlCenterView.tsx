/**
 * FINANCIAL IMMUNE SYSTEM - COMMAND CENTER VIEW (MODULE 02)
 * High-Density Executive Decision Surface & Living Operational Command Console
 * 
 * Directly Implements Section 43:
 * "THE OPERATOR KNOWS WHAT IS HAPPENING WITHIN SECONDS."
 * 
 * Visual Hierarchy:
 * LEVEL 1: Systemic State & Hero Control Margin (M(t), Reserve Status, Horizon)
 * LEVEL 2: Current Threat & Causal Attribution (Why is control slipping?)
 * LEVEL 3: Connected Systemic Telemetry (Chokepoints, AI Herding, Live Event Stream)
 * LEVEL 4: Available Governed Control (Recommended MEI, Quick Dual-Auth & Dispatch)
 * LEVEL 5: Cryptographic Assurance Posture (IBM Z LinuxONE Enclave, CPACF SHA-256 Seal)
 */

import React, { useEffect, useState } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { ControlMarginHero } from '../components/common/ControlMarginHero';
import { PanelSurface } from '../components/common/PanelSurface';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  Radio, 
  Network, 
  Cpu, 
  Share2, 
  Gauge, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  Lock, 
  Server, 
  Activity,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';

export const ControlCenterView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const currentRole = useSystemStore(state => state.currentRole);
  const authoritativeEvents = useSystemStore(state => state.authoritativeEvents);
  const institutions = useSystemStore(state => state.institutions);
  const dependencies = useSystemStore(state => state.dependencies);
  const selectEntity = useSystemStore(state => state.selectEntity);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);
  const fetchReplayTimeline = useSystemStore(state => state.fetchReplayTimeline);
  const fetchFoundryState = useSystemStore(state => state.fetchFoundryState);
  const fetchAssuranceState = useSystemStore(state => state.fetchAssuranceState);
  const authorizeFoundryCandidate = useSystemStore(state => state.authorizeFoundryCandidate);
  const executeFoundryCandidate = useSystemStore(state => state.executeFoundryCandidate);
  const isDemoMode = useSystemStore(state => state.isDemoMode);
  const foundryState = useSystemStore(state => state.foundryState);

  const [selectedGraphNode, setSelectedGraphNode] = useState<string>('DATA-X');
  const [authStatus, setAuthStatus] = useState<'PENDING' | 'AUTHORIZED' | 'EXECUTED'>('PENDING');

  useEffect(() => {
    fetchReplayTimeline();
    fetchFoundryState();
    fetchAssuranceState();
  }, []);

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const latestVerif = foundryState?.latest_verification || null;
  const crp = latestVerif?.restoration_assessment || null;
  const isUnverifiedFailure = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED' || latestVerif?.verification_result === 'VERIFIED_FAILED';
  const isRestoredFromBackstop = (!isAttack && controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90) || latestVerif?.verification_result === 'VERIFIED_EFFECTIVE';
  const marginVal = controlState.control_margin_percent;
  const isCommander = currentRole === 'INCIDENT_COMMANDER' || currentRole === 'RISK_OFFICER';

  // Mini topology nodes for interactive SVG chokepoint preview
  const topoNodes = [
    { id: 'DATA-X', label: 'DATA-X', type: 'ORACLE', x: 120, y: 62, color: isAttack ? '#ef4444' : '#10b981' },
    { id: 'BANK-A', label: 'BANK-A', type: 'G-SIB', x: 50, y: 30, color: isAttack ? '#f59e0b' : '#3b82f6' },
    { id: 'BANK-B', label: 'BANK-B', type: 'G-SIB', x: 190, y: 30, color: isAttack ? '#f59e0b' : '#3b82f6' },
    { id: 'MODEL-A', label: 'MODEL-A', type: 'AI', x: 50, y: 95, color: isUnverifiedFailure ? '#ef4444' : '#a855f7' },
    { id: 'INFRA-1', label: 'RTGS', type: 'RAIL', x: 190, y: 95, color: '#06b6d4' },
  ];

  const handleQuickAuthorize = async () => {
    if (!isCommander) {
      setCurrentRoute('control-foundry');
      return;
    }
    const ok = await authorizeFoundryCandidate('CAND-RN-2026-0041-DEP-ISOLATION', 'Authorized from Command Center');
    if (ok) {
      setAuthStatus('AUTHORIZED');
    }
  };

  const handleQuickExecute = async () => {
    if (authStatus !== 'AUTHORIZED') {
      setCurrentRoute('control-foundry');
      return;
    }
    const ok = await executeFoundryCandidate('CAND-RN-2026-0041-DEP-ISOLATION', false);
    if (ok) {
      setAuthStatus('EXECUTED');
    }
  };

  const nominalBaselineEvents = [
    { time: '21:30:00', source: 'ENCLAVE', desc: 'CPACF SHA-256 baseline attestation verified', sev: 'NOMINAL' },
    { time: '21:30:01', source: 'DATA-X', desc: 'Sovereign market feed quorum 100% synchronized', sev: 'NOMINAL' },
    { time: '21:30:02', source: 'INFRA-1', desc: 'RTGS & CCP intraday liquidity buffers nominal', sev: 'NOMINAL' },
    { time: '21:30:03', source: 'MODEL-A', desc: 'Collective AI decision diversity E(t) = 0.88', sev: 'NOMINAL' }
  ];

  const displayEvents = isAttack
    ? (authoritativeEvents.length > 0 ? authoritativeEvents.slice(0, 4) : [
        { time: '21:30:05', source: 'DATA-X', desc: 'Price feed anomaly detected (+18.4% drift)', sev: 'CRITICAL' },
        { time: '21:30:06', source: 'BANK-A', desc: 'Correlated model sell order dispatched', sev: 'HIGH' },
        { time: '21:30:07', source: 'BANK-B', desc: 'Follow-on liquidation queue formed', sev: 'HIGH' },
        { time: '21:30:08', source: 'MODEL-A', desc: 'Decision entropy collapsed (< 0.12 bits)', sev: 'HIGH' }
      ])
    : nominalBaselineEvents;

  return (
    <div className="p-3 sm:p-4 space-y-3 max-w-[1720px] mx-auto select-none">
      {/* =========================================================================
          SECTION 1: HERO CONTROL MARGIN & EXECUTIVE POSTURE (Row 1)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* 1.1 Hero Control Margin Component (8 cols on large screens) */}
        <div className="lg:col-span-8">
          <ControlMarginHero
            controlState={controlState}
            intelligenceAssessment={controlState.intelligence}
            onDrillDown={() => setCurrentRoute('control-margin')}
          />
        </div>

        {/* 1.2 Active Incident Dossier & Assurance Posture (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {/* Active Incident Dossier */}
          <PanelSurface
            title={isUnverifiedFailure ? 'Residual Threat Alert' : isAttack ? 'Active Systemic Threat' : isRestoredFromBackstop ? 'Verified Recovery Posture' : 'Systemic Threat Posture'}
            level={1}
            moduleNumber="03"
            headerAction={
              <button
                type="button"
                onClick={() => setCurrentRoute(isUnverifiedFailure ? 'verification' : 'event-detection')}
                className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                <span>{isUnverifiedFailure ? 'Inspect Verification (10)' : 'Inspect Event (03)'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            }
            className="flex-1"
          >
            {isUnverifiedFailure ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>EXECUTION ≠ RECOVERY</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold animate-pulse">
                    {crp?.restoration_state ? `CRP: ${crp.restoration_state}` : 'VERIFIED FAILED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  Gateway isolated <strong className="text-white font-mono">DATA-X</strong>, but Enclave Verifier detected latent contagion in <strong className="text-red-300 font-mono">MODEL-C</strong> (<code className="text-red-300">PATH-MODEL-C</code>).
                </div>
                <div className="pt-1.5 border-t border-[#15233c] flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 font-bold">Mandatory Escalation Active</span>
                  <button
                    type="button"
                    onClick={() => setCurrentRoute('reassessment')}
                    className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <span>Open Reassessment (11)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : isAttack ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>RN-2026-0041 • DATA-X</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold animate-pulse">
                    SYSTEMIC THREAT
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  <strong className="text-slate-400 font-mono">CAUSE:</strong> Common Rates Oracle (<strong className="text-white font-mono">DATA-X</strong>) compromised.<br />
                  <strong className="text-slate-400 font-mono">CONSEQUENCE:</strong> Correlated AI sell herd across <strong className="text-amber-300">8 Core Nodes</strong>.
                </div>

                <div className="pt-1.5 border-t border-[#15233c] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    Next: <strong className="text-cyan-400">Isolate DATA-X</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentRoute('control-foundry')}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span>Open Control Foundry (08)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : isRestoredFromBackstop ? (
              <div className="space-y-1.5 font-mono text-xs py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Control Verified Restored</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    {crp?.restoration_state ? `CRP: ${crp.restoration_state}` : `M(t) = ${marginVal}%`}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  Secondary backstop (<strong className="text-white font-mono">MODEL-C Quarantine</strong>) neutralized latent contagion across all 8 affected nodes. Residual vectors: <strong className="text-emerald-400">0 Active</strong>.
                </div>
                <div className="pt-1 border-t border-[#15233c] text-[10px] text-emerald-400/90">
                  ✓ Enclave Attested: VERIFIED_EFFECTIVE (CPACF SHA-256)
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs py-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Nominal Equilibrium (91% Baseline)</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug font-sans">
                  All 102 interbank dependency channels and 20 institutional balance sheets are operating within safe control tolerances.
                </div>
                <div className="pt-1 border-t border-[#15233c] text-[10px] text-slate-500">
                  Zero active threats • Continuous SHA-256 integrity digest audit [SIMULATED CPACF]
                </div>
              </div>
            )}
          </PanelSurface>

          {/* IBM Z Assurance Substrate */}
          <div className="fis-panel px-3 py-2 bg-[#080e1c] border border-[#17253d] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Server className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white tracking-wide">
                  IBM LinuxONE III Enclave <span className="text-[9px] text-amber-400 font-normal ml-1">[ARCHITECTED]</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Simulated SHA-256 Lineage: <strong className="text-emerald-400">AUDITED [TARGET: CPACF]</strong>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentRoute('ibm-runtime')}
              className="text-blue-400 hover:text-white text-[10px] flex items-center gap-1 font-bold shrink-0"
            >
              <span>Runtime (16)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CONNECTED SPATIAL & TELEMETRIC INTELLIGENCE (Row 2)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 2.1 Live System Topology / Chokepoint Map Preview */}
        <PanelSurface
          title="Chokepoint Topology"
          subtitle="20 Institutions • 102 Exposure Arcs"
          icon={<Network className="w-4 h-4 text-cyan-400" />}
          level={2}
          moduleNumber="04"
          headerAction={
            <button
              type="button"
              onClick={() => setCurrentRoute('system-map')}
              className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
            >
              <span>System Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-1.5">
            {/* Interactive SVG Network Map */}
            <div className="h-32 relative bg-[#040710] rounded border border-[#0d1627] flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 240 125">
                {/* Edges from DATA-X */}
                {topoNodes.slice(1).map((n) => (
                  <line 
                    key={n.id}
                    x1={topoNodes[0].x} y1={topoNodes[0].y}
                    x2={n.x} y2={n.y}
                    stroke={isAttack ? '#ef4444' : '#1e3a5f'}
                    strokeWidth={isAttack ? '2' : '1'}
                    strokeDasharray={isAttack ? '3,3' : undefined}
                    className={isAttack ? 'animate-pulse' : ''}
                  />
                ))}

                {/* Node Circles */}
                {topoNodes.map((n) => {
                  const isSelected = selectedGraphNode === n.id;
                  return (
                    <g 
                      key={n.id} 
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedGraphNode(n.id);
                        selectEntity(n.id);
                      }}
                    >
                      <circle 
                        cx={n.x} cy={n.y} r={n.id === 'DATA-X' ? 13 : 10}
                        fill="#060c18"
                        stroke={n.color}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all group-hover:stroke-blue-400"
                      />
                      <text 
                        x={n.x} y={n.y + 2.5}
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400">
                Selected: <strong className="text-white">{selectedGraphNode}</strong> (Click node to inspect)
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Oracle Concentration: <strong className="text-white">HHI 0.57</strong></span>
              <span className={isAttack ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {isAttack ? 'Single-Origin Chokepoint' : 'All Rails Clear'}
              </span>
            </div>
          </div>
        </PanelSurface>

        {/* 2.2 Collective AI & Herding Intelligence Preview */}
        <PanelSurface
          title="Collective AI Intelligence"
          subtitle="Decision Synchrony & Model Coupling"
          icon={<Cpu className="w-4 h-4 text-purple-400" />}
          level={2}
          moduleNumber="05"
          headerAction={
            <button
              type="button"
              onClick={() => setCurrentRoute('collective-intelligence')}
              className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
            >
              <span>AI Herd (05)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-2.5 font-mono text-xs">
            {/* Stat Row */}
            <div className="grid grid-cols-2 gap-2 p-2 rounded bg-[#060c1a] border border-[#121f38]">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Effective Diversity</div>
                <div className={`text-xl font-black tabular-nums ${isAttack ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isAttack ? '0.15' : '0.88'}
                </div>
                <div className="text-[9px] text-slate-500">Nominal: 0.88</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Synchrony Index</div>
                <div className={`text-xl font-black tabular-nums ${isAttack ? 'text-red-400' : 'text-slate-300'}`}>
                  {isAttack ? '91%' : '18%'}
                </div>
                <div className="text-[9px] text-slate-500">{isAttack ? 'Correlated herd' : 'Independent models'}</div>
              </div>
            </div>

            {/* Algorithmic Herd Pressure Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Algorithmic Sell Runoff:</span>
                <span className={isAttack ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {isAttack ? '70% (HERD RUN)' : '15% (BALANCED)'}
                </span>
              </div>
              <div className="w-full bg-[#0a1120] h-2 rounded-full overflow-hidden border border-[#17253d]">
                <div 
                  className={`h-full ${isAttack ? 'bg-red-500' : 'bg-emerald-500'} transition-all duration-500`}
                  style={{ width: isAttack ? '70%' : '15%' }}
                />
              </div>
              <div className="text-[9px] text-slate-500">
                {isAttack ? 'Common Oracle coupling drives correlated liquidation cascade.' : 'Models operating on independent feature distributions.'}
              </div>
            </div>

            {/* Causal Chain: Shared Oracle -> AI Models -> Automated Decisions */}
            <div className="p-2 rounded bg-[#070e1c] border border-[#17253d] space-y-1.5 text-[10px]">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                <span>Decision Environment Causal Chain</span>
                <span className={isAttack ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {isAttack ? "COUPLED HERD" : "DECOUPLED"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[9px] font-mono">
                <div className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200" title="Shared Dependency Oracle">
                  DATA-X
                </div>
                <span className="text-slate-500">→</span>
                <div className={`px-1.5 py-0.5 rounded border ${isAttack ? 'bg-red-950/70 border-red-700 text-red-200' : 'bg-slate-900 border-slate-700 text-slate-200'}`} title="Shared AI Models">
                  MODEL-A,B,C
                </div>
                <span className="text-slate-500">→</span>
                <div className={`px-1.5 py-0.5 rounded border ${isAttack ? 'bg-red-950/70 border-red-700 text-red-200' : 'bg-slate-900 border-slate-700 text-slate-200'}`} title="Automated Institutional Execution">
                  BANK-A,B,C
                </div>
                <span className="text-slate-500">→</span>
                <div className={`px-1.5 py-0.5 rounded border ${isAttack ? 'bg-red-950 text-red-400 border-red-600 font-bold' : 'bg-emerald-950 text-emerald-400 border-emerald-700'}`}>
                  {isAttack ? '91% Sync' : '18% Sync'}
                </div>
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                {isAttack 
                  ? 'Shared pricing weights cause simultaneous algorithmic margin selloffs across multiple institutions.'
                  : 'Decoupled model weights and diversified oracle feeds maintain autonomous institutional decisioning.'}
              </div>
            </div>
          </div>
        </PanelSurface>

        {/* 2.3 Authoritative Event Stream Preview */}
        <PanelSurface
          title="Authoritative Event Stream"
          subtitle="Simulated Event Log [Target: CPACF Sealed]"
          icon={<Radio className={`w-4 h-4 ${isAttack ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />}
          level={3}
          moduleNumber="03"
          headerAction={
            <button
              type="button"
              onClick={() => setCurrentRoute('event-detection')}
              className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
            >
              <span>Event Log</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-1.5 font-mono text-[10px] max-h-36 overflow-y-auto pr-1">
            {displayEvents.map((evt: any, idx) => {
              const sev = evt.sev || evt.severity || 'INFO';
              const isCrit = sev === 'CRITICAL';
              const isHigh = sev === 'HIGH' || sev === 'WARNING';
              return (
                <div 
                  key={idx} 
                  onClick={() => selectEntity(evt.source || evt.entity_id || evt.source_entity_id)}
                  className="flex items-center justify-between p-1.5 rounded bg-[#060c18] border border-[#132038] hover:border-blue-500 cursor-pointer transition-colors"
                  title="Click to inspect entity in context"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 shrink-0">{evt.time || '21:30:05'}</span>
                    <span className="text-cyan-400 font-bold shrink-0">{evt.source || evt.source_entity_id || 'ENCLAVE'}</span>
                    <span className="text-slate-300 truncate">{evt.desc || evt.causal_narrative || evt.description || evt.event_type}</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold shrink-0 ml-1 border ${
                    isCrit 
                      ? 'text-red-400 bg-red-950/80 border-red-800' 
                      : isHigh
                      ? 'text-amber-400 bg-amber-950/80 border-amber-800'
                      : 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
                  }`}>
                    {sev}
                  </span>
                </div>
              );
            })}
          </div>
        </PanelSurface>
      </div>

      {/* =========================================================================
          SECTION 3: GOVERNED CONTROL & CLOSING THE LOOP (Row 3)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* 3.1 Recommended Minimum Effective Intervention (MEI) Card (7 cols) */}
        <div className="lg:col-span-7">
          <PanelSurface
            title="Control Foundry // Recommended Intervention"
            subtitle="Counterfactual Minimum Effective Intervention & Governance"
            icon={<Sliders className="w-4 h-4 text-amber-400" />}
            level={4}
            moduleNumber="08"
            headerAction={
              <button
                type="button"
                onClick={() => setCurrentRoute('control-foundry')}
                className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                <span>Open Foundry (08)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            }
          >
            {isAttack ? (
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-[#070e1c] border border-[#15243e]">
                  <div>
                    <div className="text-[10px] text-amber-400 uppercase font-bold">
                      {isUnverifiedFailure ? 'Mandatory Secondary Escalation' : 'Minimum Effective Intervention (MEI)'}
                    </div>
                    <div className="font-bold text-white text-sm">
                      {isUnverifiedFailure
                        ? 'Enclave MODEL-C Quarantine & Parameter Clamp'
                        : 'Targeted Dependency Isolation (DATA-X → Tier-1 G-SIBs)'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Candidate ID: <strong className="text-cyan-400">{isUnverifiedFailure ? 'CAND-RN-2026-0041-MODEL-QUARANTINE-BACKSTOP' : 'CAND-RN-2026-0041-DEP-ISOLATION'}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase">Projected Restoration</div>
                    <div className="text-lg font-black text-emerald-400 tabular-nums">
                      {isUnverifiedFailure ? '+42 pts → 84%' : '+55 pts vs No-Action'}
                    </div>
                    <div className="text-[9px] text-slate-500">Disruption Cost: 8.4% (Minimal)</div>
                  </div>
                </div>

                {/* Dual-Authorization Governance Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded bg-[#0a1224] border border-[#1a2b4a]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="text-[11px]">
                      <span className="text-slate-400">Governance Gate (SOD): </span>
                      <strong className={
                        isUnverifiedFailure
                          ? 'text-red-400'
                          : authStatus === 'EXECUTED' 
                          ? 'text-emerald-400' 
                          : authStatus === 'AUTHORIZED' 
                          ? 'text-cyan-400' 
                          : 'text-amber-400'
                      }>
                        {isUnverifiedFailure ? 'REASSESSMENT REQUIRED' : authStatus === 'EXECUTED' ? 'DISPATCHED & EXECUTED' : authStatus === 'AUTHORIZED' ? 'AUTHORIZED (SEALED)' : 'AWAITING COMMANDER AUTHORIZATION'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentRoute(isUnverifiedFailure ? 'reassessment' : 'control-foundry')}
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow transition-all"
                    >
                      <span>{isUnverifiedFailure ? 'Authorize Backstop (11)' : 'Authorize & Execute in Foundry (08)'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded bg-[#070e1c] border border-[#15243e] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isRestoredFromBackstop ? 'Governed Backstop Verified Restorative (M(t) = 84%)' : 'Standby — No Active Intervention Required'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    {isRestoredFromBackstop
                      ? 'Primary DATA-X isolation and secondary MODEL-C enclave quarantine completed with full CPACF SHA-256 verification.'
                      : 'Control Foundry continuously evaluates 5 counterfactual intervention templates against live topology.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentRoute('control-foundry')}
                  className="px-3 py-1.5 rounded bg-[#0c182e] hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Inspect Foundry (08)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </PanelSurface>
        </div>

        {/* 3.2 Dynamic Causal Explanation Chain (5 cols) */}
        <div className="lg:col-span-5">
          <PanelSurface
            title="Causal Attribution Chain"
            subtitle="Monotonic Explainability & Evidence Status"
            icon={<Activity className="w-4 h-4 text-purple-400" />}
            level={2}
            moduleNumber="07"
            headerAction={
              <button
                type="button"
                onClick={() => setCurrentRoute('control-margin')}
                className="text-blue-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                <span>Margin Math (07)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            }
          >
            {isAttack ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-[11px] text-slate-300 leading-snug font-sans">
                  {controlState.intelligence?.primary_driver || 
                    'Common data dependency compromise at DATA-X induced synthetic pricing drift, triggering correlated sell orders across Tier-1 institutions.'}
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#15233c] text-[10px]">
                  <div className="p-1.5 rounded bg-[#060c18] border border-[#132038]">
                    <div className="text-slate-500">Oracle Conc.</div>
                    <div className="text-red-400 font-bold">-22 pts</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#060c18] border border-[#132038]">
                    <div className="text-slate-500">Cascade Depth</div>
                    <div className="text-amber-400 font-bold">-4 pts</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#060c18] border border-[#132038]">
                    <div className="text-slate-500">Evidence</div>
                    <div className="text-cyan-400 font-bold">FRESH (12s)</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-[11px] text-slate-400 leading-snug font-sans">
                  {isRestoredFromBackstop
                    ? 'Independent Enclave Verifier confirmed zero residual contagion across all 102 exposure arcs following secondary MODEL-C quarantine.'
                    : 'Zero control degradation active. Oracle concentration (HHI 0.57) is monitored within safe structural capacity bounds.'}
                </div>
                <div className="pt-1.5 border-t border-[#15233c] flex items-center justify-between text-[10px] text-slate-500">
                  <span>Independent Verification:</span>
                  <span className="text-emerald-400 font-bold">{isRestoredFromBackstop ? 'VERIFIED_EFFECTIVE' : 'NOMINAL QUORUM'}</span>
                </div>
              </div>
            )}
          </PanelSurface>
        </div>
      </div>
    </div>
  );
};
