/**
 * FINANCIAL IMMUNE SYSTEM - GLOBAL COMMAND HEADER
 * Institutional Sovereign Infrastructure Header with Presentation Mode
 */

import React, { useState, useEffect } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { ROLE_DEFINITIONS } from '@shared/types/roles';
import { 
  Shield, 
  RotateCcw, 
  Zap, 
  User, 
  Clock, 
  Tv, 
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const currentRole = useSystemStore(state => state.currentRole);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const controlState = useSystemStore(state => state.controlState);
  const startScenario = useSystemStore(state => state.startScenario);
  const resetScenario = useSystemStore(state => state.resetScenario);
  const setRoleModalOpen = useSystemStore(state => state.setRoleModalOpen);
  const isDemoMode = useSystemStore(state => state.isDemoMode);
  const setDemoMode = useSystemStore(state => state.setDemoMode);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const [utcTime, setUtcTime] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<any>('SCENARIO_A');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = `${monthNames[now.getUTCMonth()]} ${String(now.getUTCDate()).padStart(2, '0')}`;
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`;
      setUtcTime(`${dateStr} • ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerScenario = () => {
    startScenario(selectedScenario);
  };

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const roleMeta = ROLE_DEFINITIONS.find(r => r.role === currentRole) || ROLE_DEFINITIONS[0];

  return (
    <header className="h-16 border-b border-[#15233c] bg-[#070c18] px-3 sm:px-5 flex items-center justify-between select-none z-30 sticky top-0 shrink-0">
      {/* 1. Zone Left: IBM Emblem + System Title & Substrate Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentRoute('control-center')}
          className="flex items-center gap-3 text-left group"
          title="Return to Main Command Center"
        >
          {/* IBM 8-Bar SVG Mark */}
          <div className="h-6 w-9 text-blue-500 shrink-0">
            <svg viewBox="0 0 100 40" className="h-full w-full fill-blue-500 group-hover:fill-blue-400 transition-colors">
              <path d="M0,0 H10 V40 H0 Z M15,0 H25 V40 H15 Z M30,0 H55 V10 H40 V15 H50 V25 H40 V30 H55 V40 H30 Z M60,0 H70 V40 H60 Z M75,0 H85 V40 H75 Z M90,0 H100 V40 H90 Z" />
            </svg>
          </div>

          <div className="border-l border-[#1a2b48] pl-2.5">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans group-hover:text-blue-300 transition-colors">
                FINANCIAL IMMUNE SYSTEM
              </h1>
              <span className="hidden lg:inline-block px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-400 border border-blue-700/50 text-[9px] font-mono font-bold tracking-wider">
                SOVEREIGN ENCLAVE
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase hidden sm:block">
              SYSTEMIC CONTROL INTELLIGENCE // IBM Z ARCHITECTURE
            </div>
          </div>
        </button>
      </div>

      {/* 2. Zone Center: Active Threat Status Pill & Live Clock */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        {/* Status indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border whitespace-nowrap shrink-0 ${
          isAttack
            ? 'bg-red-950/80 text-red-300 border-red-700 shadow-glow-red animate-pulse'
            : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 shadow-glow-emerald'
        }`}>
          {isAttack ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="font-bold">INCIDENT ACTIVE: RN-2026-0041</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold">EQUILIBRIUM: ALL CHANNELS NOMINAL</span>
            </>
          )}
        </div>

        {/* UTC Clock */}
        <div className="hidden 2xl:flex text-[11px] font-mono text-slate-400 px-2.5 py-1 bg-[#091122] rounded border border-[#14223b] items-center gap-1.5 whitespace-nowrap shrink-0">
          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{utcTime || 'Oct 12 • 21:30:00 UTC'}</span>
        </div>
      </div>

      {/* 3. Zone Right: Presentation Mode Toggle, Role Badge & Scenario Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Competition Presentation Mode Toggle (Section 47) */}
        <button
          type="button"
          onClick={() => setDemoMode(!isDemoMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
            isDemoMode
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-bold'
              : 'bg-[#0a1224] text-slate-400 border-[#192b4a] hover:text-white hover:border-slate-600'
          }`}
          title="Toggle Judge Presentation Mode (Hides distraction panels, focuses Golden Path)"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isDemoMode ? 'Presentation Mode' : 'Demo Mode'}</span>
        </button>

        {/* Operator Role Pill */}
        <button
          type="button"
          data-testid="header-role-pill"
          onClick={() => setRoleModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b1428] border border-blue-500/40 text-xs font-mono text-blue-300 hover:border-blue-400 transition-colors"
          title="Switch Operational Role / Dual-Auth Signer"
        >
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold hidden lg:inline">{roleMeta.title}</span>
          <span className="lg:hidden">{currentRole === 'SYSTEM_OPERATOR' ? 'OPERATOR' : 'AUDITOR'}</span>
        </button>

        {/* Scenario Selection Dropdown */}
        <div className="hidden xl:flex items-center">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="bg-[#091122] border border-[#1a2d4e] text-slate-200 text-xs font-mono px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            title="Select Scenario Injection"
          >
            <option value="SCENARIO_A">A: Common Data (DATA-X)</option>
            <option value="SCENARIO_B">B: Rail Outage (RTGS/CCP)</option>
            <option value="SCENARIO_C">C: Latent Contagion (MODEL-C)</option>
            <option value="SCENARIO_D">D: AI Herding Convergence</option>
          </select>
        </div>

        {/* Action Buttons: Inject vs Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTriggerScenario}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-all ${
              isAttack
                ? 'bg-red-700 text-white ring-1 ring-red-400 animate-pulse'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
            }`}
            title="Inject Stress Shock into Living State"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAttack ? 'Attack Active' : 'Inject Shock'}</span>
          </button>

          <button
            type="button"
            onClick={resetScenario}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-md shadow-blue-600/30 transition-all"
            title="Reset to Deterministic Nominal Baseline (Seed: 42091)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
