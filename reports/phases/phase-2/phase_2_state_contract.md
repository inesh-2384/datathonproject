# Financial Immune System (FIS)
## Phase 2 — Authoritative State Contract Specification
### Canonical Schema, Lifecycle Contracts & Mutation Invariants

---

## 1. The Authoritative State Hierarchy

The Financial Immune System enforces a strict single-state contract. The server-side enclave manages the authoritative object, while the client Zustand store (`useSystemStore`) mirrors this state through deterministic SSE streaming.

```
SYSTEM ROOT STATE
├── simulationClock: SimulationClock
├── controlState: SystemControlState
├── activeOperation: OperationTelemetry | null
├── recentOperations: OperationTelemetry[]
├── activeIncident: Incident | null
├── incidents: Incident[]
├── institutions: Institution[]
├── dependencies: Dependency[]
├── dataProviders: DataProvider[]
├── infrastructureNodes: InfrastructureNode[]
├── aiModels: AIModel[]
├── assets: Asset[]
├── authoritativeEvents: AuthoritativeEvent[]
├── decisionEvents: DecisionEvent[]
├── evidenceRecords: EvidenceRecord[]
├── replayTimeline: ReplayFrame[]
├── causalTraceData: CausalTraceResult | null
└── operationalContext: {
      selectedEntityId: string | null,
      currentRouteId: string,
      currentRole: UserRole,
      connectionState: TransportConnectionState
    }
```

---

## 2. Canonical Domain Schemas

### 2.1 System Control State (`SystemControlState`)
```typescript
interface SystemControlState {
  overall_status: 'STABLE' | 'DEGRADING' | 'CRITICAL' | 'COLLAPSING' | 'RECOVERING' | 'RESTORED' | 'RESIDUAL_RISK';
  control_margin_percent: number; // M(t) in [0, 100]
  control_margin_source: 'SIMULATED_VARIABLE';
  intervention_window_seconds: number;
  active_threat_count: number;
  system_stability_index: number; // [0.0, 1.0]
  effective_decision_diversity: number; // [0.0, 1.0]
  chokepoint_saturation: number; // [0.0, 1.0]
  ecosystem_institutions_count: number;
  ecosystem_dependencies_count: number;
  ecosystem_events_per_sec: number;
  active_incident_count: number;
  last_evaluated_timestamp: string;
  active_incident_id: string | null;
  scenario_name: string;
}
```

### 2.2 Operation Telemetry Contract (`OperationTelemetry`)
```typescript
interface OperationTelemetry {
  operation_id: string; // "OP-XXXX-YYY"
  operation_type: 'SCENARIO_INJECTION' | 'SIMULATION_STEP' | 'INTERVENTION_PROPOSAL' | 'INTERVENTION_EXECUTION' | 'SIMULATION_RESET' | 'REPLAY_SCRUB';
  status: 'IDLE' | 'QUEUED' | 'RUNNING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL' | 'REASSESSMENT_REQUIRED';
  incident_id?: string;
  tick: number;
  source_entity_id?: string;
  affected_entity_ids: string[];
  previous_state_summary: string;
  new_state_summary?: string;
  duration_ms: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  data_truth_label: 'IMPLEMENTED' | 'DERIVED' | 'SIMULATED' | 'EXPERIMENTAL' | 'CALIBRATED' | 'ARCHITECTED';
}
```

### 2.3 Domain Entity Contracts
- **`Institution`**: `institution_id` (e.g. `BANK-A`), `name`, `tier` (`G_SIB`), `status`, `capital_adequacy_ratio`, `liquidity_coverage_ratio`, `systemic_footprint_score`, `connected_dependencies[]`, `location { city, lat, lng }`.
- **`Dependency`**: `dependency_id` (e.g. `DEP_DATA_X_BANK_A`), `source_id`, `target_id`, `type`, `status`, `exposure_weight`, `is_chokepoint`, `latency_ms`.
- **`DataProvider`**: `provider_id` (e.g. `DATA-X`), `name`, `status`, `feed_type`, `institutions_served[]`, `location`.
- **`InfrastructureNode`**: `node_id` (e.g. `INFRA-1`), `name`, `status`, `peak_throughput_tps`, `current_load_percent`.

---

## 3. State Mutation Contracts

Every meaningful state mutation in the system adheres to the 4-phase contract:

1. **Intention & Validation**: Client triggers action (e.g. `POST /api/simulation/scenario`). Request is validated for role permissions and input schema. If an operation is currently processing, HTTP 409 Conflict is returned.
2. **Operation Registration**: Server registers an active operation in `OperationLifecycleManager` with state `QUEUED` $\rightarrow$ `RUNNING` $\rightarrow$ `PROCESSING`. Telemetry packet is emitted over SSE.
3. **Deterministic Mutation & Metric Derivation**: State is mutated in `SimulationEngine`. Downstream edges are traversed in `propagation.ts`. Graph metrics ($M(t)$, chokepoint saturation) are recalculated dynamically.
4. **State Snapshot & Replay Frame Recording**: State hash ($H_t = \text{SHA256}(\text{state}_t)$) is recorded in `replayTimeline`. Telemetry transitions to `COMPLETED` and is broadcast to all clients.

---

## 4. Anti-Patterns Explicitly Prohibited

- **No component-local copies**: Workspaces do not clone entity lists into component state.
- **No client-side optimistic fabrication**: Front-end components never speculate about status changes; they wait for server-authoritative state.
- **No hardcoded cross-screen values**: All metric counters ($M(t)$, LCR, node status) derive from the root store.
- **No silent error swallowing**: Operational failures yield visible `FAILED` states and explanatory telemetry, never synthetic success.
