/**
 * FINANCIAL IMMUNE SYSTEM - GLOBAL COMMAND HEADER
 * Institutional Enterprise Mission Control Header
 */

import React, { useState, useEffect } from 'react';
import fisLogo from '../../assets/fis_logo.png';
import { useSystemStore } from '../../store/useSystemStore';
import { ROLE_DEFINITIONS } from '@shared/types/roles';
import { 
  RotateCcw, 
  Zap, 
  User, 
  Clock, 
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
    <header className="h-14 border-b border-[#15233c] bg-[#070c18] px-3 sm:px-5 flex items-center justify-between select-none z-30 sticky top-0 shrink-0 overflow-x-hidden flex-nowrap">
      {/* 1. Zone Left: Official FIS Logo & Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentRoute('control-center')}
          className="flex items-center gap-2.5 text-left group"
          title="Return to Main Command Center"
        >
          {/* Official FIS Logo */}
          <div className="h-7 w-auto shrink-0 flex items-center">
            <img src={fisLogo} alt="Financial Immune System" className="h-7 w-auto object-contain" />
          </div>

          <div className="border-l border-[#1a2b48] pl-2.5 flex items-center gap-2">
            <h1 className="font-extrabold tracking-tight text-white text-sm sm:text-base font-sans group-hover:text-blue-300 transition-colors">
              FINANCIAL IMMUNE SYSTEM
            </h1>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden md:inline">
              | MISSION CONTROL
            </span>
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
        <div className="hidden xl:flex text-[11px] font-mono text-slate-400 px-2.5 py-1 bg-[#091122] rounded border border-[#14223b] items-center gap-1.5 whitespace-nowrap shrink-0">
          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{utcTime || 'Oct 12 • 21:30:00 UTC'}</span>
        </div>
      </div>

      {/* 3. Zone Right: Role Badge & Scenario Controls */}
      <div className="flex items-center gap-2 shrink-0">
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
