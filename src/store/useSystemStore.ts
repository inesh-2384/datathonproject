/**
 * FINANCIAL IMMUNE SYSTEM - CENTRAL SYSTEM STATE STORE
 * Section 4: System State Architecture
 * Section 5: State Transitions
 * Section 6: Authentication + Roles
 * Aligned with Reference Image Panels 1-4
 */

import { create } from 'zustand';
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
} from '@shared/types/domain';
import { UserRole, UserSession, RolePermissions, ROLE_PERMISSIONS_REGISTRY } from '@shared/types/roles';
import { SimulationClock, SimulationConfig } from '@shared/types/simulation';
import { TransportConnectionState } from '@shared/types/telemetry';
import { AuthoritativeEvent, ScenarioId, ReplayFrame, OperationTelemetry } from '@shared/types/events';
import { 
  SystemicControllabilityAssessment, 
  AblationConfig, 
  BaselineTier, 
  DependencyIntelligenceRecord 
} from '@shared/types/intelligence';
import { FoundryWorkspaceState } from '@shared/types/foundry';
import { 
  AssuranceState, 
  TraceRecord, 
  IBMRuntimeTruth, 
  PrivacyTransformationRecord, 
  ClassifiedDataField, 
  ControlMarginProvenance,
  SecurityThreatScenarioId
} from '@shared/types/assurance';

interface SystemStore {
  // Authentication & Session (Section 6)
  isAuthenticated: boolean;
  currentUser: UserSession | null;
  currentRole: UserRole;
  permissions: RolePermissions;
  
  // Authoritative Domain State (Section 3)
  institutions: Institution[];
  dependencies: Dependency[];
  aiModels: AIModel[];
  assets: Asset[];
  dataProviders: DataProvider[];
  infrastructureNodes: InfrastructureNode[];
  incidents: Incident[];
  activeIncident: Incident | null;
  controlState: SystemControlState;
  systemicEvents: SystemicEvent[];
  decisionEvents: DecisionEvent[];
  authoritativeEvents: AuthoritativeEvent[];
  evidenceRecords: EvidenceRecord[];
  interventions: Intervention[];
  activeScenarioId: ScenarioId;
  scenarioState: 'NORMAL' | 'ATTACK_TRIGGERED';

  // Replay & Causal Analytics (Phase 2)
  replayTimeline: ReplayFrame[];
  causalTraceData: any | null;
  activeOperation: OperationTelemetry | null;
  recentOperations: OperationTelemetry[];
  setActiveOperation: (op: OperationTelemetry | null) => void;
  fetchOperations: () => Promise<void>;
  propagateGraph: (sourceId: string, depth?: number) => Promise<any>;


  // Systemic Intelligence (Phase 3)
  intelligenceAssessment: SystemicControllabilityAssessment | null;
  dependencyIntelligence: DependencyIntelligenceRecord[];
  ablationConfig: AblationConfig | null;

  fetchIntelligenceAssessment: () => Promise<void>;
  fetchDependencyIntelligence: () => Promise<void>;
  setAblationTier: (tier: BaselineTier) => Promise<void>;

  // Control Foundry (Phase 4)
  foundryState: FoundryWorkspaceState | null;
  fetchFoundryState: () => Promise<void>;
  evaluateFoundryCandidates: () => Promise<void>;
  requestFoundryAuthorization: (candidateId: string) => Promise<boolean>;
  authorizeFoundryCandidate: (candidateId: string, justification?: string) => Promise<boolean>;
  executeFoundryCandidate: (candidateId: string, options?: boolean | { forceFailure?: boolean; forceStaleEvidence?: boolean; forceConflictingTelemetry?: boolean; forceDownstreamContagion?: boolean }) => Promise<boolean>;
  rollbackFoundryCandidate: (candidateId: string, justification?: string) => Promise<boolean>;
  reassessFoundry: (escalatedCandidateId?: string) => Promise<void>;

  // Enterprise Assurance & Security (Phase 5)
  assuranceState: AssuranceState | null;
  activeTrace: TraceRecord | null;
  ibmRuntimeTruth: IBMRuntimeTruth | null;
  privacyTransformations: PrivacyTransformationRecord[];
  dataDictionary: ClassifiedDataField[];
  controlMarginProvenance: ControlMarginProvenance | null;

  fetchAssuranceState: () => Promise<void>;
  verifyIntegrity: () => Promise<{ allValid: boolean; recordsCount: number; results: any[] }>;
  injectAssuranceThreat: (threat: SecurityThreatScenarioId) => Promise<void>;
  attemptCloseIncident: () => Promise<{ success: boolean; narrative: string }>;
  fetchControlMarginProvenance: () => Promise<void>;

  // Inspection Context
  selectedEntityId: string | null;
  selectedEntity: any | null;
  isEntityDrawerOpen: boolean;
  selectedEventId: string | null;
  eventInspectionNotice: string | null;
  eventFocusTrigger: number;
  selectedFoundryCandidateId: string | null;
  governanceBlockNotice: {
    action: 'AUTHORIZE' | 'EXECUTE' | 'ROLLBACK';
    candidateId: string;
    currentRole: UserRole;
    requiredAuthority: string;
    requiredRoles: UserRole[];
    reason: string;
    timestamp: string;
  } | null;

  // Real-time Transport (Section 8)
  connectionState: TransportConnectionState;
  connectionLatencyMs: number;
  lastHeartbeatTimestamp: string | null;

  // Simulation Clock (Section 9)
  simulationClock: SimulationClock;
  simulationConfig: SimulationConfig;

  // Navigation (Section 7)
  currentRouteId: string;

  // UI Modals
  isLoginModalOpen: boolean;
  isRoleModalOpen: boolean;
  isInterventionModalOpen: boolean;
  isDemoMode: boolean;
  setDemoMode: (demo: boolean) => void;

  // Actions & State Transitions
  login: (role: UserRole, username?: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  selectEntity: (entityId: string | null) => void;
  closeEntityDrawer: () => void;
  selectIncident: (incidentId: string) => void;
  selectEvent: (eventId: string | null) => void;
  inspectEvent: (eventId?: string) => void;
  setSelectedFoundryCandidateId: (id: string | null) => void;
  setGovernanceBlockNotice: (notice: {
    action: 'AUTHORIZE' | 'EXECUTE' | 'ROLLBACK';
    candidateId: string;
    currentRole: UserRole;
    requiredAuthority: string;
    requiredRoles: UserRole[];
    reason: string;
    timestamp: string;
  } | null) => void;
  clearGovernanceBlockNotice: () => void;
  setCurrentRoute: (routeId: string) => void;
  
  // Real-time sync mutators
  setConnectionState: (state: TransportConnectionState, latency?: number) => void;
  applyServerSnapshot: (data: any) => void;
  applyTick: (tick: number, controlState?: Partial<SystemControlState>) => void;
  prependAuthoritativeEvents: (events: AuthoritativeEvent[]) => void;
  
  // Scenario & Simulation actions
  startScenario: (scenarioId: ScenarioId) => Promise<void>;
  scrubToTick: (tick: number) => Promise<void>;
  fetchReplayTimeline: () => Promise<void>;
  fetchCausalTrace: (entityId: string) => Promise<any>;
  injectAttack: () => Promise<void>;
  resetScenario: () => Promise<void>;
  toggleSimulation: () => Promise<void>;
  stepSimulation: () => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  
  // Intervention actions
  proposeIntervention: (intervention: Partial<Intervention>) => Promise<void>;
  executeIntervention: (interventionId: string) => Promise<void>;

  // Modal toggles
  setLoginModalOpen: (open: boolean) => void;
  setRoleModalOpen: (open: boolean) => void;
  setInterventionModalOpen: (open: boolean) => void;
}

const initialRole: UserRole = (localStorage.getItem('fis_role') as UserRole) || 'SYSTEM_OPERATOR';
const storedToken = localStorage.getItem('fis_token');
const isInitiallyAuth = !!storedToken;

export const useSystemStore = create<SystemStore>((set, get) => ({
  isAuthenticated: isInitiallyAuth,
  currentUser: isInitiallyAuth ? {
    user_id: 'USR_OPERATOR_ROOT',
    name: 'System Operator | FIS-CTRL',
    role: initialRole,
    department: 'Systemic Control & Resilience Enclave',
    enclave_session_token: storedToken || 'enc_initial_token',
    authenticated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
  } : null,
  currentRole: initialRole,
  permissions: ROLE_PERMISSIONS_REGISTRY[initialRole],

  institutions: [],
  dependencies: [],
  aiModels: [],
  assets: [],
  dataProviders: [],
  infrastructureNodes: [],
  incidents: [],
  activeIncident: null,
  controlState: {
    overall_status: 'STABLE',
    control_margin_percent: 91,
    control_margin_source: 'SIMULATED_VARIABLE',
    intervention_window_seconds: 3600,
    active_threat_count: 0,
    system_stability_index: 0.94,
    effective_decision_diversity: 0.61,
    chokepoint_saturation: 0.24,
    ecosystem_institutions_count: 20,
    ecosystem_dependencies_count: 102,
    ecosystem_events_per_sec: 842,
    active_incident_count: 0,
    key_metrics: {
      propagation_risk_pct: 12,
      decision_synchrony_pct: 18,
      model_concentration_pct: 22,
      infrastructure_dependency_pct: 26,
      evidence_sufficiency_pct: 94
    },
    last_evaluated_timestamp: '2026-10-08T14:20:12Z',
    active_incident_id: null,
    scenario_name: 'Normal State (Equilibrium)'
  },
  systemicEvents: [],
  decisionEvents: [],
  authoritativeEvents: [],
  evidenceRecords: [],
  interventions: [],
  activeScenarioId: 'SCENARIO_A',
  scenarioState: 'NORMAL',
  replayTimeline: [],
  causalTraceData: null,
  activeOperation: null,
  recentOperations: [],
  intelligenceAssessment: null,

  dependencyIntelligence: [],
  ablationConfig: null,
  foundryState: null,
  assuranceState: null,
  activeTrace: null,
  ibmRuntimeTruth: null,
  privacyTransformations: [],
  dataDictionary: [],
  controlMarginProvenance: null,

  selectedEntityId: null,
  selectedEntity: null,
  isEntityDrawerOpen: false,
  selectedEventId: null,
  eventInspectionNotice: null,
  eventFocusTrigger: 0,
  selectedFoundryCandidateId: null,
  governanceBlockNotice: null,
  isDemoMode: false,

  connectionState: 'INITIALIZING',
  connectionLatencyMs: 12,
  lastHeartbeatTimestamp: null,

  simulationClock: {
    tick: 0,
    speed_multiplier: 1,
    is_running: false,
    virtual_timestamp: '2026-10-08T14:20:12Z',
    step_duration_ms: 2000
  },
  simulationConfig: {
    seed: 42091,
    scenario_id: 'SCENARIO_DATA_X_DEPENDENCY_ATTACK',
    scenario_name: 'Common Data Dependency Attack Baseline',
    description: 'Controlled simulation of information provider compromise across Tier-1 banking rails',
    auto_tick: false,
    tick_interval_ms: 2000
  },

  currentRouteId: 'control-center',
  isLoginModalOpen: false,
  isRoleModalOpen: false,
  isInterventionModalOpen: false,

  // ACTIONS
  login: async (role: UserRole, username?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('fis_token', data.session.enclave_session_token);
        localStorage.setItem('fis_role', role);
        set({
          isAuthenticated: true,
          currentUser: data.session,
          currentRole: role,
          permissions: data.permissions,
          isLoginModalOpen: false,
          isRoleModalOpen: false
        });
      }
    } catch (err) {
      const fallbackToken = `enc_fallback_${Date.now()}`;
      localStorage.setItem('fis_token', fallbackToken);
      localStorage.setItem('fis_role', role);
      set({
        isAuthenticated: true,
        currentUser: {
          user_id: 'USR_FALLBACK',
          name: username || 'System Operator | FIS-CTRL',
          role,
          department: 'Systemic Control & Resilience Enclave',
          enclave_session_token: fallbackToken,
          authenticated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString()
        },
        currentRole: role,
        permissions: ROLE_PERMISSIONS_REGISTRY[role],
        isLoginModalOpen: false,
        isRoleModalOpen: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('fis_token');
    set({
      isAuthenticated: false,
      currentUser: null,
      currentRole: 'OBSERVER',
      permissions: ROLE_PERMISSIONS_REGISTRY['OBSERVER'],
      isLoginModalOpen: true
    });
  },

  setRole: (role: UserRole) => {
    localStorage.setItem('fis_role', role);
    set(state => ({
      currentRole: role,
      permissions: ROLE_PERMISSIONS_REGISTRY[role],
      currentUser: state.currentUser ? { ...state.currentUser, role, name: `${role.replace('_', ' ')} | FIS-CTRL` } : null,
      isRoleModalOpen: false,
      governanceBlockNotice: null
    }));
  },

  selectEntity: (entityId: string | null) => {
    if (!entityId) {
      set({ selectedEntityId: null, selectedEntity: null, isEntityDrawerOpen: false });
      return;
    }
    const state = get();
    const prov = state.dataProviders.find(p => p.provider_id === entityId);
    const inst = state.institutions.find(i => i.institution_id === entityId);
    const dep = state.dependencies.find(d => d.dependency_id === entityId);
    const aim = state.aiModels.find(m => m.model_id === entityId);
    const ast = state.assets.find(a => a.asset_id === entityId);
    const inf = state.infrastructureNodes.find(n => n.node_id === entityId);

    const found = prov || inst || dep || aim || ast || inf || null;
    set({
      selectedEntityId: entityId,
      selectedEntity: found,
      isEntityDrawerOpen: true
    });
    // Dynamically retrieve causal explanation
    get().fetchCausalTrace(entityId);
  },

  closeEntityDrawer: () => {
    set({ isEntityDrawerOpen: false });
  },

  selectIncident: (incidentId: string) => {
    const inc = get().incidents.find(i => i.incident_id === incidentId);
    if (inc) {
      set(state => ({
        activeIncident: inc,
        controlState: { ...state.controlState, active_incident_id: incidentId }
      }));
    }
  },

  selectEvent: (eventId: string | null) => {
    set(state => ({
      selectedEventId: eventId,
      eventFocusTrigger: state.eventFocusTrigger + 1,
      eventInspectionNotice: eventId
        ? `INSPECTING SELECTED EVENT [${eventId}] — DOSSIER & LINEAGE POPULATED`
        : null
    }));
  },

  inspectEvent: (eventId?: string) => {
    const state = get();
    const isAlreadyOnEventDetection = state.currentRouteId === 'event-detection';
    const isAttackActive = (state.scenarioState === 'ATTACK_TRIGGERED' || (state.activeIncident !== null && state.activeIncident.status !== 'RESOLVED')) && state.controlState.overall_status !== 'STABLE';

    if (eventId && eventId.startsWith('UNAVAILABLE')) {
      set({
        currentRouteId: 'event-detection',
        selectedEventId: eventId,
        eventFocusTrigger: state.eventFocusTrigger + 1,
        eventInspectionNotice: `EVENT NO LONGER AVAILABLE: [${eventId}] • Last Known State: ARCHIVED • Reason: Retention window expired or baseline reset • Related Incident: ${state.activeIncident?.incident_id || 'RN-2026-0041'}`
      });
      return;
    }

    const resolvedId = eventId
      || (state.authoritativeEvents.length > 0 ? state.authoritativeEvents[0].event_id : null)
      || (isAttackActive ? 'EVT-INITIAL-41' : 'EVT-NOMINAL-01');

    set({
      currentRouteId: 'event-detection',
      selectedEventId: resolvedId,
      eventFocusTrigger: state.eventFocusTrigger + 1,
      eventInspectionNotice: isAlreadyOnEventDetection
        ? `ALREADY INSPECTING EVENT [${resolvedId}] — DOSSIER EXPANDED & FOCUSED IN PLACE (Incident: ${state.activeIncident?.incident_id || 'RN-2026-0041'})`
        : `EVENT FOCUSED: AUTO-SELECTED INCIDENT EVENT [${resolvedId}] — DOSSIER POPULATED (No second click required)`
    });
  },

  setSelectedFoundryCandidateId: (id: string | null) => {
    set({ selectedFoundryCandidateId: id });
  },

  setGovernanceBlockNotice: (notice) => {
    set({ governanceBlockNotice: notice });
  },

  clearGovernanceBlockNotice: () => {
    set({ governanceBlockNotice: null });
  },

  setCurrentRoute: (routeId: string) => {
    set({ currentRouteId: routeId });
  },

  setConnectionState: (connectionState: TransportConnectionState, latency?: number) => {
    set(state => ({
      connectionState,
      connectionLatencyMs: latency !== undefined ? latency : state.connectionLatencyMs,
      lastHeartbeatTimestamp: new Date().toISOString()
    }));
  },

  applyServerSnapshot: (data: any) => {
    set({
      institutions: data.institutions || [],
      dependencies: data.dependencies || [],
      aiModels: data.aiModels || [],
      assets: data.assets || [],
      dataProviders: data.dataProviders || [],
      infrastructureNodes: data.infrastructureNodes || [],
      incidents: data.incidents || [],
      activeIncident: data.incidents && data.incidents.length > 0 ? data.incidents[0] : null,
      controlState: data.controlState || get().controlState,
      systemicEvents: data.systemicEvents || [],
      decisionEvents: data.decisionEvents || [],
      authoritativeEvents: Array.isArray(data.authoritativeEvents) ? data.authoritativeEvents : get().authoritativeEvents,
      activeScenarioId: data.activeScenarioId || get().activeScenarioId,
      evidenceRecords: data.evidenceRecords || [],
      interventions: data.interventions || [],
      scenarioState: data.scenarioState || (data.incidents && data.incidents.length > 0 ? 'ATTACK_TRIGGERED' : 'NORMAL'),
      simulationClock: data.simulationClock || get().simulationClock,
      simulationConfig: data.simulationConfig || get().simulationConfig,
      intelligenceAssessment: data.controlState?.intelligence || get().intelligenceAssessment,
      foundryState: data.controlState?.foundry || get().foundryState
    });
  },

  applyTick: (tick: number, controlStatePartial?: Partial<SystemControlState>) => {
    set(state => ({
      simulationClock: {
        ...state.simulationClock,
        tick,
        virtual_timestamp: new Date(new Date(state.simulationClock.virtual_timestamp).getTime() + 1000).toISOString()
      },
      controlState: controlStatePartial 
        ? { ...state.controlState, ...controlStatePartial } 
        : state.controlState,
      intelligenceAssessment: controlStatePartial?.intelligence || state.intelligenceAssessment,
      foundryState: controlStatePartial?.foundry || state.foundryState
    }));
  },

  prependAuthoritativeEvents: (events: AuthoritativeEvent[]) => {
    set(state => ({
      authoritativeEvents: [...events, ...state.authoritativeEvents].slice(0, 50)
    }));
  },

  setActiveOperation: (op: OperationTelemetry | null) => {
    set(state => ({
      activeOperation: op,
      recentOperations: op && ['COMPLETED', 'FAILED', 'PARTIAL', 'REASSESSMENT_REQUIRED'].includes(op.status)
        ? [op, ...state.recentOperations.filter(o => o.operation_id !== op.operation_id)].slice(0, 30)
        : state.recentOperations
    }));
  },

  fetchOperations: async () => {
    try {
      const res = await fetch('/api/simulation/operations');
      const data = await res.json();
      if (data.success) {
        set({
          activeOperation: data.active_operation || null,
          recentOperations: data.recent_operations || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch operations:', err);
    }
  },

  propagateGraph: async (sourceId: string, depth: number = 2) => {
    try {
      const res = await fetch('/api/simulation/propagate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: sourceId, depth })
      });
      const data = await res.json();
      if (data.success) {
        const stateRes = await fetch('/api/state');
        const stateData = await stateRes.json();
        if (stateData.success) {
          get().applyServerSnapshot(stateData.data);
        }
        return data.data;
      }
    } catch (err) {
      console.error('Failed to propagate graph:', err);
    }
    return null;
  },


  startScenario: async (scenarioId: ScenarioId) => {
    try {
      const res = await fetch('/api/simulation/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId })
      });
      const data = await res.json();
      if (data.success) {
        set({
          activeScenarioId: scenarioId,
          scenarioState: 'ATTACK_TRIGGERED',
          selectedEventId: 'EVT-INITIAL-41',
          governanceBlockNotice: null
        });
        const stateRes = await fetch('/api/state');
        const stateData = await stateRes.json();
        if (stateData.success) {
          get().applyServerSnapshot(stateData.data);
        }
        await Promise.all([
          get().fetchReplayTimeline(),
          get().fetchFoundryState(),
          get().fetchIntelligenceAssessment(),
          get().fetchAssuranceState()
        ]);
      }
    } catch (err) {
      console.error('Start scenario error:', err);
    }
  },

  scrubToTick: async (tick: number) => {
    try {
      const res = await fetch('/api/simulation/replay/scrub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick })
      });
      const data = await res.json();
      if (data.success && data.state) {
        get().applyServerSnapshot(data.state);
      }
    } catch (err) {
      console.error('Scrub to tick error:', err);
    }
  },

  fetchReplayTimeline: async () => {
    try {
      const res = await fetch('/api/simulation/replay/timeline');
      const data = await res.json();
      if (data.success) {
        set({ replayTimeline: data.timeline || [] });
      }
    } catch (err) {
      console.error('Fetch replay timeline error:', err);
    }
  },

  fetchCausalTrace: async (entityId: string) => {
    try {
      const res = await fetch(`/api/simulation/causal-trace/${entityId}`);
      const data = await res.json();
      if (data.success) {
        set({ causalTraceData: data.data });
        return data.data;
      }
    } catch (err) {
      console.error('Fetch causal trace error:', err);
    }
    return null;
  },

  injectAttack: async () => {
    return get().startScenario('SCENARIO_A');
  },

  resetScenario: async () => {
    try {
      const res = await fetch('/api/simulation/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: 42091 })
      });
      const data = await res.json();
      if (data.success) {
        set({
          selectedEntityId: null,
          selectedEntity: null,
          isEntityDrawerOpen: false,
          selectedEventId: null,
          eventInspectionNotice: null,
          selectedFoundryCandidateId: null,
          governanceBlockNotice: null,
          causalTraceData: null,
          activeOperation: null,
          authoritativeEvents: []
        });
        const stateRes = await fetch('/api/state');
        const stateData = await stateRes.json();
        if (stateData.success) {
          get().applyServerSnapshot(stateData.data);
        }
        await Promise.all([
          get().fetchFoundryState(),
          get().fetchIntelligenceAssessment(),
          get().fetchAssuranceState()
        ]);
      }
    } catch (err) {
      console.error('Reset scenario error:', err);
    }
  },

  toggleSimulation: async () => {
    const isRunning = get().simulationClock.is_running;
    const nextRunning = !isRunning;
    set(state => ({
      simulationClock: { ...state.simulationClock, is_running: nextRunning }
    }));
    const endpoint = isRunning ? '/api/simulation/pause' : '/api/simulation/resume';
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          simulationClock: { ...state.simulationClock, is_running: data.is_running }
        }));
      }
    } catch (err) {
      console.error('Toggle simulation error:', err);
    }
  },

  stepSimulation: async () => {
    const nextTick = get().simulationClock.tick + 1;
    set(state => ({
      simulationClock: { ...state.simulationClock, tick: nextTick }
    }));
    try {
      const res = await fetch('/api/simulation/step', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          simulationClock: data.clock,
          controlState: data.control_state
        }));
        const stateRes = await fetch('/api/state');
        const stateData = await stateRes.json();
        if (stateData.success) {
          get().applyServerSnapshot(stateData.data);
        }
        await get().fetchIntelligenceAssessment();
      }
    } catch (err) {
      console.error('Step simulation error:', err);
    }
  },

  setSpeed: async (speed: number) => {
    try {
      const res = await fetch('/api/simulation/speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier: speed })
      });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          simulationClock: { ...state.simulationClock, speed_multiplier: speed }
        }));
      }
    } catch (err) {
      console.error('Set speed error:', err);
    }
  },

  proposeIntervention: async (intervention: Partial<Intervention>) => {
    const role = get().currentRole;
    try {
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, intervention })
      });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          interventions: [data.data, ...state.interventions],
          controlState: data.control_state,
          isInterventionModalOpen: false
        }));
      }
    } catch (err) {
      console.error('Propose intervention error:', err);
    }
  },

  executeIntervention: async (interventionId: string) => {
    const role = get().currentRole;
    try {
      const res = await fetch(`/api/interventions/${interventionId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        set(state => ({
          interventions: state.interventions.map(i => i.intervention_id === interventionId ? data.data : i),
          controlState: data.control_state
        }));
      }
    } catch (err) {
      console.error('Execute intervention error:', err);
    }
  },

  fetchIntelligenceAssessment: async () => {
    try {
      const res = await fetch('/api/intelligence/assessment');
      const data = await res.json();
      if (data.success && data.assessment) {
        set({ intelligenceAssessment: data.assessment });
      }
    } catch (err) {
      console.error('Failed to fetch intelligence assessment:', err);
    }
  },

  fetchDependencyIntelligence: async () => {
    try {
      const res = await fetch('/api/intelligence/dependencies');
      const data = await res.json();
      if (data.success && data.dependencies) {
        set({ dependencyIntelligence: data.dependencies });
      }
    } catch (err) {
      console.error('Failed to fetch dependency intelligence:', err);
    }
  },

  setAblationTier: async (tier: BaselineTier) => {
    try {
      const res = await fetch('/api/intelligence/ablation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const data = await res.json();
      if (data.success) {
        set({ ablationConfig: data.config });
      }
    } catch (err) {
      console.error('Failed to set ablation tier:', err);
    }
  },

  fetchFoundryState: async () => {
    try {
      const res = await fetch('/api/foundry/state');
      const data = await res.json();
      if (data.success && data.workspace) {
        set({ foundryState: data.workspace });
      }
    } catch (err) {
      console.error('Failed to fetch foundry state:', err);
    }
  },

  evaluateFoundryCandidates: async () => {
    try {
      const res = await fetch('/api/foundry/evaluate', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.workspace) {
        set({ foundryState: data.workspace });
      }
    } catch (err) {
      console.error('Failed to evaluate foundry candidates:', err);
    }
  },

  requestFoundryAuthorization: async (candidateId: string): Promise<boolean> => {
    const role = get().currentRole;
    const userId = get().currentUser?.user_id || `USR-${role.slice(0, 4)}`;
    try {
      const res = await fetch('/api/foundry/request-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, role, user_id: userId })
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        set({ foundryState: data.workspace });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to request authorization:', err);
      return false;
    }
  },

  authorizeFoundryCandidate: async (candidateId: string, justification?: string): Promise<boolean> => {
    const role = get().currentRole;
    const userId = get().currentUser?.user_id || `USR-${role.slice(0, 4)}`;
    try {
      const res = await fetch('/api/foundry/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, role, user_id: userId, justification })
      });
      const data = await res.json();
      if (data.success) {
        set({ governanceBlockNotice: null });
        await get().fetchFoundryState();
        return true;
      } else {
        set({
          governanceBlockNotice: {
            action: 'AUTHORIZE',
            candidateId,
            currentRole: role,
            requiredAuthority: 'INCIDENT_COMMANDER / RISK_OFFICER / COMPLIANCE_OFFICER',
            requiredRoles: ['INCIDENT_COMMANDER', 'RISK_OFFICER', 'COMPLIANCE_OFFICER'],
            reason: data.error || 'Separation of Duties prevents the execution operator from authorizing their own intervention.',
            timestamp: new Date().toISOString()
          }
        });
        return false;
      }
    } catch (err) {
      console.error('Failed to authorize candidate:', err);
      return false;
    }
  },

  executeFoundryCandidate: async (candidateId: string, options?: boolean | { forceFailure?: boolean; forceStaleEvidence?: boolean; forceConflictingTelemetry?: boolean; forceDownstreamContagion?: boolean }): Promise<boolean> => {
    const role = get().currentRole;
    const userId = get().currentUser?.user_id || `USR-${role.slice(0, 4)}`;
    const forceFailure = typeof options === 'boolean' ? options : options?.forceFailure;
    const forceStaleEvidence = typeof options === 'object' ? options?.forceStaleEvidence : false;
    const forceConflictingTelemetry = typeof options === 'object' ? options?.forceConflictingTelemetry : false;
    const forceDownstreamContagion = typeof options === 'object' ? options?.forceDownstreamContagion : false;
    try {
      const res = await fetch('/api/foundry/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          candidate_id: candidateId, 
          role, 
          user_id: userId,
          force_failure: forceFailure,
          force_stale_evidence: forceStaleEvidence,
          force_conflicting_telemetry: forceConflictingTelemetry,
          force_downstream_contagion: forceDownstreamContagion
        })
      });
      const data = await res.json();
      if (data.success) {
        set({
          controlState: data.control_state,
          foundryState: data.workspace,
          governanceBlockNotice: null
        });
        const stateRes = await fetch('/api/state');
        const stateData = await stateRes.json();
        if (stateData.success) {
          get().applyServerSnapshot(stateData.data);
        }
        await Promise.all([
          get().fetchIntelligenceAssessment(),
          get().fetchAssuranceState()
        ]);
        return true;
      } else {
        set({
          governanceBlockNotice: {
            action: 'EXECUTE',
            candidateId,
            currentRole: role,
            requiredAuthority: 'SYSTEM_OPERATOR (Requires prior Authorization by INCIDENT_COMMANDER / RISK_OFFICER / COMPLIANCE_OFFICER)',
            requiredRoles: ['SYSTEM_OPERATOR'],
            reason: data.error || 'Separation of Duties requires an authorized action contract and execution operator privileges.',
            timestamp: new Date().toISOString()
          }
        });
        return false;
      }
    } catch (err) {
      console.error('Failed to execute candidate:', err);
      return false;
    }
  },

  rollbackFoundryCandidate: async (candidateId: string, justification?: string): Promise<boolean> => {
    const role = get().currentRole;
    try {
      const res = await fetch('/api/foundry/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          candidate_id: candidateId, 
          authorizer_role: 'INCIDENT_COMMANDER', 
          executor_role: role,
          justification 
        })
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        set({
          foundryState: data.workspace,
          controlState: data.control_state,
          governanceBlockNotice: null
        });
        await get().fetchIntelligenceAssessment();
        return true;
      } else {
        set({
          governanceBlockNotice: {
            action: 'ROLLBACK',
            candidateId,
            currentRole: role,
            requiredAuthority: 'SYSTEM_OPERATOR + INCIDENT_COMMANDER',
            requiredRoles: ['SYSTEM_OPERATOR', 'INCIDENT_COMMANDER'],
            reason: data.error || 'Rollback rejected by governance policy.',
            timestamp: new Date().toISOString()
          }
        });
        return false;
      }
    } catch (err) {
      console.error('Failed to rollback candidate:', err);
      return false;
    }
  },

  reassessFoundry: async (escalatedCandidateId?: string) => {
    try {
      const res = await fetch('/api/foundry/reassess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escalated_candidate_id: escalatedCandidateId })
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        set({ foundryState: data.workspace });
      }
    } catch (err) {
      console.error('Failed to trigger reassessment:', err);
    }
  },

  // Enterprise Assurance Actions (Phase 5)
  fetchAssuranceState: async () => {
    try {
      const res = await fetch('/api/assurance/state');
      const data = await res.json();
      if (data.success) {
        set({
          assuranceState: data.assurance,
          activeTrace: data.trace,
          ibmRuntimeTruth: data.ibmRuntime,
          privacyTransformations: data.transformations || [],
          dataDictionary: data.dataDictionary || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch assurance state:', err);
    }
  },

  verifyIntegrity: async () => {
    try {
      const res = await fetch('/api/assurance/verify-integrity', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await get().fetchAssuranceState();
        return { allValid: data.allValid, recordsCount: data.recordsCount, results: data.results || [] };
      }
      return { allValid: false, recordsCount: 0, results: [] };
    } catch (err) {
      console.error('Failed to verify integrity:', err);
      return { allValid: false, recordsCount: 0, results: [] };
    }
  },

  injectAssuranceThreat: async (threat: SecurityThreatScenarioId) => {
    try {
      const res = await fetch('/api/assurance/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threat })
      });
      const data = await res.json();
      if (data.success) {
        set({
          controlState: data.controlState,
          assuranceState: data.assuranceState
        });
        const stateRes = await fetch('/api/state');
        const stateJson = await stateRes.json();
        if (stateJson.success) get().applyServerSnapshot(stateJson.data);
      }
    } catch (err) {
      console.error('Failed to inject threat:', err);
    }
  },

  attemptCloseIncident: async () => {
    try {
      const res = await fetch('/api/assurance/close-incident', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const stateRes = await fetch('/api/state');
        const stateJson = await stateRes.json();
        if (stateJson.success) get().applyServerSnapshot(stateJson.data);
        await get().fetchAssuranceState();
        return { success: true, narrative: data.narrative };
      } else {
        await get().fetchAssuranceState();
        return { success: false, narrative: data.narrative || data.error };
      }
    } catch (err: any) {
      return { success: false, narrative: err.message };
    }
  },

  fetchControlMarginProvenance: async () => {
    try {
      const res = await fetch('/api/assurance/control-margin-provenance');
      const data = await res.json();
      if (data.success) {
        set({ controlMarginProvenance: data.provenance });
      }
    } catch (err) {
      console.error('Failed to fetch provenance:', err);
    }
  },

  setLoginModalOpen: (open: boolean) => set({ isLoginModalOpen: open }),
  setRoleModalOpen: (open: boolean) => set({ isRoleModalOpen: open }),
  setInterventionModalOpen: (open: boolean) => set({ isInterventionModalOpen: open }),
  setDemoMode: (demo: boolean) => set({ isDemoMode: demo })
}));
