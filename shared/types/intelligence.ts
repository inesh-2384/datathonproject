/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEMIC INTELLIGENCE SCHEMAS (PHASE 3)
 * Strongly typed schemas for systemic intelligence, controllability reasoning,
 * effective decision diversity, uncertainty representation, and ablation baselines.
 * 
 * Rules:
 * 1. Strict Data Truth: Explicitly labeled as DERIVED, SIMULATED, or EXPERIMENTAL.
 * 2. No black-box AI scores: Every metric is mathematically or structurally grounded.
 * 3. Supports evidence provenance and model versioning.
 */

import { SystemSemanticStatus } from './domain';

export type IntelligenceTruthStatus = 
  | 'DERIVED'       // Computed directly from graph topology or state
  | 'SIMULATED'     // Derived within the controlled simulation environment
  | 'EXPERIMENTAL'; // Research heuristic (e.g. Effective Decision Diversity)

export type ControllabilityState =
  | 'CONTROL_STABLE'
  | 'CONTROL_DEGRADING'
  | 'CONTROL_CRITICAL'
  | 'CONTROL_COLLAPSING'
  | 'CONTROL_RECOVERING'
  | 'CONTROL_RESTORED'
  | 'CONTROL_PARTIALLY_RESTORED'
  | 'CONTROL_NOT_RESTORED'
  | 'CONTROL_UNVERIFIED';

export type DependencyCriticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'CHOKEPOINT';
export type PropagationScope = 'LOCALIZED' | 'SYSTEMIC';

/**
 * Version tracking for all intelligence models to support reproducible benchmarking.
 */
export interface ModelVersionManifest {
  control_margin_model: string;         // e.g. 'CM-0.2'
  propagation_model: string;            // e.g. 'PROP-0.2'
  decision_diversity_model: string;     // e.g. 'EDD-0.1'
  concentration_model: string;          // e.g. 'HHI-0.1'
  evidence_evaluation_model: string;    // e.g. 'EVD-0.1'
}

/**
 * Dependency-level structural intelligence.
 */
export interface DependencyIntelligenceRecord {
  dependency_id: string;
  source_id: string;
  target_id: string;
  type: string;
  centrality_score: number;             // Relative degree centrality [0.0 - 1.0]
  affected_entity_count: number;        // Direct and indirect downstream entities
  systemic_reach_score: number;         // Normalized reach across the banking network [0.0 - 1.0]
  exposure_concentration_hhi: number;   // Herfindahl concentration of this dependency [0.0 - 1.0]
  redundancy_path_count: number;        // Alternative paths available if this rail fails
  current_health: number;               // Normalized health multiplier [0.0 - 1.0]
  propagation_contribution: number;     // Impact on current cascade severity [0.0 - 1.0]
  criticality: DependencyCriticality;
  is_chokepoint: boolean;
  truth_status: IntelligenceTruthStatus;
}

/**
 * Propagation characteristics across the network.
 */
export interface PropagationIntelligenceRecord {
  cascade_velocity_nodes_per_sec: number;
  maximum_depth_hops: number;
  breadth_affected_nodes: number;
  scope: PropagationScope;              // LOCALIZED vs SYSTEMIC
  active_transmission_paths: Array<{
    source_id: string;
    dependency_id: string;
    target_id: string;
    latency_ms: number;
  }>;
  acceleration_rate: number;            // Rate of new node degradation per tick
  persistence_ticks: number;            // Number of ticks cascade has been active
  truth_status: IntelligenceTruthStatus;
}

/**
 * Systemic concentration across four orthogonal dimensions.
 */
export interface SystemicConcentrationMetrics {
  data_concentration_hhi: number;          // Shared data oracle reliance [0.0 - 1.0]
  infrastructure_concentration_hhi: number; // Settlement / clearing rail concentration [0.0 - 1.0]
  model_concentration_hhi: number;         // Algorithmic / model architecture herding [0.0 - 1.0]
  dependency_exposure_hhi: number;         // Network-wide chokepoint concentration [0.0 - 1.0]
  composite_concentration_index: number;   // Weighted composite concentration [0.0 - 1.0]
  truth_status: IntelligenceTruthStatus;
}

export interface DiversityDecomposition {
  observed_raw_diversity: number;        // e.g. 0.78 (78%)
  common_data_penalty: number;           // e.g. 0.17 (17%)
  model_correlation_penalty: number;     // e.g. 0.12 (12%)
  temporal_synchrony_penalty: number;    // e.g. 0.08 (8%)
  net_effective_decision_diversity: number; // e.g. 0.41 (41%)
  explanatory_narrative: string;
}

/**
 * Collective Decision Intelligence & Effective Decision Diversity.
 * Research heuristic: Distinguishes apparent diversity from effective diversity.
 */
export interface CollectiveDecisionSignal {
  observed_model_diversity: number;        // Apparent vendor/model count diversity [0.0 - 1.0]
  effective_decision_diversity: number;    // Discounted for shared inputs, correlation, timing [0.0 - 1.0]
  decision_synchrony_percent: number;      // Temporal clustering of model outputs [0 - 100%]
  herding_correlation_index: number;       // Average pairwise recommendation correlation [0.0 - 1.0]
  recommendation_alignment: 'DIVERGENT' | 'CORRELATED' | 'CONVERGED_SYNCHRONIZED';
  common_input_oracle_id?: string;         // e.g. 'DATA-X'
  decomposition?: DiversityDecomposition;
  truth_status: IntelligenceTruthStatus;
}

/**
 * Mathematical Contribution Analysis of Control Margin M(t).
 * Explains exactly which factors altered M(t) relative to the baseline.
 */
export interface ControlMarginContribution {
  baseline_margin: number;                 // Pure equilibrium baseline (91%)
  delta_dependency_concentration: number;  // Negative impact of chokepoints and concentration
  delta_propagation_depth: number;         // Negative impact of multi-hop cascade
  delta_infrastructure_stress: number;     // Negative impact of settlement / clearing saturation
  delta_decision_convergence: number;      // Negative impact of herding and effective diversity drop
  delta_recovery_capacity: number;         // Positive impact of active isolation and reserves
  net_control_margin: number;              // Final M(t) [15 - 96%]
  primary_driver_category: string;
}

/**
 * Evidence quality and epistemic uncertainty assessment.
 */
export interface EvidenceQualityAssessment {
  observation_count: number;
  source_diversity_score: number;          // [0.0 - 1.0]
  average_freshness_seconds: number;
  evidence_sufficiency_score: number;      // [0.0 - 1.0]
  confidence_rating: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRYPTOGRAPHIC_PROOF';
  conflict_detected: boolean;
  conflict_description?: string;
  observation_gaps: string[];              // Entities with missing or stale telemetry
  truth_status: IntelligenceTruthStatus;
}

export interface InterventionWindowAssessment {
  estimated_window_ticks: number;
  estimated_window_seconds: number;
  trend: 'EXPANDING' | 'STABLE' | 'SHRINKING' | 'CRITICAL';
  primary_driver: string;
  secondary_driver: string;
  uncertainty_bounds_ticks: number;
}

/**
 * Complete Systemic Controllability Assessment.
 * Produced by Phase 3 intelligence engine on every tick.
 */
export interface SystemicControllabilityAssessment {
  assessment_id: string;
  tick: number;
  timestamp: string;
  controllability_state: ControllabilityState;
  control_margin_percent: number;
  estimated_intervention_window_sec: number; // Remaining time before controllability narrows
  
  // Phase 3 Core Research Invariants
  systemic_stress_index: number;            // [0.0 - 1.0] (Risk / Stress axis)
  control_capacity_index: number;           // [0.0 - 1.0] (Control capacity axis: Risk != Control)
  control_degradation_rate: number;         // Rate of margin change per tick (e.g. -8.4/tick)
  control_margin_trend: 'STABLE' | 'DEGRADING' | 'RAPIDLY_DEGRADING' | 'CRITICAL' | 'RECOVERING';

  // Structured Explanations & Lineage
  primary_driver: string;
  secondary_drivers: string[];
  amplifying_conditions: string[];
  protective_factors: string[];
  uncertainties: string[];
  causal_explanation_chain: string[];      // Dynamically assembled state-derived narrative

  // Intelligence Sub-records
  contributions: ControlMarginContribution;
  propagation_intelligence: PropagationIntelligenceRecord;
  concentration_metrics: SystemicConcentrationMetrics;
  collective_decision_signal: CollectiveDecisionSignal;
  evidence_quality: EvidenceQualityAssessment;
  intervention_window: InterventionWindowAssessment;
  model_versions: ModelVersionManifest;
}

/**
 * Counterfactual simulation result (strictly non-mutating).
 */
export interface CounterfactualSimulationResult {
  hypothesis: string;
  target_entity_id: string;
  baseline_control_margin: number;
  counterfactual_control_margin: number;
  delta_margin: number;
  controllability_state: ControllabilityState;
  status: 'COUNTERFACTUAL_SIMULATION';
  executed: false;
  narrative: string;
}

/**
 * Component Ablation evaluation result (strictly non-mutating).
 */
export interface AblationEvaluationResult {
  active_tier: BaselineTier;
  full_model_margin: number;
  ablations: Array<{
    feature: string;
    margin_without_feature: number;
    delta_points: number;
    relative_importance: number;
  }>;
  most_critical_factor: string;
}

/**
 * Entity-level controllability intelligence.
 */
export interface EntityControllabilityIntelligence {
  entity_id: string;
  name: string;
  entity_type: string;
  centrality_score: number;
  institutions_affected_count: number;
  common_information_exposure_pct: number;
  propagation_contribution_score: number;
  control_impact_score: number;
  evidence_freshness_sec: number;
  confidence_score: number;
  truth_status: IntelligenceTruthStatus;
}

/**
 * Experimental Ablation Baseline Tiers (for Phase 7 Benchmarking Preparation).
 */
export type BaselineTier = 
  | 'B0' // Raw Monitoring (thresholds only, no graph topology)
  | 'B1' // Simple Component Thresholds
  | 'B2' // Dependency-Aware Monitoring
  | 'B3' // Propagation-Aware Monitoring
  | 'B4' // Dependency + Propagation + Collective Decision Signals
  | 'B5'; // Full Systemic Controllability Assessment (FIS)

export interface AblationConfig {
  active_tier: BaselineTier;
  enable_dependency_intelligence: boolean;
  enable_propagation_intelligence: boolean;
  enable_collective_decision_signal: boolean;
  enable_uncertainty_gating: boolean;
}

