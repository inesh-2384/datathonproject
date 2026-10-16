/**
 * FINANCIAL IMMUNE SYSTEM - CONTROL FOUNDRY DOMAIN CONTRACT (PHASE 4)
 * Sections 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 30: Canonical Governed Operational Control Model
 * 
 * Semantic Invariants:
 * - Risk != Control
 * - Hazard != Priority
 * - Recommendation != Authorization
 * - Authorization != Execution
 * - Execution != Confirmation
 * - Observation != Interpretation
 * - Intervention != Outcome
 * - Recovery signal != Verified restoration
 * - Simulation != Real-world evidence
 * - Prototype metric != Empirically validated metric
 */

import { UserRole } from './roles';
import { SystemSemanticStatus } from './domain';

export type FoundryInterventionType =
  | 'NO_ACTION'                   // Mandatory counterfactual baseline
  | 'DEPENDENCY_ISOLATION'       // Isolate degraded shared rail/oracle
  | 'EXPOSURE_REDUCTION'          // Bilateral limit haircut & risk throttling
  | 'MODEL_DIVERSIFICATION'      // Fallback from converged models to rule execution
  | 'DATA_QUARANTINE'            // Quarantine corrupted feed records & clear cache
  | 'TEMPORAL_STAGGERING'        // Stagger execution timing to break synchrony
  | 'INFRASTRUCTURE_ISOLATION'   // Disconnect failing infrastructure node
  | 'LIQUIDITY_BUFFER'           // Emergency liquidity reserve deployment
  | 'SELECTIVE_SUSPENSION'       // Selectively suspend high-velocity trading channels
  | 'HUMAN_ESCALATION';          // Regulatory supervisor escalation for liquidity backstop

export type DisruptionLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC';
export type ReversibilityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'IRREVERSIBLE';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRYPTOGRAPHIC_PROOF';

/**
 * Section 4: Canonical 22-State Intervention Lifecycle State Machine
 */
export type InterventionLifecycleState =
  | 'CANDIDATE'
  | 'RECOMMENDED'
  | 'AUTHORITY_REQUIRED'
  | 'AUTHORIZATION_PENDING'
  | 'AUTHORIZED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'EXECUTION_PENDING'
  | 'EXECUTING'
  | 'EXECUTED'
  | 'EXECUTION_FAILED'
  | 'OBSERVATION_PENDING'
  | 'OBSERVED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED_EFFECTIVE'
  | 'VERIFIED_PARTIAL'
  | 'VERIFIED_FAILED'
  | 'VERIFIED_UNCERTAIN'
  | 'REASSESSMENT_REQUIRED'
  | 'REASSESSED'
  | 'ROLLED_BACK'
  | 'ROLLBACK_FAILED';

export type CandidateStatus = InterventionLifecycleState;

export type VerificationResultType =
  | 'VERIFIED_EFFECTIVE'
  | 'VERIFIED_PARTIAL'
  | 'VERIFIED_FAILED'
  | 'VERIFIED_UNCERTAIN';

export type ObservedOutcomeType =
  | 'EVENT_OBSERVED'
  | 'NON_EVENT_OBSERVED'
  | 'INTERVENTION_CONDITIONED_NON_EVENT'
  | 'OBSERVATION_GAP'
  | 'RESIDUAL_HAZARD'
  | 'CONFLICTED'
  | 'UNRESOLVED'
  | 'CONTROL_RESTORED'
  | 'CONTROL_PARTIALLY_RESTORED'
  | 'CONTROL_NOT_RESTORED'
  | 'CONTROL_UNVERIFIED'
  | 'CONTROL_DEGRADED';

/**
 * Section 5: Canonical Intervention Model
 */
export interface InterventionCandidate {
  id: string;                                // e.g. "CAND-01-DEP-ISO"
  incident_id: string;                       // e.g. "RN-2026-0041"
  type: FoundryInterventionType;
  title: string;
  description: string;
  target_entities: string[];                 // Node IDs (e.g. ["DATA-X", "BANK-A"])
  target_dependencies: string[];             // Dependency IDs (e.g. ["DEP_DATA_X_BANK_A"])
  trigger_condition: string;
  expected_effect: string;
  expected_control_margin_delta: number;     // e.g. +38% or -16% (No Action)
  estimated_disruption: DisruptionLevel;
  estimated_disruption_cost_score: number;   // 0-100 scale
  estimated_cost_usd_m: number;              // Estimated operational cost in millions
  estimated_latency_sec: number;             // Expected execution delay
  reversibility: ReversibilityLevel;
  collateral_exposure_pct: number;
  authority_required: UserRole;              // Minimum role required for authorization
  evidence_required: string[];               // Evidence types required prior to execution
  confidence: ConfidenceLevel;
  uncertainty?: number;                      // 0.0 - 1.0 scale
  risk_if_executed?: string;                 // Consequence of intervention
  risk_if_not_executed?: string;             // Consequence of doing nothing
  execution_capability?: 'AVAILABLE' | 'DEGRADED' | 'UNAVAILABLE';
  is_minimum_effective: boolean;
  status: InterventionLifecycleState;
  scientific_truth_label: 'SIMULATED' | 'EXPERIMENTAL';
  assurance_eligibility?: 'ELIGIBLE' | 'BLOCKED';
  assurance_blocked_reason?: string;
  privacy_impact?: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence_sufficiency?: 'SUFFICIENT' | 'MARGINAL' | 'INSUFFICIENT';
  verification_available?: boolean;
}

export type InterventionRecord = InterventionCandidate;

export interface CounterfactualEvaluation {
  candidate_id: string;
  candidate_title: string;
  candidate_type: FoundryInterventionType;
  projected_control_margin: number;          // Expected net M(t) after intervention
  projected_propagation_depth: number;       // In hops
  projected_affected_nodes: number;          // Total node count
  projected_diversity_score: number;         // EDD post-intervention
  projected_stability_index: number;         // 0.0 - 1.0
  residual_risk_hazard: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
  comparison_vs_no_action: {
    control_margin_delta: number;            // +pts compared to doing nothing
    propagation_hops_prevented: number;
    affected_nodes_saved: number;
    intervention_time_advantage_sec: number;
  };
  feasibility_assessment: {
    within_disruption_budget: boolean;
    reversibility_acceptable: boolean;
    intervention_window_open: boolean;
  };
  assurance_assessment?: {
    evidence_sufficient: boolean;
    evidence_fresh: boolean;
    authority_available: boolean;
    privacy_compliant: boolean;
    verification_ready: boolean;
    eligibility: 'ELIGIBLE' | 'BLOCKED';
    blocked_reason?: string;
  };
}

export interface InterventionConstraint {
  max_disruption_budget_pct: number;         // e.g. 50%
  min_control_restoration_pct: number;       // e.g. 65% minimum target
  max_latency_sec: number;                   // e.g. 45 sec
  max_collateral_exposure_pct: number;       // e.g. 30%
  required_reversibility: ReversibilityLevel;
}

export interface InterventionWindow {
  window_id: string;
  status: 'OPEN' | 'CLOSING' | 'EXPIRED';
  remaining_seconds: number;
  degradation_rate_pts_per_sec: number;
  unrecoverable_horizon_timestamp: string;
  truth_status: 'SIMULATED_VARIABLE';
}

export interface InterventionRecommendation {
  recommended_candidate_id: string;
  recommendation_timestamp: string;
  why_selected: string;
  justification_drivers: string[];
  counterfactual_summary: string;
  minimum_effective_score: number;          // Weighted composite of restoration vs disruption
  policy_compliance_status: 'COMPLIANT' | 'OVERRIDE_REQUIRED' | 'NON_COMPLIANT';
  risk_if_not_executed: string;
  evidence_refs: string[];
}

export interface AuthorizationRequest {
  request_id: string;
  candidate_id: string;
  incident_id: string;
  requester_user_id: string;
  requester_role: UserRole;
  required_role: UserRole;
  requested_at: string;
  expires_at: string;
  policy_eval_result: {
    role_authorized: boolean;
    window_active: boolean;
    evidence_sufficient: boolean;
    reasons: string[];
  };
}

export interface AuthorizationDecision {
  decision_id: string;
  request_id: string;
  candidate_id: string;
  decision: 'AUTHORIZED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
  decided_by_user_id: string;
  decided_by_role: UserRole;
  decided_at: string;
  expires_at: string;
  justification_notes: string;
  cryptographic_seal_sha256: string;         // Tamper-evident authorization token
}

export interface ExecutionRecord {
  execution_id: string;
  candidate_id: string;
  authorization_id: string;
  idempotency_key?: string;
  executed_by_role: UserRole;
  executed_by_user_id: string;
  status: 'QUEUED' | 'VALIDATING' | 'EXECUTING' | 'EXECUTED' | 'EXECUTION_FAILED';
  dispatched_at: string;
  completed_at?: string;
  execution_latency_ms: number;
  telemetry_receipt_digest_sha256: string;
  state_deltas_applied_count: number;
  technical_error?: string;
}

/**
 * Section 12 & 13: Independent Observation Record (Logical separation from executor)
 */
export interface IndependentObservationRecord {
  observation_id: string;
  execution_id: string;
  candidate_id: string;
  observed_at: string;
  observed_control_margin: number;
  observed_propagation_depth: number;
  observed_affected_nodes: number;
  observed_diversity: number;
  residual_threats_observed: string[];
  evidence_freshness_sec: number;
  has_conflicting_telemetry: boolean;
  raw_telemetry_digest_sha256: string;
}

/**
 * Control Restoration Proof (CRP) - Evidence-Backed Restoration Assessment Types
 */
export type RestorationAssessmentState =
  | 'VERIFIED_RESTORATION'
  | 'PARTIALLY_RESTORED'
  | 'CONTROL_NOT_RESTORED'
  | 'RESTORATION_UNRESOLVED';

export type RestorationAttribution =
  | 'SUPPORTED'
  | 'PLAUSIBLE'
  | 'WEAKLY_SUPPORTED'
  | 'UNRESOLVED';

export interface ResidualCriticalPath {
  path_id: string;
  vector: string;
  active_threat: string;
}

export interface RestorationAssessment {
  assessment_id: string;
  incident_id: string;
  intervention_id: string;
  execution_id: string;
  expected_response: {
    expected_margin_min: number;
    expected_margin_target: number;
    expected_propagation_depth_max: number;
  };
  observed_response: {
    observed_margin: number;
    observed_propagation_depth: number;
    observed_affected_nodes: number;
  };
  discrepancy: {
    margin_discrepancy: number; // observed - expected_target
    propagation_depth_exceeded: boolean;
  };
  residual_critical_paths: ResidualCriticalPath[];
  evidence_status: {
    freshness: 'FRESH' | 'AGING' | 'STALE' | 'EXPIRED' | 'UNKNOWN';
    is_conflicted: boolean;
    evidence_record_ids: string[];
    telemetry_digest_sha256: string;
  };
  alternative_explanation: string;
  attribution: RestorationAttribution;
  restoration_state: RestorationAssessmentState;
  reassessment_required: boolean;
  assessed_at: string;
}

export interface VerificationRecord {
  verification_id: string;
  execution_id: string;
  observation_id: string;
  candidate_id: string;
  verifier_subsystem: 'INDEPENDENT_ENCLAVE_VERIFIER';
  verified_at: string;
  observed_outcome: ObservedOutcomeType;
  verification_result: VerificationResultType;
  expected_effect: {
    expected_margin_min: number;
    expected_margin_target: number;
    expected_propagation_depth_max: number;
  };
  observed_effect: {
    observed_margin: number;
    observed_propagation_depth: number;
    observed_affected_nodes: number;
  };
  pre_intervention_margin: number;
  post_intervention_margin: number;
  expected_margin: number;
  margin_discrepancy: number;                // post - expected
  causal_attribution: 'CONFIRMED_DIRECT' | 'PROBABLE' | 'UNVERIFIED_COINCIDENCE' | 'FAILED_RECOVERY';
  residual_contagion_detected: boolean;
  evidence_freshness_status: 'FRESH' | 'STALE' | 'CONFLICTED' | 'INSUFFICIENT';
  evidence_record_ids: string[];
  verification_report: string;
  restoration_confidence_rating: ConfidenceLevel;
  restoration_assessment?: RestorationAssessment;
}

export interface ReassessmentRecord {
  reassessment_id: string;
  triggered_by: 'VERIFICATION_FAILURE' | 'VERIFIED_PARTIAL' | 'RESIDUAL_HAZARD' | 'OUTCOME_CONFLICTED' | 'EVIDENCE_STALE' | 'VERIFIED_EFFECTIVE' | 'MANUAL_OPERATOR';
  previous_intervention_id: string;
  pre_reassessment_margin: number;
  post_reassessment_margin: number;
  residual_threat_vector: string;
  recommended_escalation: string;
  escalated_candidate_id: string;
  reassessment_timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

/**
 * Section 30: Rollback Record for Reversible Interventions
 */
export interface RollbackRecord {
  rollback_id: string;
  intervention_id: string;
  requested_by: string;
  authorized_by: string;
  status: 'ROLLBACK_AVAILABLE' | 'ROLLBACK_REQUESTED' | 'ROLLBACK_AUTHORIZED' | 'ROLLBACK_EXECUTING' | 'ROLLBACK_COMPLETED' | 'ROLLBACK_FAILED';
  deltas_reverted_count: number;
  timestamp: string;
  justification: string;
}

export interface AuditTrailEvent {
  audit_id: string;
  timestamp: string;
  event_type: string;
  actor_role: string;
  actor_id: string;
  lifecycle_state: InterventionLifecycleState;
  intervention_id: string;
  details: string;
  evidence_digest?: string;
}

export interface FoundryWorkspaceState {
  is_available: boolean;                     // Available when active threat degrades control
  active_incident_id: string | null;
  lifecycle_state: InterventionLifecycleState;
  intervention_window: InterventionWindow;
  constraints: InterventionConstraint;
  candidates: InterventionCandidate[];
  evaluations: Record<string, CounterfactualEvaluation>;
  recommendation: InterventionRecommendation | null;
  active_authorization_request: AuthorizationRequest | null;
  active_authorization_decision: AuthorizationDecision | null;
  authorization_history: AuthorizationDecision[];
  latest_execution: ExecutionRecord | null;
  latest_observation: IndependentObservationRecord | null;
  latest_verification: VerificationRecord | null;
  active_reassessment: ReassessmentRecord | null;
  active_rollback: RollbackRecord | null;
  audit_trail: AuditTrailEvent[];
  last_updated_at: string;
}
