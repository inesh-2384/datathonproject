/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEMIC CONTROL MARGIN VIEW (MODULE 07)
 * Mathematical Decomposition, Reserve Buffer Depletion & Causal Attribution
 * 
 * Strict Truth Principle (Section 12 & Section 25):
 * - Answers: "Where is control degrading? Why is control degrading? How much control remains?"
 * - Shows: CURRENT MARGIN, DELTA FROM BASELINE, PRIMARY CONTRIBUTORS, INTERVENTION WINDOW,
 *   CONTROL CONSEQUENCE, and WHAT WOULD CHANGE THIS VALUE?
 * - Interactive Contributor Inspection & Propagation Linkage
 */

import React, { useState } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { ControlMarginHero } from '../components/common/ControlMarginHero';
import { ControlMarginDriversPanel } from '../components/intelligence/ControlMarginDriversPanel';
import { ControllabilityAssessmentCard } from '../components/intelligence/ControllabilityAssessmentCard';
import { DynamicCausalExplanation } from '../components/intelligence/DynamicCausalExplanation';
import { PanelSurface } from '../components/common/PanelSurface';
import { 
  Gauge, 
  ArrowRight, 
  Share2,
  Sliders,
  Clock
} from 'lucide-react';

interface MarginContributorItem {
  id: string;
  name: string;
  deltaPts: number;
  sourceNode: string;
  propagationLink: string;
  windowImpact: string;
  controlConsequence: string;
  whatChangesValue: string;
}

export const ControlMarginView: React.FC = () => {
  const controlState = useSystemStore(state => state.controlState);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const simulationClock = useSystemStore(state => state.simulationClock);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const [selectedContributorId, setSelectedContributorId] = useState<string>('CONTRIB-ORACLE');

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const isUnverifiedFailure = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED';
  const isRestored = !isAttack && controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90;
  const margin = controlState.control_margin_percent;
  const deltaFromBaseline = margin - 91;

  const contributors: MarginContributorItem[] = [
    {
      id: 'CONTRIB-ORACLE',
      name: 'Oracle Dependency Concentration (DATA-X)',
      deltaPts: isUnverifiedFailure ? -8 : isAttack ? -22 : isRestored ? -3 : -3,
      sourceNode: 'DATA-X (HHI = 0.73)',
      propagationLink: 'Hop 0 → Hop 1: DATA-X → SHARED_ORACLE_BUS → MODEL-A / MODEL-C',
      windowImpact: isAttack ? 'Compresses intervention window from 3600s to 240s' : 'Nominal window preserved',
      controlConsequence: isAttack
        ? 'Single-point oracle failure removes 22 pts of control headroom immediately upon feed drift.'
        : 'Isolated via circuit-breaker or operating within nominal variance.',
      whatChangesValue: 'Executing Candidate #1 (Targeted DATA-X Dependency Isolation + Fallback Re-Weighting) recovers +14 pts directly.'
    },
    {
      id: 'DRV-VEL',
      name: 'Propagation Velocity (v_p)',
      deltaPts: isAttack ? -16 : -4,
      sourceNode: 'Cascade Transmission (0.58 n/s)',
      propagationLink: 'Multi-hop interbank rail saturation across BANK-A/B and CCP clearing',
      windowImpact: 'Accelerates window decay by -45s per hop',
      controlConsequence: 'Rapid cascade transmission across interbank rails compounds systemic liquidity depletion.',
      whatChangesValue: 'Targeted Dependency Isolation (DATA-X) severs primary ingress (+16 pts recovered).'
    },
    {
      id: 'CONTRIB-CASCADE',
      name: 'Multi-Hop Cascade & Liquidity Drain',
      deltaPts: isUnverifiedFailure ? -16 : isAttack ? (simulationClock.tick >= 1 ? -19 : -4) : isRestored ? -2 : -2,
      sourceNode: 'BANK-A / BANK-B → INFRA-1 (RTGS)',
      propagationLink: `Hop 1 → Hop 3 (Tick #${simulationClock.tick}): Synchronized G-SIB sell flow depleting CCP buffers`,
      windowImpact: isAttack && simulationClock.tick >= 1 ? 'Accelerates window decay by -45s per propagation hop' : 'Initial hop pressure (-4 pts)',
      controlConsequence: isAttack
        ? 'Each unmitigated propagation step compounds liquidity drain across INFRA-1 and INFRA-2.'
        : 'Interbank settlement queues clearing normally.',
      whatChangesValue: 'Halting upstream oracle drift before Tick #3 prevents cascade depth from reaching 4 hops.'
    },
    {
      id: 'CONTRIB-HERD',
      name: 'Collective AI Decision Synchrony (EDD)',
      deltaPts: isUnverifiedFailure ? -10 : isAttack ? (simulationClock.tick >= 1 ? -16 : -3) : isRestored ? -2 : -2,
      sourceNode: 'MODEL-A & MODEL-C (EDD = 0.15)',
      propagationLink: 'Internal AI Bus → Automated FIX Execution Gateways across 8 G-SIBs',
      windowImpact: 'Reduces human governance reaction time due to 12ms algorithmic clustering',
      controlConsequence: 'Apparent diversity (0.88) collapses to 0.15 under shared feature tensors, eliminating counter-cyclical buyers.',
      whatChangesValue: 'Decoupling shared oracle inputs and throttling correlated model execution restores EDD ≥ 0.55.'
    },
    {
      id: 'DRV-LATENT',
      name: 'Latent Model Drift (MODEL-C)',
      deltaPts: -12,
      sourceNode: 'MODEL-C → BANK-C / INFRA-2',
      propagationLink: 'Asynchronous cached swap covariance matrix surviving primary DATA-X disconnect',
      windowImpact: isUnverifiedFailure ? 'Holds remaining intervention window at 28s until secondary backstop' : 'Secondary latent vector',
      controlConsequence: isUnverifiedFailure
        ? 'CRITICAL: Prevents M(t) from recovering above 42% after Action 1, causing Independent Verification failure.'
        : 'Latent credit valuation coupling monitored by enclave verifier.',
      whatChangesValue: 'Executing Secondary Backstop (CAND-RN-2026-0041-ESC-BACKSTOP: MODEL-C Throttle + CCP Liquidity Injection) restores M(t) to 84%.'
    }
  ];

  const activeContributor = contributors.find(c => c.id === selectedContributorId) || contributors[0];

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-[1720px] mx-auto select-none">
      {/* 1. Header Banner */}
      <PanelSurface
        title="Systemic Control Margin M(t)"
        subtitle="Reserve Buffer Depletion, Controllability State & Monotonic Accounting"
        icon={<Gauge className="w-5 h-5 text-rose-400" />}
        level={1}
        moduleNumber="07"
        headerAction={
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              SIMULATED_VARIABLE [CALIBRATED]
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
              CM-v0.2 FORMULA
            </span>
          </div>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-300 font-sans">
            Control Margin models remaining actionable intervention capacity before contagion enters an irreversible regime.
          </div>
          <div className="flex items-center gap-3">
            <span>Current M(t): <strong className={margin >= 70 ? 'text-emerald-400' : margin >= 45 ? 'text-amber-400' : 'text-red-400'}>{margin}%</strong></span>
            <span>Delta from 91% Baseline: <strong className={deltaFromBaseline < 0 ? 'text-red-400' : 'text-emerald-400'}>{deltaFromBaseline >= 0 ? `+${deltaFromBaseline}` : deltaFromBaseline} pts</strong></span>
            <span className="flex items-center gap-1 text-amber-300"><Clock className="w-3.5 h-3.5" /> Window: <strong>{controlState.intervention_window_seconds}s</strong></span>
          </div>
        </div>
      </PanelSurface>

      {/* 2. Hero Control Margin Visualizer */}
      <ControlMarginHero
        controlState={controlState}
        intelligenceAssessment={controlState.intelligence}
      />

      {/* 3. Interactive Contributor Inspector & "What Would Change This Value?" (Section 12 & 25) */}
      <div className="fis-panel p-4 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <span className="text-white font-bold uppercase">
              Interactive Contributor & Sensitivity Inspector ("What Would Change This Value?")
            </span>
            <span className="text-slate-400 text-[10px] ml-2">
              Click any contributor to inspect propagation linkage & intervention leverage
            </span>
          </div>
          <span className="text-cyan-400 font-bold text-[11px]">
            Trajectory: 91% Baseline → {isAttack ? `${margin}% Active` : isUnverifiedFailure ? '42% Residual' : isRestored ? '84% Restored' : '91% Nominal'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 5 cols: Selectable Contributor List */}
          <div className="lg:col-span-5 space-y-1.5">
            {contributors.map(item => {
              const isSelected = item.id === selectedContributorId;
              return (
                <button
                  key={item.id}
                  data-testid={`margin-driver-${item.id}`}
                  type="button"
                  onClick={() => setSelectedContributorId(item.id)}
                  className={`w-full p-2.5 rounded border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-950/50 border-blue-400 text-white ring-1 ring-blue-500/40'
                      : 'bg-[#060a14] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.sourceNode}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                    item.deltaPts <= -15 ? 'bg-red-950 text-red-400 border border-red-800' : item.deltaPts < -3 ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {item.deltaPts} pts
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right 7 cols: Selected Contributor Causal & Counterfactual Detail */}
          <div className="lg:col-span-7 p-3.5 rounded bg-[#060a14] border border-slate-800 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-cyan-300 text-sm">{activeContributor.name}</span>
                <span className="text-red-400 font-bold">Contribution: {activeContributor.deltaPts} pts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase block">Propagation Linkage</span>
                  <span className="text-slate-200 font-sans">{activeContributor.propagationLink}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase block">Intervention Window Linkage</span>
                  <span className="text-amber-300 font-sans">{activeContributor.windowImpact}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/70 border border-slate-800 text-[11px]">
                <span className="text-[9px] text-slate-500 uppercase block">Systemic Control Consequence</span>
                <span className="text-slate-200 font-sans">{activeContributor.controlConsequence}</span>
              </div>

              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-700/50 text-[11px]">
                <span className="text-[9px] text-emerald-400 font-bold block">What Would Change This Value? (Counterfactual Sensitivity)</span>
                <span className="text-emerald-200 font-sans">{activeContributor.whatChangesValue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentRoute('propagation')}
                className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1"
              >
                <Share2 className="w-3 h-3 text-cyan-400" /> Inspect Propagation Path (06)
              </button>
              <button
                type="button"
                onClick={() => setCurrentRoute(isUnverifiedFailure ? 'reassessment' : 'control-foundry')}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" /> {isUnverifiedFailure ? 'Evaluate 2nd Backstop (11)' : 'Evaluate Intervention in Foundry (08)'} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep Mathematical Decomposition & Controllability State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5">
          <ControllabilityAssessmentCard />
        </div>
        <div className="lg:col-span-7">
          <ControlMarginDriversPanel />
        </div>
      </div>

      {/* 5. State-Derived Causal Explanation Chain */}
      <div className="grid grid-cols-1 gap-3.5">
        <DynamicCausalExplanation />
      </div>

      {/* 6. Next Step Action Navigation */}
      <div className="fis-panel p-3.5 bg-[#080e1a] border border-[#16233b] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          Control margin decomposition complete. Proceed to Control Foundry to evaluate governed counterfactual interventions:
        </span>
        <button
          type="button"
          onClick={() => setCurrentRoute('control-foundry')}
          className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
        >
          <span>Open Control Foundry (08)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ControlMarginView;
