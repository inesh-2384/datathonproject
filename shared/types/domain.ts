/**
 * FINANCIAL IMMUNE SYSTEM - CORE DOMAIN MODEL
 * Authoritative, strongly typed domain schemas.
 * 
 * Rules:
 * 1. Entities have stable, explicit IDs (institution_id, incident_id, etc.)
 * 2. Immutable typing across client, server, and simulation engine.
 * 3. Supports future IBM Z/LinuxONE enclave attestation.
 * 4. Strict Data Truth: Provenance vs Integrity conceptually separated.
 */

import { ControllabilityState, SystemicControllabilityAssessment } from './intelligence';
import { FoundryWorkspaceState } from './foundry';
import { AssuranceState, EvidenceFreshness, DataClassification } from './assurance';

export type EntityType = 
  | 'INSTITUTION'
  | 'ASSET'
  | 'DEPENDENCY'
  | 'AI_MODEL'
  | 'DATA_PROVIDER'
  | 'INFRASTRUCTURE_NODE'
  | 'MARKET_VENUE';

export type SystemSemanticStatus =
  | 'STABLE'
  | 'DEGRADING'
  | 'CRITICAL'
  | 'COLLAPSING'
  | 'RECOVERING'
  | 'RESTORED'
  | 'UNVERIFIED'
  | 'CONFLICTED'
  | 'OBSERVATION_GAP'
  | 'RESIDUAL_RISK'
  | 'COMPROMISED';

export type RegulatoryTier = 'G_SIB' | 'D_SIB' | 'TIER_1_CLEARING' | 'CRITICAL_INFRASTRUCTURE' | 'MARKET_PARTICIPANT';

export interface GeoLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Institution {
  institution_id: string;
  name: string;
  code: string;
  tier: RegulatoryTier;
  location: GeoLocation;
  status: SystemSemanticStatus;
  capital_adequacy_ratio: number;
  liquidity_coverage_ratio: number;
  systemic_footprint_score: number;
  connected_dependencies: string[];
  active_ai_models: string[];
  last_stress_test_timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  asset_id: string;
  name: string;
  symbol: string;
  asset_class: 'SOVEREIGN_DEBT' | 'INTERBANK_LIQUIDITY' | 'REPO_COLLATERAL' | 'EQUITY_INDEX' | 'SYNTHETIC_CREDIT';
  valuation_usd_bn: number;
  liquidity_depth_score: number;
  systemic_exposure_index: number;
  primary_holder_institutions: string[];
  status: SystemSemanticStatus;
  updated_at: string;
}

export type DependencyType = 
  | 'LIQUIDITY_CREDIT_LINE'
  | 'CLEARING_SETTLEMENT'
  | 'CROSS_HOLDING'
  | 'SHARED_AI_ALGORITHM'
  | 'DATA_FEED'
  | 'CLOUD_INFRASTRUCTURE'
  | 'FINANCIAL'
  | 'INFORMATION'
  | 'BEHAVIOURAL';

export interface Dependency {
  dependency_id: string;
  source_id: string;
  target_id: string;
  type: DependencyType;
  exposure_weight: number;
  latency_ms: number;
  status: SystemSemanticStatus;
  is_chokepoint: boolean;
  telemetry_freshness_sec: number;
  updated_at: string;
}

export interface AIModel {
  model_id: string;
  name: string;
  vendor_or_framework: string;
  decision_domain: 'ALGORITHMIC_EXECUTION' | 'LIQUIDITY_OPTIMIZATION' | 'RISK_SCORING' | 'MARKET_MAKING';
  deployed_institutions: string[];
  herd_correlation_risk: number;
  effective_diversity_score: number;
  attestation_hash: string;
  status: SystemSemanticStatus;
  last_decision_timestamp: string;
}

export interface DataProvider {
  provider_id: string;
  name: string;
  feed_type: 'ORDER_BOOK' | 'RATES_BENCHMARK' | 'MACRO_ORACLE' | 'CREDIT_DEFAULT_SPREADS' | 'INFORMATION_PROVIDER';
  institutions_served: string[];
  dependencies_count: number;
  affected_nodes_count: number;
  evidence_signals_count: number;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH';
  latency_ms: number;
  status: SystemSemanticStatus;
  updated_at: string;
  location?: GeoLocation;
}

export interface InfrastructureNode {
  node_id: string;
  name: string;
  category: 'RTGS_PAYMENT_SYSTEM' | 'CENTRAL_COUNTERPARTY' | 'SECURITIES_DEPOSITORY' | 'MAINFRAME_ENCLAVE' | 'MARKET_VENUE';
  jurisdiction: string;
  peak_throughput_tps: number;
  current_load_percent: number;
  status: SystemSemanticStatus;
  last_heartbeat: string;
  location?: GeoLocation;
}

export interface DecisionEvent {
  event_id: string;
  timestamp: string;
  source_entity_id: string;
  model_id?: string;
  actor_role: string;
  decision_type: 'LIQUIDITY_PULL' | 'MARGIN_CALL' | 'CORRELATION_UNWIND' | 'DATA_INTEGRITY_ANOMALY' | 'INPUT_DISTRIBUTION_SHIFT' | 'PRICE_MOVEMENT_DETECTED';
  confidence_score: number;
  anomaly_score: number;
  impact_projection: number;
  rationale_summary: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  status: SystemSemanticStatus;
}

export interface SystemicEvent {
  event_id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  event_type: 'DATA_CORRUPTION' | 'AI_HERD_LIQUIDITY_DRAIN' | 'CLEARING_COLLATERAL_DESYNC' | 'ORACLE_PRICE_DISPERSION';
  source_entity_id: string;
  impacted_entity_ids: string[];
  system_metric_deltas: {
    control_margin_delta: number;
    diversity_delta: number;
    stress_delta: number;
  };
  narrative: string;
  status: SystemSemanticStatus;
}

export interface Incident {
  incident_id: string;
  title: string;
  status: 'ACTIVE' | 'CONTAINING' | 'RESOLVED' | 'BASELINE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'SYSTEMIC_THREAT';
  declared_at: string;
  resolved_at?: string;
  root_cause_vector: string;
  affected_node_ids: string[];
  affected_dependency_ids: string[];
  containment_margin_percent: number;
  estimated_intervention_window_sec: number;
  evidence_record_ids: string[];
}

export interface PropagationState {
  propagation_id: string;
  incident_id: string;
  cascade_velocity_nodes_per_sec: number;
  depth_levels: number;
  cascade_probability: number;
  active_transmission_channels: DependencyType[];
  chokepoint_bottlenecks: string[];
  updated_at: string;
}

/**
 * System Control State - Authoritative Operational Metric Representation
 * Explicit Data Truth: 'control_margin_percent' is a deterministic simulation variable.
 * Methodology research belongs to Phase 2.
 */
export interface SystemControlState {
  overall_status: SystemSemanticStatus;
  control_margin_percent: number; // e.g. 91 (Normal) or 34 (Critical)
  control_margin_source: 'SIMULATED_VARIABLE'; // Explicitly marks as simulation variable
  intervention_window_seconds: number; // e.g. 41 sec
  active_threat_count: number;
  system_stability_index: number; // 0.0 - 1.0
  effective_decision_diversity: number; // e.g. 0.23
  chokepoint_saturation: number;
  ecosystem_institutions_count: number; // 20
  ecosystem_dependencies_count: number; // 102
  ecosystem_events_per_sec: number; // 842
  active_incident_count: number; // 0 or 1
  key_metrics: {
    propagation_risk_pct: number; // 12%
    decision_synchrony_pct: number; // 18%
    model_concentration_pct: number; // 22%
    infrastructure_dependency_pct: number; // 26%
    evidence_sufficiency_pct: number; // 94%
  };
  last_evaluated_timestamp: string;
  active_incident_id: string | null;
  scenario_name: string; // 'Normal State' | 'Common Data Dependency Attack'
  controllability_state?: ControllabilityState;
  intelligence?: SystemicControllabilityAssessment;
  foundry?: FoundryWorkspaceState;
  assurance?: AssuranceState;
}

export type InterventionType = 
  | 'DEPENDENCY_ISOLATION'
  | 'GLOBAL_SHUTDOWN'
  | 'BROAD_THROTTLE'
  | 'DATA_QUARANTINE'
  | 'MODEL_DIVERSIFICATION';

export type InterventionStatus = 
  | 'DRAFT'
  | 'PENDING_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'EXECUTING'
  | 'EXECUTED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'FAILED';

export interface InterventionCandidate {
  intervention_id: string;
  title: string;
  type: InterventionType;
  target: string;
  risk_after: number;
  control_after: number;
  disruption_budget_pct: number;
  execution_time_sec: number;
  is_recommended: boolean;
  status: InterventionStatus;
}

export interface Intervention {
  intervention_id: string;
  incident_id: string;
  title: string;
  type: InterventionType;
  target_entity_ids: string[];
  parameters: Record<string, any>;
  status: InterventionStatus;
  proposer_role: string;
  requested_at: string;
  authorized_at?: string;
  executed_at?: string;
  expected_control_margin_recovery: number;
}

export interface Authorization {
  authorization_id: string;
  intervention_id: string;
  required_roles: string[];
  approved_by_role: string;
  approved_by_user_id: string;
  timestamp: string;
  cryptographic_signature: string;
  consensus_threshold_met: boolean;
}

export interface Execution {
  execution_id: string;
  intervention_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CONFIRMATION_TIMEOUT';
  executed_at: string;
  telemetry_receipt_hash: string;
  execution_latency_ms: number;
}

export interface Verification {
  verification_id: string;
  intervention_id: string;
  status: 'VERIFIED' | 'RESIDUAL_RISK' | 'NOT_RESTORED' | 'UNVERIFIED';
  delta_control_margin: number;
  restoration_confidence_pct: number;
  verified_at: string;
  outcome_report: string;
}

/**
 * Tamper-Evident Evidence Record
 * Conceptual clarity: SHA-256 establishes payload integrity of the observation,
 * NOT empirical ground-truth of real-world macro reality.
 */
export interface EvidenceRecord {
  evidence_id: string;
  sequence_step: number;
  title: string;
  incident_id: string;
  timestamp: string;
  entity_id: string;
  event_chain: string[];
  payload_digest_sha256: string; // Explicit digest of recorded telemetry payload
  enclave_attested: boolean;
  lineage_summary: string;
  compliance_alignment: 'BCBS_239_ALIGNED' | 'DORA_ARTICLE_14_ALIGNED' | 'SEC_RULE_15C3_ALIGNED';
  freshness?: EvidenceFreshness;
  classification?: DataClassification;
  trace_id?: string;
  source_event_ids?: string[];
  input_state_hash?: string;
  confidence?: string;
  uncertainty?: string;
}
