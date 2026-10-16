/**
 * FINANCIAL IMMUNE SYSTEM - PERSISTENT ENTERPRISE COMMAND SIDEBAR
 * Section 6: Global Application Shell Architecture
 */

import React, { useState } from 'react';
import { APPLICATION_ROUTES } from '@shared/constants/navigation';
import { useSystemStore } from '../../store/useSystemStore';
import { ROLE_DEFINITIONS } from '@shared/types/roles';
import { 
  ShieldAlert, 
  Network, 
  Cpu, 
  Share2, 
  Gauge, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  History, 
  FileText, 
  Lock, 
  Server, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  Radio,
  RotateCcw,
  ShieldCheck,
  Activity,
  AlertTriangle
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Radio: <Radio className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  RotateCcw: <RotateCcw className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  Server: <Server className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
};

export const NavigationSidebar: React.FC = () => {
  const currentRouteId = useSystemStore(state => state.currentRouteId);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);
  const inspectEvent = useSystemStore(state => state.inspectEvent);
  const currentRole = useSystemStore(state => state.currentRole);
  const setRoleModalOpen = useSystemStore(state => state.setRoleModalOpen);
  const controlState = useSystemStore(state => state.controlState);
  const connectionState = useSystemStore(state => state.connectionState);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDemoMode = useSystemStore(state => state.isDemoMode);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';

  const roleMeta = ROLE_DEFINITIONS.find(r => r.role === currentRole) || ROLE_DEFINITIONS[0];
  const categories = ['CONTROL', 'DECISION', 'ASSURANCE', 'RUNTIME'] as const;
  const canonicalPath = ['control-center', 'event-detection', 'system-map', 'collective-intelligence', 'propagation', 'control-margin', 'control-foundry', 'verification', 'reassessment'];

  return (
    <aside 
      className={`border-r border-[#15233c] bg-[#070c16] flex flex-col justify-between select-none shrink-0 transition-all duration-200 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. Header: Operator Profile & Collapse Toggle */}
      <div className="p-3 border-b border-[#15233c] bg-[#091120] space-y-2">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#101b30] transition-colors text-left w-full group"
                title="Click to Switch Role / Authority"
              >
                <div className="w-7 h-7 rounded bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:border-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white tracking-wide truncate group-hover:text-blue-300">
                    {roleMeta.title}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400/90 tracking-wider uppercase">
                    {currentRole === 'INCIDENT_COMMANDER' ? 'AUTHORIZE SIGNER (SOD)' : currentRole === 'SYSTEM_OPERATOR' ? 'EXECUTION AUTHORITY (SOD)' : 'SWITCH ROLE ▾'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 ml-1"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Active Incident Alert Banner in Sidebar */}
            {isAttack && (
              <button
                type="button"
                onClick={() => inspectEvent()}
                className="w-full p-2 rounded bg-red-950/80 border border-red-700 hover:bg-red-900 transition-colors text-left font-mono"
              >
                <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>INCIDENT ACTIVE</span>
                </div>
                <div className="text-[9px] text-slate-300 truncate mt-0.5">
                  RN-2026-0041 • DATA-X
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded hover:bg-[#101b30] text-slate-400 hover:text-blue-400"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {isAttack && (
              <button
                type="button"
                onClick={() => inspectEvent()}
                className="w-8 h-8 rounded bg-red-950 border border-red-700 flex items-center justify-center text-red-400 animate-pulse"
                title="Active Incident: RN-2026-0041"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Grouped Operational Modules Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {categories.map((cat) => {
          const routesInCat = APPLICATION_ROUTES.filter(r => r.category === cat);
          if (routesInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold border-b border-[#111c30]">
                  {cat}
                </div>
              )}
              <div className="space-y-0.5">
                {routesInCat.map((route) => {
                  const isActive = currentRouteId === route.id;

                  const isCanonical = isDemoMode && canonicalPath.includes(route.id);

                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setCurrentRoute(route.id)}
                      title={route.description}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-all font-mono text-left relative ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)] font-semibold'
                          : isCanonical
                          ? 'text-slate-300 hover:text-white hover:bg-[#0c1527] border border-indigo-900/40'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#0c1527] border border-transparent'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-blue-400' : isCanonical ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {ICON_MAP[route.iconName] || <Activity className="w-4 h-4" />}
                      </span>

                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full truncate">
                          <span className="truncate text-[11px] font-sans flex items-center gap-1.5">
                            {route.name}
                            {isCanonical && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" title="Golden Path Step" />}
                          </span>
                          {route.moduleNumber && (
                            <span className="text-[9px] font-mono text-slate-500 ml-1.5">
                              {route.moduleNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Persistent System Status */}
      <div className="p-3 border-t border-[#15233c] bg-[#070d18] text-[10px] font-mono space-y-2">
        {!isCollapsed ? (
          <>
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              SYSTEM STATUS
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Simulation
                </span>
                <span className="text-emerald-400 font-bold">{controlState.control_margin_percent}% M(t)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  SSE Stream
                </span>
                <span className="text-blue-400">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Evidence Chain
                </span>
                <span className="text-cyan-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="text-indigo-400">IBM Runtime:</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 text-[9px]">
                  ARCHITECTED
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live Simulation" />
            <span className="w-2 h-2 rounded-full bg-blue-400" title="SSE Connected" />
            <span className="w-2 h-2 rounded-full bg-cyan-400" title="Evidence Active" />
          </div>
        )}
      </div>
    </aside>
  );
};
