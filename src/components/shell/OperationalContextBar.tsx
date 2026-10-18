/**
 * FINANCIAL IMMUNE SYSTEM - OPERATIONAL CONTEXT BANNER & GUIDED OPERATOR WORKFLOW
 * Directly Implements Section 8 & Section 27:
 * "The evaluator should always understand:
 *  WHERE AM I? WHAT HAPPENED? WHY DID IT HAPPEN? WHAT CAN I DO? WHAT HAPPENS NEXT?"
 */

import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { APPLICATION_ROUTES } from '@shared/constants/navigation';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  Radio, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  RotateCcw,
  Sliders,
  Share2,
  Cpu,
  FileCheck2,
  History
} from 'lucide-react';

export const OperationalContextBar: React.FC = () => {
  const currentRouteId = useSystemStore(state => state.currentRouteId);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const controlState = useSystemStore(state => state.controlState);
  const currentRole = useSystemStore(state => state.currentRole);
  const simulationClock = useSystemStore(state => state.simulationClock);
  const permissions = useSystemStore(state => state.permissions);
  const injectAttack = useSystemStore(state => state.injectAttack);
  const resetScenario = useSystemStore(state => state.resetScenario);
  const authoritativeEvents = useSystemStore(state => state.authoritativeEvents);
  const activeOperation = useSystemStore(state => state.activeOperation);
  const inspectEvent = useSystemStore(state => state.inspectEvent);
  const isDemoMode = useSystemStore(state => state.isDemoMode);
  const foundryState = useSystemStore(state => state.foundryState);

  const currentRoute = APPLICATION_ROUTES.find(r => r.id === currentRouteId) || APPLICATION_ROUTES[0];
  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const isResidual = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED';
  const isRestored = !isAttack && marginValHelper(controlState.control_margin_percent) >= 80 && marginValHelper(controlState.control_margin_percent) < 90;
  const margin = controlState.control_margin_percent;
  const lastEvent = authoritativeEvents[0];
  const affectedCount = activeIncident?.affected_node_ids?.length || controlState.active_threat_count || 8;
  const operationStatus = activeOperation ? activeOperation.status : (controlState.overall_status === 'STABLE' ? 'IDLE' : 'MONITORING');

  function marginValHelper(v: number) { return v; }

  // Determine dynamic Next Action based on authoritative system state (Section 16 & 17)
  const getNextAction = () => {
    if (activeOperation && ['QUEUED', 'RUNNING', 'PROCESSING'].includes(activeOperation.status)) {
      return {
        label: `Processing ${activeOperation.operation_type}...`,
        icon: <RotateCcw className="w-3.5 h-3.5 text-blue-400 animate-spin" />,
        action: () => {},
        hint: 'Authoritative state transition in progress'
      };
    }

    // 1. NORMAL / STABLE State
    if (controlState.overall_status === 'STABLE' && !isAttack) {
      if (simulationClock.tick > 0) {
        return {
          label: 'Return to Baseline',
          icon: <RotateCcw className="w-3.5 h-3.5 text-slate-400" />,
          action: () => resetScenario(),
          hint: 'Reset simulation to Tick 0'
        };
      }
      return {
        label: 'Monitor Ecosystem',
        icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
        action: () => setCurrentRoute('control-center'),
        hint: 'System in nominal equilibrium (M(t)=91%)'
      };
    }

    // 2. EVENT DETECTED (Initial compromise tick 0)
    if (simulationClock.tick === 0 && isAttack && currentRouteId !== 'event-detection') {
      return {
        label: 'Inspect Event (Alert RN-2026-0041)',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        action: () => inspectEvent(),
        hint: 'Inspect cryptographic alert payload and auto-focus incident dossier'
      };
    }

    // 3. PROPAGATING (Ticks 1-2, multi-hop transmission)
    if (simulationClock.tick >= 1 && simulationClock.tick <= 2 && ['DEGRADING', 'CRITICAL'].includes(controlState.overall_status)) {
      if (currentRouteId !== 'propagation' && currentRouteId !== 'system-map') {
        return {
          label: 'Review Propagation & Topology',
          icon: <Share2 className="w-3.5 h-3.5 text-cyan-400" />,
          action: () => setCurrentRoute('propagation'),
          hint: 'Analyze multi-hop cascade progression'
        };
      }
    }

    // 4. RESIDUAL RISK
    if (isResidual) {
      return {
        label: 'Inspect Latent Drift & Reassess',
        icon: <RotateCcw className="w-3.5 h-3.5 text-purple-400" />,
        action: () => setCurrentRoute('reassessment'),
        hint: 'Closed-loop reassessment of MODEL-C vector'
      };
    }

    // 5. CONTROL DEGRADING / CRITICAL
    if (['DEGRADING', 'CRITICAL', 'COLLAPSING', 'CONTROL_DEGRADING'].includes(controlState.overall_status)) {
      if (currentRouteId !== 'control-margin' && currentRouteId !== 'control-foundry') {
        return {
          label: 'Assess Control Margin',
          icon: <Sliders className="w-3.5 h-3.5 text-rose-400" />,
          action: () => setCurrentRoute('control-margin'),
          hint: 'Evaluate reserve depletion and synthesize MEI'
        };
      }
      return {
        label: 'Open Control Foundry',
        icon: <Zap className="w-3.5 h-3.5 text-blue-400" />,
        action: () => setCurrentRoute('control-foundry'),
        hint: 'Synthesize counterfactual interventions'
      };
    }

    // 6. RESTORED / RECOVERING
    if (['RESTORED', 'RECOVERING'].includes(controlState.overall_status) || isRestored) {
      return {
        label: 'Review Evidence Chain',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        action: () => setCurrentRoute('evidence'),
        hint: 'Verify cryptographic evidence chain'
      };
    }

    // Fallback
    return {
      label: 'Mission Control',
      icon: <Shield className="w-3.5 h-3.5 text-blue-400" />,
      action: () => setCurrentRoute('control-center'),
      hint: 'Command overview'
    };
  };

  const nextAction = getNextAction();

  // 10-step lifecycle progression items
  const workflowSteps = [
    { id: 'event-detection', step: '03', label: 'Detect' },
    { id: 'system-map', step: '04', label: 'Map' },
    { id: 'collective-intelligence', step: '05', label: 'AI Herd' },
    { id: 'propagation', step: '06', label: 'Propagate' },
    { id: 'control-margin', step: '07', label: 'Margin' },
    { id: 'control-foundry', step: '08', label: 'Foundry' },
    { id: 'execution', step: '09', label: 'Execute' },
    { id: 'verification', step: '10', label: 'Verify' },
    { id: 'reassessment', step: '11', label: 'Reassess' },
    { id: 'evidence', step: '14', label: 'Evidence' },
  ];

  const authorizedAudit = foundryState?.audit_trail?.find(a => a.event_type === 'AUTHORIZATION_GRANTED');
  const latestExec = foundryState?.latest_execution;
  const latestVerif = foundryState?.latest_verification;

  return (
    <div className="bg-[#070c18] border-b border-[#142036] px-4 py-1.5 select-none shrink-0 z-10">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Current Location & Incident Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase font-bold text-[10px]">WORKSPACE:</span>
            <span className="text-white font-bold">{currentRoute.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">{currentRoute.category}</span>
          </div>

          {/* Active Incident & State Pill */}
          {isAttack ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inspectEvent()}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-300 text-[10px] font-bold animate-pulse hover:bg-red-900 transition-colors"
                title="Click to inspect and auto-focus active incident event in Event Detection Console"
              >
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>INCIDENT: {activeIncident?.incident_id || 'RN-2026-0041'}</span>
              </button>
              <button
                type="button"
                onClick={() => inspectEvent()}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-blue-300 text-[10px] font-bold hover:bg-blue-900 transition-colors"
                title="Inspect Event (Alert RN-2026-0041) — Focuses & Expands Dossier"
              >
                <Radio className="w-2.5 h-2.5 text-blue-400" />
                <span>Inspect Event</span>
              </button>
              <div className="hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/60 text-amber-300">
                <span className="text-slate-500 font-bold">STATE:</span>
                <span className="font-bold">{controlState.overall_status}</span>
              </div>
              <div className="hidden lg:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#0b1324] border border-[#1b2b48] text-slate-300">
                <span className="text-slate-500 font-bold">LAST EVENT:</span>
                <span className="text-cyan-400 font-bold truncate max-w-[140px]">{lastEvent?.event_type || 'PROVIDER_COMPROMISED'}</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#0b1324] border border-[#1b2b48] text-slate-300">
                <span className="text-slate-500 font-bold">AFFECTED:</span>
                <span className="text-rose-400 font-bold">{affectedCount} nodes</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{isRestored ? 'CONTROL RESTORED' : 'NOMINAL BASELINE'}</span>
              </div>
              <button
                type="button"
                onClick={() => inspectEvent()}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0b1324] border border-[#1b2b48] text-slate-300 hover:text-white hover:border-blue-500 text-[10px] font-bold transition-colors"
                title="Inspect Latest Telemetry Event in Event Detection Console"
              >
                <Radio className="w-2.5 h-2.5 text-cyan-400" />
                <span>Inspect Event</span>
              </button>
              <div className="hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#0b1324] border border-[#1b2b48] text-slate-300">
                <span className="text-slate-500 font-bold">STATE:</span>
                <span className="text-emerald-400 font-bold">{isRestored ? 'RESTORED (84%)' : 'STABLE'}</span>
              </div>
              <div className="hidden lg:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#0b1324] border border-[#1b2b48] text-slate-300">
                <span className="text-slate-500 font-bold">OP:</span>
                <span className="text-blue-400 font-bold">{operationStatus}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Key Telemetry Metrics & Dynamic Next Action Pill */}
        <div className="flex items-center gap-3">
          {/* Control Margin Counter */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500">M(t):</span>
            <span className={`font-bold font-mono ${
              margin > 70 ? 'text-emerald-400' : margin > 40 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {margin}%
            </span>
          </div>

          {/* Intervention Window */}
          {isAttack && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="font-mono font-bold">{controlState.intervention_window_seconds}s window</span>
            </div>
          )}

          {/* Dynamic Next Action Button */}
          <button
            type="button"
            onClick={nextAction.action}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            title={nextAction.hint}
          >
            {nextAction.icon}
            <span>{nextAction.label}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperationalContextBar;
