/**
 * FINANCIAL IMMUNE SYSTEM - DETERMINISTIC SIMULATION ENGINE
 * Phase 2 Authoritative Event-Driven Simulation Engine
 * 
 * Central Architectural Invariant:
 * ONE EVENT -> ONE AUTHORITATIVE STATE -> PROJECTIONS
 * 
 * Features:
 * 1. Seedable 32-bit PRNG (Mulberry32) for strict reproducibility.
 * 2. Real-time dynamic graph metrics & Control Margin derivation M(t).
 * 3. 3 Authoritative multi-stage scenarios (A, B, C).
 * 4. Authoritative event log with causal lineage tracking.
 * 5. Full deterministic replay buffer & timeline scrubbing.
 */

import { Mulberry32 } from './prng';
import { 
  BASELINE_INSTITUTIONS, 
  BASELINE_DEPENDENCIES, 
  BASELINE_AI_MODELS, 
  BASELINE_ASSETS, 
  BASELINE_DATA_PROVIDERS, 
  BASELINE_INFRASTRUCTURE, 
  NORMAL_CONTROL_STATE, 
  BASELINE_EVIDENCE_CHAIN 
} from './baseline';
import { 
  Institution, 
  Dependency, 
  AIModel, 
  Asset, 
  DataProvider, 
  InfrastructureNode, 
  Incident, 
  SystemControlState, 
  EvidenceRecord, 
  SystemicEvent, 
  DecisionEvent, 
  Intervention 
} from '../../../shared/types/domain';
import { SimulationClock, SimulationConfig, SimulationSnapshot } from '../../../shared/types/simulation';
import { AuthoritativeEvent, ScenarioId } from '../../../shared/types/events';
import { computeSystemicGraphMetrics, traceEntityCausality, CausalTraceResult } from './propagation';
import { executeScenarioStage, SCENARIO_DESCRIPTORS } from './scenarios';
import { globalReplayEngine } from './replay';
import { generateSystemicControllabilityAssessment } from '../intelligence/controllabilityModel';
import { globalFoundryManager } from '../foundry/foundryManager';
import { globalAssuranceManager } from '../assurance/assuranceManager';

export class SimulationEngine {
  private prng: Mulberry32;
  public config: SimulationConfig;
  public clock: SimulationClock;

  // Authoritative dynamic topology
  public institutions: Institution[] = [];
  public dependencies: Dependency[] = [];
  public aiModels: AIModel[] = [];
  public assets: Asset[] = [];
  public dataProviders: DataProvider[] = [];
  public infrastructureNodes: InfrastructureNode[] = [];
  public incidents: Incident[] = [];
  public controlState: SystemControlState = { ...NORMAL_CONTROL_STATE };
  public systemicEvents: SystemicEvent[] = [];
  public decisionEvents: DecisionEvent[] = [];
  public authoritativeEvents: AuthoritativeEvent[] = [];
  public evidenceRecords: EvidenceRecord[] = [];
  public interventions: Intervention[] = [];

  // Scenario & progression state
  public activeScenarioId: ScenarioId = 'SCENARIO_A';
  public scenarioStageIndex: number = 0;
  public scenarioState: 'NORMAL' | 'ATTACK_TRIGGERED' = 'NORMAL';

  private listeners: Array<(event: string, payload: any) => void> = [];
  private tickIntervalHandle: NodeJS.Timeout | null = null;

  constructor(initialSeed: number = 42091) {
    this.prng = new Mulberry32(initialSeed);
    this.config = {
      seed: initialSeed,
      scenario_id: 'SCENARIO_A',
      scenario_name: 'Common Data Dependency Failure',
      description: 'Controlled simulation of information provider compromise across Tier-1 banking rails',
      auto_tick: false,
      tick_interval_ms: 2000
    };
    this.clock = {
      tick: 0,
      speed_multiplier: 1,
      is_running: false,
      virtual_timestamp: '2026-10-08T14:20:12Z',
      step_duration_ms: 2000
    };

    this.reset(initialSeed);
  }

  /**
   * Resets simulation deterministically to the Normal Baseline State (Panel 2).
   */
  public reset(seed?: number): void {
    const activeSeed = seed !== undefined ? seed : this.config.seed;
    this.config.seed = activeSeed;
    this.prng.reseed(activeSeed);

    this.institutions = JSON.parse(JSON.stringify(BASELINE_INSTITUTIONS));
    this.dependencies = JSON.parse(JSON.stringify(BASELINE_DEPENDENCIES));
    this.aiModels = JSON.parse(JSON.stringify(BASELINE_AI_MODELS));
    this.assets = JSON.parse(JSON.stringify(BASELINE_ASSETS));
    this.dataProviders = JSON.parse(JSON.stringify(BASELINE_DATA_PROVIDERS));
    this.infrastructureNodes = JSON.parse(JSON.stringify(BASELINE_INFRASTRUCTURE));
    this.incidents = [];
    this.controlState = JSON.parse(JSON.stringify(NORMAL_CONTROL_STATE));
    this.systemicEvents = [];
    this.decisionEvents = [];
    this.authoritativeEvents = [];
    this.evidenceRecords = JSON.parse(JSON.stringify(BASELINE_EVIDENCE_CHAIN));
    this.interventions = [];
    this.scenarioState = 'NORMAL';
    this.scenarioStageIndex = 0;
    this.activeScenarioId = 'SCENARIO_A';

    this.clock.tick = 0;
    this.clock.virtual_timestamp = '2026-10-08T14:20:12Z';

    // Derive initial baseline metrics
    const initialMetrics = computeSystemicGraphMetrics(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels
    );
    this.controlState.control_margin_percent = initialMetrics.control_margin_percent;
    this.controlState.overall_status = initialMetrics.overall_status;
    this.controlState.system_stability_index = initialMetrics.system_stability_index;
    this.controlState.chokepoint_saturation = initialMetrics.chokepoint_saturation;
    this.controlState.key_metrics = initialMetrics.key_metrics;

    // Generate baseline systemic intelligence assessment
    const baselineAssessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      0,
      undefined,
      this.interventions
    );
    this.controlState.intelligence = baselineAssessment;
    this.controlState.controllability_state = baselineAssessment.controllability_state;
    this.controlState.intervention_window_seconds = baselineAssessment.estimated_intervention_window_sec;
    this.controlState.effective_decision_diversity = baselineAssessment.collective_decision_signal.effective_decision_diversity;
    globalFoundryManager.reset();
    this.controlState.foundry = globalFoundryManager.getWorkspaceState(this);
    globalAssuranceManager.reset();
    this.controlState.assurance = globalAssuranceManager.evaluateAssuranceState(this);

    // Reset replay buffer and commit baseline frame T0
    globalReplayEngine.clear();
    globalReplayEngine.recordFrame(this, 'Normal Baseline State (Equilibrium)');

    this.notify('RESET', { tick: 0, seed: activeSeed, state: this.getSnapshot() });
  }

  /**
   * Switches and triggers an authoritative scenario (A, B, or C).
   */
  public startScenario(scenarioId: ScenarioId): void {
    this.reset(this.config.seed);
    this.activeScenarioId = scenarioId;
    this.config.scenario_id = scenarioId;
    this.config.scenario_name = SCENARIO_DESCRIPTORS[scenarioId].name;
    this.scenarioState = 'ATTACK_TRIGGERED';
    this.scenarioStageIndex = 0;

    // Execute Stage 0
    const events = executeScenarioStage(scenarioId, 0, this);
    for (const evt of events) {
      this.authoritativeEvents.unshift(evt);
      this.decisionEvents.unshift(this.mapToDecisionEvent(evt));
    }

    // Dynamically recompute graph state after stage 0
    const metrics = computeSystemicGraphMetrics(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels
    );
    const assessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      0,
      scenarioId,
      this.interventions
    );

    this.controlState = {
      ...this.controlState,
      control_margin_percent: assessment.control_margin_percent,
      overall_status: assessment.controllability_state === 'CONTROL_RESTORED' ? 'RESTORED' :
        (assessment.controllability_state === 'CONTROL_COLLAPSING' ? 'COLLAPSING' :
        (assessment.controllability_state === 'CONTROL_CRITICAL' ? 'CRITICAL' :
        (assessment.controllability_state === 'CONTROL_UNVERIFIED' ? 'RESIDUAL_RISK' :
        (assessment.controllability_state === 'CONTROL_RECOVERING' ? 'RECOVERING' :
        (assessment.controllability_state === 'CONTROL_DEGRADING' ? 'DEGRADING' : 'STABLE'))))),
      system_stability_index: metrics.system_stability_index,
      chokepoint_saturation: metrics.chokepoint_saturation,
      key_metrics: metrics.key_metrics,
      active_threat_count: metrics.affected_nodes_count,
      last_evaluated_timestamp: this.clock.virtual_timestamp,
      controllability_state: assessment.controllability_state,
      intelligence: assessment,
      intervention_window_seconds: assessment.estimated_intervention_window_sec,
      effective_decision_diversity: assessment.collective_decision_signal.effective_decision_diversity,
      foundry: globalFoundryManager.getWorkspaceState(this),
      assurance: globalAssuranceManager.evaluateAssuranceState(this)
    };

    if (this.incidents[0]) {
      globalAssuranceManager.bindIncidentTrace(this.incidents[0].incident_id, events[0]?.event_id);
      this.controlState.assurance = globalAssuranceManager.evaluateAssuranceState(this);
    }

    // Note: Frame 0 is preserved as the pristine Baseline Equilibrium recorded during reset()

    this.notify('SCENARIO_STARTED', {
      scenario_id: scenarioId,
      incident: this.incidents[0],
      control_state: this.controlState,
      events: this.authoritativeEvents
    });
  }

  /**
   * Backward-compatible trigger for reference Scenario A.
   */
  public injectAttack(): void {
    this.startScenario('SCENARIO_A');
  }

  /**
   * Advances the simulation clock by 1 deterministic tick and progresses multi-stage scenario.
   */
  public step(): void {
    this.clock.tick += 1;

    // Advance virtual timestamp by 1 second per tick
    const currentTimeMs = new Date(this.clock.virtual_timestamp).getTime();
    this.clock.virtual_timestamp = new Date(currentTimeMs + 1000).toISOString();

    if (this.scenarioState === 'ATTACK_TRIGGERED') {
      // Countdown intervention window if active
      if (this.controlState.intervention_window_seconds > 0) {
        this.controlState.intervention_window_seconds = Math.max(0, this.controlState.intervention_window_seconds - 1);
      }

      // Progress scenario stages on each tick until completed
      const descriptor = SCENARIO_DESCRIPTORS[this.activeScenarioId];
      if (this.scenarioStageIndex + 1 < descriptor.stages_count) {
        this.scenarioStageIndex += 1;
        const newEvents = executeScenarioStage(this.activeScenarioId, this.scenarioStageIndex, this);
        for (const evt of newEvents) {
          this.authoritativeEvents.unshift(evt);
          this.decisionEvents.unshift(this.mapToDecisionEvent(evt));
        }
      }
    }

    // Dynamically recompute graph state and Systemic Intelligence
    const metrics = computeSystemicGraphMetrics(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels
    );

    const assessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      this.clock.tick,
      this.scenarioState === 'NORMAL' ? undefined : this.activeScenarioId,
      this.interventions
    );

    this.controlState = {
      ...this.controlState,
      control_margin_percent: assessment.control_margin_percent,
      overall_status: assessment.controllability_state === 'CONTROL_RESTORED' ? 'RESTORED' :
        (assessment.controllability_state === 'CONTROL_COLLAPSING' ? 'COLLAPSING' :
        (assessment.controllability_state === 'CONTROL_CRITICAL' ? 'CRITICAL' :
        (assessment.controllability_state === 'CONTROL_UNVERIFIED' ? 'RESIDUAL_RISK' :
        (assessment.controllability_state === 'CONTROL_RECOVERING' ? 'RECOVERING' :
        (assessment.controllability_state === 'CONTROL_DEGRADING' ? 'DEGRADING' : 'STABLE'))))),
      system_stability_index: metrics.system_stability_index,
      chokepoint_saturation: metrics.chokepoint_saturation,
      key_metrics: metrics.key_metrics,
      active_threat_count: metrics.affected_nodes_count,
      last_evaluated_timestamp: this.clock.virtual_timestamp,
      controllability_state: assessment.controllability_state,
      intelligence: assessment,
      intervention_window_seconds: assessment.estimated_intervention_window_sec,
      effective_decision_diversity: assessment.collective_decision_signal.effective_decision_diversity,
      foundry: globalFoundryManager.getWorkspaceState(this),
      assurance: globalAssuranceManager.evaluateAssuranceState(this)
    };

    // Commit frame to replay engine
    const frame = globalReplayEngine.recordFrame(this);

    this.notify('TICK', {
      tick: this.clock.tick,
      frame,
      control_state: this.controlState,
      authoritative_events: this.authoritativeEvents.slice(0, 5)
    });
  }

  /**
   * Recomputes the systemic controllability assessment on current topology,
   * reflecting any changes to active ablation configuration or parameters.
   */
  public recomputeIntelligence(): any {
    const assessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      this.clock.tick,
      this.scenarioState === 'NORMAL' ? undefined : this.activeScenarioId,
      this.interventions
    );

    this.controlState = {
      ...this.controlState,
      control_margin_percent: assessment.control_margin_percent,
      overall_status: assessment.controllability_state === 'CONTROL_RESTORED' ? 'RESTORED' :
        (assessment.controllability_state === 'CONTROL_COLLAPSING' ? 'COLLAPSING' :
        (assessment.controllability_state === 'CONTROL_CRITICAL' ? 'CRITICAL' :
        (assessment.controllability_state === 'CONTROL_UNVERIFIED' ? 'RESIDUAL_RISK' :
        (assessment.controllability_state === 'CONTROL_RECOVERING' ? 'RECOVERING' :
        (assessment.controllability_state === 'CONTROL_DEGRADING' ? 'DEGRADING' : 'STABLE'))))),
      controllability_state: assessment.controllability_state,
      intelligence: assessment,
      intervention_window_seconds: assessment.estimated_intervention_window_sec,
      effective_decision_diversity: assessment.collective_decision_signal.effective_decision_diversity
    };

    return assessment;
  }

  /**
   * Scrubs simulation to a recorded tick frame.
   */
  public scrubToTick(targetTick: number): boolean {
    const success = globalReplayEngine.restoreTick(targetTick, this);
    if (success) {
      this.notify('REPLAY_SCRUB', {
        tick: targetTick,
        clock: this.clock,
        control_state: this.controlState
      });
    }
    return success;
  }

  public pause(): void {
    this.clock.is_running = false;
    if (this.tickIntervalHandle) {
      clearInterval(this.tickIntervalHandle);
      this.tickIntervalHandle = null;
    }
    this.notify('PAUSED', { tick: this.clock.tick });
  }

  public resume(): void {
    if (this.clock.is_running) return;
    this.clock.is_running = true;

    const interval = Math.max(200, Math.floor(1000 / (this.clock.speed_multiplier || 1)));
    this.tickIntervalHandle = setInterval(() => {
      this.step();
    }, interval);

    this.notify('RESUMED', { tick: this.clock.tick });
  }

  public setSpeed(multiplier: number): void {
    this.clock.speed_multiplier = multiplier;
    if (this.clock.is_running) {
      this.pause();
      this.resume();
    }
  }

  /**
   * Propose and execute intervention with dynamic verification.
   */
  public applyIntervention(intervention: Intervention): void {
    this.interventions.push(intervention);

    if (intervention.status === 'EXECUTED' || intervention.status === 'VERIFIED') {
      // Quarantine target entity channels
      for (const entityId of intervention.target_entity_ids) {
        const prov = this.dataProviders.find(p => p.provider_id === entityId);
        if (prov) prov.status = 'RECOVERING';

        const inst = this.institutions.find(i => i.institution_id === entityId);
        if (inst) inst.status = 'RECOVERING';

        const model = this.aiModels.find(m => m.model_id === entityId);
        if (model) model.status = 'RECOVERING';

        for (const dep of this.dependencies) {
          if (dep.source_id === entityId || dep.target_id === entityId) {
            dep.status = 'RECOVERING';
          }
        }
      }

      // Emit intervention event
      const intEvent: AuthoritativeEvent = {
        event_id: `EVT-INT-${Date.now().toString(36).toUpperCase()}`,
        tick: this.clock.tick,
        simulation_timestamp: this.clock.virtual_timestamp,
        event_type: 'INTERVENTION_EXECUTED',
        severity: 'INFO',
        source_entity_id: intervention.proposer_role,
        target_entity_id: intervention.target_entity_ids[0],
        causal_chain_id: `CHAIN-${this.activeScenarioId}`,
        state_deltas: intervention.target_entity_ids.map(id => ({
          entity_type: 'INSTITUTION',
          entity_id: id,
          field: 'status',
          previous_value: 'DEGRADING',
          new_value: 'RECOVERING'
        })),
        causal_narrative: `Intervention [${intervention.title}] executed. Quarantined infected channels across target nodes.`,
        systemic_impact: { control_margin_delta: +38, stability_delta: +0.28 }
      };
      this.authoritativeEvents.unshift(intEvent);
      this.decisionEvents.unshift(this.mapToDecisionEvent(intEvent));

      // Recalculate graph metrics
      const metrics = computeSystemicGraphMetrics(
        this.institutions,
        this.dependencies,
        this.dataProviders,
        this.infrastructureNodes,
        this.aiModels
      );
      const assessment = generateSystemicControllabilityAssessment(
        this.institutions,
        this.dependencies,
        this.dataProviders,
        this.infrastructureNodes,
        this.aiModels,
        this.incidents,
        this.evidenceRecords,
        this.clock.tick,
        this.scenarioState === 'NORMAL' ? undefined : this.activeScenarioId,
        this.interventions
      );
      this.controlState = {
        ...this.controlState,
        control_margin_percent: Math.max(76, metrics.control_margin_percent),
        overall_status: 'RECOVERING',
        system_stability_index: metrics.system_stability_index,
        last_evaluated_timestamp: this.clock.virtual_timestamp,
        controllability_state: 'CONTROL_RECOVERING',
        intelligence: assessment,
        foundry: globalFoundryManager.getWorkspaceState(this),
        assurance: globalAssuranceManager.evaluateAssuranceState(this)
      };

      globalReplayEngine.recordFrame(this, `Intervention Executed: ${intervention.title}`);
      this.notify('INTERVENTION_APPLIED', { intervention, control_state: this.controlState });
    }
  }

  /**
   * Retrieves causal explanation for an entity.
   */
  public getCausalTrace(entityId: string): CausalTraceResult {
    return traceEntityCausality(
      entityId,
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes
    );
  }

  public getSnapshot(): SimulationSnapshot {
    return {
      seed: this.config.seed,
      tick: this.clock.tick,
      timestamp: this.clock.virtual_timestamp,
      control_margin_percent: this.controlState.control_margin_percent,
      active_incident_count: this.incidents.filter(i => i.status === 'ACTIVE' || i.status === 'CONTAINING').length,
      system_stability_index: this.controlState.system_stability_index,
      event_count: this.authoritativeEvents.length,
      state_hash: globalReplayEngine.generateStateHash(
        this.config.seed,
        this.clock.tick,
        this.activeScenarioId,
        this.institutions,
        this.dependencies,
        this.controlState.control_margin_percent
      )
    };
  }

  public getClock(): SimulationClock {
    return { ...this.clock };
  }

  public getConfig(): SimulationConfig {
    return { ...this.config };
  }

  public subscribe(listener: (event: string, payload: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(event: string, payload: any): void {
    for (const listener of this.listeners) {
      try {
        listener(event, payload);
      } catch (err) {
        console.error('Listener notification error:', err);
      }
    }
  }

  private mapToDecisionEvent(evt: AuthoritativeEvent): DecisionEvent {
    let decType: any = 'DATA_INTEGRITY_ANOMALY';
    if (evt.event_type === 'INFRASTRUCTURE_FAILURE' || evt.event_type === 'INFRASTRUCTURE_CONGESTION') {
      decType = 'LIQUIDITY_PULL';
    } else if (evt.event_type === 'INSTITUTION_DEGRADATION') {
      decType = 'MARGIN_CALL';
    }

    return {
      event_id: evt.event_id,
      timestamp: evt.simulation_timestamp,
      source_entity_id: evt.source_entity_id,
      actor_role: 'FIS_SYSTEMIC_ENGINE',
      decision_type: decType,
      confidence_score: 0.98,
      anomaly_score: evt.severity === 'CRITICAL' ? 0.94 : 0.65,
      impact_projection: evt.systemic_impact.control_margin_delta,
      rationale_summary: evt.causal_narrative,
      severity: evt.severity === 'ELEVATED' ? 'HIGH' : evt.severity,
      status: evt.severity === 'CRITICAL' ? 'CRITICAL' : 'DEGRADING'
    };
  }
}

export const globalSimulationEngine = new SimulationEngine();
