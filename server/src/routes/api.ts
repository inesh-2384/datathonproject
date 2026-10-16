/**
 * FINANCIAL IMMUNE SYSTEM - REST API ROUTER
 * Section 5: State Transitions
 * Section 6: Authentication + Roles
 * Section 9: Simulation Control
 */

import { Router, Request, Response } from 'express';
import { globalSimulationEngine } from '../simulation/engine';
import { systemStateStore } from '../state/store';
import { ROLE_PERMISSIONS_REGISTRY, UserRole } from '../../../shared/types/roles';
import { Intervention } from '../../../shared/types/domain';
import { SCENARIO_DESCRIPTORS } from '../simulation/scenarios';
import { ScenarioId } from '../../../shared/types/events';
import { globalReplayEngine } from '../simulation/replay';
import { computeDependencyIntelligence } from '../intelligence/dependencyIntelligence';
import { getActiveAblationConfig, setActiveAblationTier } from '../intelligence/ablation';
import { BaselineTier } from '../../../shared/types/intelligence';
import { 
  evaluateCounterfactualSimulation, 
  evaluateAblationImpacts, 
  computeEntityControllabilityIntelligence,
  evaluateParameterSensitivity
} from '../intelligence/controllabilityModel';
import { globalFoundryManager } from '../foundry/foundryManager';
import { GovernedExecutionBus } from '../foundry/governedExecutionBus';
import { globalAssuranceManager } from '../assurance/assuranceManager';
import { EvidenceEngine } from '../assurance/evidenceEngine';
import { PrivacyBoundary } from '../assurance/privacyBoundary';
import { IBMRuntimeContext } from '../assurance/ibmRuntime';
import { SecurityThreatScenarioId } from '../../../shared/types/assurance';
import { globalOperationManager } from '../simulation/operations';
import { propagateGraphContagion } from '../simulation/propagation';

const router = Router();


// GET /api/state - Full authoritative system state snapshot
router.get('/state', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: systemStateStore.getState()
  });
});

// GET /api/entities - List domain entities
router.get('/entities', (req: Request, res: Response) => {
  const { type } = req.query;
  const state = systemStateStore.getState();

  if (type === 'INSTITUTION') return res.json({ success: true, data: state.institutions });
  if (type === 'DEPENDENCY') return res.json({ success: true, data: state.dependencies });
  if (type === 'AI_MODEL') return res.json({ success: true, data: state.aiModels });
  if (type === 'DATA_PROVIDER') return res.json({ success: true, data: state.dataProviders });
  if (type === 'INFRASTRUCTURE') return res.json({ success: true, data: state.infrastructureNodes });

  res.json({
    success: true,
    data: {
      institutions: state.institutions,
      dependencies: state.dependencies,
      aiModels: state.aiModels,
      assets: state.assets,
      dataProviders: state.dataProviders,
      infrastructure: state.infrastructureNodes
    }
  });
});

// GET /api/entities/:id - Contextual inspection of single entity
router.get('/entities/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const state = systemStateStore.getState();

  const provider = state.dataProviders.find(p => p.provider_id === id);
  if (provider) {
    const connectedDeps = state.dependencies.filter(d => d.source_id === id || d.target_id === id);
    const affectedInsts = state.institutions.filter(i => provider.institutions_served.includes(i.institution_id));
    return res.json({
      success: true,
      data: {
        entity: provider,
        type: 'DATA_PROVIDER',
        connected_dependencies: connectedDeps,
        affected_institutions: affectedInsts,
        recent_events: state.decisionEvents.filter(e => e.source_entity_id === id)
      }
    });
  }

  const institution = state.institutions.find(i => i.institution_id === id);
  if (institution) {
    const connectedDeps = state.dependencies.filter(d => d.source_id === id || d.target_id === id);
    const relatedAiModels = state.aiModels.filter(m => m.deployed_institutions.includes(id));
    const relatedEvents = state.decisionEvents.filter(e => e.source_entity_id === id);
    const trace = globalSimulationEngine.getCausalTrace(id as string);

    return res.json({
      success: true,
      data: {
        entity: institution,
        type: 'INSTITUTION',
        connected_dependencies: connectedDeps,
        ai_models: relatedAiModels,
        recent_events: relatedEvents,
        causal_trace: trace
      }
    });
  }

  const dependency = state.dependencies.find(d => d.dependency_id === id);
  if (dependency) {
    const depIntel = computeDependencyIntelligence(
      state.dependencies,
      state.institutions,
      state.dataProviders,
      state.infrastructureNodes
    ).find(di => di.dependency_id === id);

    return res.json({
      success: true,
      data: {
        entity: dependency,
        type: 'DEPENDENCY',
        source: state.institutions.find(i => i.institution_id === dependency.source_id) || state.dataProviders.find(p => p.provider_id === dependency.source_id),
        target: state.institutions.find(i => i.institution_id === dependency.target_id),
        intelligence: depIntel
      }
    });
  }

  const infra = state.infrastructureNodes.find(n => n.node_id === id);
  if (infra) {
    const connectedDeps = state.dependencies.filter(d => d.source_id === id || d.target_id === id);
    const trace = globalSimulationEngine.getCausalTrace(id as string);
    return res.json({
      success: true,
      data: {
        entity: infra,
        type: 'INFRASTRUCTURE_NODE',
        connected_dependencies: connectedDeps,
        causal_trace: trace,
        recent_events: state.authoritativeEvents.filter(e => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }

  const aiModel = state.aiModels.find(m => m.model_id === id);
  if (aiModel) {
    const deployedInsts = state.institutions.filter(i => aiModel.deployed_institutions.includes(i.institution_id));
    const trace = globalSimulationEngine.getCausalTrace(id as string);
    return res.json({
      success: true,
      data: {
        entity: aiModel,
        type: 'AI_MODEL',
        deployed_institutions: deployedInsts,
        causal_trace: trace,
        recent_events: state.authoritativeEvents.filter(e => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }

  const asset = state.assets.find(a => a.asset_id === id);
  if (asset) {
    const holderInsts = state.institutions.filter(i => asset.primary_holder_institutions.includes(i.institution_id));
    return res.json({
      success: true,
      data: {
        entity: asset,
        type: 'ASSET',
        holder_institutions: holderInsts,
        recent_events: state.authoritativeEvents.filter(e => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }

  res.status(404).json({ success: false, error: `Entity not found: ${id}` });
});

// GET /api/incidents - List incidents
router.get('/incidents', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: globalSimulationEngine.incidents
  });
});

// GET /api/evidence - List tamper-evident records
router.get('/evidence', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: globalSimulationEngine.evidenceRecords
  });
});

// GET /api/simulation/scenarios - List Phase 2 scenario descriptors
router.get('/simulation/scenarios', (req: Request, res: Response) => {
  res.json({
    success: true,
    active_scenario_id: globalSimulationEngine.activeScenarioId,
    data: Object.values(SCENARIO_DESCRIPTORS)
  });
});

// POST /api/simulation/scenario - Switch and start an authoritative scenario
router.post('/simulation/scenario', (req: Request, res: Response) => {
  const { scenario_id } = req.body;
  if (!scenario_id) {
    return res.status(400).json({ success: false, error: 'Scenario ID is required' });
  }
  const targetScenario = scenario_id as ScenarioId;

  if (!SCENARIO_DESCRIPTORS[targetScenario]) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid scenario_id: ${scenario_id}. Available scenarios: ${Object.keys(SCENARIO_DESCRIPTORS).join(', ')}` 
    });
  }

  let op;
  try {
    op = globalOperationManager.beginOperation('SCENARIO_INJECTION', {
      tick: globalSimulationEngine.clock.tick,
      incident_id: globalSimulationEngine.incidents[0]?.incident_id,
      source_entity_id: SCENARIO_DESCRIPTORS[targetScenario].primary_target,
      previous_state_summary: `Overall status: ${globalSimulationEngine.controlState.overall_status}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err: any) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: 'CONFLICT' });
    }
    return res.status(500).json({ success: false, error: err.message });
  }

  try {
    globalOperationManager.transitionProcessing(op.operation_id);
    globalSimulationEngine.startScenario(targetScenario);
    systemStateStore.persistToDisk();

    const completedOp = globalOperationManager.completeOperation(op.operation_id, {
      new_state_summary: `Overall status: ${globalSimulationEngine.controlState.overall_status}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`,
      affected_entity_ids: globalSimulationEngine.incidents[0]?.affected_node_ids || [SCENARIO_DESCRIPTORS[targetScenario].primary_target]
    });

    res.json({
      success: true,
      operation: completedOp,
      message: `Scenario ${targetScenario} started.`,
      active_scenario: SCENARIO_DESCRIPTORS[targetScenario],
      control_state: globalSimulationEngine.controlState,
      incident: globalSimulationEngine.incidents[0] || null,
      events: globalSimulationEngine.authoritativeEvents
    });
  } catch (err: any) {
    globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/simulation/operations - Recent operations history
router.get('/simulation/operations', (req: Request, res: Response) => {
  res.json({
    success: true,
    active_operation: globalOperationManager.getActiveOperation(),
    recent_operations: globalOperationManager.getRecentOperations(50)
  });
});

// GET /api/simulation/operations/active - Currently active operation
router.get('/simulation/operations/active', (req: Request, res: Response) => {
  res.json({
    success: true,
    active_operation: globalOperationManager.getActiveOperation()
  });
});

// POST /api/simulation/propagate - Dynamic graph traversal propagation from any node (Section 35)
router.post('/simulation/propagate', (req: Request, res: Response) => {
  const { source_id, depth } = req.body;
  if (!source_id) {
    return res.status(400).json({ success: false, error: 'source_id is required for graph propagation' });
  }

  let op;
  try {
    op = globalOperationManager.beginOperation('SIMULATION_STEP', {
      tick: globalSimulationEngine.clock.tick,
      source_entity_id: source_id,
      previous_state_summary: `Margin before propagation: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err: any) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: 'CONFLICT' });
    }
  }

  try {
    if (op) globalOperationManager.transitionProcessing(op.operation_id);
    const depthLimit = typeof depth === 'number' ? depth : 2;
    const propagationResult = propagateGraphContagion(globalSimulationEngine, source_id, depthLimit);
    systemStateStore.persistToDisk();

    if (op) {
      globalOperationManager.completeOperation(op.operation_id, {
        new_state_summary: `Traversed ${propagationResult.traversed_dependencies.length} dependencies, affected ${propagationResult.affected_entities.length} nodes. Margin: ${propagationResult.control_margin_after}%`,
        affected_entity_ids: propagationResult.affected_entities
      });
    }

    res.json({
      success: true,
      data: propagationResult,
      control_state: globalSimulationEngine.controlState
    });
  } catch (err: any) {
    if (op) globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/simulation/replay/timeline - Retrieve full replay frames
router.get('/simulation/replay/timeline', (req: Request, res: Response) => {
  res.json({
    success: true,
    timeline: globalReplayEngine.getTimeline(),
    current_tick: globalSimulationEngine.clock.tick
  });
});

// POST /api/simulation/replay/scrub - Scrub simulation to specific tick
router.post('/simulation/replay/scrub', (req: Request, res: Response) => {
  const { tick } = req.body;
  if (tick === undefined || typeof tick !== 'number') {
    return res.status(400).json({ success: false, error: 'Tick number is required' });
  }

  const success = globalSimulationEngine.scrubToTick(tick);
  if (!success) {
    return res.status(404).json({ success: false, error: `Replay frame for tick ${tick} not found` });
  }

  systemStateStore.persistToDisk();
  res.json({
    success: true,
    tick,
    clock: globalSimulationEngine.getClock(),
    control_state: globalSimulationEngine.controlState,
    state: systemStateStore.getState()
  });
});

// GET /api/simulation/causal-trace/:id - Causal lineage explanation
router.get('/simulation/causal-trace/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const trace = globalSimulationEngine.getCausalTrace(id as string);
  res.json({
    success: true,
    data: trace
  });
});

// GET /api/simulation/events - Authoritative events stream
router.get('/simulation/events', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: globalSimulationEngine.authoritativeEvents,
    events: globalSimulationEngine.authoritativeEvents
  });
});

// GET /api/events - Canonical event list endpoint
router.get('/events', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: globalSimulationEngine.authoritativeEvents,
    events: globalSimulationEngine.authoritativeEvents
  });
});

// POST /api/simulation/attack - Inject reference attack (Backward compatible)
router.post('/simulation/attack', (req: Request, res: Response) => {
  globalSimulationEngine.injectAttack();
  systemStateStore.persistToDisk();

  res.json({
    success: true,
    message: 'Common Data Dependency Attack scenario triggered (RN-2026-0041).',
    control_state: globalSimulationEngine.controlState,
    incident: globalSimulationEngine.incidents[0]
  });
});

// POST /api/simulation/reset - Deterministic baseline reset (Panel 2)
router.post('/simulation/reset', (req: Request, res: Response) => {
  const seed = req.body?.seed !== undefined ? Number(req.body.seed) : 42091;
  const op = globalOperationManager.beginOperation('SIMULATION_RESET', {
    tick: globalSimulationEngine.clock.tick,
    previous_state_summary: `Pre-reset tick ${globalSimulationEngine.clock.tick}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
  });

  try {
    globalOperationManager.transitionProcessing(op.operation_id);
    globalSimulationEngine.reset(seed);
    systemStateStore.persistToDisk();

    const completedOp = globalOperationManager.completeOperation(op.operation_id, {
      new_state_summary: `Reset to baseline Tick 0, Seed ${seed}, Margin: 91% STABLE`
    });

    res.json({
      success: true,
      operation: completedOp,
      message: `System simulation reset to deterministic baseline (Normal State, Seed ${seed}).`,
      snapshot: globalSimulationEngine.getSnapshot(),
      control_state: globalSimulationEngine.controlState
    });
  } catch (err: any) {
    globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/simulation/pause - Pause simulation
router.post('/simulation/pause', (req: Request, res: Response) => {
  globalSimulationEngine.pause();
  res.json({ success: true, is_running: false, clock: globalSimulationEngine.getClock() });
});

// POST /api/simulation/resume - Resume simulation
router.post('/simulation/resume', (req: Request, res: Response) => {
  globalSimulationEngine.resume();
  res.json({ success: true, is_running: true, clock: globalSimulationEngine.getClock() });
});

// GET /api/simulation/clock - Current simulation clock telemetry
router.get('/simulation/clock', (req: Request, res: Response) => {
  res.json({ success: true, ...globalSimulationEngine.getClock() });
});

// POST /api/simulation/step - Advance by 1 tick
router.post('/simulation/step', (req: Request, res: Response) => {
  let op;
  try {
    op = globalOperationManager.beginOperation('SIMULATION_STEP', {
      tick: globalSimulationEngine.clock.tick,
      incident_id: globalSimulationEngine.incidents[0]?.incident_id,
      previous_state_summary: `Tick ${globalSimulationEngine.clock.tick}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err: any) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: 'CONFLICT' });
    }
  }

  try {
    if (op) globalOperationManager.transitionProcessing(op.operation_id);
    globalSimulationEngine.step();
    systemStateStore.persistToDisk();

    let completedOp = null;
    if (op) {
      completedOp = globalOperationManager.completeOperation(op.operation_id, {
        new_state_summary: `Advanced to Tick ${globalSimulationEngine.clock.tick}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`,
        status: globalSimulationEngine.controlState.overall_status === 'RESIDUAL_RISK' ? 'REASSESSMENT_REQUIRED' : 'COMPLETED'
      });
    }

    res.json({
      success: true,
      operation: completedOp,
      clock: globalSimulationEngine.getClock(),
      control_state: globalSimulationEngine.controlState,
      latest_event: globalSimulationEngine.authoritativeEvents[0] || null
    });
  } catch (err: any) {
    if (op) globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// POST /api/interventions - Propose intervention (Role checked)
router.post('/interventions', (req: Request, res: Response) => {
  const { role, intervention } = req.body;
  const userRole = (role as UserRole) || 'OBSERVER';
  const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];

  if (!permissions.can_propose_interventions) {
    return res.status(403).json({
      success: false,
      error: `Role '${userRole}' is not authorized to propose systemic interventions.`
    });
  }

  const newIntervention: Intervention = {
    intervention_id: `INT_${Date.now().toString(36).toUpperCase()}`,
    incident_id: intervention.incident_id || 'RN-2026-0041',
    title: intervention.title || 'Dependency Isolation',
    type: intervention.type || 'DEPENDENCY_ISOLATION',
    target_entity_ids: intervention.target_entity_ids || ['DATA-X', 'BANK-A', 'BANK-B', 'BANK-C'],
    parameters: intervention.parameters || { max_disruption_budget: 0.14 },
    status: permissions.can_authorize_interventions ? 'AUTHORIZED' : 'PENDING_AUTHORIZATION',
    proposer_role: userRole,
    requested_at: new Date().toISOString(),
    expected_control_margin_recovery: intervention.expected_control_margin_recovery || 44.0
  };

  globalSimulationEngine.applyIntervention(newIntervention);
  systemStateStore.persistToDisk();

  res.json({
    success: true,
    data: newIntervention,
    control_state: globalSimulationEngine.controlState
  });
});

// POST /api/interventions/:id/execute - Execute intervention (Role checked)
router.post('/interventions/:id/execute', (req: Request, res: Response) => {
  const { role } = req.body;
  const { id } = req.params;
  const userRole = (role as UserRole) || 'OBSERVER';
  const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];

  if (!permissions.can_execute_interventions) {
    return res.status(403).json({
      success: false,
      error: `Role '${userRole}' is not authorized to execute systemic interventions.`
    });
  }

  const existing = globalSimulationEngine.interventions.find(i => i.intervention_id === id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Intervention not found' });
  }

  existing.status = 'EXECUTED';
  existing.executed_at = new Date().toISOString();
  globalSimulationEngine.applyIntervention(existing);
  systemStateStore.persistToDisk();

  res.json({
    success: true,
    data: existing,
    control_state: globalSimulationEngine.controlState
  });
});

// POST /api/auth/login - Role-based session issuance
router.post('/auth/login', (req: Request, res: Response) => {
  const { role, username } = req.body;
  const selectedRole = (role as UserRole) || 'SYSTEM_OPERATOR';

  const session = {
    user_id: `USR_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    name: username || `System Operator | FIS-CTRL`,
    role: selectedRole,
    department: 'Systemic Control & Resilience Enclave',
    enclave_session_token: `enc_tok_${Buffer.from(selectedRole + Date.now()).toString('base64').slice(0, 32)}`,
    authenticated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
  };

  res.json({
    success: true,
    session,
    permissions: ROLE_PERMISSIONS_REGISTRY[selectedRole]
  });
});

// GET /api/auth/roles - List defined operational roles & permission matrix
router.get('/auth/roles', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: Object.keys(ROLE_PERMISSIONS_REGISTRY),
    permissions: ROLE_PERMISSIONS_REGISTRY
  });
});

// GET /api/intelligence/assessment - Full authoritative Phase 3 intelligence assessment
router.get('/intelligence/assessment', (req: Request, res: Response) => {
  const intelligence = globalSimulationEngine.controlState.intelligence;
  res.json({
    success: true,
    assessment: intelligence
  });
});

// GET /api/intelligence/dependencies - Structural dependency intelligence & HHI
router.get('/intelligence/dependencies', (req: Request, res: Response) => {
  const records = computeDependencyIntelligence(
    globalSimulationEngine.dependencies,
    globalSimulationEngine.institutions,
    globalSimulationEngine.dataProviders,
    globalSimulationEngine.infrastructureNodes
  );
  res.json({
    success: true,
    count: records.length,
    dependencies: records
  });
});

// GET /api/intelligence/decision-diversity - Effective decision diversity & synchrony
router.get('/intelligence/decision-diversity', (req: Request, res: Response) => {
  const signal = globalSimulationEngine.controlState.intelligence?.collective_decision_signal;
  res.json({
    success: true,
    signal
  });
});

// GET /api/intelligence/ablation - Current ablation / baseline config
router.get('/intelligence/ablation', (req: Request, res: Response) => {
  res.json({
    success: true,
    config: getActiveAblationConfig()
  });
});

// POST /api/intelligence/ablation - Set active ablation baseline tier (B0 - B5)
router.post('/intelligence/ablation', (req: Request, res: Response) => {
  const { tier } = req.body;
  if (!tier) {
    return res.status(400).json({ success: false, error: 'tier is required (B0 - B5)' });
  }
  const config = setActiveAblationTier(tier as BaselineTier);
  const updatedAssessment = globalSimulationEngine.recomputeIntelligence();
  res.json({
    success: true,
    config,
    assessment: updatedAssessment
  });
});

// POST /api/intelligence/counterfactual - Strictly non-mutating counterfactual simulation
router.post('/intelligence/counterfactual', (req: Request, res: Response) => {
  const { hypothesis, target_entity_id } = req.body;
  if (!target_entity_id) {
    return res.status(400).json({ success: false, error: 'target_entity_id is required' });
  }

  const result = evaluateCounterfactualSimulation(
    globalSimulationEngine,
    hypothesis || `Hypothetical isolation of ${target_entity_id}`,
    target_entity_id
  );

  res.json({
    success: true,
    result
  });
});

// POST /api/intelligence/ablation/evaluate - Feature ablation impact evaluation
router.post('/intelligence/ablation/evaluate', (req: Request, res: Response) => {
  const assessment = globalSimulationEngine.controlState.intelligence;
  if (!assessment) {
    return res.status(500).json({ success: false, error: 'Intelligence assessment not initialized' });
  }

  const result = evaluateAblationImpacts(assessment);
  res.json({
    success: true,
    result
  });
});

// GET /api/intelligence/entity/:id - Entity controllability contribution and intelligence
router.get('/intelligence/entity/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = computeEntityControllabilityIntelligence(
    id as string,
    globalSimulationEngine.institutions,
    globalSimulationEngine.dependencies,
    globalSimulationEngine.dataProviders,
    globalSimulationEngine.infrastructureNodes,
    globalSimulationEngine.aiModels
  );

  if (!result) {
    return res.status(404).json({ success: false, error: `Entity not found: ${id}` });
  }

  res.json({
    success: true,
    data: result
  });
});

// POST /api/intelligence/sensitivity - Controlled parametric sensitivity sweeps
router.post('/intelligence/sensitivity', (req: Request, res: Response) => {
  const result = evaluateParameterSensitivity(globalSimulationEngine);
  res.json({
    success: true,
    ...result
  });
});

// ============================================================================
// PHASE 4: CONTROL FOUNDRY REST ENDPOINTS
// ============================================================================

// GET /api/foundry/state - Current live Control Foundry workspace state
router.get('/foundry/state', (req: Request, res: Response) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace
  });
});

// POST /api/foundry/evaluate - Re-evaluate counterfactuals against current graph state
router.post('/foundry/evaluate', (req: Request, res: Response) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace
  });
});

// POST /api/foundry/request-auth - Submit an intervention authorization request
router.post('/foundry/request-auth', (req: Request, res: Response) => {
  const { candidate_id, role, user_id } = req.body;
  const userRole = (role as UserRole) || 'ANALYST';
  const userId = user_id || `USR-${userRole.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}`;

  if (!candidate_id) {
    return res.status(400).json({ success: false, error: 'candidate_id is required' });
  }

  try {
    const request = globalFoundryManager.requestAuthorization(
      candidate_id,
      userRole,
      userId,
      globalSimulationEngine
    );
    systemStateStore.persistToDisk();
    res.json({
      success: true,
      request,
      workspace: globalFoundryManager.getWorkspaceState(globalSimulationEngine)
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/foundry/authorize - Request role-governed authorization (enforces RBAC & separation of duties)
router.post('/foundry/authorize', (req: Request, res: Response) => {
  const { candidate_id, role, user_id, justification } = req.body;
  const userRole = (role as UserRole) || 'INCIDENT_COMMANDER';
  const userId = user_id || `USR-${userRole.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}`;

  if (!candidate_id) {
    return res.status(400).json({ success: false, error: 'candidate_id is required' });
  }

  try {
    const result = globalFoundryManager.authorize(
      candidate_id,
      userRole,
      userId,
      globalSimulationEngine,
      justification
    );

    if (!result.success) {
      return res.status(403).json(result);
    }

    systemStateStore.persistToDisk();
    res.json({
      ...result,
      workspace: globalFoundryManager.getWorkspaceState(globalSimulationEngine)
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/foundry/execute - Governed execution & independent verification closed loop
router.post('/foundry/execute', (req: Request, res: Response) => {
  const { 
    candidate_id, 
    role, 
    user_id, 
    idempotency_key, 
    force_failure, 
    force_stale_evidence, 
    force_conflicting_telemetry, 
    force_downstream_contagion,
    force_partial_recovery 
  } = req.body;

  const executorRole = (role as UserRole) || 'SYSTEM_OPERATOR';
  const executorUserId = user_id || `USR-OP-${Date.now().toString(36).toUpperCase()}`;

  if (!candidate_id) {
    return res.status(400).json({ success: false, error: 'candidate_id is required' });
  }

  try {
    const result = globalFoundryManager.execute(
      candidate_id,
      executorRole,
      executorUserId,
      globalSimulationEngine,
      {
        idempotencyKey: idempotency_key,
        forceTechnicalFailure: !!force_failure,
        forceStaleEvidence: !!force_stale_evidence,
        forceConflictingTelemetry: !!force_conflicting_telemetry,
        forceDownstreamContagion: !!force_downstream_contagion,
        forcePartialRecovery: !!force_partial_recovery
      }
    );

    systemStateStore.persistToDisk();
    res.json({
      success: true,
      ...result,
      control_state: globalSimulationEngine.controlState,
      workspace: globalFoundryManager.getWorkspaceState(globalSimulationEngine)
    });
  } catch (err: any) {
    console.error('[FIS-SRV] /foundry/execute error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/foundry/rollback - Governed operational rollback of reversible interventions
router.post('/foundry/rollback', (req: Request, res: Response) => {
  const { candidate_id, authorizer_role, executor_role, justification } = req.body;
  const authRole = (authorizer_role as UserRole) || 'INCIDENT_COMMANDER';
  const execRole = (executor_role as UserRole) || 'SYSTEM_OPERATOR';

  if (!candidate_id) {
    return res.status(400).json({ success: false, error: 'candidate_id is required' });
  }

  try {
    const result = globalFoundryManager.rollback(
      candidate_id,
      authRole,
      execRole,
      globalSimulationEngine,
      justification
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    systemStateStore.persistToDisk();
    res.json({
      ...result,
      control_state: globalSimulationEngine.controlState,
      workspace: globalFoundryManager.getWorkspaceState(globalSimulationEngine)
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/foundry/check-conflict - Detect conflicting intervention proposals
router.post('/foundry/check-conflict', (req: Request, res: Response) => {
  const { candidate_id_a, candidate_id_b } = req.body;
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  const candA = workspace.candidates.find(c => c.id === candidate_id_a);
  const candB = workspace.candidates.find(c => c.id === candidate_id_b);

  if (!candA || !candB) {
    return res.status(404).json({ success: false, error: 'Both candidate IDs must be valid candidates' });
  }

  const conflict = GovernedExecutionBus.checkInterventionConflict(candA, candB);
  res.json({
    success: true,
    ...conflict
  });
});

// GET /api/foundry/audit-trail - Chronological event lineage and audit trail
router.get('/foundry/audit-trail', (req: Request, res: Response) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    audit_trail: workspace.audit_trail
  });
});

// POST /api/foundry/reassess - Trigger emergency reassessment
router.post('/foundry/reassess', (req: Request, res: Response) => {
  globalSimulationEngine.step();
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace,
    control_state: globalSimulationEngine.controlState
  });
});

/* =========================================================================
   PHASE 5: ASSURANCE, PRIVACY, INTEGRITY & IBM Z / LINUXONE RUNTIME API
   ========================================================================= */

// GET /api/assurance/state - Full assurance plane state
router.get('/assurance/state', (req: Request, res: Response) => {
  const assurance = globalAssuranceManager.evaluateAssuranceState(globalSimulationEngine);
  const trace = globalAssuranceManager.getActiveTrace();
  const ibmRuntime = IBMRuntimeContext.getRuntimeTruth();
  const transformations = PrivacyBoundary.getTransformations();
  const dataDictionary = PrivacyBoundary.DATA_DICTIONARY;

  res.json({
    success: true,
    assurance,
    trace,
    ibmRuntime,
    transformations,
    dataDictionary
  });
});

// POST /api/assurance/verify-integrity - Cryptographic SHA-256 verification of evidence records
router.post('/assurance/verify-integrity', (req: Request, res: Response) => {
  const records = globalSimulationEngine.evidenceRecords || [];
  const results = records.map(r => ({
    evidence_id: r.evidence_id,
    title: r.title,
    timestamp: r.timestamp,
    ...EvidenceEngine.verifyRecordIntegrity(r)
  }));

  const allValid = results.every(r => r.valid);

  res.json({
    success: true,
    allValid,
    recordsCount: results.length,
    verifiedAt: new Date().toISOString(),
    results
  });
});

// POST /api/assurance/inject - Controlled demonstration threat & failure mode injection
router.post('/assurance/inject', (req: Request, res: Response) => {
  const { threat } = req.body;
  if (!threat) {
    return res.status(400).json({ success: false, error: 'threat identifier is required' });
  }

  try {
    const result = globalAssuranceManager.injectThreat(threat as SecurityThreatScenarioId, globalSimulationEngine);
    systemStateStore.persistToDisk();
    res.json({
      success: true,
      threat,
      event: result.event,
      assuranceState: result.state,
      controlState: globalSimulationEngine.controlState
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/assurance/close-incident - Governed incident closure with evidence freshness/conflict verification
router.post('/assurance/close-incident', (req: Request, res: Response) => {
  const records = globalSimulationEngine.evidenceRecords || [];
  const evalResult = EvidenceEngine.evaluateClosureEligibility(records);

  if (!evalResult.closureAllowed) {
    return res.status(400).json({
      success: false,
      reason: evalResult.failureReason,
      outcome: evalResult.controllabilityOutcome,
      narrative: evalResult.narrative,
      assuranceState: globalAssuranceManager.evaluateAssuranceState(globalSimulationEngine)
    });
  }

  // If closure is permitted, resolve active incidents
  for (const inc of globalSimulationEngine.incidents) {
    inc.status = 'RESOLVED';
  }
  globalSimulationEngine.controlState.overall_status = 'STABLE';
  globalSimulationEngine.controlState.controllability_state = 'CONTROL_RESTORED';

  res.json({
    success: true,
    outcome: evalResult.controllabilityOutcome,
    narrative: evalResult.narrative,
    assuranceState: globalAssuranceManager.evaluateAssuranceState(globalSimulationEngine)
  });
});

// GET /api/assurance/privacy-filter/:role - Demonstrates role-based privacy boundary masking
router.get('/assurance/privacy-filter/:role', (req: Request, res: Response) => {
  const role = (req.params.role as UserRole) || 'OBSERVER';

  // Sample bank entity with both public and restricted/sensitive fields
  const sampleBank = {
    institution_id: 'BANK-A',
    name: 'Global Atlantic Clearing Bank',
    systemic_footprint_score: 0.88,
    liquidity_coverage_ratio: 88.5,
    status: 'DEGRADING',
    // Sensitive / Restricted fields that MUST be masked for unauthorized roles (OBSERVER)
    proprietary_order_book_depth_usd_m: 4850.0,
    unhedged_derivative_notional_usd_b: 142.8,
    bilateral_intraday_borrowing_limit_usd_m: 2500.0
  };

  const filtered = PrivacyBoundary.filterEntityForRole(sampleBank, role);

  res.json({
    success: true,
    role,
    data: filtered
  });
});

// GET /api/assurance/control-margin-provenance - Mathematical provenance breakdown of Control Margin
router.get('/assurance/control-margin-provenance', (req: Request, res: Response) => {
  const currentMargin = globalSimulationEngine.controlState.control_margin_percent;
  const previousMargin = 91; // Baseline equilibrium
  const provenance = globalAssuranceManager.generateControlMarginProvenance(previousMargin, currentMargin, globalSimulationEngine);

  res.json({
    success: true,
    provenance
  });
});

// GET /api/assurance/ibm-runtime - Authoritative IBM Z / LinuxONE capability matrix and truth state
router.get('/assurance/ibm-runtime', (req: Request, res: Response) => {
  res.json({
    success: true,
    ibmRuntime: IBMRuntimeContext.getRuntimeTruth()
  });
});

export default router;
