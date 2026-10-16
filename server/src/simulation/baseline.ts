/**
 * FINANCIAL IMMUNE SYSTEM - AUTHORITATIVE BASELINE ECOSYSTEM
 * Aligned with Reference Image Panels 2, 3, 4, 12, 14
 * 
 * Strict Data Truth:
 * - Institutions & Nodes: Exact entities from reference (DATA-X, BANK-A..D, INFRA-1..2, etc.)
 * - Normal Baseline: 20 Institutions, 102 Dependencies, 842 events/sec, 0 Incidents, Control Margin 91
 * - Attack State: Scenario 'Common Data Dependency Attack' (RN-2026-0041, DATA-X compromised, Control Margin 34)
 */

import { 
  Institution, 
  Asset, 
  Dependency, 
  AIModel, 
  DataProvider, 
  InfrastructureNode, 
  Incident, 
  SystemControlState, 
  EvidenceRecord,
  SystemicEvent,
  DecisionEvent
} from '../../../shared/types/domain';

export const BASELINE_DATA_PROVIDERS: DataProvider[] = [
  {
    provider_id: 'DATA-X',
    name: 'DATA-X Common Information Provider',
    feed_type: 'INFORMATION_PROVIDER',
    institutions_served: ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'],
    dependencies_count: 12,
    affected_nodes_count: 8,
    evidence_signals_count: 6,
    criticality: 'HIGH',
    latency_ms: 1.4,
    status: 'STABLE', // Normal state; transitions to COMPROMISED during attack
    updated_at: '2026-10-08T14:20:12Z',
    location: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 }
  },
  {
    provider_id: 'PROV_BLOOMBERG_BPIPE',
    name: 'B-PIPE High-Speed Market Feed',
    feed_type: 'ORDER_BOOK',
    institutions_served: ['BANK-A', 'BANK-B', 'GCCB-US'],
    dependencies_count: 8,
    affected_nodes_count: 3,
    evidence_signals_count: 4,
    criticality: 'MEDIUM',
    latency_ms: 2.1,
    status: 'STABLE',
    updated_at: '2026-10-08T14:20:12Z',
    location: { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 }
  }
];

export const BASELINE_INSTITUTIONS: Institution[] = [
  {
    institution_id: 'BANK-A',
    name: 'Atlantic Tier-1 Commercial Bank (BANK-A)',
    code: 'BANK-A',
    tier: 'G_SIB',
    location: { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    status: 'STABLE',
    capital_adequacy_ratio: 15.4,
    liquidity_coverage_ratio: 136.2,
    systemic_footprint_score: 0.92,
    connected_dependencies: ['DEP_DATA_X_BANK_A', 'DEP_BANK_A_BANK_B'],
    active_ai_models: ['MODEL-A', 'MODEL-C'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'BANK-B',
    name: 'European Settlement & Clearing Corp (BANK-B)',
    code: 'BANK-B',
    tier: 'G_SIB',
    location: { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    status: 'STABLE',
    capital_adequacy_ratio: 16.1,
    liquidity_coverage_ratio: 142.0,
    systemic_footprint_score: 0.89,
    connected_dependencies: ['DEP_DATA_X_BANK_B', 'DEP_BANK_A_BANK_B', 'DEP_BANK_B_BANK_C'],
    active_ai_models: ['MODEL-A'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'BANK-C',
    name: 'Rhine Interbank Liquidity AG (BANK-C)',
    code: 'BANK-C',
    tier: 'G_SIB',
    location: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    status: 'STABLE',
    capital_adequacy_ratio: 16.8,
    liquidity_coverage_ratio: 148.5,
    systemic_footprint_score: 0.85,
    connected_dependencies: ['DEP_DATA_X_BANK_C', 'DEP_BANK_B_BANK_C'],
    active_ai_models: ['MODEL-C'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'BANK-D',
    name: 'Pacific Core Clearing Trust (BANK-D)',
    code: 'BANK-D',
    tier: 'TIER_1_CLEARING',
    location: { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    status: 'STABLE',
    capital_adequacy_ratio: 14.8,
    liquidity_coverage_ratio: 131.0,
    systemic_footprint_score: 0.81,
    connected_dependencies: ['DEP_DATA_X_BANK_D'],
    active_ai_models: ['MODEL-C'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'GCCB-US',
    name: 'Gotham Central Clearing Bank',
    code: 'GCCB-US',
    tier: 'G_SIB',
    location: { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    status: 'STABLE',
    capital_adequacy_ratio: 14.2,
    liquidity_coverage_ratio: 128.5,
    systemic_footprint_score: 0.94,
    connected_dependencies: ['DEP_GCCB_TISC'],
    active_ai_models: ['MODEL-A'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'TISC-UK',
    name: 'Thames Interbank Settlement Corp',
    code: 'TISC-UK',
    tier: 'G_SIB',
    location: { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    status: 'STABLE',
    capital_adequacy_ratio: 15.1,
    liquidity_coverage_ratio: 134.0,
    systemic_footprint_score: 0.91,
    connected_dependencies: ['DEP_GCCB_TISC'],
    active_ai_models: ['MODEL-A'],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'MICC-SG',
    name: 'Merlion Intercontinental Clearing',
    code: 'MICC-SG',
    tier: 'TIER_1_CLEARING',
    location: { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    status: 'STABLE',
    capital_adequacy_ratio: 17.8,
    liquidity_coverage_ratio: 156.2,
    systemic_footprint_score: 0.81,
    connected_dependencies: [],
    active_ai_models: [],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    institution_id: 'VHFR-HK',
    name: 'Victoria Harbor Financial Repository',
    code: 'VHFR-HK',
    tier: 'TIER_1_CLEARING',
    location: { city: 'Hong Kong', country: 'Hong Kong SAR', lat: 22.3193, lng: 114.1694 },
    status: 'STABLE',
    capital_adequacy_ratio: 14.5,
    liquidity_coverage_ratio: 125.0,
    systemic_footprint_score: 0.83,
    connected_dependencies: [],
    active_ai_models: [],
    last_stress_test_timestamp: '2026-10-08T14:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-08T14:20:12Z'
  }
];

export const BASELINE_DEPENDENCIES: Dependency[] = [
  {
    dependency_id: 'DEP_DATA_X_BANK_A',
    source_id: 'DATA-X',
    target_id: 'BANK-A',
    type: 'INFORMATION',
    exposure_weight: 0.94,
    latency_ms: 1.2,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.2,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_DATA_X_BANK_B',
    source_id: 'DATA-X',
    target_id: 'BANK-B',
    type: 'INFORMATION',
    exposure_weight: 0.91,
    latency_ms: 1.5,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.3,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_DATA_X_BANK_C',
    source_id: 'DATA-X',
    target_id: 'BANK-C',
    type: 'INFORMATION',
    exposure_weight: 0.88,
    latency_ms: 1.8,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_DATA_X_BANK_D',
    source_id: 'DATA-X',
    target_id: 'BANK-D',
    type: 'INFORMATION',
    exposure_weight: 0.85,
    latency_ms: 2.1,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_BANK_A_BANK_B',
    source_id: 'BANK-A',
    target_id: 'BANK-B',
    type: 'FINANCIAL',
    exposure_weight: 0.82,
    latency_ms: 34,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.6,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_BANK_B_BANK_C',
    source_id: 'BANK-B',
    target_id: 'BANK-C',
    type: 'FINANCIAL',
    exposure_weight: 0.79,
    latency_ms: 14,
    status: 'STABLE',
    is_chokepoint: false,
    telemetry_freshness_sec: 0.5,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_GCCB_TISC',
    source_id: 'GCCB-US',
    target_id: 'TISC-UK',
    type: 'LIQUIDITY_CREDIT_LINE',
    exposure_weight: 0.86,
    latency_ms: 38,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.8,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_INFRA_1_BANK_A',
    source_id: 'INFRA-1',
    target_id: 'BANK-A',
    type: 'CLEARING_SETTLEMENT',
    exposure_weight: 0.90,
    latency_ms: 18,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_INFRA_1_BANK_B',
    source_id: 'INFRA-1',
    target_id: 'BANK-B',
    type: 'CLEARING_SETTLEMENT',
    exposure_weight: 0.88,
    latency_ms: 12,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_INFRA_2_BANK_C',
    source_id: 'INFRA-2',
    target_id: 'BANK-C',
    type: 'CLEARING_SETTLEMENT',
    exposure_weight: 0.85,
    latency_ms: 22,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_INFRA_2_BANK_D',
    source_id: 'INFRA-2',
    target_id: 'BANK-D',
    type: 'CLEARING_SETTLEMENT',
    exposure_weight: 0.82,
    latency_ms: 25,
    status: 'STABLE',
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: '2026-10-08T14:20:12Z'
  },
  {
    dependency_id: 'DEP_MODEL_C_ASSET_17',
    source_id: 'MODEL-C',
    target_id: 'ASSET-17',
    type: 'SHARED_AI_ALGORITHM',
    exposure_weight: 0.89,
    latency_ms: 4,
    status: 'STABLE',
    is_chokepoint: false,
    telemetry_freshness_sec: 0.1,
    updated_at: '2026-10-08T14:20:12Z'
  }
];

export const BASELINE_AI_MODELS: AIModel[] = [
  {
    model_id: 'MODEL-A',
    name: 'Autonomous Alpha Order Routing (MODEL-A)',
    vendor_or_framework: 'PyTorch / OpenShift AI',
    decision_domain: 'ALGORITHMIC_EXECUTION',
    deployed_institutions: ['BANK-A', 'BANK-B', 'GCCB-US'],
    herd_correlation_risk: 0.82,
    effective_diversity_score: 0.23,
    attestation_hash: '0x8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e',
    status: 'STABLE',
    last_decision_timestamp: '2026-10-08T14:20:00Z'
  },
  {
    model_id: 'MODEL-C',
    name: 'Multi-Bank Liquidity Balancer (MODEL-C)',
    vendor_or_framework: 'Secure Enclave Model',
    decision_domain: 'LIQUIDITY_OPTIMIZATION',
    deployed_institutions: ['BANK-A', 'BANK-C', 'BANK-D'],
    herd_correlation_risk: 0.76,
    effective_diversity_score: 0.28,
    attestation_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    status: 'STABLE',
    last_decision_timestamp: '2026-10-08T14:20:00Z'
  }
];

export const BASELINE_ASSETS: Asset[] = [
  {
    asset_id: 'ASSET-17',
    name: 'Synthetic Credit Benchmark ASSET-17',
    symbol: 'ASSET-17',
    asset_class: 'SYNTHETIC_CREDIT',
    valuation_usd_bn: 3240.0,
    liquidity_depth_score: 0.89,
    systemic_exposure_index: 0.94,
    primary_holder_institutions: ['BANK-A', 'BANK-B', 'BANK-C'],
    status: 'STABLE',
    updated_at: '2026-10-08T14:20:12Z'
  }
];

export const BASELINE_INFRASTRUCTURE: InfrastructureNode[] = [
  {
    node_id: 'INFRA-1',
    name: 'Global Real-Time Settlement Rail (INFRA-1)',
    category: 'RTGS_PAYMENT_SYSTEM',
    jurisdiction: 'GLOBAL',
    peak_throughput_tps: 14000,
    current_load_percent: 48.2,
    status: 'STABLE',
    last_heartbeat: '2026-10-08T14:20:10Z',
    location: { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 }
  },
  {
    node_id: 'INFRA-2',
    name: 'Cross-Border Clearing Hub (INFRA-2)',
    category: 'CENTRAL_COUNTERPARTY',
    jurisdiction: 'GLOBAL',
    peak_throughput_tps: 18000,
    current_load_percent: 54.1,
    status: 'STABLE',
    last_heartbeat: '2026-10-08T14:20:10Z',
    location: { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 }
  },
  {
    node_id: 'MARKET-1',
    name: 'Primary Sovereign Rates Venue (MARKET-1)',
    category: 'MARKET_VENUE',
    jurisdiction: 'US/EU',
    peak_throughput_tps: 22000,
    current_load_percent: 61.0,
    status: 'STABLE',
    last_heartbeat: '2026-10-08T14:20:10Z',
    location: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 }
  }
];

/**
 * NORMAL BASELINE CONTROL STATE (Reference Image Panel 2)
 */
export const NORMAL_CONTROL_STATE: SystemControlState = {
  overall_status: 'STABLE',
  control_margin_percent: 91, // 91 / 100
  control_margin_source: 'SIMULATED_VARIABLE',
  intervention_window_seconds: 3600, // safe horizon
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
};

/**
 * ATTACK TRIGGERED CONTROL STATE (Reference Image Panel 3, 4, 7)
 */
export const ATTACK_CONTROL_STATE: SystemControlState = {
  overall_status: 'CRITICAL',
  control_margin_percent: 34, // 34 / 100 CRITICAL
  control_margin_source: 'SIMULATED_VARIABLE',
  intervention_window_seconds: 41, // 41 sec window!
  active_threat_count: 1,
  system_stability_index: 0.42,
  effective_decision_diversity: 0.23, // Degrading -62%
  chokepoint_saturation: 0.88,
  ecosystem_institutions_count: 20,
  ecosystem_dependencies_count: 102,
  ecosystem_events_per_sec: 1480,
  active_incident_count: 1,
  key_metrics: {
    propagation_risk_pct: 84,
    decision_synchrony_pct: 88,
    model_concentration_pct: 82,
    infrastructure_dependency_pct: 76,
    evidence_sufficiency_pct: 87
  },
  last_evaluated_timestamp: '2026-10-08T14:24:05Z',
  active_incident_id: 'RN-2026-0041',
  scenario_name: 'Common Data Dependency Attack'
};

export const ATTACK_INCIDENT: Incident = {
  incident_id: 'RN-2026-0041',
  title: 'Common Information Provider Compromised (DATA-X)',
  status: 'ACTIVE',
  severity: 'HIGH',
  declared_at: '2026-10-08T14:24:05Z',
  root_cause_vector: 'Data integrity anomaly detected at DATA-X; corrupted price signals propagating across 4 Tier-1 institutions and triggering synchronized defensive margin withdrawal.',
  affected_node_ids: ['DATA-X', 'BANK-A', 'BANK-B', 'BANK-C', 'MODEL-A', 'INFRA-1', 'INFRA-2', 'MARKET-1'],
  affected_dependency_ids: ['DEP_DATA_X_BANK_A', 'DEP_DATA_X_BANK_B', 'DEP_DATA_X_BANK_C', 'DEP_BANK_A_BANK_B'],
  containment_margin_percent: 34,
  estimated_intervention_window_sec: 41,
  evidence_record_ids: ['EVID_2026_0041_01', 'EVID_2026_0041_02', 'EVID_2026_0041_03']
};

/**
 * REAL-TIME EVENT STREAM (Reference Image Panel 3 Table)
 */
export const ATTACK_REALTIME_EVENTS: DecisionEvent[] = [
  {
    event_id: 'EVT_01',
    timestamp: '14:24:05 UTC',
    source_entity_id: 'DATA-X',
    decision_type: 'DATA_INTEGRITY_ANOMALY',
    actor_role: 'Oracle Watchdog',
    confidence_score: 0.99,
    anomaly_score: 0.96,
    impact_projection: 0.88,
    rationale_summary: 'Data integrity anomaly detected; oracle stream signature mismatch.',
    severity: 'HIGH',
    status: 'COMPROMISED'
  },
  {
    event_id: 'EVT_02',
    timestamp: '14:24:06 UTC',
    source_entity_id: 'BANK-A',
    decision_type: 'INPUT_DISTRIBUTION_SHIFT',
    actor_role: 'Risk Engine',
    confidence_score: 0.94,
    anomaly_score: 0.84,
    impact_projection: 0.72,
    rationale_summary: 'Unusual model input detected; VaR boundary breach forecasted.',
    severity: 'HIGH',
    status: 'DEGRADING'
  },
  {
    event_id: 'EVT_03',
    timestamp: '14:24:07 UTC',
    source_entity_id: 'BANK-B',
    decision_type: 'MARGIN_CALL',
    actor_role: 'Clearing Algorithm',
    confidence_score: 0.91,
    anomaly_score: 0.81,
    impact_projection: 0.75,
    rationale_summary: 'Similar pattern detected; automated collateral buffers called.',
    severity: 'HIGH',
    status: 'DEGRADING'
  },
  {
    event_id: 'EVT_04',
    timestamp: '14:24:08 UTC',
    source_entity_id: 'MODEL-A',
    decision_type: 'LIQUIDITY_PULL',
    actor_role: 'Execution Agent',
    confidence_score: 0.96,
    anomaly_score: 0.89,
    impact_projection: 0.82,
    rationale_summary: 'Input distribution shift; automated withdrawal of cross-border line.',
    severity: 'HIGH',
    status: 'CRITICAL'
  },
  {
    event_id: 'EVT_05',
    timestamp: '14:24:10 UTC',
    source_entity_id: 'MARKET-1',
    decision_type: 'PRICE_MOVEMENT_DETECTED',
    actor_role: 'Venue Telemetry',
    confidence_score: 0.88,
    anomaly_score: 0.78,
    impact_projection: 0.79,
    rationale_summary: 'Price movement detected; bid-ask spread widened 42bps.',
    severity: 'HIGH',
    status: 'DEGRADING'
  }
];

/**
 * 9-STAGE EVIDENCE & ASSURANCE CHAIN (Reference Image Panel 14)
 */
export const BASELINE_EVIDENCE_CHAIN: EvidenceRecord[] = [
  {
    evidence_id: 'EVID_STEP_01',
    sequence_step: 1,
    title: 'Event Detection',
    incident_id: 'RN-2026-0041',
    timestamp: '14:24:05 UTC',
    entity_id: 'DATA-X',
    event_chain: ['EVT_01'],
    payload_digest_sha256: 'sha256:7c9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c',
    enclave_attested: true,
    lineage_summary: 'Data integrity anomaly telemetry captured by enclave oracle filter.',
    compliance_alignment: 'BCBS_239_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_02',
    sequence_step: 2,
    title: 'Data Corruption',
    incident_id: 'RN-2026-0041',
    timestamp: '14:24:06 UTC',
    entity_id: 'DATA-X',
    event_chain: ['EVT_01', 'EVT_02'],
    payload_digest_sha256: 'sha256:3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f',
    enclave_attested: true,
    lineage_summary: 'Payload hash desynchronization verified across 4 subscriber institutions.',
    compliance_alignment: 'DORA_ARTICLE_14_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_03',
    sequence_step: 3,
    title: 'Impact Assessment',
    incident_id: 'RN-2026-0041',
    timestamp: '14:24:08 UTC',
    entity_id: 'MODEL-A',
    event_chain: ['EVT_02', 'EVT_03', 'EVT_04'],
    payload_digest_sha256: 'sha256:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    enclave_attested: true,
    lineage_summary: 'Blast radius projected at 8/20 nodes with 37% systemic capital impact.',
    compliance_alignment: 'SEC_RULE_15C3_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_04',
    sequence_step: 4,
    title: 'Intervention Formulation',
    incident_id: 'RN-2026-0041',
    timestamp: '14:25:12 UTC',
    entity_id: 'CONTROL_FOUNDRY',
    event_chain: ['INT_CANDIDATE_01'],
    payload_digest_sha256: 'sha256:5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    enclave_attested: true,
    lineage_summary: 'Dependency Isolation formulated; estimated disruption budget 14%.',
    compliance_alignment: 'DORA_ARTICLE_14_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_05',
    sequence_step: 5,
    title: 'Authorization Multi-Sig',
    incident_id: 'RN-2026-0041',
    timestamp: '14:25:40 UTC',
    entity_id: 'AUTHORIZATION_BUS',
    event_chain: ['AUTH_SIG_01'],
    payload_digest_sha256: 'sha256:9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a',
    enclave_attested: true,
    lineage_summary: 'Dual-key cryptographic authorization signature confirmed by System Operator.',
    compliance_alignment: 'BCBS_239_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_06',
    sequence_step: 6,
    title: 'Execution Transmission',
    incident_id: 'RN-2026-0041',
    timestamp: '14:26:01 UTC',
    entity_id: 'DISPATCH_BUS',
    event_chain: ['EXEC_RECEIPT_01'],
    payload_digest_sha256: 'sha256:0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    enclave_attested: true,
    lineage_summary: 'Tamper-proof dispatch receipt confirmed across DATA-X and bank ingress rails.',
    compliance_alignment: 'DORA_ARTICLE_14_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_07',
    sequence_step: 7,
    title: 'Verification Observation',
    incident_id: 'RN-2026-0041',
    timestamp: '14:26:52 UTC',
    entity_id: 'INDEPENDENT_OBSERVER',
    event_chain: ['OBS_DELTA_01'],
    payload_digest_sha256: 'sha256:8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    enclave_attested: true,
    lineage_summary: 'Empirical telemetry sampled: Residual risk alert (propagation continuing via MODEL-C).',
    compliance_alignment: 'SEC_RULE_15C3_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_08',
    sequence_step: 8,
    title: 'Reassessment Update',
    incident_id: 'RN-2026-0041',
    timestamp: '14:28:10 UTC',
    entity_id: 'REASSESSMENT_ENGINE',
    event_chain: ['REASSESS_01'],
    payload_digest_sha256: 'sha256:4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
    enclave_attested: true,
    lineage_summary: 'Secondary intervention formulated: Infrastructure Isolation (INFRA-2).',
    compliance_alignment: 'BCBS_239_ALIGNED'
  },
  {
    evidence_id: 'EVID_STEP_09',
    sequence_step: 9,
    title: 'Verification Final',
    incident_id: 'RN-2026-0041',
    timestamp: '14:30:00 UTC',
    entity_id: 'VERIFICATION_CORE',
    event_chain: ['FINAL_RESTORE_01'],
    payload_digest_sha256: 'sha256:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    enclave_attested: true,
    lineage_summary: 'Full systemic stabilization verified: Control Margin restored to 91/100.',
    compliance_alignment: 'DORA_ARTICLE_14_ALIGNED'
  }
];
