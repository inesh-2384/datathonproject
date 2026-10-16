/**
 * FINANCIAL IMMUNE SYSTEM - AUTHORITATIVE EVENT & REPLAY DOMAIN SCHEMAS
 * Phase 2 Core Architectural Contract
 * 
 * Guarantees:
 * 1. Strongly-typed, immutable event structures with causal lineage.
 * 2. Deterministic replay frames with cryptographic state fingerprinting.
 * 3. Exact multi-hop state deltas.
 */

import { SystemSemanticStatus } from './domain';

export type AuthoritativeEventType =
  | 'ANOMALY_DETECTED'
  | 'PROVIDER_DEGRADATION'
  | 'PROVIDER_COMPROMISED'
  | 'DEPENDENCY_PROPAGATION'
  | 'INSTITUTION_DEGRADATION'
  | 'INFRASTRUCTURE_CONGESTION'
  | 'INFRASTRUCTURE_FAILURE'
  | 'INTERVENTION_PROPOSED'
  | 'INTERVENTION_AUTHORIZED'
  | 'INTERVENTION_EXECUTED'
  | 'INTERVENTION_VERIFIED'
  | 'RESIDUAL_RISK_DETECTED'
  | 'SYSTEM_REASSESSMENT'
  | 'COLLECTIVE_DECISION_CONVERGENCE'
  | 'DIVERSITY_COLLAPSE'
  | 'BASELINE_RESTORED'
  | 'REPLAY_SCRUB'
  // Phase 4 Control Foundry Events
  | 'CONTROL_FOUNDRY_OPENED'
  | 'INTERVENTION_CANDIDATES_GENERATED'
  | 'COUNTERFACTUAL_EVALUATION_COMPLETED'
  | 'INTERVENTION_RECOMMENDED'
  | 'AUTHORIZATION_REQUESTED'
  | 'INTERVENTION_REJECTED'
  | 'EXECUTION_FAILED'
  | 'VERIFICATION_STARTED'
  | 'OUTCOME_CONFIRMED'
  | 'OUTCOME_CONFLICTED'
  | 'RESIDUAL_HAZARD_DETECTED'
  | 'REASSESSMENT_TRIGGERED'
  | 'CONTROL_RESTORED'
  | 'CONTROL_UNVERIFIED'
  | 'INTERVENTION_ROLLED_BACK'
  | 'EVIDENCE_STALENESS_DETECTED'
  | 'CONFLICTING_EVIDENCE_DETECTED'
  | 'INTERVENTION_VERIFICATION_FAILED'
  | 'PARTIAL_RECOVERY_CONFIRMED'
  // Phase 5 Enterprise Assurance & Security Events
  | 'EVIDENCE_RECEIVED'
  | 'EVIDENCE_CLASSIFIED'
  | 'EVIDENCE_EXPIRED'
  | 'EVIDENCE_CONFLICT_DETECTED'
  | 'AUTHORIZATION_GRANTED'
  | 'AUTHORIZATION_DENIED'
  | 'PRIVACY_TRANSFORMATION_APPLIED'
  | 'INTEGRITY_VERIFIED'
  | 'INTEGRITY_FAILURE_DETECTED'
  | 'EXECUTION_STARTED'
  | 'EXECUTION_COMPLETED'
  | 'VERIFICATION_FAILED'
  | 'VERIFICATION_COMPLETED'
  | 'ASSURANCE_DEGRADED'
  | 'ASSURANCE_COMPROMISED'
  | 'ASSURANCE_RESTORED';

export interface StateDeltaRecord {
  entity_type: 'DATA_PROVIDER' | 'INSTITUTION' | 'DEPENDENCY' | 'INFRASTRUCTURE_NODE' | 'AI_MODEL' | 'ASSET' | 'SYSTEM_CONTROL';
  entity_id: string;
  field: string;
  previous_value: any;
  new_value: any;
}

export interface AuthoritativeEvent {
  event_id: string;
  tick: number;
  simulation_timestamp: string;
  event_type: AuthoritativeEventType;
  severity: 'INFO' | 'WARNING' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  source_entity_id: string;
  target_entity_id?: string;
  parent_event_id?: string | null;
  causal_chain_id: string;
  state_deltas: StateDeltaRecord[];
  causal_narrative: string;
  systemic_impact: {
    control_margin_delta: number;
    stability_delta: number;
  };
}

export interface ReplayFrame {
  tick: number;
  virtual_timestamp: string;
  scenario_id: string;
  state_hash: string;
  control_margin_percent: number;
  overall_status: SystemSemanticStatus;
  active_incident_id: string | null;
  events_count: number;
  summary: string;
}

export type ScenarioId = 
  | 'SCENARIO_A'  // Common Data Dependency Failure (DATA-X)
  | 'SCENARIO_B'  // Shared Infrastructure Failure (RTGS / CCP)
  | 'SCENARIO_C'  // Incomplete Intervention & Residual Impact
  | 'SCENARIO_D'; // Collective Decision Convergence (Herding & Diversity Collapse)

export interface ScenarioDescriptor {
  scenario_id: ScenarioId;
  name: string;
  short_code: string;
  category: string;
  root_cause: string;
  description: string;
  primary_target: string;
  expected_min_control_margin: number;
  stages_count: number;
}

export type OperationLifecycleStatus = 
  | 'IDLE' 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'PARTIAL' 
  | 'REASSESSMENT_REQUIRED';

export type OperationType = 
  | 'SCENARIO_INJECTION'
  | 'SIMULATION_STEP'
  | 'INTERVENTION_PROPOSAL'
  | 'INTERVENTION_EXECUTION'
  | 'SIMULATION_RESET'
  | 'REPLAY_SCRUB'
  | 'INTEGRITY_VERIFICATION';

export interface OperationTelemetry {
  operation_id: string;
  operation_type: OperationType;
  status: OperationLifecycleStatus;
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
  data_truth_label: 'IMPLEMENTED' | 'DERIVED' | 'SIMULATED' | 'EXPERIMENTAL' | 'CALIBRATED' | 'ARCHITECTED' | 'IBM_INTEGRATED';
}

