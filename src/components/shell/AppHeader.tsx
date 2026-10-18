/**
 * FINANCIAL IMMUNE SYSTEM - GLOBAL COMMAND HEADER
 * Institutional Enterprise Mission Control Header
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
    <header className="h-[52px] border-b border-[#142036] bg-[#070c18] px-3 sm:px-5 flex items-center justify-between select-none z-30 sticky top-0 shrink-0 overflow-x-hidden flex-nowrap">
      {/* 1. Zone Left: Shield Icon + System Title & Substrate Badge (Matching Image 2) */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentRoute('control-center')}
          className="flex items-center gap-2.5 text-left group"
          title="Return to Main Command Center"
        >
          {/* Vector Shield Icon */}
          <Shield className="w-5 h-5 text-blue-400 shrink-0 group-hover:text-blue-300 transition-colors" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold tracking-tight text-white text-xs sm:text-sm font-sans uppercase group-hover:text-blue-300 transition-colors">
                FINANCIAL IMMUNE SYSTEM
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-400 border border-blue-700/50 text-[9px] font-mono font-bold tracking-wider">
                SOVEREIGN ENCLAVE
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase hidden sm:block">
              SYSTEMIC CONTROL INTELLIGENCE // IBM Z ARCHITECTURE
            </div>
          </div>

          <div className="h-4 w-[1px] bg-slate-700/80 mx-1 hidden md:block" />

          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden md:inline">
            MISSION CONTROL
          </span>
        </button>
      </div>

      {/* 2. Zone Right: Restrained Live Status & Operational Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Status indicator: ● LIVE SYSTEM */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-medium whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isAttack ? 'LIVE SYSTEM • INCIDENT ACTIVE: RN-2026-0041' : 'LIVE SYSTEM'}</span>
          {!isAttack && (
            <span className="text-emerald-500/80 text-[10px] hidden md:inline">&bull; NOMINAL</span>
          )}
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-1.5">
          {/* Operator Role Pill */}
          <button
            type="button"
            data-testid="header-role-pill"
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0b1428] border border-blue-500/20 text-[11px] font-mono text-slate-300 hover:text-blue-200 hover:border-blue-400 transition-colors"
            title="Switch Operational Role / Dual-Auth Signer"
          >
            <User className="w-3 h-3 text-blue-400" />
            <span className="hidden lg:inline">{roleMeta.title}</span>
            <span className="text-[9px] text-slate-500">▼</span>
          </button>

          {/* Action Buttons: Inject Shock & Reset */}
          <button
            type="button"
            onClick={handleTriggerScenario}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
              isAttack
                ? 'bg-red-700 text-white ring-1 ring-red-400 animate-pulse'
                : 'bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900'
            }`}
            title="Inject Stress Shock into Living State"
          >
            <Zap className="w-3 h-3" />
            <span>{isAttack ? 'Attack Active' : 'Inject Shock'}</span>
          </button>

          <button
            type="button"
            onClick={resetScenario}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
            title="Reset to Deterministic Nominal Baseline (Seed: 42091)"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
