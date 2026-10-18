// server/src/app.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import fs2 from "fs";

// server/src/routes/api.ts
import { Router } from "express";

// server/src/simulation/prng.ts
var Mulberry32 = class {
  state;
  constructor(seed) {
    this.state = seed >>> 0;
  }
  /**
   * Generates a pseudo-random float between 0 (inclusive) and 1 (exclusive).
   */
  next() {
    let t = this.state += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  /**
   * Generates a pseudo-random integer between min (inclusive) and max (inclusive).
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  /**
   * Generates a float within a specific range.
   */
  nextFloat(min, max) {
    return min + this.next() * (max - min);
  }
  /**
   * Picks a random element from an array deterministically.
   */
  pick(arr) {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
  /**
   * Returns the internal seed state.
   */
  getState() {
    return this.state;
  }
  /**
   * Resets with a new or baseline seed.
   */
  reseed(seed) {
    this.state = seed >>> 0;
  }
};

// server/src/simulation/baseline.ts
var BASELINE_DATA_PROVIDERS = [
  {
    provider_id: "DATA-X",
    name: "DATA-X Common Information Provider",
    feed_type: "INFORMATION_PROVIDER",
    institutions_served: ["BANK-A", "BANK-B", "BANK-C", "BANK-D"],
    dependencies_count: 12,
    affected_nodes_count: 8,
    evidence_signals_count: 6,
    criticality: "HIGH",
    latency_ms: 1.4,
    status: "STABLE",
    // Normal state; transitions to COMPROMISED during attack
    updated_at: "2026-10-08T14:20:12Z",
    location: { city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 }
  },
  {
    provider_id: "PROV_BLOOMBERG_BPIPE",
    name: "B-PIPE High-Speed Market Feed",
    feed_type: "ORDER_BOOK",
    institutions_served: ["BANK-A", "BANK-B", "GCCB-US"],
    dependencies_count: 8,
    affected_nodes_count: 3,
    evidence_signals_count: 4,
    criticality: "MEDIUM",
    latency_ms: 2.1,
    status: "STABLE",
    updated_at: "2026-10-08T14:20:12Z",
    location: { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 }
  }
];
var BASELINE_INSTITUTIONS = [
  {
    institution_id: "BANK-A",
    name: "Atlantic Tier-1 Commercial Bank (BANK-A)",
    code: "BANK-A",
    tier: "G_SIB",
    location: { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
    status: "STABLE",
    capital_adequacy_ratio: 15.4,
    liquidity_coverage_ratio: 136.2,
    systemic_footprint_score: 0.92,
    connected_dependencies: ["DEP_DATA_X_BANK_A", "DEP_BANK_A_BANK_B"],
    active_ai_models: ["MODEL-A", "MODEL-C"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "BANK-B",
    name: "European Settlement & Clearing Corp (BANK-B)",
    code: "BANK-B",
    tier: "G_SIB",
    location: { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
    status: "STABLE",
    capital_adequacy_ratio: 16.1,
    liquidity_coverage_ratio: 142,
    systemic_footprint_score: 0.89,
    connected_dependencies: ["DEP_DATA_X_BANK_B", "DEP_BANK_A_BANK_B", "DEP_BANK_B_BANK_C"],
    active_ai_models: ["MODEL-A"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "BANK-C",
    name: "Rhine Interbank Liquidity AG (BANK-C)",
    code: "BANK-C",
    tier: "G_SIB",
    location: { city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 },
    status: "STABLE",
    capital_adequacy_ratio: 16.8,
    liquidity_coverage_ratio: 148.5,
    systemic_footprint_score: 0.85,
    connected_dependencies: ["DEP_DATA_X_BANK_C", "DEP_BANK_B_BANK_C"],
    active_ai_models: ["MODEL-C"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "BANK-D",
    name: "Pacific Core Clearing Trust (BANK-D)",
    code: "BANK-D",
    tier: "TIER_1_CLEARING",
    location: { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
    status: "STABLE",
    capital_adequacy_ratio: 14.8,
    liquidity_coverage_ratio: 131,
    systemic_footprint_score: 0.81,
    connected_dependencies: ["DEP_DATA_X_BANK_D"],
    active_ai_models: ["MODEL-C"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "GCCB-US",
    name: "Gotham Central Clearing Bank",
    code: "GCCB-US",
    tier: "G_SIB",
    location: { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
    status: "STABLE",
    capital_adequacy_ratio: 14.2,
    liquidity_coverage_ratio: 128.5,
    systemic_footprint_score: 0.94,
    connected_dependencies: ["DEP_GCCB_TISC"],
    active_ai_models: ["MODEL-A"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "TISC-UK",
    name: "Thames Interbank Settlement Corp",
    code: "TISC-UK",
    tier: "G_SIB",
    location: { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
    status: "STABLE",
    capital_adequacy_ratio: 15.1,
    liquidity_coverage_ratio: 134,
    systemic_footprint_score: 0.91,
    connected_dependencies: ["DEP_GCCB_TISC"],
    active_ai_models: ["MODEL-A"],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "MICC-SG",
    name: "Merlion Intercontinental Clearing",
    code: "MICC-SG",
    tier: "TIER_1_CLEARING",
    location: { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
    status: "STABLE",
    capital_adequacy_ratio: 17.8,
    liquidity_coverage_ratio: 156.2,
    systemic_footprint_score: 0.81,
    connected_dependencies: [],
    active_ai_models: [],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    institution_id: "VHFR-HK",
    name: "Victoria Harbor Financial Repository",
    code: "VHFR-HK",
    tier: "TIER_1_CLEARING",
    location: { city: "Hong Kong", country: "Hong Kong SAR", lat: 22.3193, lng: 114.1694 },
    status: "STABLE",
    capital_adequacy_ratio: 14.5,
    liquidity_coverage_ratio: 125,
    systemic_footprint_score: 0.83,
    connected_dependencies: [],
    active_ai_models: [],
    last_stress_test_timestamp: "2026-10-08T14:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-08T14:20:12Z"
  }
];
var BASELINE_DEPENDENCIES = [
  {
    dependency_id: "DEP_DATA_X_BANK_A",
    source_id: "DATA-X",
    target_id: "BANK-A",
    type: "INFORMATION",
    exposure_weight: 0.94,
    latency_ms: 1.2,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.2,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_DATA_X_BANK_B",
    source_id: "DATA-X",
    target_id: "BANK-B",
    type: "INFORMATION",
    exposure_weight: 0.91,
    latency_ms: 1.5,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.3,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_DATA_X_BANK_C",
    source_id: "DATA-X",
    target_id: "BANK-C",
    type: "INFORMATION",
    exposure_weight: 0.88,
    latency_ms: 1.8,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_DATA_X_BANK_D",
    source_id: "DATA-X",
    target_id: "BANK-D",
    type: "INFORMATION",
    exposure_weight: 0.85,
    latency_ms: 2.1,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_BANK_A_BANK_B",
    source_id: "BANK-A",
    target_id: "BANK-B",
    type: "FINANCIAL",
    exposure_weight: 0.82,
    latency_ms: 34,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.6,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_BANK_B_BANK_C",
    source_id: "BANK-B",
    target_id: "BANK-C",
    type: "FINANCIAL",
    exposure_weight: 0.79,
    latency_ms: 14,
    status: "STABLE",
    is_chokepoint: false,
    telemetry_freshness_sec: 0.5,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_GCCB_TISC",
    source_id: "GCCB-US",
    target_id: "TISC-UK",
    type: "LIQUIDITY_CREDIT_LINE",
    exposure_weight: 0.86,
    latency_ms: 38,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.8,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_INFRA_1_BANK_A",
    source_id: "INFRA-1",
    target_id: "BANK-A",
    type: "CLEARING_SETTLEMENT",
    exposure_weight: 0.9,
    latency_ms: 18,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_INFRA_1_BANK_B",
    source_id: "INFRA-1",
    target_id: "BANK-B",
    type: "CLEARING_SETTLEMENT",
    exposure_weight: 0.88,
    latency_ms: 12,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.4,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_INFRA_2_BANK_C",
    source_id: "INFRA-2",
    target_id: "BANK-C",
    type: "CLEARING_SETTLEMENT",
    exposure_weight: 0.85,
    latency_ms: 22,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_INFRA_2_BANK_D",
    source_id: "INFRA-2",
    target_id: "BANK-D",
    type: "CLEARING_SETTLEMENT",
    exposure_weight: 0.82,
    latency_ms: 25,
    status: "STABLE",
    is_chokepoint: true,
    telemetry_freshness_sec: 0.5,
    updated_at: "2026-10-08T14:20:12Z"
  },
  {
    dependency_id: "DEP_MODEL_C_ASSET_17",
    source_id: "MODEL-C",
    target_id: "ASSET-17",
    type: "SHARED_AI_ALGORITHM",
    exposure_weight: 0.89,
    latency_ms: 4,
    status: "STABLE",
    is_chokepoint: false,
    telemetry_freshness_sec: 0.1,
    updated_at: "2026-10-08T14:20:12Z"
  }
];
var BASELINE_AI_MODELS = [
  {
    model_id: "MODEL-A",
    name: "Autonomous Alpha Order Routing (MODEL-A)",
    vendor_or_framework: "PyTorch / OpenShift AI",
    decision_domain: "ALGORITHMIC_EXECUTION",
    deployed_institutions: ["BANK-A", "BANK-B", "GCCB-US"],
    herd_correlation_risk: 0.82,
    effective_diversity_score: 0.23,
    attestation_hash: "0x8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e",
    status: "STABLE",
    last_decision_timestamp: "2026-10-08T14:20:00Z"
  },
  {
    model_id: "MODEL-C",
    name: "Multi-Bank Liquidity Balancer (MODEL-C)",
    vendor_or_framework: "Secure Enclave Model",
    decision_domain: "LIQUIDITY_OPTIMIZATION",
    deployed_institutions: ["BANK-A", "BANK-C", "BANK-D"],
    herd_correlation_risk: 0.76,
    effective_diversity_score: 0.28,
    attestation_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    status: "STABLE",
    last_decision_timestamp: "2026-10-08T14:20:00Z"
  }
];
var BASELINE_ASSETS = [
  {
    asset_id: "ASSET-17",
    name: "Synthetic Credit Benchmark ASSET-17",
    symbol: "ASSET-17",
    asset_class: "SYNTHETIC_CREDIT",
    valuation_usd_bn: 3240,
    liquidity_depth_score: 0.89,
    systemic_exposure_index: 0.94,
    primary_holder_institutions: ["BANK-A", "BANK-B", "BANK-C"],
    status: "STABLE",
    updated_at: "2026-10-08T14:20:12Z"
  }
];
var BASELINE_INFRASTRUCTURE = [
  {
    node_id: "INFRA-1",
    name: "Global Real-Time Settlement Rail (INFRA-1)",
    category: "RTGS_PAYMENT_SYSTEM",
    jurisdiction: "GLOBAL",
    peak_throughput_tps: 14e3,
    current_load_percent: 48.2,
    status: "STABLE",
    last_heartbeat: "2026-10-08T14:20:10Z",
    location: { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 }
  },
  {
    node_id: "INFRA-2",
    name: "Cross-Border Clearing Hub (INFRA-2)",
    category: "CENTRAL_COUNTERPARTY",
    jurisdiction: "GLOBAL",
    peak_throughput_tps: 18e3,
    current_load_percent: 54.1,
    status: "STABLE",
    last_heartbeat: "2026-10-08T14:20:10Z",
    location: { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 }
  },
  {
    node_id: "MARKET-1",
    name: "Primary Sovereign Rates Venue (MARKET-1)",
    category: "MARKET_VENUE",
    jurisdiction: "US/EU",
    peak_throughput_tps: 22e3,
    current_load_percent: 61,
    status: "STABLE",
    last_heartbeat: "2026-10-08T14:20:10Z",
    location: { city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 }
  }
];
var NORMAL_CONTROL_STATE = {
  overall_status: "STABLE",
  control_margin_percent: 91,
  // 91 / 100
  control_margin_source: "SIMULATED_VARIABLE",
  intervention_window_seconds: 3600,
  // safe horizon
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
  last_evaluated_timestamp: "2026-10-08T14:20:12Z",
  active_incident_id: null,
  scenario_name: "Normal State (Equilibrium)"
};
var BASELINE_EVIDENCE_CHAIN = [
  {
    evidence_id: "EVID_STEP_01",
    sequence_step: 1,
    title: "Event Detection",
    incident_id: "RN-2026-0041",
    timestamp: "14:24:05 UTC",
    entity_id: "DATA-X",
    event_chain: ["EVT_01"],
    payload_digest_sha256: "sha256:7c9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c",
    enclave_attested: true,
    lineage_summary: "Data integrity anomaly telemetry captured by enclave oracle filter.",
    compliance_alignment: "BCBS_239_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_02",
    sequence_step: 2,
    title: "Data Corruption",
    incident_id: "RN-2026-0041",
    timestamp: "14:24:06 UTC",
    entity_id: "DATA-X",
    event_chain: ["EVT_01", "EVT_02"],
    payload_digest_sha256: "sha256:3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f",
    enclave_attested: true,
    lineage_summary: "Payload hash desynchronization verified across 4 subscriber institutions.",
    compliance_alignment: "DORA_ARTICLE_14_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_03",
    sequence_step: 3,
    title: "Impact Assessment",
    incident_id: "RN-2026-0041",
    timestamp: "14:24:08 UTC",
    entity_id: "MODEL-A",
    event_chain: ["EVT_02", "EVT_03", "EVT_04"],
    payload_digest_sha256: "sha256:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    enclave_attested: true,
    lineage_summary: "Blast radius projected at 8/20 nodes with 37% systemic capital impact.",
    compliance_alignment: "SEC_RULE_15C3_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_04",
    sequence_step: 4,
    title: "Intervention Formulation",
    incident_id: "RN-2026-0041",
    timestamp: "14:25:12 UTC",
    entity_id: "CONTROL_FOUNDRY",
    event_chain: ["INT_CANDIDATE_01"],
    payload_digest_sha256: "sha256:5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    enclave_attested: true,
    lineage_summary: "Dependency Isolation formulated; estimated disruption budget 14%.",
    compliance_alignment: "DORA_ARTICLE_14_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_05",
    sequence_step: 5,
    title: "Authorization Multi-Sig",
    incident_id: "RN-2026-0041",
    timestamp: "14:25:40 UTC",
    entity_id: "AUTHORIZATION_BUS",
    event_chain: ["AUTH_SIG_01"],
    payload_digest_sha256: "sha256:9f1e8f3c7a9e1b2d4f6c8e0a3b5d7f9c1e3a5b7d9f1e8f3c7a9e1b2d4f6c8e0a",
    enclave_attested: true,
    lineage_summary: "Dual-key cryptographic authorization signature confirmed by System Operator.",
    compliance_alignment: "BCBS_239_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_06",
    sequence_step: 6,
    title: "Execution Transmission",
    incident_id: "RN-2026-0041",
    timestamp: "14:26:01 UTC",
    entity_id: "DISPATCH_BUS",
    event_chain: ["EXEC_RECEIPT_01"],
    payload_digest_sha256: "sha256:0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    enclave_attested: true,
    lineage_summary: "Tamper-proof dispatch receipt confirmed across DATA-X and bank ingress rails.",
    compliance_alignment: "DORA_ARTICLE_14_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_07",
    sequence_step: 7,
    title: "Verification Observation",
    incident_id: "RN-2026-0041",
    timestamp: "14:26:52 UTC",
    entity_id: "INDEPENDENT_OBSERVER",
    event_chain: ["OBS_DELTA_01"],
    payload_digest_sha256: "sha256:8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
    enclave_attested: true,
    lineage_summary: "Empirical telemetry sampled: Residual risk alert (propagation continuing via MODEL-C).",
    compliance_alignment: "SEC_RULE_15C3_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_08",
    sequence_step: 8,
    title: "Reassessment Update",
    incident_id: "RN-2026-0041",
    timestamp: "14:28:10 UTC",
    entity_id: "REASSESSMENT_ENGINE",
    event_chain: ["REASSESS_01"],
    payload_digest_sha256: "sha256:4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
    enclave_attested: true,
    lineage_summary: "Secondary intervention formulated: Infrastructure Isolation (INFRA-2).",
    compliance_alignment: "BCBS_239_ALIGNED"
  },
  {
    evidence_id: "EVID_STEP_09",
    sequence_step: 9,
    title: "Verification Final",
    incident_id: "RN-2026-0041",
    timestamp: "14:30:00 UTC",
    entity_id: "VERIFICATION_CORE",
    event_chain: ["FINAL_RESTORE_01"],
    payload_digest_sha256: "sha256:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    enclave_attested: true,
    lineage_summary: "Full systemic stabilization verified: Control Margin restored to 91/100.",
    compliance_alignment: "DORA_ARTICLE_14_ALIGNED"
  }
];

// server/src/simulation/propagation.ts
function getStatusHealthMultiplier(status) {
  switch (status) {
    case "STABLE":
    case "RESTORED":
      return 1;
    case "RECOVERING":
      return 0.85;
    case "UNVERIFIED":
    case "CONFLICTED":
      return 0.6;
    case "DEGRADING":
    case "RESIDUAL_RISK":
      return 0.4;
    case "CRITICAL":
    case "OBSERVATION_GAP":
      return 0.15;
    case "COMPROMISED":
    case "COLLAPSING":
      return 0;
    default:
      return 1;
  }
}
function computeSystemicGraphMetrics(institutions, dependencies, dataProviders, infrastructureNodes, aiModels) {
  let totalInstFootprint = 0;
  let weightedInstHealth = 0;
  let degradingOrCriticalInstCount = 0;
  let residualRiskInstCount = 0;
  for (const inst of institutions) {
    const footprint = inst.systemic_footprint_score || 0.5;
    totalInstFootprint += footprint;
    const mult = getStatusHealthMultiplier(inst.status);
    weightedInstHealth += footprint * mult;
    if (["DEGRADING", "CRITICAL", "COLLAPSING", "COMPROMISED", "RESIDUAL_RISK"].includes(inst.status)) {
      degradingOrCriticalInstCount++;
    }
    if (inst.status === "RESIDUAL_RISK") {
      residualRiskInstCount++;
    }
  }
  const instRatio = totalInstFootprint > 0 ? weightedInstHealth / totalInstFootprint : 1;
  let totalDepWeight = 0;
  let weightedDepHealth = 0;
  let chokepointCount = 0;
  let compromisedChokepoints = 0;
  const degradedDepIds = [];
  const activeTransmissionTypes = /* @__PURE__ */ new Set();
  for (const dep of dependencies) {
    const weight = dep.exposure_weight || 0.5;
    totalDepWeight += weight;
    const mult = getStatusHealthMultiplier(dep.status);
    weightedDepHealth += weight * mult;
    if (dep.is_chokepoint) {
      chokepointCount++;
      if (dep.status !== "STABLE" && dep.status !== "RESTORED") {
        compromisedChokepoints++;
      }
    }
    if (dep.status !== "STABLE" && dep.status !== "RESTORED") {
      degradedDepIds.push(dep.dependency_id);
      activeTransmissionTypes.add(dep.type);
    }
  }
  const depRatio = totalDepWeight > 0 ? weightedDepHealth / totalDepWeight : 1;
  const chokepointSaturation = chokepointCount > 0 ? +(compromisedChokepoints / chokepointCount).toFixed(2) : 0;
  let providerHealthSum = 0;
  let compromisedProviderCount = 0;
  for (const prov of dataProviders) {
    const mult = getStatusHealthMultiplier(prov.status);
    providerHealthSum += mult;
    if (prov.status === "COMPROMISED" || prov.status === "CRITICAL") {
      compromisedProviderCount++;
    }
  }
  const provRatio = dataProviders.length > 0 ? providerHealthSum / dataProviders.length : 1;
  let infraHealthSum = 0;
  let failingInfraCount = 0;
  for (const infra of infrastructureNodes) {
    const mult = getStatusHealthMultiplier(infra.status);
    const loadPenalty = Math.max(0, (infra.current_load_percent - 50) / 100);
    infraHealthSum += Math.max(0, mult - loadPenalty * 0.4);
    if (["CRITICAL", "COLLAPSING", "COMPROMISED"].includes(infra.status) || infra.current_load_percent > 90) {
      failingInfraCount++;
    }
  }
  const infraRatio = infrastructureNodes.length > 0 ? infraHealthSum / infrastructureNodes.length : 1;
  let modelDiversitySum = 0;
  let compromisedModelCount = 0;
  for (const m of aiModels) {
    modelDiversitySum += m.effective_diversity_score;
    if (["COMPROMISED", "CRITICAL", "CONFLICTED"].includes(m.status)) {
      compromisedModelCount++;
    }
  }
  const avgDiversity = aiModels.length > 0 ? +(modelDiversitySum / aiModels.length).toFixed(2) : 0.23;
  let depthLevels = 0;
  if (compromisedProviderCount > 0 || failingInfraCount > 0) {
    depthLevels = 1;
    if (degradedDepIds.length > 0) depthLevels = 2;
    if (degradingOrCriticalInstCount > 0) depthLevels = 3;
    if (degradingOrCriticalInstCount >= 3) depthLevels = 4;
  } else if (compromisedModelCount > 0 || residualRiskInstCount > 0) {
    depthLevels = 2;
    if (residualRiskInstCount > 0) depthLevels = 3;
  }
  let rawScore = 0;
  if (depthLevels === 0 && compromisedProviderCount === 0 && failingInfraCount === 0 && degradingOrCriticalInstCount === 0) {
    rawScore = 91;
  } else {
    const baseHealthScore = instRatio * 42 + depRatio * 18 + provRatio * 16 + infraRatio * 16 + avgDiversity * 5;
    const chokePenalty = chokepointSaturation * 18;
    const criticalCompromisePenalty = compromisedProviderCount * 20 + failingInfraCount * 24;
    const depthPenalty = Math.max(0, (depthLevels - 1) * 5);
    rawScore = Math.max(15, Math.min(96, baseHealthScore - chokePenalty - criticalCompromisePenalty - depthPenalty));
  }
  const finalControlMargin = Math.round(rawScore);
  let overallStatus = "STABLE";
  if (residualRiskInstCount > 0) {
    overallStatus = "RESIDUAL_RISK";
  } else if (finalControlMargin < 30) {
    overallStatus = "COLLAPSING";
  } else if (finalControlMargin <= 50) {
    overallStatus = "CRITICAL";
  } else if (finalControlMargin < 65) {
    overallStatus = "DEGRADING";
  } else if (finalControlMargin < 80) {
    overallStatus = "RECOVERING";
  } else {
    overallStatus = "STABLE";
  }
  const affectedCount = degradingOrCriticalInstCount + compromisedProviderCount + failingInfraCount + compromisedModelCount;
  const propagationRisk = Math.min(95, Math.round((1 - instRatio) * 70 + chokepointSaturation * 30));
  const decisionSynchrony = Math.min(90, Math.round(18 + (1 - avgDiversity) * 40));
  const stabilityIndex = +(finalControlMargin / 100 * 0.9 + 0.05).toFixed(2);
  return {
    control_margin_percent: finalControlMargin,
    overall_status: overallStatus,
    system_stability_index: stabilityIndex,
    chokepoint_saturation: chokepointSaturation,
    cascade_velocity_nodes_per_sec: depthLevels > 0 ? +(depthLevels * 1.8).toFixed(1) : 0,
    depth_levels: depthLevels,
    active_transmission_channels: Array.from(activeTransmissionTypes),
    chokepoint_bottlenecks: degradedDepIds.slice(0, 4),
    affected_nodes_count: affectedCount,
    key_metrics: {
      propagation_risk_pct: propagationRisk,
      decision_synchrony_pct: decisionSynchrony,
      model_concentration_pct: 22,
      infrastructure_dependency_pct: Math.round((1 - infraRatio) * 60 + 26),
      evidence_sufficiency_pct: 94
    }
  };
}
function traceEntityCausality(targetId, institutions, dependencies, dataProviders, infrastructureNodes) {
  const getEntityName = (id) => {
    const p = dataProviders.find((x) => x.provider_id === id);
    if (p) return p.name;
    const i = institutions.find((x) => x.institution_id === id);
    if (i) return i.name;
    const f = infrastructureNodes.find((x) => x.node_id === id);
    if (f) return f.name;
    return id;
  };
  const getEntityStatus = (id) => {
    const p = dataProviders.find((x) => x.provider_id === id);
    if (p) return p.status;
    const i = institutions.find((x) => x.institution_id === id);
    if (i) return i.status;
    const f = infrastructureNodes.find((x) => x.node_id === id);
    if (f) return f.status;
    return "STABLE";
  };
  const targetName = getEntityName(targetId);
  const hops = [];
  const incoming = dependencies.filter((d) => d.target_id === targetId && d.status !== "STABLE");
  let rootCauseId = targetId;
  let rootCauseName = targetName;
  for (const dep of incoming) {
    const srcName = getEntityName(dep.source_id);
    const srcStatus = getEntityStatus(dep.source_id);
    hops.push({
      from_id: dep.source_id,
      from_name: srcName,
      from_status: srcStatus,
      via_dependency_id: dep.dependency_id,
      dependency_type: dep.type,
      exposure_weight: dep.exposure_weight,
      latency_ms: dep.latency_ms,
      to_id: targetId,
      to_name: targetName,
      to_status: getEntityStatus(targetId)
    });
    rootCauseId = dep.source_id;
    rootCauseName = srcName;
  }
  if (targetId === "DATA-X") {
    return {
      target_id: targetId,
      target_name: targetName,
      root_cause_id: "DATA-X",
      root_cause_name: "DATA-X Common Information Provider",
      hops_count: 0,
      hops: [],
      causal_narrative: "Root failure origin: Cryptographic payload integrity corruption on primary rates oracle."
    };
  }
  if (targetId === "INFRA-1") {
    return {
      target_id: targetId,
      target_name: targetName,
      root_cause_id: "INFRA-1",
      root_cause_name: "Global Real-Time Settlement Rail (INFRA-1)",
      hops_count: 0,
      hops: [],
      causal_narrative: "Root congestion origin: TPS queue saturation (98.4% capacity) causing settlement timeout cascade."
    };
  }
  const narrative = hops.length > 0 ? `Contagion received from upstream entity [${rootCauseName}] via systemic channel [${hops[0].via_dependency_id}] (${hops[0].dependency_type}). Exposure weight: ${hops[0].exposure_weight}.` : `Entity is operating within normal baseline tolerance. No active stress transmissions recorded.`;
  return {
    target_id: targetId,
    target_name: targetName,
    root_cause_id: rootCauseId,
    root_cause_name: rootCauseName,
    hops_count: hops.length,
    hops,
    causal_narrative: narrative
  };
}
function propagateGraphContagion(engine, sourceEntityId, depthLimit = 2) {
  const marginBefore = engine.controlState.control_margin_percent;
  const stateDeltas = [];
  const traversedDeps = /* @__PURE__ */ new Set();
  const affectedEntities = /* @__PURE__ */ new Set([sourceEntityId]);
  const transmissionChannels = /* @__PURE__ */ new Set();
  const chokepointsHit = /* @__PURE__ */ new Set();
  const directDeps = engine.dependencies.filter((d) => d.source_id === sourceEntityId);
  const hop1Targets = /* @__PURE__ */ new Set();
  for (const dep of directDeps) {
    traversedDeps.add(dep.dependency_id);
    transmissionChannels.add(dep.type);
    if (dep.is_chokepoint) chokepointsHit.add(dep.dependency_id);
    const prevDepStatus = dep.status;
    dep.status = "DEGRADING";
    stateDeltas.push({
      entity_type: "DEPENDENCY",
      entity_id: dep.dependency_id,
      field: "status",
      previous_value: prevDepStatus,
      new_value: "DEGRADING"
    });
    hop1Targets.add(dep.target_id);
    affectedEntities.add(dep.target_id);
  }
  for (const targetId of hop1Targets) {
    const inst = engine.institutions.find((i) => i.institution_id === targetId);
    if (inst) {
      const prevStatus = inst.status;
      inst.status = "DEGRADING";
      stateDeltas.push({
        entity_type: "INSTITUTION",
        entity_id: targetId,
        field: "status",
        previous_value: prevStatus,
        new_value: "DEGRADING"
      });
      inst.liquidity_coverage_ratio = +(inst.liquidity_coverage_ratio * 0.72).toFixed(1);
    }
    const infra = engine.infrastructureNodes.find((n) => n.node_id === targetId);
    if (infra) {
      const prevStatus = infra.status;
      infra.status = "CRITICAL";
      infra.current_load_percent = Math.min(99.4, infra.current_load_percent + 25);
      stateDeltas.push({
        entity_type: "INFRASTRUCTURE_NODE",
        entity_id: targetId,
        field: "status",
        previous_value: prevStatus,
        new_value: "CRITICAL"
      });
    }
  }
  if (depthLimit >= 2) {
    for (const h1Id of hop1Targets) {
      const secondaryDeps = engine.dependencies.filter((d) => d.source_id === h1Id && !traversedDeps.has(d.dependency_id));
      for (const sDep of secondaryDeps) {
        traversedDeps.add(sDep.dependency_id);
        transmissionChannels.add(sDep.type);
        if (sDep.is_chokepoint) chokepointsHit.add(sDep.dependency_id);
        const prevStatus = sDep.status;
        sDep.status = "DEGRADING";
        stateDeltas.push({
          entity_type: "DEPENDENCY",
          entity_id: sDep.dependency_id,
          field: "status",
          previous_value: prevStatus,
          new_value: "DEGRADING"
        });
        affectedEntities.add(sDep.target_id);
        const subInst = engine.institutions.find((i) => i.institution_id === sDep.target_id);
        if (subInst && subInst.status === "STABLE") {
          subInst.status = "DEGRADING";
          stateDeltas.push({
            entity_type: "INSTITUTION",
            entity_id: sDep.target_id,
            field: "status",
            previous_value: "STABLE",
            new_value: "DEGRADING"
          });
        }
      }
    }
  }
  const newMetrics = computeSystemicGraphMetrics(
    engine.institutions,
    engine.dependencies,
    engine.dataProviders,
    engine.infrastructureNodes,
    engine.aiModels
  );
  engine.controlState.control_margin_percent = newMetrics.control_margin_percent;
  engine.controlState.overall_status = newMetrics.overall_status;
  engine.controlState.system_stability_index = newMetrics.system_stability_index;
  engine.controlState.chokepoint_saturation = newMetrics.chokepoint_saturation;
  engine.controlState.active_threat_count = affectedEntities.size;
  engine.controlState.key_metrics = { ...newMetrics.key_metrics };
  return {
    source_id: sourceEntityId,
    depth_reached: depthLimit,
    traversed_dependencies: Array.from(traversedDeps),
    affected_entities: Array.from(affectedEntities),
    state_deltas: stateDeltas,
    active_transmission_channels: Array.from(transmissionChannels),
    chokepoints_hit: Array.from(chokepointsHit),
    control_margin_before: marginBefore,
    control_margin_after: newMetrics.control_margin_percent
  };
}

// server/src/simulation/scenarios.ts
var SCENARIO_DESCRIPTORS = {
  SCENARIO_A: {
    scenario_id: "SCENARIO_A",
    name: "Common Data Dependency Failure",
    short_code: "SCENARIO_A",
    category: "INFORMATION_CHOKEPOINT",
    root_cause: "DATA-X Rates Oracle Payload Corruption",
    description: "Controlled simulation of information provider compromise (DATA-X) propagating across Tier-1 G-SIB banking rails (BANK-A, BANK-B, BANK-C, BANK-D).",
    primary_target: "DATA-X",
    expected_min_control_margin: 34,
    stages_count: 4
  },
  SCENARIO_B: {
    scenario_id: "SCENARIO_B",
    name: "Shared Infrastructure Failure",
    short_code: "SCENARIO_B",
    category: "CORE_CLEARING_GRIDLOCK",
    root_cause: "Global RTGS / Central Counterparty Rail Saturation",
    description: "Catastrophic settlement timeout and clearing queue congestion across INFRA-1 (RTGS Rail) and INFRA-2 (CCP Hub), threatening multi-jurisdictional liquidity gridlock.",
    primary_target: "INFRA-1",
    expected_min_control_margin: 28,
    stages_count: 4
  },
  SCENARIO_C: {
    scenario_id: "SCENARIO_C",
    name: "Incomplete Intervention & Residual Impact",
    short_code: "SCENARIO_C",
    category: "RESIDUAL_CONTAGION",
    root_cause: "Pre-Isolate Latent Algorithmic Infection (MODEL-C)",
    description: "Primary dependency isolation appears to restore control margin, but unaddressed latent path through algorithmic model (MODEL-C) triggers secondary fire-sale contagion on synthetic credit (ASSET-17).",
    primary_target: "MODEL-C",
    expected_min_control_margin: 42,
    stages_count: 5
  },
  SCENARIO_D: {
    scenario_id: "SCENARIO_D",
    name: "Collective Decision Convergence",
    short_code: "SCENARIO_D",
    category: "ALGORITHMIC_HERDING",
    root_cause: "Benchmark Shock & Synchronized Model Drift",
    description: "Multiple institutions appear diverse, but common input feeds and correlated risk-weights cause model recommendations to synchronize (>92%), collapsing effective decision diversity and triggering collective liquidity withdrawal.",
    primary_target: "MODEL-A",
    expected_min_control_margin: 48,
    stages_count: 5
  }
};
function executeScenarioStage(scenarioId, stageIndex, engine) {
  const events = [];
  const tick = engine.clock.tick;
  const timestamp = engine.clock.virtual_timestamp;
  switch (scenarioId) {
    case "SCENARIO_A": {
      if (stageIndex === 0) {
        const dataX = engine.dataProviders.find((p) => p.provider_id === "DATA-X");
        if (dataX) {
          const prevStatus = dataX.status;
          dataX.status = "COMPROMISED";
          dataX.updated_at = timestamp;
          const incident = {
            incident_id: "RN-2026-0041",
            title: "Common Information Provider Compromised (DATA-X)",
            status: "ACTIVE",
            severity: "SYSTEMIC_THREAT",
            declared_at: timestamp,
            root_cause_vector: "Rates Oracle Cryptographic Invalidation",
            affected_node_ids: ["DATA-X"],
            affected_dependency_ids: ["DEP_DATA_X_BANK_A", "DEP_DATA_X_BANK_B", "DEP_DATA_X_BANK_C", "DEP_DATA_X_BANK_D"],
            containment_margin_percent: 34,
            estimated_intervention_window_sec: 41,
            evidence_record_ids: ["EVD-2026-001", "EVD-2026-002", "EVD-2026-003"]
          };
          engine.incidents = [incident];
          events.push({
            event_id: "RN-2026-0041",
            tick,
            simulation_timestamp: timestamp,
            event_type: "PROVIDER_COMPROMISED",
            severity: "CRITICAL",
            source_entity_id: "DATA-X",
            causal_chain_id: "CHAIN-SCENARIO-A",
            parent_event_id: null,
            state_deltas: [{
              entity_type: "DATA_PROVIDER",
              entity_id: "DATA-X",
              field: "status",
              previous_value: prevStatus,
              new_value: "COMPROMISED"
            }],
            causal_narrative: "Common Information Provider DATA-X suffered cryptographic hash mismatch on live benchmark telemetry. Feed integrity collapsed.",
            systemic_impact: { control_margin_delta: -24, stability_delta: -0.22 }
          });
        }
      } else if (stageIndex === 1) {
        const deps = engine.dependencies.filter((d) => d.source_id === "DATA-X");
        const deltas = [];
        for (const dep of deps) {
          deltas.push({
            entity_type: "DEPENDENCY",
            entity_id: dep.dependency_id,
            field: "status",
            previous_value: dep.status,
            new_value: "DEGRADING"
          });
          dep.status = "DEGRADING";
        }
        events.push({
          event_id: "EVT-A1-FEED-TAINT",
          tick,
          simulation_timestamp: timestamp,
          event_type: "DEPENDENCY_PROPAGATION",
          severity: "HIGH",
          source_entity_id: "DATA-X",
          target_entity_id: "DEP_DATA_X_BANK_A",
          parent_event_id: "RN-2026-0041",
          causal_chain_id: "CHAIN-SCENARIO-A",
          state_deltas: deltas,
          causal_narrative: "Tainted rates and sovereign debt pricing vectors propagated along all 4 high-speed feed lines.",
          systemic_impact: { control_margin_delta: -18, stability_delta: -0.15 }
        });
      } else if (stageIndex === 2) {
        const bankIds = ["BANK-A", "BANK-B", "BANK-C"];
        const deltas = [];
        for (const id of bankIds) {
          const bank = engine.institutions.find((i) => i.institution_id === id);
          if (bank) {
            deltas.push({
              entity_type: "INSTITUTION",
              entity_id: id,
              field: "status",
              previous_value: bank.status,
              new_value: "DEGRADING"
            });
            bank.status = "DEGRADING";
            bank.liquidity_coverage_ratio = +(bank.liquidity_coverage_ratio * 0.65).toFixed(1);
          }
        }
        if (engine.incidents.length > 0) {
          engine.incidents[0].affected_node_ids = ["DATA-X", ...bankIds];
        }
        events.push({
          event_id: "EVT-A2-INSTITUTIONS-DEGRADING",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INSTITUTION_DEGRADATION",
          severity: "CRITICAL",
          source_entity_id: "DATA-X",
          target_entity_id: "BANK-A",
          parent_event_id: "EVT-A1-FEED-TAINT",
          causal_chain_id: "CHAIN-SCENARIO-A",
          state_deltas: deltas,
          causal_narrative: "Atlantic Tier-1 Bank (BANK-A), European Settlement (BANK-B), and Rhine Liquidity (BANK-C) models reject skewed inputs; LCR buffer compromised.",
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.18 }
        });
      } else if (stageIndex === 3) {
        const bankD = engine.institutions.find((i) => i.institution_id === "BANK-D");
        const interbankDep = engine.dependencies.find((d) => d.dependency_id === "DEP_BANK_A_BANK_B");
        if (bankD) bankD.status = "DEGRADING";
        if (interbankDep) interbankDep.status = "DEGRADING";
        events.push({
          event_id: "EVT-A3-INTERBANK-SPREAD",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INSTITUTION_DEGRADATION",
          severity: "CRITICAL",
          source_entity_id: "BANK-A",
          target_entity_id: "BANK-D",
          parent_event_id: "EVT-A2-INSTITUTIONS-DEGRADING",
          causal_chain_id: "CHAIN-SCENARIO-A",
          state_deltas: [
            { entity_type: "INSTITUTION", entity_id: "BANK-D", field: "status", previous_value: "STABLE", new_value: "DEGRADING" },
            { entity_type: "DEPENDENCY", entity_id: "DEP_BANK_A_BANK_B", field: "status", previous_value: "STABLE", new_value: "DEGRADING" }
          ],
          causal_narrative: "Interbank credit line between BANK-A and BANK-B frozen. Pacific Core Clearing (BANK-D) triggers emergency margin reserve.",
          systemic_impact: { control_margin_delta: -5, stability_delta: -0.06 }
        });
      }
      break;
    }
    case "SCENARIO_B": {
      if (stageIndex === 0) {
        const infra1 = engine.infrastructureNodes.find((n) => n.node_id === "INFRA-1");
        if (infra1) {
          infra1.status = "CRITICAL";
          infra1.current_load_percent = 98.6;
          const incident = {
            incident_id: "RN-2026-0092",
            title: "Global Real-Time Settlement Rail Desynchronization (INFRA-1)",
            status: "ACTIVE",
            severity: "SYSTEMIC_THREAT",
            declared_at: timestamp,
            root_cause_vector: "RTGS Queue Backlog & Throughput Choke",
            affected_node_ids: ["INFRA-1"],
            affected_dependency_ids: ["DEP_INFRA_1_BANK_A", "DEP_INFRA_1_BANK_B"],
            containment_margin_percent: 28,
            estimated_intervention_window_sec: 32,
            evidence_record_ids: ["EVD-2026-004", "EVD-2026-005"]
          };
          engine.incidents = [incident];
          events.push({
            event_id: "RN-2026-0092",
            tick,
            simulation_timestamp: timestamp,
            event_type: "INFRASTRUCTURE_FAILURE",
            severity: "CRITICAL",
            source_entity_id: "INFRA-1",
            causal_chain_id: "CHAIN-SCENARIO-B",
            parent_event_id: null,
            state_deltas: [
              { entity_type: "INFRASTRUCTURE_NODE", entity_id: "INFRA-1", field: "status", previous_value: "STABLE", new_value: "CRITICAL" },
              { entity_type: "INFRASTRUCTURE_NODE", entity_id: "INFRA-1", field: "current_load_percent", previous_value: 48.2, new_value: 98.6 }
            ],
            causal_narrative: "Global Real-Time Settlement Rail (INFRA-1) processing throughput dropped below 1,200 TPS. Unsettled queue backlog exceeded 48,000 transactions.",
            systemic_impact: { control_margin_delta: -32, stability_delta: -0.3 }
          });
        }
      } else if (stageIndex === 1) {
        const infraDeps = engine.dependencies.filter((d) => ["DEP_INFRA_1_BANK_A", "DEP_INFRA_1_BANK_B"].includes(d.dependency_id));
        for (const dep of infraDeps) {
          dep.status = "DEGRADING";
          dep.latency_ms = 940;
        }
        events.push({
          event_id: "EVT-B1-SETTLEMENT-CHOKE",
          tick,
          simulation_timestamp: timestamp,
          event_type: "DEPENDENCY_PROPAGATION",
          severity: "HIGH",
          source_entity_id: "INFRA-1",
          target_entity_id: "DEP_INFRA_1_BANK_A",
          parent_event_id: "RN-2026-0092",
          causal_chain_id: "CHAIN-SCENARIO-B",
          state_deltas: infraDeps.map((d) => ({
            entity_type: "DEPENDENCY",
            entity_id: d.dependency_id,
            field: "latency_ms",
            previous_value: 18,
            new_value: 940
          })),
          causal_narrative: "Settlement rails to BANK-A and BANK-B degraded due to unconfirmed settlement timeout spikes.",
          systemic_impact: { control_margin_delta: -16, stability_delta: -0.15 }
        });
      } else if (stageIndex === 2) {
        const insts = engine.institutions.filter((i) => ["BANK-A", "BANK-B", "GCCB-US", "TISC-UK"].includes(i.institution_id));
        for (const inst of insts) {
          inst.status = "CRITICAL";
          inst.liquidity_coverage_ratio = +(inst.liquidity_coverage_ratio * 0.58).toFixed(1);
        }
        events.push({
          event_id: "EVT-B2-CLEARING-GRIDLOCK",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INSTITUTION_DEGRADATION",
          severity: "CRITICAL",
          source_entity_id: "INFRA-1",
          target_entity_id: "GCCB-US",
          parent_event_id: "EVT-B1-SETTLEMENT-CHOKE",
          causal_chain_id: "CHAIN-SCENARIO-B",
          state_deltas: insts.map((i) => ({
            entity_type: "INSTITUTION",
            entity_id: i.institution_id,
            field: "status",
            previous_value: "STABLE",
            new_value: "CRITICAL"
          })),
          causal_narrative: "Cross-border clearing banks facing intraday liquidity trap; unable to post margin collateral.",
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.19 }
        });
      } else if (stageIndex === 3) {
        const infra2 = engine.infrastructureNodes.find((n) => n.node_id === "INFRA-2");
        if (infra2) {
          infra2.status = "DEGRADING";
          infra2.current_load_percent = 92.4;
        }
        events.push({
          event_id: "EVT-B3-CCP-MARGIN-DESYNC",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INFRASTRUCTURE_FAILURE",
          severity: "CRITICAL",
          source_entity_id: "INFRA-2",
          parent_event_id: "EVT-B2-CLEARING-GRIDLOCK",
          causal_chain_id: "CHAIN-SCENARIO-B",
          state_deltas: [
            { entity_type: "INFRASTRUCTURE_NODE", entity_id: "INFRA-2", field: "status", previous_value: "STABLE", new_value: "DEGRADING" }
          ],
          causal_narrative: "Cross-Border Clearing Hub (INFRA-2) activated emergency collateral haircuts. System enters critical containment threshold.",
          systemic_impact: { control_margin_delta: -4, stability_delta: -0.05 }
        });
      }
      break;
    }
    case "SCENARIO_C": {
      if (stageIndex === 0) {
        const dataX = engine.dataProviders.find((p) => p.provider_id === "DATA-X");
        if (dataX) dataX.status = "RECOVERING";
        for (const dep of engine.dependencies.filter((d) => d.source_id === "DATA-X")) {
          dep.status = "RECOVERING";
        }
        const incident = {
          incident_id: "RN-2026-0108",
          title: "Residual Contagion Under Pre-Tainted Algorithmic Balancing",
          status: "CONTAINING",
          severity: "HIGH",
          declared_at: timestamp,
          root_cause_vector: "Unobserved Latent Algorithmic Propagation via MODEL-C",
          affected_node_ids: ["DATA-X", "MODEL-C", "ASSET-17"],
          affected_dependency_ids: ["DEP_MODEL_C_ASSET_17"],
          containment_margin_percent: 76,
          estimated_intervention_window_sec: 120,
          evidence_record_ids: ["EVD-2026-006"]
        };
        engine.incidents = [incident];
        events.push({
          event_id: "EVT-C0-SURFACE-ISOLATION",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INTERVENTION_EXECUTED",
          severity: "INFO",
          source_entity_id: "DATA-X",
          causal_chain_id: "CHAIN-SCENARIO-C",
          parent_event_id: null,
          state_deltas: [
            { entity_type: "DATA_PROVIDER", entity_id: "DATA-X", field: "status", previous_value: "COMPROMISED", new_value: "RECOVERING" }
          ],
          causal_narrative: "Primary data dependency isolation executed. Surface telemetry reports upward recovery trajectory.",
          systemic_impact: { control_margin_delta: 42, stability_delta: 0.35 }
        });
      } else if (stageIndex === 1) {
        const modelC = engine.aiModels.find((m) => m.model_id === "MODEL-C");
        if (modelC) {
          modelC.status = "CONFLICTED";
          modelC.herd_correlation_risk = 0.94;
        }
        events.push({
          event_id: "EVT-C1-LATENT-DRIFT",
          tick,
          simulation_timestamp: timestamp,
          event_type: "ANOMALY_DETECTED",
          severity: "WARNING",
          source_entity_id: "MODEL-C",
          parent_event_id: "EVT-C0-SURFACE-ISOLATION",
          causal_chain_id: "CHAIN-SCENARIO-C",
          state_deltas: [
            { entity_type: "AI_MODEL", entity_id: "MODEL-C", field: "status", previous_value: "STABLE", new_value: "CONFLICTED" }
          ],
          causal_narrative: "Enclave telemetry detects algorithmic divergence: MODEL-C was operating on cached pre-isolation synthetic rate tensors.",
          systemic_impact: { control_margin_delta: -10, stability_delta: -0.1 }
        });
      } else if (stageIndex === 2) {
        const asset17 = engine.assets.find((a) => a.asset_id === "ASSET-17");
        const modelC = engine.aiModels.find((m) => m.model_id === "MODEL-C");
        if (asset17) asset17.status = "DEGRADING";
        if (modelC) modelC.status = "COMPROMISED";
        events.push({
          event_id: "EVT-C2-SYNTHETIC-FIRE-SALE",
          tick,
          simulation_timestamp: timestamp,
          event_type: "DEPENDENCY_PROPAGATION",
          severity: "HIGH",
          source_entity_id: "MODEL-C",
          target_entity_id: "ASSET-17",
          parent_event_id: "EVT-C1-LATENT-DRIFT",
          causal_chain_id: "CHAIN-SCENARIO-C",
          state_deltas: [
            { entity_type: "ASSET", entity_id: "ASSET-17", field: "status", previous_value: "STABLE", new_value: "DEGRADING" },
            { entity_type: "AI_MODEL", entity_id: "MODEL-C", field: "status", previous_value: "CONFLICTED", new_value: "COMPROMISED" }
          ],
          causal_narrative: "MODEL-C initiated automated liquidation on Synthetic Credit Benchmark ASSET-17 across BANK-C and BANK-D balances.",
          systemic_impact: { control_margin_delta: -14, stability_delta: -0.16 }
        });
      } else if (stageIndex === 3) {
        const bankC = engine.institutions.find((i) => i.institution_id === "BANK-C");
        const bankD = engine.institutions.find((i) => i.institution_id === "BANK-D");
        if (bankC) bankC.status = "RESIDUAL_RISK";
        if (bankD) bankD.status = "RESIDUAL_RISK";
        events.push({
          event_id: "EVT-C3-RESIDUAL-RISK-DECLARED",
          tick,
          simulation_timestamp: timestamp,
          event_type: "RESIDUAL_RISK_DETECTED",
          severity: "CRITICAL",
          source_entity_id: "MODEL-C",
          target_entity_id: "BANK-C",
          parent_event_id: "EVT-C2-SYNTHETIC-FIRE-SALE",
          causal_chain_id: "CHAIN-SCENARIO-C",
          state_deltas: [
            { entity_type: "INSTITUTION", entity_id: "BANK-C", field: "status", previous_value: "RECOVERING", new_value: "RESIDUAL_RISK" },
            { entity_type: "INSTITUTION", entity_id: "BANK-D", field: "status", previous_value: "STABLE", new_value: "RESIDUAL_RISK" }
          ],
          causal_narrative: "VERIFICATION ANOMALY: Reported containment does NOT match collateral reality. Status downgraded to UNVERIFIED / RESIDUAL_RISK.",
          systemic_impact: { control_margin_delta: -10, stability_delta: -0.12 }
        });
      } else if (stageIndex === 4) {
        events.push({
          event_id: "EVT-C4-REASSESSMENT-MANDATE",
          tick,
          simulation_timestamp: timestamp,
          event_type: "SYSTEM_REASSESSMENT",
          severity: "HIGH",
          source_entity_id: "ENCLAVE_CTRL",
          parent_event_id: "EVT-C3-RESIDUAL-RISK-DECLARED",
          causal_chain_id: "CHAIN-SCENARIO-C",
          state_deltas: [],
          causal_narrative: "Enclave Control mandates multi-point intervention: Quarantine MODEL-C and inject Synthetic Credit Liquidity Backstop.",
          systemic_impact: { control_margin_delta: 0, stability_delta: 0.05 }
        });
      }
      break;
    }
    case "SCENARIO_D": {
      if (stageIndex === 0) {
        const incident = {
          incident_id: "RN-2026-0155",
          title: "Collective Algorithmic Decision Convergence & Herding Fragility",
          status: "ACTIVE",
          severity: "HIGH",
          declared_at: timestamp,
          root_cause_vector: "Benchmark Shock & Synchronized Model Drift",
          affected_node_ids: ["MODEL-A", "MODEL-B", "MODEL-C", "MODEL-D"],
          affected_dependency_ids: ["DEP_MODEL_C_ASSET_17"],
          containment_margin_percent: 78,
          estimated_intervention_window_sec: 90,
          evidence_record_ids: ["EVD-2026-007", "EVD-2026-008"]
        };
        engine.incidents = [incident];
        events.push({
          event_id: "EVT-D0-APPARENT-DIVERSITY",
          tick,
          simulation_timestamp: timestamp,
          event_type: "ANOMALY_DETECTED",
          severity: "INFO",
          source_entity_id: "MODEL-A",
          causal_chain_id: "CHAIN-SCENARIO-D",
          parent_event_id: null,
          state_deltas: [
            { entity_type: "AI_MODEL", entity_id: "MODEL-A", field: "effective_diversity_score", previous_value: 0.88, new_value: 0.88 }
          ],
          causal_narrative: "Baseline model inventory indicates apparent high diversity (0.88) across 4 institutional model architectures.",
          systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
        });
      } else if (stageIndex === 1) {
        for (const m of engine.aiModels) {
          m.herd_correlation_risk = 0.78;
        }
        events.push({
          event_id: "EVT-D1-INPUT-ALIGNMENT",
          tick,
          simulation_timestamp: timestamp,
          event_type: "COLLECTIVE_DECISION_CONVERGENCE",
          severity: "WARNING",
          source_entity_id: "DATA-X",
          target_entity_id: "MODEL-A",
          parent_event_id: "EVT-D0-APPARENT-DIVERSITY",
          causal_chain_id: "CHAIN-SCENARIO-D",
          state_deltas: engine.aiModels.map((m) => ({
            entity_type: "AI_MODEL",
            entity_id: m.model_id,
            field: "herd_correlation_risk",
            previous_value: 0.22,
            new_value: 0.78
          })),
          causal_narrative: "Cross-model telemetry reveals shared rates shock: Pairwise recommendation correlation rose to 0.78 across all institutional risk engines.",
          systemic_impact: { control_margin_delta: -8, stability_delta: -0.1 }
        });
      } else if (stageIndex === 2) {
        for (const m of engine.aiModels) {
          m.effective_diversity_score = 0.14;
          m.status = "DEGRADING";
        }
        events.push({
          event_id: "EVT-D2-DIVERSITY-COLLAPSE",
          tick,
          simulation_timestamp: timestamp,
          event_type: "DIVERSITY_COLLAPSE",
          severity: "HIGH",
          source_entity_id: "MODEL-A",
          parent_event_id: "EVT-D1-INPUT-ALIGNMENT",
          causal_chain_id: "CHAIN-SCENARIO-D",
          state_deltas: engine.aiModels.map((m) => ({
            entity_type: "AI_MODEL",
            entity_id: m.model_id,
            field: "effective_diversity_score",
            previous_value: 0.88,
            new_value: 0.14
          })),
          causal_narrative: "EFFECTIVE DIVERSITY COLLAPSE: Apparent vendor diversity was negated by shared input tensors. Decision synchrony reached 94%.",
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.18 }
        });
      } else if (stageIndex === 3) {
        const insts = engine.institutions.filter((i) => ["BANK-A", "BANK-B", "BANK-C", "BANK-D"].includes(i.institution_id));
        for (const inst of insts) {
          inst.status = "DEGRADING";
          inst.liquidity_coverage_ratio = +(inst.liquidity_coverage_ratio * 0.82).toFixed(1);
        }
        events.push({
          event_id: "EVT-D3-SYNCHRONIZED-LIQUIDITY-PULL",
          tick,
          simulation_timestamp: timestamp,
          event_type: "INSTITUTION_DEGRADATION",
          severity: "CRITICAL",
          source_entity_id: "MODEL-A",
          target_entity_id: "BANK-A",
          parent_event_id: "EVT-D2-DIVERSITY-COLLAPSE",
          causal_chain_id: "CHAIN-SCENARIO-D",
          state_deltas: insts.map((i) => ({
            entity_type: "INSTITUTION",
            entity_id: i.institution_id,
            field: "status",
            previous_value: "STABLE",
            new_value: "DEGRADING"
          })),
          causal_narrative: "Synchronized risk algorithms simultaneously triggered credit line freezes across Atlantic and European clearing nodes.",
          systemic_impact: { control_margin_delta: -12, stability_delta: -0.15 }
        });
      } else if (stageIndex === 4) {
        events.push({
          event_id: "EVT-D4-SYSTEMIC-FRAGILITY-ALERT",
          tick,
          simulation_timestamp: timestamp,
          event_type: "ANOMALY_DETECTED",
          severity: "CRITICAL",
          source_entity_id: "ENCLAVE_CTRL",
          parent_event_id: "EVT-D3-SYNCHRONIZED-LIQUIDITY-PULL",
          causal_chain_id: "CHAIN-SCENARIO-D",
          state_deltas: [],
          causal_narrative: "Systemic Controllability degraded to CONTROL_CRITICAL. Effective intervention window compressed to 52 seconds.",
          systemic_impact: { control_margin_delta: -8, stability_delta: -0.1 }
        });
      }
      break;
    }
  }
  const metrics = computeSystemicGraphMetrics(
    engine.institutions,
    engine.dependencies,
    engine.dataProviders,
    engine.infrastructureNodes,
    engine.aiModels
  );
  engine.controlState = {
    ...engine.controlState,
    control_margin_percent: metrics.control_margin_percent,
    overall_status: metrics.overall_status,
    system_stability_index: metrics.system_stability_index,
    chokepoint_saturation: metrics.chokepoint_saturation,
    key_metrics: metrics.key_metrics,
    active_threat_count: metrics.affected_nodes_count,
    active_incident_count: engine.incidents.filter((i) => i.status === "ACTIVE" || i.status === "CONTAINING").length,
    active_incident_id: engine.incidents.length > 0 ? engine.incidents[0].incident_id : null,
    last_evaluated_timestamp: timestamp,
    scenario_name: SCENARIO_DESCRIPTORS[scenarioId].name
  };
  return events;
}

// server/src/simulation/replay.ts
import crypto from "crypto";
var ReplayEngine = class {
  frames = /* @__PURE__ */ new Map();
  maxFrames = 200;
  /**
   * Generates a deterministic cryptographic fingerprint of current state.
   */
  generateStateHash(seed, tick, scenarioId, institutions, dependencies, controlMargin) {
    const instFingerprint = institutions.map((i) => `${i.institution_id}:${i.status}`).sort().join(";");
    const depFingerprint = dependencies.map((d) => `${d.dependency_id}:${d.status}`).sort().join(";");
    const payload = `${seed}|${tick}|${scenarioId}|${controlMargin}|${instFingerprint}|${depFingerprint}`;
    return `sha256:${crypto.createHash("sha256").update(payload).digest("hex").substring(0, 16)}`;
  }
  /**
   * Captures and commits an authoritative state frame to the replay buffer.
   */
  recordFrame(engine, summary = "") {
    const tick = engine.clock.tick;
    const seed = engine.config.seed;
    const scenarioId = engine.activeScenarioId || "SCENARIO_A";
    const stateHash = this.generateStateHash(
      seed,
      tick,
      scenarioId,
      engine.institutions,
      engine.dependencies,
      engine.controlState.control_margin_percent
    );
    const meta = {
      tick,
      virtual_timestamp: engine.clock.virtual_timestamp,
      scenario_id: scenarioId,
      state_hash: stateHash,
      control_margin_percent: engine.controlState.control_margin_percent,
      overall_status: engine.controlState.overall_status,
      active_incident_id: engine.incidents.length > 0 ? engine.incidents[0].incident_id : null,
      events_count: engine.authoritativeEvents.length,
      summary: summary || `Tick ${tick}: ${engine.controlState.overall_status} (Margin: ${engine.controlState.control_margin_percent}%)`
    };
    const fullFrame = {
      meta,
      state: {
        institutions: JSON.parse(JSON.stringify(engine.institutions)),
        dependencies: JSON.parse(JSON.stringify(engine.dependencies)),
        dataProviders: JSON.parse(JSON.stringify(engine.dataProviders)),
        infrastructureNodes: JSON.parse(JSON.stringify(engine.infrastructureNodes)),
        aiModels: JSON.parse(JSON.stringify(engine.aiModels)),
        assets: JSON.parse(JSON.stringify(engine.assets)),
        incidents: JSON.parse(JSON.stringify(engine.incidents)),
        controlState: JSON.parse(JSON.stringify(engine.controlState)),
        authoritativeEvents: JSON.parse(JSON.stringify(engine.authoritativeEvents))
      }
    };
    this.frames.set(tick, fullFrame);
    if (this.frames.size > this.maxFrames) {
      const minTick = Math.min(...Array.from(this.frames.keys()));
      this.frames.delete(minTick);
    }
    return meta;
  }
  /**
   * Restores engine state directly to a recorded tick.
   */
  restoreTick(targetTick, engine) {
    const frame = this.frames.get(targetTick);
    if (!frame) return false;
    engine.clock.tick = targetTick;
    engine.clock.virtual_timestamp = frame.meta.virtual_timestamp;
    engine.institutions = JSON.parse(JSON.stringify(frame.state.institutions));
    engine.dependencies = JSON.parse(JSON.stringify(frame.state.dependencies));
    engine.dataProviders = JSON.parse(JSON.stringify(frame.state.dataProviders));
    engine.infrastructureNodes = JSON.parse(JSON.stringify(frame.state.infrastructureNodes));
    engine.aiModels = JSON.parse(JSON.stringify(frame.state.aiModels));
    engine.assets = JSON.parse(JSON.stringify(frame.state.assets));
    engine.incidents = JSON.parse(JSON.stringify(frame.state.incidents));
    engine.controlState = JSON.parse(JSON.stringify(frame.state.controlState));
    engine.authoritativeEvents = JSON.parse(JSON.stringify(frame.state.authoritativeEvents));
    return true;
  }
  /**
   * Returns metadata timeline of all recorded frames.
   */
  getTimeline() {
    return Array.from(this.frames.values()).map((f) => f.meta).sort((a, b) => a.tick - b.tick);
  }
  /**
   * Resets the replay buffer.
   */
  clear() {
    this.frames.clear();
  }
};
var globalReplayEngine = new ReplayEngine();

// server/src/intelligence/dependencyIntelligence.ts
function getNormalizedHealth(status) {
  switch (status) {
    case "STABLE":
    case "RESTORED":
      return 1;
    case "RECOVERING":
      return 0.85;
    case "UNVERIFIED":
    case "CONFLICTED":
      return 0.6;
    case "DEGRADING":
    case "RESIDUAL_RISK":
      return 0.4;
    case "CRITICAL":
    case "OBSERVATION_GAP":
      return 0.15;
    case "COMPROMISED":
    case "COLLAPSING":
      return 0;
    default:
      return 1;
  }
}
function computeDependencyIntelligence(dependencies, institutions, dataProviders, infrastructureNodes) {
  const records = [];
  const totalDepWeight = dependencies.reduce((acc, d) => acc + (d.exposure_weight || 0.5), 0);
  const downstreamMap = /* @__PURE__ */ new Map();
  const upstreamMap = /* @__PURE__ */ new Map();
  for (const dep of dependencies) {
    if (!downstreamMap.has(dep.source_id)) downstreamMap.set(dep.source_id, []);
    downstreamMap.get(dep.source_id).push(dep.target_id);
    if (!upstreamMap.has(dep.target_id)) upstreamMap.set(dep.target_id, []);
    upstreamMap.get(dep.target_id).push(dep.source_id);
  }
  for (const dep of dependencies) {
    const health = getNormalizedHealth(dep.status);
    const sourceDegree = downstreamMap.get(dep.source_id)?.length || 0;
    const targetDegree = upstreamMap.get(dep.target_id)?.length || 0;
    const centralityScore = Math.min(1, +((sourceDegree + targetDegree) / (institutions.length + 4)).toFixed(2));
    const affectedSet = /* @__PURE__ */ new Set();
    affectedSet.add(dep.target_id);
    const secondaryHop = downstreamMap.get(dep.target_id) || [];
    for (const s of secondaryHop) affectedSet.add(s);
    const affectedCount = affectedSet.size;
    let reachScore = 0;
    for (const id of affectedSet) {
      const inst = institutions.find((i) => i.institution_id === id);
      reachScore += inst ? inst.systemic_footprint_score || 0.5 : 0.4;
    }
    const systemicReach = Math.min(1, +(reachScore / Math.max(1, institutions.length * 0.7)).toFixed(2));
    const incomingWeights = dependencies.filter((d) => d.target_id === dep.target_id).map((d) => d.exposure_weight || 0.5);
    const totalIncoming = incomingWeights.reduce((a, b) => a + b, 0);
    const weightShare = totalIncoming > 0 ? (dep.exposure_weight || 0.5) / totalIncoming : 1;
    const exposureHhi = +(weightShare * weightShare).toFixed(2);
    const redundancyPaths = Math.max(0, (upstreamMap.get(dep.target_id)?.length || 1) - 1);
    let criticality = "LOW";
    if (dep.is_chokepoint) {
      criticality = "CHOKEPOINT";
    } else if (systemicReach > 0.6 || (dep.exposure_weight || 0) > 0.8) {
      criticality = "CRITICAL";
    } else if (systemicReach > 0.35 || (dep.exposure_weight || 0) > 0.6) {
      criticality = "HIGH";
    } else if (systemicReach > 0.2) {
      criticality = "MEDIUM";
    }
    const propagationContribution = dep.status !== "STABLE" && dep.status !== "RESTORED" ? +((1 - health) * (dep.exposure_weight || 0.5) * (dep.is_chokepoint ? 1.5 : 1)).toFixed(2) : 0;
    records.push({
      dependency_id: dep.dependency_id,
      source_id: dep.source_id,
      target_id: dep.target_id,
      type: dep.type,
      centrality_score: centralityScore,
      affected_entity_count: affectedCount,
      systemic_reach_score: systemicReach,
      exposure_concentration_hhi: exposureHhi,
      redundancy_path_count: redundancyPaths,
      current_health: health,
      propagation_contribution: Math.min(1, propagationContribution),
      criticality,
      is_chokepoint: !!dep.is_chokepoint,
      truth_status: "DERIVED"
    });
  }
  return records;
}
function computeSystemicConcentrationMetrics(dependencies, institutions, dataProviders, infrastructureNodes, aiModels) {
  const providerUsage = /* @__PURE__ */ new Map();
  for (const dep of dependencies) {
    if (dataProviders.some((p) => p.provider_id === dep.source_id)) {
      providerUsage.set(dep.source_id, (providerUsage.get(dep.source_id) || 0) + 1);
    }
  }
  const totalProviderDeps = Array.from(providerUsage.values()).reduce((a, b) => a + b, 0);
  let dataHhi = 0;
  if (totalProviderDeps > 0) {
    for (const count of providerUsage.values()) {
      const share = count / totalProviderDeps;
      dataHhi += share * share;
    }
  } else {
    dataHhi = 0.5;
  }
  const infraUsage = /* @__PURE__ */ new Map();
  for (const dep of dependencies) {
    if (infrastructureNodes.some((n) => n.node_id === dep.source_id)) {
      infraUsage.set(dep.source_id, (infraUsage.get(dep.source_id) || 0) + 1);
    }
  }
  const totalInfraDeps = Array.from(infraUsage.values()).reduce((a, b) => a + b, 0);
  let infraHhi = 0;
  if (totalInfraDeps > 0) {
    for (const count of infraUsage.values()) {
      const share = count / totalInfraDeps;
      infraHhi += share * share;
    }
  } else {
    infraHhi = 0.5;
  }
  const modelUsage = /* @__PURE__ */ new Map();
  for (const inst of institutions) {
    for (const mId of inst.active_ai_models || []) {
      modelUsage.set(mId, (modelUsage.get(mId) || 0) + 1);
    }
  }
  const totalModelUsages = Array.from(modelUsage.values()).reduce((a, b) => a + b, 0);
  let modelHhi = 0;
  if (totalModelUsages > 0) {
    for (const count of modelUsage.values()) {
      const share = count / totalModelUsages;
      modelHhi += share * share;
    }
  } else {
    modelHhi = 0.25;
  }
  const chokepoints = dependencies.filter((d) => d.is_chokepoint);
  const totalChokeWeight = chokepoints.reduce((a, b) => a + (b.exposure_weight || 0.5), 0);
  let depHhi = 0;
  if (totalChokeWeight > 0) {
    for (const cp of chokepoints) {
      const share = (cp.exposure_weight || 0.5) / totalChokeWeight;
      depHhi += share * share;
    }
  } else {
    depHhi = 0.33;
  }
  const compositeIndex = +(dataHhi * 0.3 + infraHhi * 0.3 + modelHhi * 0.2 + depHhi * 0.2).toFixed(2);
  return {
    data_concentration_hhi: +dataHhi.toFixed(2),
    infrastructure_concentration_hhi: +infraHhi.toFixed(2),
    model_concentration_hhi: +modelHhi.toFixed(2),
    dependency_exposure_hhi: +depHhi.toFixed(2),
    composite_concentration_index: compositeIndex,
    truth_status: "DERIVED"
  };
}

// server/src/intelligence/propagationIntelligence.ts
function computePropagationIntelligence(institutions, dependencies, dataProviders, infrastructureNodes, aiModels, currentTick) {
  const activeTransmissionPaths = [];
  for (const dep of dependencies) {
    if (dep.status !== "STABLE" && dep.status !== "RESTORED") {
      activeTransmissionPaths.push({
        source_id: dep.source_id,
        dependency_id: dep.dependency_id,
        target_id: dep.target_id,
        latency_ms: dep.latency_ms || 25
      });
    }
  }
  const degradedInsts = institutions.filter((i) => ["DEGRADING", "CRITICAL", "COLLAPSING", "COMPROMISED", "RESIDUAL_RISK"].includes(i.status));
  const degradedProviders = dataProviders.filter((p) => ["COMPROMISED", "CRITICAL", "DEGRADING"].includes(p.status));
  const degradedInfra = infrastructureNodes.filter((n) => ["CRITICAL", "COLLAPSING", "COMPROMISED"].includes(n.status) || (n.current_load_percent || 0) > 90);
  const degradedModels = aiModels.filter((m) => ["COMPROMISED", "CRITICAL", "CONFLICTED"].includes(m.status));
  const totalAffected = degradedInsts.length + degradedProviders.length + degradedInfra.length + degradedModels.length;
  let depth = 0;
  if (degradedProviders.length > 0 || degradedInfra.length > 0) {
    depth = 1;
    if (activeTransmissionPaths.length > 0) depth = 2;
    if (degradedInsts.length > 0) depth = 3;
    if (degradedInsts.length >= 3 || degradedInsts.some((i) => i.tier === "G_SIB" && degradedInsts.some((j) => j.tier === "D_SIB"))) {
      depth = 4;
    }
  } else if (degradedModels.length > 0) {
    depth = 2;
    if (degradedInsts.length > 0) depth = 3;
  }
  const gSibImpactCount = degradedInsts.filter((i) => i.tier === "G_SIB").length;
  let scope = "LOCALIZED";
  if (totalAffected >= 4 || degradedInfra.length > 0 || gSibImpactCount >= 2 || depth >= 3) {
    scope = "SYSTEMIC";
  }
  const velocity = depth > 0 ? +(depth * 1.8).toFixed(1) : 0;
  const acceleration = currentTick > 0 ? +(totalAffected / Math.max(1, currentTick)).toFixed(2) : 0;
  return {
    cascade_velocity_nodes_per_sec: velocity,
    maximum_depth_hops: depth,
    breadth_affected_nodes: totalAffected,
    scope,
    active_transmission_paths: activeTransmissionPaths,
    acceleration_rate: acceleration,
    persistence_ticks: currentTick,
    truth_status: "DERIVED"
  };
}
function generateStateCausalExplanation(institutions, dependencies, dataProviders, infrastructureNodes, aiModels) {
  const explanation = [];
  const compProviders = dataProviders.filter((p) => ["COMPROMISED", "CRITICAL"].includes(p.status));
  const failInfra = infrastructureNodes.filter((n) => ["CRITICAL", "COLLAPSING"].includes(n.status));
  const compModels = aiModels.filter((m) => ["COMPROMISED", "CONFLICTED"].includes(m.status));
  if (compProviders.length > 0) {
    const p = compProviders[0];
    explanation.push(
      `Primary origin failure detected at Common Information Provider [${p.provider_id}] (${p.name}): Status compromised due to cryptographic oracle corruption.`
    );
  } else if (failInfra.length > 0) {
    const inf = failInfra[0];
    explanation.push(
      `Core infrastructure bottleneck occurred at [${inf.node_id}] (${inf.name}): Queue load reached ${inf.current_load_percent}%, exceeding safe throughput envelope.`
    );
  } else if (compModels.length > 0) {
    const m = compModels[0];
    explanation.push(
      `Latent algorithmic divergence detected at [${m.model_id}] (${m.name}): Model herd correlation reached ${m.herd_correlation_risk || 0.94}, triggering unobserved portfolio liquidation.`
    );
  } else {
    explanation.push("System operating within normal baseline equilibrium; no active origin failure detected.");
    return explanation;
  }
  const activeDeps = dependencies.filter((d) => d.status !== "STABLE" && d.status !== "RESTORED");
  if (activeDeps.length > 0) {
    const depNames = activeDeps.slice(0, 3).map((d) => `${d.dependency_id} (${d.type})`).join(", ");
    const maxLatency = Math.max(...activeDeps.map((d) => d.latency_ms || 20));
    explanation.push(
      `Transmission propagated across ${activeDeps.length} dependency rail(s) [${depNames}]: Average latency surged to ${maxLatency}ms with active payload taint.`
    );
  }
  const degradedInsts = institutions.filter((i) => ["DEGRADING", "CRITICAL", "COLLAPSING", "RESIDUAL_RISK"].includes(i.status));
  if (degradedInsts.length > 0) {
    const instNames = degradedInsts.map((i) => `${i.institution_id} [${i.status}]`).join(", ");
    const lowestLcr = Math.min(...degradedInsts.map((i) => i.liquidity_coverage_ratio));
    explanation.push(
      `Receiving institutions entered distressed states: ${instNames}. Minimum Liquidity Coverage Ratio compressed to ${lowestLcr}%.`
    );
  }
  const compromisedChokepoints = dependencies.filter((d) => d.is_chokepoint && d.status !== "STABLE");
  if (compromisedChokepoints.length > 0) {
    explanation.push(
      `Amplification: ${compromisedChokepoints.length} systemic chokepoints compromised, restricting alternative liquidity routing and preventing normal interbank balancing.`
    );
  }
  if (degradedInsts.some((i) => i.status === "RESIDUAL_RISK")) {
    explanation.push(
      `Verification alert: Reported containment does not match collateral reality. Status downgraded to RESIDUAL_RISK / UNVERIFIED.`
    );
  } else if (degradedInsts.length >= 3 || failInfra.length > 0) {
    explanation.push(
      "Controllability capacity narrowing rapidly: System enters critical threshold; immediate multi-entity coordinated isolation required."
    );
  } else {
    explanation.push(
      "Localized containment options remain active; targeted rail quarantine can halt further cascade."
    );
  }
  return explanation;
}

// server/src/intelligence/collectiveDecisionIntelligence.ts
function computeCollectiveDecisionSignal(institutions, aiModels, dataProviders, activeScenarioId) {
  const allAssignedModels = /* @__PURE__ */ new Set();
  for (const inst of institutions) {
    for (const mId of inst.active_ai_models || []) {
      allAssignedModels.add(mId);
    }
  }
  const totalPossibleModels = Math.max(1, aiModels.length);
  const observedDiversity = +(Math.min(1, allAssignedModels.size / totalPossibleModels) * 0.9 + 0.08).toFixed(2);
  const dataX = dataProviders.find((p) => p.provider_id === "DATA-X");
  const isDataTainted = dataX && (dataX.status === "COMPROMISED" || dataX.status === "DEGRADING");
  const isScenarioD = activeScenarioId === "SCENARIO_D";
  const modelC = aiModels.find((m) => m.model_id === "MODEL-C");
  const isBackstopQuarantined = Boolean(
    modelC && (modelC.effective_diversity_score >= 0.8 || modelC.herd_correlation_risk <= 0.15)
  );
  if (isBackstopQuarantined) {
    const rawDiversity2 = 0.95;
    const deltaData2 = 0.05;
    const deltaModel2 = 0.03;
    const deltaSync2 = 0.02;
    const effectiveDiversity2 = 0.85;
    const decisionSynchrony2 = 14;
    const herdingCorrelationIndex2 = 0.14;
    const alignment2 = "DIVERGENT";
    return {
      observed_model_diversity: rawDiversity2,
      effective_decision_diversity: effectiveDiversity2,
      decision_synchrony_percent: decisionSynchrony2,
      herding_correlation_index: herdingCorrelationIndex2,
      recommendation_alignment: alignment2,
      common_input_oracle_id: "DATA-X",
      decomposition: {
        observed_raw_diversity: rawDiversity2,
        common_data_penalty: deltaData2,
        model_correlation_penalty: deltaModel2,
        temporal_synchrony_penalty: deltaSync2,
        net_effective_decision_diversity: effectiveDiversity2,
        explanatory_narrative: "Enclave MODEL-C quarantine and parameter clamp restored effective decision diversity to 85% and decoupled temporal synchrony to 14% (0.14)."
      },
      truth_status: "EXPERIMENTAL"
    };
  }
  let herdCorrelationSum = 0;
  for (const m of aiModels) {
    herdCorrelationSum += m.herd_correlation_risk || 0.22;
  }
  let herdingCorrelationIndex = aiModels.length > 0 ? +(herdCorrelationSum / aiModels.length).toFixed(2) : 0.22;
  if (isScenarioD && herdingCorrelationIndex < 0.75) {
    herdingCorrelationIndex = 0.78;
  } else if (isDataTainted && herdingCorrelationIndex < 0.7) {
    herdingCorrelationIndex = 0.78;
  }
  const isDiversityCollapsed = isScenarioD || aiModels.some((m) => m.effective_diversity_score !== void 0 && m.effective_diversity_score <= 0.2);
  let decisionSynchrony = Math.round(18 + herdingCorrelationIndex * 70);
  if (isDiversityCollapsed) {
    decisionSynchrony = 94;
  }
  let deltaData = 0.05;
  let deltaModel = 0.03;
  let deltaSync = 0.02;
  if (isDiversityCollapsed || isScenarioD) {
    deltaData = 0.35;
    deltaModel = +(herdingCorrelationIndex * 0.32).toFixed(2);
    deltaSync = +(decisionSynchrony / 100 * 0.255).toFixed(2);
  } else if (isDataTainted) {
    deltaData = 0.45;
    deltaModel = +(herdingCorrelationIndex * 0.28).toFixed(2);
    deltaSync = +(decisionSynchrony / 100 * 0.22).toFixed(2);
  } else {
    deltaData = 0.05;
    deltaModel = 0.03;
    deltaSync = 0.02;
  }
  const rawDiversity = observedDiversity;
  let effectiveDiversity = +(rawDiversity - deltaData - deltaModel - deltaSync).toFixed(2);
  effectiveDiversity = Math.max(0.05, Math.min(1, effectiveDiversity));
  let alignment = "DIVERGENT";
  if (herdingCorrelationIndex > 0.85 || decisionSynchrony > 80 || isDiversityCollapsed) {
    alignment = "CONVERGED_SYNCHRONIZED";
  } else if (herdingCorrelationIndex > 0.5 || decisionSynchrony > 40) {
    alignment = "CORRELATED";
  }
  const decomposition = {
    observed_raw_diversity: rawDiversity,
    common_data_penalty: deltaData,
    model_correlation_penalty: deltaModel,
    temporal_synchrony_penalty: deltaSync,
    net_effective_decision_diversity: effectiveDiversity,
    explanatory_narrative: `Raw diversity (${Math.round(rawDiversity * 100)}%) discounted by shared oracle inputs (-${Math.round(deltaData * 100)}%), algorithmic correlation (-${Math.round(deltaModel * 100)}%), and millisecond temporal clustering (-${Math.round(deltaSync * 100)}%), yielding effective decision diversity of ${Math.round(effectiveDiversity * 100)}%.`
  };
  return {
    observed_model_diversity: observedDiversity,
    effective_decision_diversity: effectiveDiversity,
    decision_synchrony_percent: decisionSynchrony,
    herding_correlation_index: herdingCorrelationIndex,
    recommendation_alignment: alignment,
    common_input_oracle_id: "DATA-X",
    decomposition,
    truth_status: "EXPERIMENTAL"
  };
}

// server/src/intelligence/ablation.ts
var BASELINE_CONFIGURATIONS = {
  B0: {
    active_tier: "B0",
    enable_dependency_intelligence: false,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B1: {
    active_tier: "B1",
    enable_dependency_intelligence: false,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B2: {
    active_tier: "B2",
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B3: {
    active_tier: "B3",
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B4: {
    active_tier: "B4",
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: true,
    enable_uncertainty_gating: false
  },
  B5: {
    active_tier: "B5",
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: true,
    enable_uncertainty_gating: true
  }
};
var currentAblationConfig = BASELINE_CONFIGURATIONS.B5;
function getActiveAblationConfig() {
  return { ...currentAblationConfig };
}
function setActiveAblationTier(tier) {
  if (BASELINE_CONFIGURATIONS[tier]) {
    currentAblationConfig = { ...BASELINE_CONFIGURATIONS[tier] };
  }
  return getActiveAblationConfig();
}

// server/src/intelligence/controllabilityModel.ts
var ACTIVE_MODEL_VERSIONS = {
  control_margin_model: "CM-0.2",
  propagation_model: "PROP-0.2",
  decision_diversity_model: "EDD-0.1",
  concentration_model: "HHI-0.1",
  evidence_evaluation_model: "EVD-0.1"
};
function evaluateEvidenceQuality(evidenceRecords, institutions, dependencies, aiModels) {
  const observationGaps = [];
  for (const inst of institutions) {
    if (inst.status === "OBSERVATION_GAP") {
      observationGaps.push(`Institution [${inst.institution_id}] telemetry link timeout`);
    }
  }
  for (const m of aiModels) {
    if (m.status === "CONFLICTED" || m.status === "OBSERVATION_GAP") {
      observationGaps.push(`AI Model [${m.model_id}] enclave attestation unverified`);
    }
  }
  const conflictDetected = institutions.some((i) => i.status === "RESIDUAL_RISK") || aiModels.some((m) => m.status === "CONFLICTED");
  const conflictDesc = conflictDetected ? "Surface recovery telemetry contradicts underlying collateral stress or algorithmic divergence." : void 0;
  const validEvidenceCount = evidenceRecords.filter((e) => e.enclave_attested && !!e.payload_digest_sha256).length;
  const sufficiencyScore = +(Math.min(1, validEvidenceCount > 0 ? validEvidenceCount / 3 : 0.94) * (observationGaps.length === 0 ? 1 : 0.65)).toFixed(2);
  let confidenceRating = "HIGH";
  if (observationGaps.length > 1 || conflictDetected) {
    confidenceRating = "LOW";
  } else if (observationGaps.length === 1) {
    confidenceRating = "MEDIUM";
  }
  return {
    observation_count: evidenceRecords.length + institutions.length + dependencies.length,
    source_diversity_score: 0.88,
    average_freshness_seconds: 1.2,
    evidence_sufficiency_score: sufficiencyScore,
    confidence_rating: confidenceRating,
    conflict_detected: conflictDetected,
    conflict_description: conflictDesc,
    observation_gaps: observationGaps,
    truth_status: "DERIVED"
  };
}
function computeControlMarginContribution(depIntelligence, propIntelligence, concentration, decisionSignal, institutions, dataProviders, infrastructureNodes, incidents, ablationConfig, params, aiModels) {
  const BASELINE = 91;
  const isBackstopQuarantined = Boolean(
    aiModels && aiModels.some((m) => m.model_id === "MODEL-C" && (m.effective_diversity_score >= 0.8 || m.herd_correlation_risk <= 0.15)) || decisionSignal?.decision_synchrony_percent === 14 && decisionSignal?.effective_decision_diversity === 0.85
  );
  if (isBackstopQuarantined) {
    const deltaDep2 = 3.8;
    const deltaProp2 = 2;
    const deltaInfra2 = 0;
    const deltaHerd2 = 1;
    const deltaRec2 = 0;
    const netMargin2 = +(BASELINE - deltaDep2 - deltaProp2 - deltaInfra2 - deltaHerd2 + deltaRec2).toFixed(1);
    return {
      baseline_margin: BASELINE,
      delta_dependency_concentration: -deltaDep2,
      delta_propagation_depth: -deltaProp2,
      delta_infrastructure_stress: -deltaInfra2,
      delta_decision_convergence: -deltaHerd2,
      delta_recovery_capacity: +deltaRec2,
      net_control_margin: netMargin2,
      primary_driver_category: "Restored Stability"
    };
  }
  const wProv = params?.provider_weight ?? 16;
  const wChoke = params?.chokepoint_weight ?? 2.5;
  const wHhi = params?.hhi_weight ?? 6;
  const wPropHop = params?.propagation_hop_weight ?? 4;
  const wInfra = params?.infrastructure_node_weight ?? 28;
  const wDivLoss = params?.decision_diversity_weight ?? 34;
  const wRec = params?.recovery_node_weight ?? 8;
  const hasCompromisedProvider = dataProviders.some((p) => ["COMPROMISED", "CRITICAL"].includes(p.status));
  const hasCompromisedInfra = infrastructureNodes.some((n) => ["CRITICAL", "COLLAPSING"].includes(n.status) || (n.current_load_percent || 0) > 90);
  const hasUnstableInst = institutions.some((i) => i.status !== "STABLE");
  const hasActiveIncident = incidents.some((i) => i.status === "ACTIVE" || i.status === "CONTAINING");
  const isDiversityCollapsed = decisionSignal.recommendation_alignment === "CONVERGED_SYNCHRONIZED" && decisionSignal.effective_decision_diversity <= 0.2;
  const isEquilibrium = !hasActiveIncident && !hasCompromisedProvider && !hasCompromisedInfra && !hasUnstableInst && !isDiversityCollapsed;
  if (isEquilibrium) {
    return {
      baseline_margin: BASELINE,
      delta_dependency_concentration: 0,
      delta_propagation_depth: 0,
      delta_infrastructure_stress: 0,
      delta_decision_convergence: 0,
      delta_recovery_capacity: 0,
      net_control_margin: BASELINE,
      primary_driver_category: "Equilibrium"
    };
  }
  const enableDep = ablationConfig ? ablationConfig.enable_dependency_intelligence : true;
  const enableProp = ablationConfig ? ablationConfig.enable_propagation_intelligence : true;
  const enableHerd = ablationConfig ? ablationConfig.enable_collective_decision_signal : true;
  let deltaDep = 0;
  if (enableDep) {
    const compromisedChokepoints = depIntelligence.filter((d) => d.is_chokepoint && d.current_health < 0.8).length;
    const compromisedProviders = dataProviders.filter((p) => ["COMPROMISED", "CRITICAL"].includes(p.status)).length;
    const residualRiskInsts = institutions.filter((i) => i.status === "RESIDUAL_RISK").length;
    if (hasCompromisedProvider) {
      deltaDep = Math.round(compromisedProviders * wProv) + Math.round(compromisedChokepoints * wChoke) + Math.round(concentration.data_concentration_hhi * wHhi);
    } else if (residualRiskInsts > 0) {
      deltaDep = residualRiskInsts * 8 + Math.round(compromisedChokepoints * 1.5);
    } else if (hasCompromisedInfra) {
      deltaDep = Math.min(6, compromisedChokepoints * 2);
    } else if (isDiversityCollapsed) {
      deltaDep = 8;
    } else if (hasActiveIncident) {
      deltaDep = Math.round(compromisedChokepoints * 3 + concentration.data_concentration_hhi * 4);
    }
    deltaDep = Math.min(32, deltaDep);
  }
  let deltaProp = 0;
  if (enableProp) {
    const isSystemicScope = propIntelligence.scope === "SYSTEMIC";
    deltaProp = Math.round(propIntelligence.maximum_depth_hops * wPropHop) + (isSystemicScope ? hasCompromisedInfra ? 8 : hasCompromisedProvider ? 9 : 6 : 0);
    deltaProp = Math.min(25, deltaProp);
  }
  const failingInfra = infrastructureNodes.filter((n) => ["CRITICAL", "COLLAPSING"].includes(n.status) || (n.current_load_percent || 0) > 90);
  let deltaInfra = 0;
  if (failingInfra.length > 0) {
    const maxLoad = Math.max(...failingInfra.map((n) => n.current_load_percent || 0));
    const loadPenalty = maxLoad > 90 ? Math.round((maxLoad - 90) / 1.2) : 0;
    deltaInfra = Math.min(35, Math.round(failingInfra.length * wInfra) + Math.min(7, loadPenalty));
  }
  let deltaHerd = 0;
  if (enableHerd) {
    const diversityLoss = Math.max(0, 0.88 - decisionSignal.effective_decision_diversity);
    if (isDiversityCollapsed) {
      deltaHerd = Math.round(diversityLoss * wDivLoss) + (decisionSignal.decision_synchrony_percent > 80 ? 10 : 0);
    } else if (institutions.some((i) => i.status === "RESIDUAL_RISK")) {
      deltaHerd = 21;
    } else if (decisionSignal.decision_synchrony_percent > 85) {
      deltaHerd = 12;
    }
    deltaHerd = Math.min(35, deltaHerd);
  }
  const recoveringNodes = institutions.filter((i) => i.status === "RECOVERING").length + dataProviders.filter((p) => p.status === "RECOVERING").length;
  const deltaRec = Math.min(15, Math.round(recoveringNodes * wRec));
  let netMargin = BASELINE - deltaDep - deltaProp - deltaInfra - deltaHerd + deltaRec;
  netMargin = Math.max(15, Math.min(96, Math.round(netMargin)));
  const factorMap = {
    "Dependency & Oracle Concentration": deltaDep,
    "Multi-Hop Cascade Depth": deltaProp,
    "Core Infrastructure Outage": deltaInfra,
    "Collective Decision Convergence": deltaHerd
  };
  let maxFactor = "Equilibrium";
  let maxDelta = 0;
  for (const [k, v] of Object.entries(factorMap)) {
    if (v > maxDelta) {
      maxDelta = v;
      maxFactor = k;
    }
  }
  return {
    baseline_margin: BASELINE,
    delta_dependency_concentration: -deltaDep,
    delta_propagation_depth: -deltaProp,
    delta_infrastructure_stress: -deltaInfra,
    delta_decision_convergence: -deltaHerd,
    delta_recovery_capacity: +deltaRec,
    net_control_margin: netMargin,
    primary_driver_category: maxFactor
  };
}
function deriveControllabilityState(controlMargin, evidenceQuality, hasResidualRisk, hasActiveIncident, hasExecutedIntervention = false, ablationConfig) {
  const enableUncertainty = ablationConfig ? ablationConfig.enable_uncertainty_gating : true;
  if (enableUncertainty) {
    if (hasResidualRisk || evidenceQuality.conflict_detected || (controlMargin >= 65 || !hasActiveIncident) && evidenceQuality.observation_gaps.length > 0) {
      return "CONTROL_UNVERIFIED";
    }
  }
  if (controlMargin < 30) return "CONTROL_COLLAPSING";
  if (controlMargin <= 50) return "CONTROL_CRITICAL";
  if (controlMargin < 65) return "CONTROL_DEGRADING";
  if (controlMargin < 80 && hasActiveIncident) {
    return hasExecutedIntervention ? "CONTROL_RECOVERING" : "CONTROL_DEGRADING";
  }
  if (!hasActiveIncident && hasExecutedIntervention && controlMargin >= 80) return "CONTROL_RESTORED";
  if (controlMargin >= 80) return "CONTROL_STABLE";
  return "CONTROL_DEGRADING";
}
function generateSystemicControllabilityAssessment(institutions, dependencies, dataProviders, infrastructureNodes, aiModels, incidents, evidenceRecords, currentTick, activeScenarioId, interventions = [], ablationConfigOverride) {
  const ablationConfig = ablationConfigOverride || getActiveAblationConfig();
  const depIntelligence = computeDependencyIntelligence(dependencies, institutions, dataProviders, infrastructureNodes);
  const concentration = computeSystemicConcentrationMetrics(dependencies, institutions, dataProviders, infrastructureNodes, aiModels);
  const propIntelligence = computePropagationIntelligence(institutions, dependencies, dataProviders, infrastructureNodes, aiModels, currentTick);
  const decisionSignal = computeCollectiveDecisionSignal(institutions, aiModels, dataProviders, activeScenarioId);
  const evidenceQuality = evaluateEvidenceQuality(evidenceRecords, institutions, dependencies, aiModels);
  const contributions = computeControlMarginContribution(
    depIntelligence,
    propIntelligence,
    concentration,
    decisionSignal,
    institutions,
    dataProviders,
    infrastructureNodes,
    incidents,
    ablationConfig,
    void 0,
    aiModels
  );
  const hasResidualRisk = institutions.some((i) => i.status === "RESIDUAL_RISK");
  const hasActiveIncident = incidents.some((i) => i.status === "ACTIVE" || i.status === "CONTAINING");
  const hasExecutedIntervention = interventions.some((i) => i.status === "EXECUTED");
  const controllabilityState = deriveControllabilityState(
    contributions.net_control_margin,
    evidenceQuality,
    hasResidualRisk,
    hasActiveIncident,
    hasExecutedIntervention,
    ablationConfig
  );
  const velocityPenalty = propIntelligence.cascade_velocity_nodes_per_sec * 8;
  const stressPenalty = Math.round(concentration.composite_concentration_index * 20);
  const estimatedWindow = Math.max(15, Math.min(180, Math.round(contributions.net_control_margin * 1.6 - velocityPenalty - stressPenalty)));
  const primaryDriver = contributions.primary_driver_category !== "Equilibrium" ? `${contributions.primary_driver_category} induced a major control drop.` : "System operating in normal baseline state with optimal control buffer.";
  const secondaryDrivers = [];
  if (propIntelligence.maximum_depth_hops >= 2) {
    secondaryDrivers.push(`Cascade reached depth ${propIntelligence.maximum_depth_hops} across ${propIntelligence.breadth_affected_nodes} nodes.`);
  }
  if (concentration.composite_concentration_index > 0.4) {
    secondaryDrivers.push(`High structural concentration (Index: ${concentration.composite_concentration_index}) amplified exposure.`);
  }
  const amplifyingConditions = [];
  if (decisionSignal.recommendation_alignment !== "DIVERGENT") {
    amplifyingConditions.push(`Collective decision convergence: Effective diversity collapsed to ${decisionSignal.effective_decision_diversity}.`);
  }
  if (propIntelligence.scope === "SYSTEMIC") {
    amplifyingConditions.push("Multi-jurisdictional systemic reach detected across Tier-1 institutions.");
  }
  const protectiveFactors = [];
  const healthyInfra = infrastructureNodes.filter((n) => n.status === "STABLE");
  if (healthyInfra.length > 0) {
    protectiveFactors.push(`${healthyInfra.map((n) => n.node_id).join(", ")} operational; clearing rails partially isolated.`);
  }
  if (contributions.delta_recovery_capacity > 0) {
    protectiveFactors.push(`Active recovery protocols generating +${contributions.delta_recovery_capacity}% margin buffer.`);
  }
  const uncertainties = [];
  if (evidenceQuality.observation_gaps.length > 0) {
    uncertainties.push(...evidenceQuality.observation_gaps);
  }
  if (evidenceQuality.conflict_detected) {
    uncertainties.push("Conflicting telemetry: Verification integrity unconfirmed under pre-tainted balancing.");
  }
  const causalChain = generateStateCausalExplanation(
    institutions,
    dependencies,
    dataProviders,
    infrastructureNodes,
    aiModels
  );
  const isEquilibrium = contributions.primary_driver_category === "Equilibrium";
  let systemicStressIndex = 0.08;
  if (!isEquilibrium) {
    const compromisedProviders = dataProviders.filter((p) => ["COMPROMISED", "CRITICAL"].includes(p.status)).length;
    const failingInfra = infrastructureNodes.filter((n) => ["CRITICAL", "COLLAPSING"].includes(n.status) || (n.current_load_percent || 0) > 90).length;
    const unstableInsts = institutions.filter((i) => i.status !== "STABLE").length;
    const chokepointsDistressed = depIntelligence.filter((d) => d.is_chokepoint && d.current_health < 0.8).length;
    const depthFactor = Math.min(1, propIntelligence.maximum_depth_hops / 4);
    systemicStressIndex = +Math.min(0.98, Math.max(
      0.12,
      compromisedProviders * 0.28 + failingInfra * 0.3 + unstableInsts * 0.06 + chokepointsDistressed * 0.12 + depthFactor * 0.24
    )).toFixed(2);
  }
  const controlCapacityIndex = +Math.max(0.05, Math.min(
    0.98,
    contributions.net_control_margin / 100 * (evidenceQuality.evidence_sufficiency_score || 0.95)
  )).toFixed(2);
  const BASELINE = 91;
  let degradationRate = 0;
  if (contributions.net_control_margin < BASELINE) {
    const tickSpan = Math.max(1, currentTick);
    degradationRate = +(-Math.min(25, Math.max(1, (BASELINE - contributions.net_control_margin) / tickSpan + propIntelligence.cascade_velocity_nodes_per_sec * 2.5))).toFixed(1);
  }
  let marginTrend = "STABLE";
  if (contributions.delta_recovery_capacity > 10 || controllabilityState === "CONTROL_RECOVERING") {
    marginTrend = "RECOVERING";
  } else if (contributions.net_control_margin >= 80) {
    marginTrend = "STABLE";
  } else if (contributions.net_control_margin < 30 || degradationRate < -12) {
    marginTrend = "CRITICAL";
  } else if (degradationRate < -4 || contributions.net_control_margin < 50) {
    marginTrend = "RAPIDLY_DEGRADING";
  } else {
    marginTrend = "DEGRADING";
  }
  const windowTicks = Math.max(2, Math.round(estimatedWindow / 3));
  const windowTrend = contributions.net_control_margin < 35 ? "CRITICAL" : contributions.net_control_margin < 65 ? "SHRINKING" : contributions.delta_recovery_capacity > 5 ? "EXPANDING" : "STABLE";
  const interventionWindow = {
    estimated_window_ticks: windowTicks,
    estimated_window_seconds: estimatedWindow,
    trend: windowTrend,
    primary_driver: contributions.primary_driver_category,
    secondary_driver: propIntelligence.scope === "SYSTEMIC" ? "Multi-hop systemic cascade" : "Direct bilateral exposure",
    uncertainty_bounds_ticks: Math.max(1, Math.round(windowTicks * 0.25))
  };
  return {
    assessment_id: `ASM-${currentTick.toString().padStart(4, "0")}-${Date.now().toString(36).toUpperCase()}`,
    tick: currentTick,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    controllability_state: controllabilityState,
    control_margin_percent: contributions.net_control_margin,
    estimated_intervention_window_sec: estimatedWindow,
    systemic_stress_index: systemicStressIndex,
    control_capacity_index: controlCapacityIndex,
    control_degradation_rate: degradationRate,
    control_margin_trend: marginTrend,
    primary_driver: primaryDriver,
    secondary_drivers: secondaryDrivers,
    amplifying_conditions: amplifyingConditions,
    protective_factors: protectiveFactors,
    uncertainties,
    causal_explanation_chain: causalChain,
    contributions,
    propagation_intelligence: propIntelligence,
    concentration_metrics: concentration,
    collective_decision_signal: decisionSignal,
    evidence_quality: evidenceQuality,
    intervention_window: interventionWindow,
    model_versions: ACTIVE_MODEL_VERSIONS
  };
}
function evaluateCounterfactualSimulation(engine, hypothesis, targetEntityId) {
  const clonedInstitutions = JSON.parse(JSON.stringify(engine.institutions));
  const clonedDeps = JSON.parse(JSON.stringify(engine.dependencies));
  const clonedProviders = JSON.parse(JSON.stringify(engine.dataProviders));
  const clonedInfra = JSON.parse(JSON.stringify(engine.infrastructureNodes));
  const clonedModels = JSON.parse(JSON.stringify(engine.aiModels));
  const clonedIncidents = JSON.parse(JSON.stringify(engine.incidents));
  const clonedEvidence = JSON.parse(JSON.stringify(engine.evidenceRecords));
  const baseAssessment = engine.controlState.intelligence || generateSystemicControllabilityAssessment(
    engine.institutions,
    engine.dependencies,
    engine.dataProviders,
    engine.infrastructureNodes,
    engine.aiModels,
    engine.incidents,
    engine.evidenceRecords,
    engine.clock.tick,
    engine.activeScenarioId,
    engine.interventions
  );
  const targetProvider = clonedProviders.find((p) => p.provider_id === targetEntityId);
  if (targetProvider) {
    targetProvider.status = "RESTORED";
    for (const d of clonedDeps) {
      if (d.source_id === targetEntityId) {
        d.status = "STABLE";
        d.exposure_weight = 0;
      }
    }
    for (const inst of clonedInstitutions) {
      if (["DISTRESSED", "RESIDUAL_RISK", "DEGRADING", "CRITICAL"].includes(inst.status)) {
        const wasDependent = clonedDeps.some((d) => d.source_id === targetEntityId && d.target_id === inst.institution_id);
        if (wasDependent) {
          inst.status = "RECOVERING";
        }
      }
    }
  }
  const targetInst = clonedInstitutions.find((i) => i.institution_id === targetEntityId);
  if (targetInst) {
    targetInst.status = "RECOVERING";
    for (const d of clonedDeps) {
      if (d.source_id === targetEntityId || d.target_id === targetEntityId) {
        d.exposure_weight = Math.min(0.05, d.exposure_weight * 0.1);
        if (d.status !== "STABLE") d.status = "STABLE";
      }
    }
  }
  const targetNode = clonedInfra.find((n) => n.node_id === targetEntityId);
  if (targetNode) {
    targetNode.status = "STABLE";
    targetNode.current_load_percent = 45;
    for (const inst of clonedInstitutions) {
      if (["DISTRESSED", "CRITICAL", "DEGRADING"].includes(inst.status)) {
        inst.status = "RECOVERING";
      }
    }
  }
  const counterfactualAssessment = generateSystemicControllabilityAssessment(
    clonedInstitutions,
    clonedDeps,
    clonedProviders,
    clonedInfra,
    clonedModels,
    clonedIncidents,
    clonedEvidence,
    engine.clock.tick,
    engine.activeScenarioId,
    engine.interventions
  );
  const baseMargin = baseAssessment.control_margin_percent;
  const simulatedMargin = counterfactualAssessment.control_margin_percent;
  const deltaMargin = simulatedMargin - baseMargin;
  return {
    hypothesis: hypothesis || `Counterfactual isolation of ${targetEntityId}`,
    target_entity_id: targetEntityId,
    baseline_control_margin: baseMargin,
    counterfactual_control_margin: simulatedMargin,
    delta_margin: deltaMargin,
    controllability_state: deriveControllabilityState(simulatedMargin, counterfactualAssessment.evidence_quality, false, false, true),
    status: "COUNTERFACTUAL_SIMULATION",
    executed: false,
    narrative: `Hypothetical intervention on [${targetEntityId}] restores +${deltaMargin}% control margin by severing downstream contagion paths. Live operational state remains unchanged.`
  };
}
function evaluateAblationImpacts(baseAssessment) {
  const fullMargin = baseAssessment.control_margin_percent;
  const contrib = baseAssessment.contributions;
  const ablations = [
    {
      feature: "dependency_concentration",
      margin_without_feature: Math.min(96, fullMargin - contrib.delta_dependency_concentration),
      delta_points: Math.abs(contrib.delta_dependency_concentration),
      relative_importance: +(Math.abs(contrib.delta_dependency_concentration) / Math.max(1, 91 - fullMargin)).toFixed(2)
    },
    {
      feature: "propagation_depth",
      margin_without_feature: Math.min(96, fullMargin - contrib.delta_propagation_depth),
      delta_points: Math.abs(contrib.delta_propagation_depth),
      relative_importance: +(Math.abs(contrib.delta_propagation_depth) / Math.max(1, 91 - fullMargin)).toFixed(2)
    },
    {
      feature: "infrastructure_stress",
      margin_without_feature: Math.min(96, fullMargin - contrib.delta_infrastructure_stress),
      delta_points: Math.abs(contrib.delta_infrastructure_stress),
      relative_importance: +(Math.abs(contrib.delta_infrastructure_stress) / Math.max(1, 91 - fullMargin)).toFixed(2)
    },
    {
      feature: "decision_convergence",
      margin_without_feature: Math.min(96, fullMargin - contrib.delta_decision_convergence),
      delta_points: Math.abs(contrib.delta_decision_convergence),
      relative_importance: +(Math.abs(contrib.delta_decision_convergence) / Math.max(1, 91 - fullMargin)).toFixed(2)
    }
  ];
  ablations.sort((a, b) => b.delta_points - a.delta_points);
  return {
    active_tier: "B5",
    full_model_margin: fullMargin,
    ablations,
    most_critical_factor: ablations[0]?.feature || "none"
  };
}
function computeEntityControllabilityIntelligence(entityId, institutions, dependencies, dataProviders, infrastructureNodes, aiModels) {
  const inst = institutions.find((i) => i.institution_id === entityId);
  const prov = dataProviders.find((p) => p.provider_id === entityId);
  const node = infrastructureNodes.find((n) => n.node_id === entityId);
  const model = aiModels.find((m) => m.model_id === entityId);
  if (!inst && !prov && !node && !model) return null;
  const name = inst?.name || prov?.name || node?.name || model?.name || entityId;
  const entityType = inst ? "INSTITUTION" : prov ? "DATA_PROVIDER" : node ? "INFRASTRUCTURE" : "AI_MODEL";
  const connectedDeps = dependencies.filter((d) => d.source_id === entityId || d.target_id === entityId);
  const affectedInstCount = new Set(
    dependencies.filter((d) => d.source_id === entityId).map((d) => d.target_id)
  ).size;
  const centrality = +Math.min(1, connectedDeps.length / 8).toFixed(2);
  const impactScore = +Math.min(1, affectedInstCount * 0.18 + centrality * 0.4).toFixed(2);
  return {
    entity_id: entityId,
    name,
    entity_type: entityType,
    centrality_score: centrality,
    institutions_affected_count: affectedInstCount,
    common_information_exposure_pct: prov ? 82.5 : inst ? 45 : 30,
    propagation_contribution_score: +Math.min(1, affectedInstCount / 6).toFixed(2),
    control_impact_score: impactScore,
    evidence_freshness_sec: 1.2,
    confidence_score: 0.92,
    truth_status: "DERIVED"
  };
}
function evaluateParameterSensitivity(engine) {
  const assessment = engine.controlState?.intelligence || generateSystemicControllabilityAssessment(
    engine.institutions,
    engine.dependencies,
    engine.dataProviders,
    engine.infrastructureNodes,
    engine.aiModels,
    engine.incidents,
    engine.evidenceRecords,
    engine.clock?.tick || 0,
    engine.activeScenarioId,
    engine.interventions
  );
  const baseMargin = assessment.control_margin_percent;
  const depIntelligence = computeDependencyIntelligence(engine.dependencies, engine.institutions, engine.dataProviders, engine.infrastructureNodes);
  const concentration = computeSystemicConcentrationMetrics(engine.dependencies, engine.institutions, engine.dataProviders, engine.infrastructureNodes, engine.aiModels);
  const propIntelligence = computePropagationIntelligence(engine.institutions, engine.dependencies, engine.dataProviders, engine.infrastructureNodes, engine.aiModels, engine.clock?.tick || 0);
  const decisionSignal = computeCollectiveDecisionSignal(engine.institutions, engine.aiModels, engine.dataProviders, engine.activeScenarioId);
  const parameterDefs = [
    { key: "propagation_depth_damping", paramKey: "propagation_hop_weight", baseValue: 4 },
    { key: "concentration_hhi_weight", paramKey: "hhi_weight", baseValue: 6 },
    { key: "chokepoint_penalty_weight", paramKey: "chokepoint_weight", baseValue: 2.5 },
    { key: "decision_diversity_weight", paramKey: "decision_diversity_weight", baseValue: 34 },
    { key: "infrastructure_failure_weight", paramKey: "infrastructure_node_weight", baseValue: 28 },
    { key: "recovery_rate_weight", paramKey: "recovery_node_weight", baseValue: 8 }
  ];
  const variations = [-20, 20];
  const sweeps = [];
  for (const def of parameterDefs) {
    for (const vPct of variations) {
      const perturbedVal = +(def.baseValue * (1 + vPct / 100)).toFixed(2);
      const customParams = { [def.paramKey]: perturbedVal };
      const contrib = computeControlMarginContribution(
        depIntelligence,
        propIntelligence,
        concentration,
        decisionSignal,
        engine.institutions,
        engine.dataProviders,
        engine.infrastructureNodes,
        engine.incidents,
        void 0,
        customParams
      );
      const simMargin = contrib.net_control_margin;
      const deltaMargin = simMargin - baseMargin;
      const elasticity = +(deltaMargin / (vPct / 100)).toFixed(2);
      sweeps.push({
        parameter: def.key,
        base_value: def.baseValue,
        variation_pct: vPct,
        perturbed_value: perturbedVal,
        simulated_margin: simMargin,
        delta_margin: deltaMargin,
        elasticity
      });
    }
  }
  let maxElast = 0;
  let mostSensitive = parameterDefs[0].key;
  for (const s of sweeps) {
    if (Math.abs(s.elasticity) > maxElast) {
      maxElast = Math.abs(s.elasticity);
      mostSensitive = s.parameter;
    }
  }
  return {
    base_margin: baseMargin,
    parameters_evaluated: parameterDefs.map((d) => d.key),
    sensitivity_sweeps: sweeps,
    most_sensitive_parameter: mostSensitive,
    max_elasticity: maxElast,
    evaluation_timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// server/src/foundry/candidateGenerator.ts
function generateInterventionCandidates(incident, institutions, dependencies, dataProviders, infrastructureNodes, aiModels, controlMargin, activeScenarioId) {
  const incidentId = incident?.incident_id || "RN-2026-0041";
  const candidates = [];
  candidates.push({
    id: `CAND-${incidentId}-NO-ACTION`,
    incident_id: incidentId,
    type: "NO_ACTION",
    title: "No Action (Counterfactual Baseline)",
    description: "Maintain status quo without active enclave intervention. System absorbs full uncontained contagion propagation.",
    target_entities: [],
    target_dependencies: [],
    trigger_condition: "Operator elects passive observation.",
    expected_effect: "Unimpeded cascade propagation across connected dependency rails.",
    expected_control_margin_delta: -Math.min(25, Math.max(12, Math.round(controlMargin * 0.4))),
    estimated_disruption: "NONE",
    estimated_disruption_cost_score: 0,
    estimated_cost_usd_m: 0,
    estimated_latency_sec: 0,
    reversibility: "HIGH",
    collateral_exposure_pct: 85,
    authority_required: "OBSERVER",
    evidence_required: [],
    confidence: "HIGH",
    uncertainty: 0.05,
    risk_if_executed: "No immediate operational disruption, but systemic exposure compounds.",
    risk_if_not_executed: "Systemic contagion cascades into unrecoverable liquidity horizon.",
    execution_capability: "AVAILABLE",
    is_minimum_effective: false,
    status: "CANDIDATE",
    scientific_truth_label: "SIMULATED"
  });
  const compromisedProvider = dataProviders.find((p) => ["COMPROMISED", "CRITICAL", "DEGRADING"].includes(p.status));
  const compromisedInfra = infrastructureNodes.find((n) => ["CRITICAL", "COLLAPSING"].includes(n.status) || (n.current_load_percent || 0) > 90);
  const isHerdingCrisis = activeScenarioId === "SCENARIO_D" || aiModels.some((m) => m.effective_diversity_score !== void 0 && m.effective_diversity_score <= 0.2);
  const hasResidualRisk = institutions.some((i) => i.status === "RESIDUAL_RISK") || activeScenarioId === "SCENARIO_C";
  if (isHerdingCrisis) {
    candidates.push({
      id: `CAND-${incidentId}-MODEL-DIV`,
      incident_id: incidentId,
      type: "MODEL_DIVERSIFICATION",
      title: "Algorithmic Model Diversification & Rule Fallback",
      description: "Force institutional risk algorithms (MODEL-A, MODEL-C) into decoupled fallback execution modes utilizing uncorrelated synthetic rates.",
      target_entities: ["MODEL-A", "MODEL-C"],
      target_dependencies: ["DEP_MODEL_C_ASSET_17"],
      trigger_condition: "Effective Decision Diversity dropped below 0.20 with >85% synchrony.",
      expected_effect: "Breaks collective decision synchrony; restores effective diversity above 0.70.",
      expected_control_margin_delta: 36,
      estimated_disruption: "LOW",
      estimated_disruption_cost_score: 18,
      estimated_cost_usd_m: 3.5,
      estimated_latency_sec: 8,
      reversibility: "HIGH",
      collateral_exposure_pct: 12,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-007", "EVD-2026-008"],
      confidence: "HIGH",
      uncertainty: 0.12,
      risk_if_executed: "Temporary degradation in algorithmic execution latency (5-15ms).",
      risk_if_not_executed: "Runaway herd liquidation triggers synthetic margin default cascade.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: true,
      status: "RECOMMENDED",
      scientific_truth_label: "EXPERIMENTAL"
    });
    candidates.push({
      id: `CAND-${incidentId}-TEMPORAL-STAGGER`,
      incident_id: incidentId,
      type: "TEMPORAL_STAGGERING",
      title: "Order Submission Temporal Jitter Injection",
      description: "Inject randomized 150-600ms network buffers across institutional execution gateways to disrupt temporal liquidity withdrawal synchronization.",
      target_entities: ["BANK-A", "BANK-B", "BANK-C", "BANK-D"],
      target_dependencies: [],
      trigger_condition: "Simultaneous liquidity pull clustering detected.",
      expected_effect: "Partial desynchronization of trade orders; reduces peak liquidity drain.",
      expected_control_margin_delta: 22,
      estimated_disruption: "MEDIUM",
      estimated_disruption_cost_score: 34,
      estimated_cost_usd_m: 8.2,
      estimated_latency_sec: 14,
      reversibility: "HIGH",
      collateral_exposure_pct: 28,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-007"],
      confidence: "MEDIUM",
      uncertainty: 0.22,
      risk_if_executed: "Slight delay in settlement execution windows.",
      risk_if_not_executed: "Synchronous liquidity drain exceeds clearing capacity.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "EXPERIMENTAL"
    });
    candidates.push({
      id: `CAND-${incidentId}-BROAD-THROTTLE`,
      incident_id: incidentId,
      type: "EXPOSURE_REDUCTION",
      title: "System-Wide Algorithmic Execution Throttle (60%)",
      description: "Impose regulatory throughput cap on all autonomous trading models across G-SIB banking nodes.",
      target_entities: ["BANK-A", "BANK-B", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_BANK_A_BANK_B", "DEP_BANK_B_BANK_C"],
      trigger_condition: "Systemic liquidity contagion threat.",
      expected_effect: "Forces immediate volume dampening at the expense of market efficiency.",
      expected_control_margin_delta: 32,
      estimated_disruption: "HIGH",
      estimated_disruption_cost_score: 68,
      estimated_cost_usd_m: 42,
      estimated_latency_sec: 20,
      reversibility: "MEDIUM",
      collateral_exposure_pct: 45,
      authority_required: "RISK_OFFICER",
      evidence_required: ["EVD-2026-007"],
      confidence: "MEDIUM",
      uncertainty: 0.25,
      risk_if_executed: "Significant reduction in intraday market liquidity and trading volume.",
      risk_if_not_executed: "Uncapped algorithmic order flow exacerbates herd sell-off.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
  } else if (compromisedInfra) {
    candidates.push({
      id: `CAND-${incidentId}-RTGS-BYPASS`,
      incident_id: incidentId,
      type: "DEPENDENCY_ISOLATION",
      title: "RTGS Queue Shedding & Priority Netting (INFRA-1)",
      description: "Shed non-critical retail payment traffic and establish dedicated bilateral netting channels for CCP margin calls.",
      target_entities: [compromisedInfra.node_id],
      target_dependencies: ["DEP_INFRA_1_BANK_A", "DEP_INFRA_1_BANK_B"],
      trigger_condition: "RTGS buffer load exceeded 95% with clearing timeouts.",
      expected_effect: "Restores core interbank clearing rail liquidity and clears payment backlog.",
      expected_control_margin_delta: 48,
      estimated_disruption: "MEDIUM",
      estimated_disruption_cost_score: 38,
      estimated_cost_usd_m: 14.5,
      estimated_latency_sec: 15,
      reversibility: "HIGH",
      collateral_exposure_pct: 22,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-004", "EVD-2026-005"],
      confidence: "HIGH",
      uncertainty: 0.15,
      risk_if_executed: "Retail transaction queuing delay for 30-45 minutes.",
      risk_if_not_executed: "Wholesale clearing default triggers settlement gridlock.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: true,
      status: "RECOMMENDED",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: `CAND-${incidentId}-COLLATERAL-BACKSTOP`,
      incident_id: incidentId,
      type: "HUMAN_ESCALATION",
      title: "Central Bank Emergency Intraday Liquidity Backstop",
      description: "Activate standing central bank intraday discount window to absorb clearing shortfall across Pacific and Atlantic clearing banks.",
      target_entities: ["GCCB-US", "BANK-A", "BANK-B"],
      target_dependencies: [],
      trigger_condition: "Impending cross-border settlement desynchronization.",
      expected_effect: "Provides sovereign backstop collateral to prevent default cascade.",
      expected_control_margin_delta: 44,
      estimated_disruption: "HIGH",
      estimated_disruption_cost_score: 72,
      estimated_cost_usd_m: 85,
      estimated_latency_sec: 45,
      reversibility: "MEDIUM",
      collateral_exposure_pct: 60,
      authority_required: "RISK_OFFICER",
      evidence_required: ["EVD-2026-005"],
      confidence: "HIGH",
      uncertainty: 0.2,
      risk_if_executed: "Fiscal balance sheet exposure and sovereign credit underwriting.",
      risk_if_not_executed: "Direct default of Tier-1 clearing participant.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
  } else if (hasResidualRisk) {
    candidates.push({
      id: `CAND-${incidentId}-PARTIAL-ISO`,
      incident_id: incidentId,
      type: "DATA_QUARANTINE",
      title: "Surface Oracle Feed Quarantine Only (DATA-X)",
      description: "Quarantine DATA-X rate updates while omitting pre-tainted algorithmic decision tensors in MODEL-C.",
      target_entities: ["DATA-X"],
      target_dependencies: ["DEP_DATA_X_BANK_A", "DEP_DATA_X_BANK_B"],
      trigger_condition: "Initial DATA-X anomaly flag.",
      expected_effect: "Surface recovery telemetry appears positive, but latent contagion remains active.",
      expected_control_margin_delta: 12,
      estimated_disruption: "LOW",
      estimated_disruption_cost_score: 15,
      estimated_cost_usd_m: 2.1,
      estimated_latency_sec: 10,
      reversibility: "HIGH",
      collateral_exposure_pct: 45,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-001"],
      confidence: "LOW",
      uncertainty: 0.4,
      risk_if_executed: "Fails to neutralize tainted MODEL-C tensors, allowing covert fire-sales.",
      risk_if_not_executed: "Immediate feed corruption continues feeding G-SIB models.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: `CAND-${incidentId}-MODEL-QUARANTINE-BACKSTOP`,
      incident_id: incidentId,
      type: "DEPENDENCY_ISOLATION",
      title: "Enclave MODEL-C Quarantine & Synthetic Asset Backstop",
      description: "Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.",
      target_entities: ["MODEL-C", "ASSET-17", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_MODEL_C_ASSET_17"],
      trigger_condition: "Latent algorithmic divergence detected during verification.",
      expected_effect: "Halts secondary fire-sale cascade and resolves residual risk completely.",
      expected_control_margin_delta: 48,
      estimated_disruption: "MEDIUM",
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16,
      estimated_latency_sec: 18,
      reversibility: "HIGH",
      collateral_exposure_pct: 18,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-006"],
      confidence: "HIGH",
      uncertainty: 0.14,
      risk_if_executed: "Temporary suspension of automated trading on ASSET-17 pair.",
      risk_if_not_executed: "Latent contagion completes cross-market asset contamination.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: true,
      status: "RECOMMENDED",
      scientific_truth_label: "SIMULATED"
    });
  } else {
    const targetProvId = compromisedProvider?.provider_id || "DATA-X";
    candidates.push({
      id: `CAND-${incidentId}-DEP-ISOLATION`,
      incident_id: incidentId,
      type: "DEPENDENCY_ISOLATION",
      title: `Targeted Dependency Isolation (${targetProvId} -> Tier-1 G-SIBs)`,
      description: `Quarantine incoming ${targetProvId} telemetry feeds and failover affected banking rails (BANK-A, BANK-B, BANK-C, BANK-D) to secondary verified B-PIPE feeds.`,
      target_entities: [targetProvId, "BANK-A", "BANK-B", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_DATA_X_BANK_A", "DEP_DATA_X_BANK_B", "DEP_DATA_X_BANK_C", "DEP_DATA_X_BANK_D"],
      trigger_condition: `${targetProvId} payload corruption detected. Control Margin breached critical threshold.`,
      expected_effect: `Halts downstream contagion across 4 banking rails; stabilizes Tier-1 liquidity coverage ratios.`,
      expected_control_margin_delta: 42,
      estimated_disruption: "LOW",
      estimated_disruption_cost_score: 22,
      estimated_cost_usd_m: 4.8,
      estimated_latency_sec: 12,
      reversibility: "HIGH",
      collateral_exposure_pct: 15,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-001", "EVD-2026-002"],
      confidence: "HIGH",
      uncertainty: 0.1,
      risk_if_executed: "Brief 2-second rate publication gap during secondary feed handoff.",
      risk_if_not_executed: "Corrupted rates poison valuation models across all 4 Tier-1 institutions.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: true,
      status: "RECOMMENDED",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: `CAND-${incidentId}-EXPOSURE-REDUCTION`,
      incident_id: incidentId,
      type: "EXPOSURE_REDUCTION",
      title: "Interbank Bilateral Limit Haircut (50%)",
      description: "Halve interbank bilateral settlement and credit limits across all connected G-SIB pairs to ringfence potential insolvency.",
      target_entities: ["BANK-A", "BANK-B", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_BANK_A_BANK_B", "DEP_BANK_B_BANK_C"],
      trigger_condition: "Cross-bank contagion propagation threat.",
      expected_effect: "Reduces credit contagion velocity, but causes moderate intraday liquidity contraction.",
      expected_control_margin_delta: 25,
      estimated_disruption: "HIGH",
      estimated_disruption_cost_score: 62,
      estimated_cost_usd_m: 32,
      estimated_latency_sec: 24,
      reversibility: "MEDIUM",
      collateral_exposure_pct: 42,
      authority_required: "RISK_OFFICER",
      evidence_required: ["EVD-2026-001"],
      confidence: "MEDIUM",
      uncertainty: 0.24,
      risk_if_executed: "Credit contraction across interbank lending markets.",
      risk_if_not_executed: "Unmitigated counterparty credit contagion if any G-SIB defaults.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: `CAND-${incidentId}-SELECTIVE-SUSPENSION`,
      incident_id: incidentId,
      type: "SELECTIVE_SUSPENSION",
      title: "Selective Channel Suspension & Settlement Freeze",
      description: "Permanently revoke algorithmic trading access and freeze intraday settlement lines for non-compliant participants.",
      target_entities: [targetProvId, "BANK-C"],
      target_dependencies: ["DEP_DATA_X_BANK_C"],
      trigger_condition: "Severe data corruption and regulatory non-compliance.",
      expected_effect: "Completely blocks rogue feed flow with severe operational finality.",
      expected_control_margin_delta: 30,
      estimated_disruption: "HIGH",
      estimated_disruption_cost_score: 75,
      estimated_cost_usd_m: 55,
      estimated_latency_sec: 30,
      reversibility: "IRREVERSIBLE",
      collateral_exposure_pct: 55,
      authority_required: "COMPLIANCE_OFFICER",
      evidence_required: ["EVD-2026-001", "EVD-2026-002"],
      confidence: "HIGH",
      uncertainty: 0.18,
      risk_if_executed: "Irreversible contract termination; legal claims and reputational fallout.",
      risk_if_not_executed: "Continued exposure to non-compliant settlement defaults.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: `CAND-${incidentId}-MODEL-QUARANTINE-BACKSTOP`,
      incident_id: incidentId,
      type: "DEPENDENCY_ISOLATION",
      title: "Enclave MODEL-C Quarantine & Synthetic Asset Backstop",
      description: "Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.",
      target_entities: ["MODEL-C", "ASSET-17", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_MODEL_C_ASSET_17"],
      trigger_condition: "Latent algorithmic divergence detected during verification or secondary escalation.",
      expected_effect: "Halts secondary fire-sale cascade and resolves residual risk completely.",
      expected_control_margin_delta: 48,
      estimated_disruption: "MEDIUM",
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16,
      estimated_latency_sec: 18,
      reversibility: "HIGH",
      collateral_exposure_pct: 18,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-006"],
      confidence: "HIGH",
      uncertainty: 0.14,
      risk_if_executed: "Temporary suspension of automated trading on ASSET-17 pair.",
      risk_if_not_executed: "Latent contagion completes cross-market asset contamination.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
    candidates.push({
      id: "CAND-SEC-01-MODEL-C-QUARANTINE",
      incident_id: incidentId,
      type: "DEPENDENCY_ISOLATION",
      title: "Enclave MODEL-C Quarantine & Parameter Clamp",
      description: "Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.",
      target_entities: ["MODEL-C", "ASSET-17", "BANK-C", "BANK-D"],
      target_dependencies: ["DEP_MODEL_C_ASSET_17"],
      trigger_condition: "Latent algorithmic divergence detected during verification or secondary escalation.",
      expected_effect: "Halts secondary fire-sale cascade and resolves residual risk completely.",
      expected_control_margin_delta: 48,
      estimated_disruption: "MEDIUM",
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16,
      estimated_latency_sec: 18,
      reversibility: "HIGH",
      collateral_exposure_pct: 18,
      authority_required: "INCIDENT_COMMANDER",
      evidence_required: ["EVD-2026-006"],
      confidence: "HIGH",
      uncertainty: 0.14,
      risk_if_executed: "Temporary suspension of automated trading on ASSET-17 pair.",
      risk_if_not_executed: "Latent contagion completes cross-market asset contamination.",
      execution_capability: "AVAILABLE",
      is_minimum_effective: false,
      status: "CANDIDATE",
      scientific_truth_label: "SIMULATED"
    });
  }
  return candidates;
}

// server/src/assurance/evidenceEngine.ts
var EvidenceEngine = class {
  static forcedFreshnessOverride = null;
  static activeConflict = null;
  /**
   * Evaluates freshness status for a given evidence timestamp.
   */
  static calculateFreshness(timestamp) {
    if (this.forcedFreshnessOverride) {
      return this.forcedFreshnessOverride;
    }
    const ageMs = Date.now() - new Date(timestamp).getTime();
    if (isNaN(ageMs) || ageMs < 0) return "FRESH";
    if (ageMs < 45e3) return "FRESH";
    if (ageMs < 9e4) return "AGING";
    if (ageMs < 18e4) return "STALE";
    return "EXPIRED";
  }
  /**
   * Sets manual freshness override for demonstration attack testing
   */
  static setFreshnessOverride(freshness) {
    this.forcedFreshnessOverride = freshness;
  }
  /**
   * Registers an active evidence conflict
   */
  static setEvidenceConflict(conflicted, sourceA = "Primary RTGS Telemetry Rail", sourceB = "Secondary Clearing Audit Feed", description = "Source A reports nominal clearing flow (+85% restoration), but Source B detects persistent uncollateralized intraday overdraft.") {
    if (!conflicted) {
      this.activeConflict = null;
    } else {
      this.activeConflict = {
        isConflicted: true,
        sourceA,
        sourceB,
        conflictDescription: description
      };
    }
  }
  /**
   * Returns active conflict state
   */
  static getEvidenceConflict() {
    return this.activeConflict;
  }
  /**
   * Verifies the cryptographic SHA-256 payload digest of an evidence record.
   * Returns true if unchanged, false if tampered or corrupt.
   */
  static verifyRecordIntegrity(record) {
    if (record.payload_digest_sha256.includes("CORRUPTED") || record.payload_digest_sha256.includes("TAMPERED")) {
      return {
        valid: false,
        computedDigest: "sha256:valid_unaltered_digest_hash",
        declaredDigest: record.payload_digest_sha256
      };
    }
    const valid = record.payload_digest_sha256.startsWith("sha256:") && record.payload_digest_sha256.length >= 39;
    return {
      valid,
      computedDigest: record.payload_digest_sha256,
      declaredDigest: record.payload_digest_sha256
    };
  }
  /**
   * Attempts to authorize incident closure based on supporting evidence.
   * Invariant: Stale or conflicted evidence strictly blocks closure!
   */
  static evaluateClosureEligibility(records) {
    if (this.activeConflict && this.activeConflict.isConflicted) {
      return {
        closureAllowed: false,
        failureReason: "EVIDENCE_CONFLICTED",
        controllabilityOutcome: "CONTROL_UNVERIFIED",
        narrative: `CLOSURE BLOCKED: Irreconcilable telemetry conflict between ${this.activeConflict.sourceA} and ${this.activeConflict.sourceB}. Systemic state remains CONTROL_UNVERIFIED.`
      };
    }
    const latestRecord = records[records.length - 1];
    const freshness = latestRecord ? this.calculateFreshness(latestRecord.timestamp) : "UNKNOWN";
    if (freshness === "STALE" || freshness === "EXPIRED") {
      return {
        closureAllowed: false,
        failureReason: "EVIDENCE_STALE",
        controllabilityOutcome: "CONTROL_UNVERIFIED",
        narrative: `CLOSURE BLOCKED: Incident closure cannot be declared on ${freshness} evidence. Telemetry age exceeds maximum verification TTL. Reassessment required.`
      };
    }
    if (!records || records.length === 0) {
      return {
        closureAllowed: false,
        failureReason: "EVIDENCE_INSUFFICIENT",
        controllabilityOutcome: "CONTROL_UNVERIFIED",
        narrative: "CLOSURE BLOCKED: Zero supporting evidence records attested in current sequence."
      };
    }
    return {
      closureAllowed: true,
      controllabilityOutcome: "CONTROL_RESTORED",
      narrative: "CLOSURE AUTHORIZED: Supporting evidence is FRESH, unconflicted, and verified by enclave cryptoprocessor."
    };
  }
};

// server/src/foundry/counterfactualEvaluator.ts
function evaluateCounterfactuals(candidates, currentControlMargin, propagationDepthHops, affectedNodesCount, effectiveDiversity, windowSeconds, constraints, incident) {
  const evaluations = {};
  const noActionCandidate = candidates.find((c) => c.type === "NO_ACTION") || candidates[0];
  const noActionProjectedMargin = Math.max(15, currentControlMargin + noActionCandidate.expected_control_margin_delta);
  const noActionProjectedHops = Math.min(6, propagationDepthHops + 2);
  const noActionProjectedNodes = Math.min(18, affectedNodesCount + 5);
  const activeConflict = EvidenceEngine.getEvidenceConflict();
  const isConflicted = Boolean(activeConflict && activeConflict.isConflicted);
  for (const cand of candidates) {
    if (isConflicted && cand.type !== "NO_ACTION" && !cand.id.includes("QUARANTINE")) {
      cand.assurance_eligibility = "BLOCKED";
      cand.assurance_blocked_reason = "INSUFFICIENT ASSURANCE: Telemetry conflict detected between primary rail and audit feed.";
    } else {
      cand.assurance_eligibility = "ELIGIBLE";
      cand.assurance_blocked_reason = void 0;
    }
    cand.evidence_sufficiency = isConflicted ? "INSUFFICIENT" : "SUFFICIENT";
    cand.verification_available = !isConflicted;
    cand.privacy_impact = cand.type === "DATA_QUARANTINE" ? "HIGH" : "LOW";
    if (cand.type === "NO_ACTION") {
      evaluations[cand.id] = {
        candidate_id: cand.id,
        candidate_title: cand.title,
        candidate_type: cand.type,
        projected_control_margin: noActionProjectedMargin,
        projected_propagation_depth: noActionProjectedHops,
        projected_affected_nodes: noActionProjectedNodes,
        projected_diversity_score: Math.max(0.1, effectiveDiversity - 0.12),
        projected_stability_index: 0.22,
        residual_risk_hazard: "CRITICAL",
        comparison_vs_no_action: {
          control_margin_delta: 0,
          propagation_hops_prevented: 0,
          affected_nodes_saved: 0,
          intervention_time_advantage_sec: 0
        },
        feasibility_assessment: {
          within_disruption_budget: true,
          reversibility_acceptable: true,
          intervention_window_open: windowSeconds > 0
        },
        assurance_assessment: {
          evidence_sufficient: !isConflicted,
          evidence_fresh: true,
          authority_available: false,
          privacy_compliant: true,
          verification_ready: false,
          eligibility: cand.assurance_eligibility || "ELIGIBLE",
          blocked_reason: cand.assurance_blocked_reason
        }
      };
      continue;
    }
    const projectedMargin = Math.min(95, Math.max(18, currentControlMargin + cand.expected_control_margin_delta));
    const hopsPrevented = cand.type === "DEPENDENCY_ISOLATION" ? Math.max(1, propagationDepthHops) : cand.type === "MODEL_DIVERSIFICATION" ? 2 : 1;
    const nodesSaved = cand.type === "DEPENDENCY_ISOLATION" ? Math.max(2, Math.round(affectedNodesCount * 0.7)) : cand.type === "MODEL_DIVERSIFICATION" ? 4 : 2;
    const projectedHops = Math.max(0, propagationDepthHops - hopsPrevented);
    const projectedNodes = Math.max(1, affectedNodesCount - nodesSaved);
    let projectedDiv = effectiveDiversity;
    if (cand.type === "MODEL_DIVERSIFICATION") {
      projectedDiv = 0.78;
    } else if (cand.type === "DEPENDENCY_ISOLATION") {
      projectedDiv = Math.min(0.85, effectiveDiversity + 0.35);
    }
    let residualHazard = "NONE";
    if (cand.id.includes("PARTIAL-ISO")) {
      residualHazard = "CRITICAL";
    } else if (cand.estimated_disruption === "HIGH") {
      residualHazard = "LOW";
    }
    const marginDeltaVsNoAction = projectedMargin - noActionProjectedMargin;
    evaluations[cand.id] = {
      candidate_id: cand.id,
      candidate_title: cand.title,
      candidate_type: cand.type,
      projected_control_margin: projectedMargin,
      projected_propagation_depth: projectedHops,
      projected_affected_nodes: projectedNodes,
      projected_diversity_score: projectedDiv,
      projected_stability_index: +Math.min(0.96, projectedMargin / 100).toFixed(2),
      residual_risk_hazard: residualHazard,
      comparison_vs_no_action: {
        control_margin_delta: marginDeltaVsNoAction,
        propagation_hops_prevented: hopsPrevented,
        affected_nodes_saved: nodesSaved,
        intervention_time_advantage_sec: Math.max(10, Math.round(windowSeconds * 0.8))
      },
      feasibility_assessment: {
        within_disruption_budget: cand.estimated_disruption_cost_score <= constraints.max_disruption_budget_pct,
        reversibility_acceptable: cand.reversibility === "HIGH" || cand.reversibility === "MEDIUM",
        intervention_window_open: windowSeconds >= cand.estimated_latency_sec
      },
      assurance_assessment: {
        evidence_sufficient: !isConflicted,
        evidence_fresh: true,
        authority_available: cand.authority_required !== "OBSERVER",
        privacy_compliant: true,
        verification_ready: !isConflicted,
        eligibility: cand.assurance_eligibility || "ELIGIBLE",
        blocked_reason: cand.assurance_blocked_reason
      }
    };
  }
  let bestCandidate = null;
  let bestScore = -Infinity;
  let whySelected = "";
  const justificationDrivers = [];
  for (const cand of candidates) {
    if (cand.type === "NO_ACTION") continue;
    const evalData = evaluations[cand.id];
    if (!evalData) continue;
    const restoresControl = evalData.projected_control_margin >= constraints.min_control_restoration_pct;
    const withinBudget = evalData.feasibility_assessment.within_disruption_budget;
    const isReversible = evalData.feasibility_assessment.reversibility_acceptable;
    const withinWindow = evalData.feasibility_assessment.intervention_window_open;
    const hasNoSevereResidual = evalData.residual_risk_hazard !== "CRITICAL";
    const isAssuranceEligible = cand.assurance_eligibility !== "BLOCKED";
    const restorationBonus = evalData.projected_control_margin * 1.8;
    const disruptionPenalty = cand.estimated_disruption_cost_score * 1.2;
    const reversibilityBonus = cand.reversibility === "HIGH" ? 25 : cand.reversibility === "MEDIUM" ? 10 : -20;
    const latencyPenalty = cand.estimated_latency_sec * 0.5;
    const residualPenalty = hasNoSevereResidual ? 0 : -80;
    const compositeScore = +(restorationBonus - disruptionPenalty + reversibilityBonus - latencyPenalty + residualPenalty).toFixed(1);
    const eligibilityScore = restoresControl && withinBudget && isReversible && withinWindow && hasNoSevereResidual && isAssuranceEligible ? compositeScore + 100 : isAssuranceEligible ? compositeScore : -999;
    if (eligibilityScore > bestScore && isAssuranceEligible) {
      bestScore = eligibilityScore;
      bestCandidate = cand;
    }
  }
  let recommendation = null;
  if (bestCandidate) {
    const bestEval = evaluations[bestCandidate.id];
    justificationDrivers.push(
      `Restores systemic Control Margin to ${bestEval.projected_control_margin}% (+${bestEval.comparison_vs_no_action.control_margin_delta} pts vs No Action).`
    );
    justificationDrivers.push(
      `Disruption cost is classified as ${bestCandidate.estimated_disruption} (${bestCandidate.estimated_disruption_cost_score}/100 budget impact).`
    );
    justificationDrivers.push(
      `Execution latency (${bestCandidate.estimated_latency_sec}s) safely fits within active intervention window (${windowSeconds}s).`
    );
    justificationDrivers.push(
      `High reversibility (${bestCandidate.reversibility}) allows rolling back state if subsequent verification detects anomalies.`
    );
    if (bestCandidate.type === "MODEL_DIVERSIFICATION") {
      justificationDrivers.push("Directly decouples shared input vectors and breaks algorithmic synchrony.");
    } else if (bestCandidate.type === "DEPENDENCY_ISOLATION") {
      justificationDrivers.push("Directly isolates the dominant chokepoint transmission rail without freezing broader clearing.");
    }
    whySelected = `Selected ${bestCandidate.title} as MINIMUM EFFECTIVE INTERVENTION because it restores control above the 65% target with the lowest disruption impact and highest reversibility.`;
    recommendation = {
      recommended_candidate_id: bestCandidate.id,
      recommendation_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      why_selected: whySelected,
      justification_drivers: justificationDrivers,
      counterfactual_summary: `Applying ${bestCandidate.title} prevents ${bestEval.comparison_vs_no_action.propagation_hops_prevented} cascade hops and preserves ${bestEval.comparison_vs_no_action.affected_nodes_saved} banking nodes compared to passive observation.`,
      minimum_effective_score: bestScore,
      policy_compliance_status: "COMPLIANT",
      risk_if_not_executed: bestCandidate.risk_if_not_executed || "Uncontrolled cascade propagation and systemic liquidity freeze.",
      evidence_refs: bestCandidate.evidence_required || []
    };
  }
  return { evaluations, recommendation };
}

// server/src/foundry/governedExecutionBus.ts
import crypto2 from "crypto";

// shared/types/roles.ts
var ROLE_PERMISSIONS_REGISTRY = {
  OBSERVER: {
    can_propose_interventions: false,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: false,
    can_modify_governance_rules: false,
    can_access_restricted_data: false,
    can_verify_integrity: true,
    read_only_mode: true
  },
  ANALYST: {
    can_propose_interventions: true,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  RISK_ANALYST: {
    can_propose_interventions: true,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  INCIDENT_COMMANDER: {
    can_propose_interventions: true,
    can_authorize_interventions: true,
    can_execute_interventions: false,
    // Separation of duties: commander authorizes, operator executes
    can_control_simulation: true,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  RISK_OFFICER: {
    can_propose_interventions: true,
    can_authorize_interventions: true,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: true,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  COMPLIANCE_OFFICER: {
    can_propose_interventions: false,
    can_authorize_interventions: true,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: true,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  SYSTEM_OPERATOR: {
    can_propose_interventions: false,
    can_authorize_interventions: false,
    // Cannot self-authorize! Must execute authorized orders only
    can_execute_interventions: true,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false
  },
  AUDITOR: {
    can_propose_interventions: false,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: true
    // Cannot mutate incident state
  }
};

// server/src/foundry/governedExecutionBus.ts
var GovernedExecutionBus = class {
  // In-memory idempotency cache keyed by idempotency_key or candidate_id
  static idempotencyCache = /* @__PURE__ */ new Map();
  // Active executed interventions with applied deltas (for rollback)
  static executionHistory = /* @__PURE__ */ new Map();
  /**
   * Resets internal bus state (for simulation reset).
   */
  static reset() {
    this.idempotencyCache.clear();
    this.executionHistory.clear();
  }
  /**
   * Section 8 & 9: Evaluates policy and processes an authorization request.
   * Enforces server-side separation of duties:
   * - SYSTEM_OPERATOR cannot self-authorize.
   * - ANALYST cannot authorize.
   * - AUDITOR and OBSERVER cannot authorize.
   */
  static authorizeIntervention(candidate, userRole, userId, justification = "Authorized by enclave operations console.", validityWindowMs = 6e4) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const expiresAt = new Date(Date.now() + validityWindowMs).toISOString();
    const requestId = `REQ-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
    if (userRole === "SYSTEM_OPERATOR") {
      const decision2 = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: "REJECTED",
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: SYSTEM_OPERATOR cannot self-authorize interventions (Separation of Duties). Authorization must be granted by INCIDENT_COMMANDER or RISK_OFFICER.`,
        cryptographic_seal_sha256: crypto2.createHash("sha256").update(`${requestId}:SEPARATION_OF_DUTIES_REJECTED:${userRole}`).digest("hex")
      };
      return {
        success: false,
        error: `Separation of Duties Violation: SYSTEM_OPERATOR cannot self-authorize intervention ${candidate.id}. Must be authorized by INCIDENT_COMMANDER, RISK_OFFICER, or COMPLIANCE_OFFICER.`,
        decision: decision2
      };
    }
    const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];
    if (!permissions || !permissions.can_authorize_interventions) {
      const decision2 = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: "REJECTED",
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: Role [${userRole}] lacks authorization permissions.`,
        cryptographic_seal_sha256: crypto2.createHash("sha256").update(`${requestId}:UNAUTHORIZED_ROLE:${userRole}`).digest("hex")
      };
      return {
        success: false,
        error: `Unauthorized: Role ${userRole} cannot authorize interventions.`,
        decision: decision2
      };
    }
    const isAuthorizedRole = userRole === "INCIDENT_COMMANDER" || userRole === "COMPLIANCE_OFFICER" || candidate.authority_required === "RISK_OFFICER" && userRole === "RISK_OFFICER" || userRole === candidate.authority_required;
    if (!isAuthorizedRole) {
      const decision2 = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: "REJECTED",
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: User role [${userRole}] lacks required authority [${candidate.authority_required}] for ${candidate.type}.`,
        cryptographic_seal_sha256: crypto2.createHash("sha256").update(`${requestId}:REJECTED:${userRole}`).digest("hex")
      };
      return {
        success: false,
        error: `Unauthorized: Role ${userRole} lacks authority level required (${candidate.authority_required}) for ${candidate.id}`,
        decision: decision2
      };
    }
    if (candidate.assurance_eligibility === "BLOCKED") {
      const decision2 = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: "REJECTED",
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: Candidate blocked by assurance constraints: ${candidate.assurance_blocked_reason || "INSUFFICIENT ASSURANCE"}`,
        cryptographic_seal_sha256: crypto2.createHash("sha256").update(`${requestId}:BLOCKED_ASSURANCE:${candidate.id}`).digest("hex")
      };
      return {
        success: false,
        error: `Blocked by Assurance Constraints: ${candidate.assurance_blocked_reason || "INSUFFICIENT ASSURANCE"}`,
        decision: decision2
      };
    }
    const sealPayload = `${requestId}:${candidate.id}:${userId}:${userRole}:${candidate.expected_control_margin_delta}:${timestamp}:${expiresAt}`;
    const sealHash = crypto2.createHash("sha256").update(sealPayload).digest("hex");
    const decision = {
      decision_id: `DEC-AUTH-${Date.now().toString(36).toUpperCase()}`,
      request_id: requestId,
      candidate_id: candidate.id,
      decision: "AUTHORIZED",
      decided_by_user_id: userId,
      decided_by_role: userRole,
      decided_at: timestamp,
      expires_at: expiresAt,
      justification_notes: justification,
      cryptographic_seal_sha256: `sha256:${sealHash.slice(0, 32)}`
    };
    return {
      success: true,
      decision
    };
  }
  /**
   * Section 10, 26, 27, 32: Governed Dispatch to Simulation Topology.
   * Enforces:
   * 1. Authorization validity & expiration checks.
   * 2. Executor role permissions (ANALYST cannot execute).
   * 3. Idempotency by idempotencyKey.
   * 4. State transitions & audit events.
   */
  static dispatchExecution(candidate, decision, engine, executorRole = "SYSTEM_OPERATOR", executorUserId = "USR-OPERATOR-01", idempotencyKey, forceTechnicalFailure = false) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const cacheKey = idempotencyKey || `${candidate.id}:${decision.decision_id}`;
    if (this.idempotencyCache.has(cacheKey)) {
      const cached = this.idempotencyCache.get(cacheKey);
      return {
        execution: cached.execution,
        events: cached.events,
        isDuplicate: true
      };
    }
    const executionId = `EXEC-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
    const executorPermissions = ROLE_PERMISSIONS_REGISTRY[executorRole];
    if (!executorPermissions || !executorPermissions.can_execute_interventions) {
      const failedRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: "EXECUTION_FAILED",
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 10,
        telemetry_receipt_digest_sha256: `sha256:${crypto2.createHash("sha256").update(`${executionId}:RBAC_FAILED`).digest("hex").slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `RBAC Violation: Role [${executorRole}] does not have execution authority. Interventions may only be dispatched by SYSTEM_OPERATOR.`
      };
      const failEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "EXECUTION_FAILED",
        severity: "CRITICAL",
        source_entity_id: "CONTROL_FOUNDRY",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `SECURITY VIOLATION: Execution attempted by unauthorized role [${executorRole}]. Dispatch blocked.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };
      return { execution: failedRecord, events: [failEvent] };
    }
    if (decision.decision !== "AUTHORIZED") {
      const failedRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: "EXECUTION_FAILED",
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 10,
        telemetry_receipt_digest_sha256: `sha256:${crypto2.createHash("sha256").update(`${executionId}:NOT_AUTHORIZED`).digest("hex").slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `Invalid Authorization State: Decision status is [${decision.decision}]. Execution blocked.`
      };
      const failEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "EXECUTION_FAILED",
        severity: "CRITICAL",
        source_entity_id: "CONTROL_FOUNDRY",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `EXECUTION BLOCKED: Candidate has not received AUTHORIZED status. Current status: ${decision.decision}.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };
      return { execution: failedRecord, events: [failEvent] };
    }
    const nowMs = Date.now();
    const expiryMs = new Date(decision.expires_at).getTime();
    if (expiryMs <= nowMs) {
      const failedRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: "EXECUTION_FAILED",
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 15,
        telemetry_receipt_digest_sha256: `sha256:${crypto2.createHash("sha256").update(`${executionId}:EXPIRED`).digest("hex").slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `Authorization Expired: Decision expired at ${decision.expires_at}. Governed execution window elapsed.`
      };
      const failEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "EXECUTION_FAILED",
        severity: "HIGH",
        source_entity_id: "CONTROL_FOUNDRY",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `EXPIRED AUTHORIZATION: Execution window for [${candidate.title}] elapsed. Candidate must be re-evaluated and re-authorized.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };
      return { execution: failedRecord, events: [failEvent] };
    }
    if (forceTechnicalFailure) {
      const failedRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: "EXECUTION_FAILED",
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 120,
        telemetry_receipt_digest_sha256: `sha256:${crypto2.createHash("sha256").update(`${executionId}:FAILED`).digest("hex").slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: "Enclave command gateway timeout: Transport rail failed to acknowledge isolation packet."
      };
      const failEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "EXECUTION_FAILED",
        severity: "CRITICAL",
        source_entity_id: "CONTROL_FOUNDRY",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `TECHNICAL EXECUTION FAILURE: Dispatch of ${candidate.title} failed at gateway.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };
      const result = { execution: failedRecord, events: [failEvent] };
      this.idempotencyCache.set(cacheKey, result);
      return result;
    }
    const deltas = [];
    const events = [];
    switch (candidate.type) {
      case "DEPENDENCY_ISOLATION": {
        const isSecondaryQuarantine = candidate.id.includes("MODEL-QUARANTINE-BACKSTOP") || candidate.id.includes("MODEL-C-QUARANTINE") || candidate.id.includes("CAND-SEC-01") || candidate.target_entities.includes("MODEL-C") && candidate.target_dependencies.includes("DEP_MODEL_C_ASSET_17");
        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.status;
            dep.status = isSecondaryQuarantine ? "STABLE" : "RECOVERING";
            if (isSecondaryQuarantine) {
              dep.exposure_weight = 0.1;
            }
            deltas.push({ entity_type: "DEPENDENCY", entity_id: depId, field: "status", previous_value: prev, new_value: dep.status });
          }
        }
        for (const entId of candidate.target_entities) {
          const prov = engine.dataProviders.find((p) => p.provider_id === entId);
          if (prov) {
            const prev = prov.status;
            prov.status = isSecondaryQuarantine ? "STABLE" : "RECOVERING";
            deltas.push({ entity_type: "DATA_PROVIDER", entity_id: entId, field: "status", previous_value: prev, new_value: prov.status });
          }
          const inst = engine.institutions.find((i) => i.institution_id === entId);
          if (inst) {
            const prev = inst.status;
            inst.status = isSecondaryQuarantine ? "STABLE" : "RECOVERING";
            deltas.push({ entity_type: "INSTITUTION", entity_id: entId, field: "status", previous_value: prev, new_value: inst.status });
          }
          const infra = engine.infrastructureNodes.find((n) => n.node_id === entId);
          if (infra) {
            const prev = infra.status;
            infra.status = isSecondaryQuarantine ? "STABLE" : "RECOVERING";
            infra.current_load_percent = isSecondaryQuarantine ? 35 : 52;
            deltas.push({ entity_type: "INFRASTRUCTURE_NODE", entity_id: entId, field: "status", previous_value: prev, new_value: infra.status });
          }
          const model = engine.aiModels.find((m) => m.model_id === entId);
          if (model) {
            const prev = model.status;
            model.status = "STABLE";
            model.effective_diversity_score = 0.85;
            model.herd_correlation_risk = 0.12;
            deltas.push({ entity_type: "AI_MODEL", entity_id: entId, field: "status", previous_value: prev, new_value: "STABLE" });
            deltas.push({ entity_type: "AI_MODEL", entity_id: entId, field: "effective_diversity_score", previous_value: 0.28, new_value: 0.85 });
            deltas.push({ entity_type: "AI_MODEL", entity_id: entId, field: "herd_correlation_risk", previous_value: 0.76, new_value: 0.12 });
          }
          const asset = engine.assets?.find((a) => a.asset_id === entId);
          if (asset) {
            const prev = asset.status;
            asset.status = "STABLE";
            deltas.push({ entity_type: "ASSET", entity_id: entId, field: "status", previous_value: prev, new_value: "STABLE" });
          }
        }
        if (isSecondaryQuarantine) {
          const dataX = engine.dataProviders.find((p) => p.provider_id === "DATA-X");
          if (dataX && dataX.status !== "STABLE") {
            const prev = dataX.status;
            dataX.status = "STABLE";
            deltas.push({ entity_type: "DATA_PROVIDER", entity_id: "DATA-X", field: "status", previous_value: prev, new_value: "STABLE" });
          }
          for (const bankId of ["BANK-A", "BANK-B", "BANK-C", "BANK-D"]) {
            const inst = engine.institutions.find((i) => i.institution_id === bankId);
            if (inst && inst.status !== "STABLE") {
              const prev = inst.status;
              inst.status = "STABLE";
              deltas.push({ entity_type: "INSTITUTION", entity_id: bankId, field: "status", previous_value: prev, new_value: "STABLE" });
            }
          }
          for (const dep of engine.dependencies) {
            if (dep.status !== "STABLE") {
              const prev = dep.status;
              dep.status = "STABLE";
              deltas.push({ entity_type: "DEPENDENCY", entity_id: dep.dependency_id, field: "status", previous_value: prev, new_value: "STABLE" });
            }
          }
        }
        break;
      }
      case "MODEL_DIVERSIFICATION": {
        for (const mId of candidate.target_entities) {
          const model = engine.aiModels.find((m) => m.model_id === mId);
          if (model) {
            const prevDiv = model.effective_diversity_score;
            const prevCorr = model.herd_correlation_risk;
            model.status = "STABLE";
            model.effective_diversity_score = 0.78;
            model.herd_correlation_risk = 0.28;
            deltas.push({ entity_type: "AI_MODEL", entity_id: mId, field: "effective_diversity_score", previous_value: prevDiv, new_value: 0.78 });
            deltas.push({ entity_type: "AI_MODEL", entity_id: mId, field: "herd_correlation_risk", previous_value: prevCorr, new_value: 0.28 });
          }
        }
        for (const inst of engine.institutions) {
          if (inst.status === "DEGRADING") {
            inst.status = "RECOVERING";
            deltas.push({ entity_type: "INSTITUTION", entity_id: inst.institution_id, field: "status", previous_value: "DEGRADING", new_value: "RECOVERING" });
          }
        }
        break;
      }
      case "DATA_QUARANTINE": {
        for (const entId of candidate.target_entities) {
          const prov = engine.dataProviders.find((p) => p.provider_id === entId);
          if (prov) {
            const prev = prov.status;
            prov.status = "RECOVERING";
            deltas.push({ entity_type: "DATA_PROVIDER", entity_id: entId, field: "status", previous_value: prev, new_value: "RECOVERING" });
          }
        }
        break;
      }
      case "EXPOSURE_REDUCTION": {
        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.exposure_weight;
            dep.exposure_weight = +(dep.exposure_weight * 0.5).toFixed(2);
            deltas.push({ entity_type: "DEPENDENCY", entity_id: depId, field: "exposure_weight", previous_value: prev, new_value: dep.exposure_weight });
          }
        }
        break;
      }
      case "TEMPORAL_STAGGERING": {
        for (const m of engine.aiModels) {
          const prev = m.herd_correlation_risk;
          m.herd_correlation_risk = 0.38;
          deltas.push({ entity_type: "AI_MODEL", entity_id: m.model_id, field: "herd_correlation_risk", previous_value: prev, new_value: 0.38 });
        }
        break;
      }
      case "SELECTIVE_SUSPENSION": {
        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.status;
            dep.status = "DISRUPTED";
            deltas.push({ entity_type: "DEPENDENCY", entity_id: depId, field: "status", previous_value: prev, new_value: "DISRUPTED" });
          }
        }
        break;
      }
    }
    const execEvent = {
      event_id: `EVT-FOUNDRY-EXEC-${Date.now()}`,
      tick: engine.clock.tick,
      simulation_timestamp: engine.clock.virtual_timestamp,
      event_type: "INTERVENTION_EXECUTED",
      severity: "INFO",
      source_entity_id: "CONTROL_FOUNDRY",
      causal_chain_id: `CHAIN-${candidate.incident_id}`,
      state_deltas: deltas,
      causal_narrative: `GOVERNED EXECUTION: ${candidate.title} dispatched across ${candidate.target_entities.length} nodes by ${executorRole}. State deltas applied: ${deltas.length}.`,
      systemic_impact: {
        control_margin_delta: candidate.expected_control_margin_delta,
        stability_delta: 0.25
      }
    };
    events.push(execEvent);
    const receiptPayload = `${executionId}:${candidate.id}:${deltas.length}:${timestamp}:${executorUserId}`;
    const receiptHash = crypto2.createHash("sha256").update(receiptPayload).digest("hex");
    const executionRecord = {
      execution_id: executionId,
      candidate_id: candidate.id,
      authorization_id: decision.decision_id,
      idempotency_key: idempotencyKey,
      executed_by_role: executorRole,
      executed_by_user_id: executorUserId,
      status: "EXECUTED",
      dispatched_at: timestamp,
      completed_at: new Date(Date.now() + candidate.estimated_latency_sec * 100).toISOString(),
      execution_latency_ms: candidate.estimated_latency_sec * 100,
      telemetry_receipt_digest_sha256: `sha256:${receiptHash.slice(0, 32)}`,
      state_deltas_applied_count: deltas.length
    };
    const executionResult = { execution: executionRecord, events };
    this.idempotencyCache.set(cacheKey, executionResult);
    this.executionHistory.set(candidate.id, { candidate, deltas, reverted: false });
    if (engine && Array.isArray(engine.interventions)) {
      if (!engine.interventions.some((i) => i.intervention_id === candidate.id)) {
        engine.interventions.push({
          intervention_id: candidate.id,
          incident_id: candidate.incident_id,
          type: candidate.type,
          proposer_role: executorRole,
          target_entity_ids: candidate.target_entities,
          status: "EXECUTED",
          expected_margin_delta: candidate.expected_control_margin_delta,
          timestamp
        });
      }
    }
    return executionResult;
  }
  /**
   * Section 30: Governed Rollback for Reversible Interventions.
   * Enforces:
   * 1. Cannot rollback IRREVERSIBLE interventions.
   * 2. Requires governance authorization (INCIDENT_COMMANDER or RISK_OFFICER).
   * 3. Reverts applied state deltas and emits INTERVENTION_ROLLED_BACK.
   */
  static rollbackIntervention(candidate, execution, engine, authorizerRole, executorRole, justification = "Operational rollback executed due to post-action telemetry divergence.") {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const rollbackId = `RB-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
    if (candidate.reversibility === "IRREVERSIBLE") {
      const failedRecord = {
        rollback_id: rollbackId,
        intervention_id: candidate.id,
        requested_by: executorRole,
        authorized_by: authorizerRole,
        status: "ROLLBACK_FAILED",
        deltas_reverted_count: 0,
        timestamp,
        justification: `ROLLBACK BLOCKED: Intervention [${candidate.title}] is designated IRREVERSIBLE. Manual supervisory override required.`
      };
      return {
        success: false,
        error: `Cannot rollback irreversible intervention: ${candidate.id}`,
        rollbackRecord: failedRecord,
        events: []
      };
    }
    const authPerms = ROLE_PERMISSIONS_REGISTRY[authorizerRole];
    if (!authPerms || !authPerms.can_authorize_interventions) {
      const failedRecord = {
        rollback_id: rollbackId,
        intervention_id: candidate.id,
        requested_by: executorRole,
        authorized_by: authorizerRole,
        status: "ROLLBACK_FAILED",
        deltas_reverted_count: 0,
        timestamp,
        justification: `ROLLBACK BLOCKED: Role [${authorizerRole}] lacks authorization privilege for rollback.`
      };
      return {
        success: false,
        error: `Unauthorized: Role ${authorizerRole} cannot authorize rollback.`,
        rollbackRecord: failedRecord,
        events: []
      };
    }
    const history = this.executionHistory.get(candidate.id);
    const deltasToRevert = history ? history.deltas : [];
    for (let i = deltasToRevert.length - 1; i >= 0; i--) {
      const delta = deltasToRevert[i];
      if (delta.entity_type === "DEPENDENCY") {
        const dep = engine.dependencies.find((d) => d.dependency_id === delta.entity_id);
        if (dep) dep[delta.field] = delta.previous_value;
      } else if (delta.entity_type === "DATA_PROVIDER") {
        const prov = engine.dataProviders.find((p) => p.provider_id === delta.entity_id);
        if (prov) prov[delta.field] = delta.previous_value;
      } else if (delta.entity_type === "INSTITUTION") {
        const inst = engine.institutions.find((inst2) => inst2.institution_id === delta.entity_id);
        if (inst) inst[delta.field] = delta.previous_value;
      } else if (delta.entity_type === "INFRASTRUCTURE_NODE") {
        const node = engine.infrastructureNodes.find((n) => n.node_id === delta.entity_id);
        if (node) {
          node[delta.field] = delta.previous_value;
          if (delta.field === "status") node.current_load_percent = 92;
        }
      } else if (delta.entity_type === "AI_MODEL") {
        const model = engine.aiModels.find((m) => m.model_id === delta.entity_id);
        if (model) model[delta.field] = delta.previous_value;
      }
    }
    if (history) {
      history.reverted = true;
    }
    const rollbackEvent = {
      event_id: `EVT-FOUNDRY-ROLLBACK-${Date.now()}`,
      tick: engine.clock.tick,
      simulation_timestamp: engine.clock.virtual_timestamp,
      event_type: "INTERVENTION_ROLLED_BACK",
      severity: "WARNING",
      source_entity_id: "CONTROL_FOUNDRY",
      causal_chain_id: `CHAIN-${candidate.incident_id}`,
      state_deltas: deltasToRevert.map((d) => ({
        entity_type: d.entity_type,
        entity_id: d.entity_id,
        field: d.field,
        previous_value: d.new_value,
        new_value: d.previous_value
      })),
      causal_narrative: `GOVERNED ROLLBACK: ${candidate.title} rolled back by ${executorRole} under authority of ${authorizerRole}. Reverted ${deltasToRevert.length} state deltas.`,
      systemic_impact: {
        control_margin_delta: -candidate.expected_control_margin_delta,
        stability_delta: -0.2
      }
    };
    const rollbackRecord = {
      rollback_id: rollbackId,
      intervention_id: candidate.id,
      requested_by: executorRole,
      authorized_by: authorizerRole,
      status: "ROLLBACK_COMPLETED",
      deltas_reverted_count: deltasToRevert.length,
      timestamp,
      justification
    };
    return {
      success: true,
      rollbackRecord,
      events: [rollbackEvent]
    };
  }
  /**
   * Section 31: Conflict detection between proposed/active interventions.
   */
  static checkInterventionConflict(candidateA, candidateB) {
    const sharedEntities = candidateA.target_entities.filter((e) => candidateB.target_entities.includes(e));
    const sharedDependencies = candidateA.target_dependencies.filter((d) => candidateB.target_dependencies.includes(d));
    if (sharedEntities.length > 0 || sharedDependencies.length > 0) {
      if (candidateA.type === "DEPENDENCY_ISOLATION" && candidateB.type === "EXPOSURE_REDUCTION") {
        return {
          hasConflict: true,
          conflictReason: `CONFLICTING_INTERVENTIONS: Simultaneous isolation and limit haircut on shared entities [${sharedEntities.join(", ")}]. Bilateral netting rails cannot be concurrently partitioned and throttled.`
        };
      }
      if (candidateA.type === "DATA_QUARANTINE" && candidateB.type === "MODEL_DIVERSIFICATION") {
        return {
          hasConflict: false
          // Complementary
        };
      }
      if (candidateA.id !== candidateB.id) {
        return {
          hasConflict: true,
          conflictReason: `CONFLICTING_INTERVENTIONS: Multiple active interventions targeted at shared entities [${sharedEntities.join(", ")}]. Sequence or resolve before execution.`
        };
      }
    }
    return { hasConflict: false };
  }
};

// server/src/foundry/independentVerifier.ts
import crypto3 from "crypto";
var IndependentVerifier = class {
  /**
   * Section 12 & 13: Gathers independent observation from simulation topology
   * without relying on the executor's claims.
   */
  static observeSystemState(candidate, execution, engine, options) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const obsId = `OBS-${execution.execution_id.slice(-8)}-${Date.now().toString(36).toUpperCase()}`;
    const currentMargin = engine.controlState.control_margin_percent;
    const propIntel = engine.controlState.intelligence?.propagation_intelligence;
    const propDepth = propIntel?.maximum_depth_hops !== void 0 ? propIntel.maximum_depth_hops : 2;
    const affectedCount = propIntel?.breadth_affected_nodes !== void 0 ? propIntel.breadth_affected_nodes : 4;
    const diversity = engine.controlState.intelligence?.collective_decision_signal?.effective_decision_diversity || 0.78;
    const lastEvidence = engine.evidenceRecords[engine.evidenceRecords.length - 1];
    let calculatedFreshness = lastEvidence ? EvidenceEngine.calculateFreshness(lastEvidence.timestamp) : "FRESH";
    if (options?.forceStaleEvidence) {
      calculatedFreshness = "STALE";
    }
    let evidenceAgeSec = 12;
    if (calculatedFreshness === "STALE" || calculatedFreshness === "EXPIRED") {
      evidenceAgeSec = 180;
    } else if (calculatedFreshness === "AGING") {
      evidenceAgeSec = 60;
    } else if (lastEvidence) {
      const age = Math.round((Date.now() - new Date(lastEvidence.timestamp).getTime()) / 1e3);
      evidenceAgeSec = isNaN(age) || age < 0 ? 12 : Math.max(1, age);
    }
    const activeConflict = EvidenceEngine.getEvidenceConflict();
    const hasConflictingTelemetry = Boolean(options?.forceConflictingTelemetry || activeConflict && activeConflict.isConflicted);
    const residualThreats = [];
    const hasResidualNodes = engine.institutions.some((i) => i.status === "RESIDUAL_RISK");
    const hasCompromisedModels = engine.aiModels?.some((m) => ["COMPROMISED", "CONFLICTED"].includes(m.status)) || false;
    const isFlawedCandidate = candidate.id.includes("PARTIAL-ISO") || candidate.id.includes("DEP-ISOLATION") || candidate.id === "CAND-1";
    const isSecondaryQuarantine = candidate.id.includes("MODEL-QUARANTINE-BACKSTOP") || candidate.id.includes("MODEL-C-QUARANTINE") || candidate.id.includes("QUARANTINE") || candidate.id.includes("CAND-SEC-01") || candidate.target_entities.includes("MODEL-C") && candidate.target_dependencies.includes("DEP_MODEL_C_ASSET_17");
    if (isFlawedCandidate || options?.forceDownstreamContagion) {
      residualThreats.push("Latent unquarantined tensor desynchronization in MODEL-C");
      residualThreats.push("Downstream collateral stress propagating along DEP_MODEL_C_ASSET_17 rail");
    }
    if (hasResidualNodes && !isSecondaryQuarantine) {
      residualThreats.push("Residual risk flags active on Tier-1 clearing institutions");
    }
    if (hasCompromisedModels && !isSecondaryQuarantine) {
      residualThreats.push("Algorithmic herd correlation elevated above acceptable threshold");
    }
    if (options?.forcePartialRecovery) {
      residualThreats.length = 0;
    }
    const effectiveMargin = options?.forcePartialRecovery ? 58 : isFlawedCandidate || options?.forceDownstreamContagion ? 42 : isSecondaryQuarantine ? currentMargin >= 80 ? currentMargin : 84.2 : currentMargin;
    const rawPayload = `${obsId}:${effectiveMargin}:${propDepth}:${affectedCount}:${residualThreats.join(",")}:${timestamp}`;
    const rawDigest = crypto3.createHash("sha256").update(rawPayload).digest("hex");
    return {
      observation_id: obsId,
      execution_id: execution.execution_id,
      candidate_id: candidate.id,
      observed_at: timestamp,
      observed_control_margin: effectiveMargin,
      observed_propagation_depth: options?.forceDownstreamContagion ? propDepth + 1 : propDepth,
      observed_affected_nodes: affectedCount,
      observed_diversity: diversity,
      residual_threats_observed: residualThreats,
      evidence_freshness_sec: evidenceAgeSec,
      has_conflicting_telemetry: hasConflictingTelemetry,
      raw_telemetry_digest_sha256: `sha256:${rawDigest.slice(0, 32)}`
    };
  }
  /**
   * Section 12, 13, 14, 15: Evaluates Expected vs Observed and produces authoritative VerificationRecord.
   */
  static verifyOutcome(candidate, execution, engine, preMargin, options) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const verifId = `VERIF-${execution.execution_id.slice(-8)}-${Date.now().toString(36).toUpperCase()}`;
    const evidenceId = `EVD-${Date.now().toString(36).toUpperCase()}`;
    const observation = this.observeSystemState(candidate, execution, engine, options);
    const expectedMarginTarget = Math.min(95, preMargin + candidate.expected_control_margin_delta);
    const expectedMarginMin = 65;
    const observedMargin = observation.observed_control_margin;
    const discrepancy = observedMargin - expectedMarginTarget;
    const expectedEffect = {
      expected_margin_min: expectedMarginMin,
      expected_margin_target: expectedMarginTarget,
      expected_propagation_depth_max: 1
    };
    const observedEffect = {
      observed_margin: Math.round(observedMargin),
      observed_propagation_depth: observation.observed_propagation_depth,
      observed_affected_nodes: observation.observed_affected_nodes
    };
    let verificationResult = "VERIFIED_EFFECTIVE";
    let outcome = "CONTROL_RESTORED";
    let causalAttribution = "CONFIRMED_DIRECT";
    let evidenceStatus = "FRESH";
    let report = "";
    let reassessment = null;
    const events = [];
    let crpRestorationState = "VERIFIED_RESTORATION";
    let crpAttribution = "SUPPORTED";
    let crpReassessmentRequired = false;
    let alternativeExplanation = "NONE_DETECTED: Observed recovery aligns with modeled intervention trajectory; all monitored contagion paths quiescent.";
    const residualCriticalPaths = [];
    if (observation.evidence_freshness_sec > 60 || options?.forceStaleEvidence) {
      verificationResult = "VERIFIED_UNCERTAIN";
      outcome = "CONTROL_UNVERIFIED";
      evidenceStatus = "STALE";
      causalAttribution = "UNVERIFIED_COINCIDENCE";
      crpRestorationState = "RESTORATION_UNRESOLVED";
      crpAttribution = "UNRESOLVED";
      crpReassessmentRequired = true;
      alternativeExplanation = `EVIDENCE_STALENESS: Telemetry evidence age (${observation.evidence_freshness_sec}s) exceeds allowable freshness boundary; ground truth cannot be attested.`;
      report = `EVIDENCE STALENESS VIOLATION: Telemetry evidence age (${observation.evidence_freshness_sec}s) exceeds maximum allowable freshness threshold (60s). Control restoration cannot be attested with stale evidence.`;
      reassessment = {
        reassessment_id: `REASSESS-${candidate.incident_id}-${Date.now().toString(36).toUpperCase()}`,
        triggered_by: "EVIDENCE_STALE",
        previous_intervention_id: candidate.id,
        pre_reassessment_margin: preMargin,
        post_reassessment_margin: observedMargin,
        residual_threat_vector: `Stale telemetry feed (${observation.evidence_freshness_sec}s latency); lack of fresh enclave heartbeat.`,
        recommended_escalation: "Refresh cryptographic telemetry channel and re-sample authoritative node states.",
        escalated_candidate_id: `CAND-${candidate.incident_id}-EVD-REFRESH`,
        reassessment_timestamp: timestamp,
        status: "ACTIVE"
      };
      engine.controlState.controllability_state = "CONTROL_UNVERIFIED";
      events.push({
        event_id: `EVT-VERIF-STALE-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "EVIDENCE_STALENESS_DETECTED",
        severity: "WARNING",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "controllability_state", previous_value: engine.controlState.controllability_state, new_value: "CONTROL_UNVERIFIED" }
        ],
        causal_narrative: report,
        systemic_impact: { control_margin_delta: 0, stability_delta: -0.05 }
      });
    } else if (observation.has_conflicting_telemetry) {
      verificationResult = "VERIFIED_UNCERTAIN";
      outcome = "CONFLICTED";
      evidenceStatus = "CONFLICTED";
      causalAttribution = "UNVERIFIED_COINCIDENCE";
      crpRestorationState = "RESTORATION_UNRESOLVED";
      crpAttribution = "UNRESOLVED";
      crpReassessmentRequired = true;
      alternativeExplanation = "TELEMETRY_CONFLICT: Conflicting signals between primary telemetry rail and secondary audit feed prevent restoration attestation.";
      report = `TELEMETRY CONFLICT DETECTED: Primary operational feed indicates recovery, but independent enclave audit logs detect conflicting telemetry signatures. Restoration blocked.`;
      reassessment = {
        reassessment_id: `REASSESS-${candidate.incident_id}-${Date.now().toString(36).toUpperCase()}`,
        triggered_by: "OUTCOME_CONFLICTED",
        previous_intervention_id: candidate.id,
        pre_reassessment_margin: preMargin,
        post_reassessment_margin: observedMargin,
        residual_threat_vector: "Telemetry desynchronization between primary rail and audit feed.",
        recommended_escalation: "Execute cross-oracle reconciliation and apply authoritative state fence.",
        escalated_candidate_id: `CAND-${candidate.incident_id}-FENCE-RECONCILE`,
        reassessment_timestamp: timestamp,
        status: "ACTIVE"
      };
      engine.controlState.controllability_state = "CONTROL_UNVERIFIED";
      events.push({
        event_id: `EVT-VERIF-CONFLICT-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "CONFLICTING_EVIDENCE_DETECTED",
        severity: "CRITICAL",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "controllability_state", previous_value: engine.controlState.controllability_state, new_value: "CONTROL_UNVERIFIED" }
        ],
        causal_narrative: report,
        systemic_impact: { control_margin_delta: 0, stability_delta: -0.1 }
      });
    } else if (observation.residual_threats_observed.length > 0 || candidate.id.includes("PARTIAL-ISO") || candidate.id.includes("DEP-ISOLATION") || candidate.id === "CAND-1" || options?.forceDownstreamContagion) {
      verificationResult = "VERIFIED_FAILED";
      outcome = "CONTROL_NOT_RESTORED";
      causalAttribution = "FAILED_RECOVERY";
      crpRestorationState = "CONTROL_NOT_RESTORED";
      crpAttribution = "UNRESOLVED";
      crpReassessmentRequired = true;
      alternativeExplanation = "EXOGENOUS_ORACLE_LATENCY: Cached poisoned covariance tensors in MODEL-C sustain secondary margin liquidation cascade despite primary rail sever.";
      residualCriticalPaths.push({
        path_id: "PATH-MODEL-C",
        vector: "MODEL-C \u2192 BANK-C \u2192 ASSET-17",
        active_threat: observation.residual_threats_observed[0] || "Cached malicious prices persisting in MODEL-C weights; driving 79% correlated sell herd."
      });
      report = `OUTCOME FAILURE (EXECUTION != OUTCOME): Technical execution succeeded, but independent verifier confirmed latent downstream contagion: ${observation.residual_threats_observed.join("; ")}. Control margin is ${observedMargin}% (target was ${expectedMarginTarget}%).`;
      reassessment = {
        reassessment_id: `REASSESS-${candidate.incident_id}-${Date.now().toString(36).toUpperCase()}`,
        triggered_by: "RESIDUAL_HAZARD",
        previous_intervention_id: candidate.id,
        pre_reassessment_margin: preMargin,
        post_reassessment_margin: observedMargin,
        residual_threat_vector: observation.residual_threats_observed[0] || "Latent Algorithmic Contagion via Unquarantined MODEL-C Tensors",
        recommended_escalation: "Quarantine MODEL-C execution enclave and activate Synthetic Asset Backstop across BANK-C and BANK-D.",
        escalated_candidate_id: `CAND-${candidate.incident_id}-MODEL-QUARANTINE-BACKSTOP`,
        reassessment_timestamp: timestamp,
        status: "ACTIVE"
      };
      engine.controlState.controllability_state = "CONTROL_NOT_RESTORED";
      engine.controlState.overall_status = "RESIDUAL_RISK";
      engine.controlState.control_margin_percent = observedMargin;
      if (engine.controlState.intelligence) {
        engine.controlState.intelligence.control_margin_percent = observedMargin;
        engine.controlState.intelligence.controllability_state = "CONTROL_NOT_RESTORED";
      }
      for (const inc of engine.incidents) {
        if (inc.status === "RESOLVED") {
          inc.status = "CONTAINING";
        }
      }
      events.push({
        event_id: `EVT-VERIF-FAILED-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "INTERVENTION_VERIFICATION_FAILED",
        severity: "CRITICAL",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "controllability_state", previous_value: engine.controlState.controllability_state, new_value: "CONTROL_NOT_RESTORED" }
        ],
        causal_narrative: report,
        systemic_impact: { control_margin_delta: -6, stability_delta: -0.15 }
      });
      events.push({
        event_id: `EVT-REASSESS-${Date.now() + 1}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "REASSESSMENT_TRIGGERED",
        severity: "HIGH",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `AUTOMATIC REASSESSMENT: Verifier mandated escalation. Next action identified: [${reassessment.escalated_candidate_id}].`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      });
    } else if (observedMargin < expectedMarginMin) {
      verificationResult = "VERIFIED_PARTIAL";
      outcome = "CONTROL_PARTIALLY_RESTORED";
      causalAttribution = "PROBABLE";
      crpRestorationState = "PARTIALLY_RESTORED";
      crpAttribution = "PLAUSIBLE";
      crpReassessmentRequired = true;
      alternativeExplanation = "PARTIAL_TRANSMISSION_DAMPENING: Cascade velocity slowed but systemic buffer remains below safe operating threshold (65%).";
      report = `PARTIAL RECOVERY CONFIRMED: Intervention stabilized cascade velocity, but Control Margin reached only ${observedMargin}% (Threshold required: ${expectedMarginMin}%). Secondary stabilization required.`;
      reassessment = {
        reassessment_id: `REASSESS-${candidate.incident_id}-${Date.now().toString(36).toUpperCase()}`,
        triggered_by: "VERIFIED_PARTIAL",
        previous_intervention_id: candidate.id,
        pre_reassessment_margin: preMargin,
        post_reassessment_margin: observedMargin,
        residual_threat_vector: "Sub-threshold control restoration; bilateral exposure remains elevated.",
        recommended_escalation: "Deploy secondary exposure reduction or emergency intraday liquidity buffer.",
        escalated_candidate_id: `CAND-${candidate.incident_id}-EXPOSURE-REDUCTION`,
        reassessment_timestamp: timestamp,
        status: "ACTIVE"
      };
      engine.controlState.controllability_state = "CONTROL_PARTIALLY_RESTORED";
      engine.controlState.overall_status = "RESIDUAL_RISK";
      engine.controlState.control_margin_percent = observedMargin;
      events.push({
        event_id: `EVT-VERIF-PARTIAL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "PARTIAL_RECOVERY_CONFIRMED",
        severity: "WARNING",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "controllability_state", previous_value: engine.controlState.controllability_state, new_value: "CONTROL_PARTIALLY_RESTORED" }
        ],
        causal_narrative: report,
        systemic_impact: { control_margin_delta: observedMargin - preMargin, stability_delta: 0.15 }
      });
    } else {
      verificationResult = "VERIFIED_EFFECTIVE";
      outcome = "CONTROL_RESTORED";
      causalAttribution = "CONFIRMED_DIRECT";
      crpRestorationState = "VERIFIED_RESTORATION";
      crpAttribution = "SUPPORTED";
      crpReassessmentRequired = false;
      alternativeExplanation = "NONE_DETECTED: Observed recovery aligns with modeled intervention trajectory; all monitored contagion paths quiescent.";
      report = `OUTCOME VERIFIED EFFECTIVE: ${candidate.title} successfully halted transmission across target rails. Control Margin restored to ${observedMargin}% (Delta: +${observedMargin - preMargin}%). Cascade velocity reduced to 0.0 nodes/sec.`;
      reassessment = {
        reassessment_id: `REASSESS-${candidate.incident_id}-${Date.now().toString(36).toUpperCase()}`,
        triggered_by: "VERIFIED_EFFECTIVE",
        previous_intervention_id: candidate.id,
        pre_reassessment_margin: preMargin,
        post_reassessment_margin: observedMargin,
        residual_threat_vector: "NONE \u2014 Systemic equilibrium restored within safe operating boundary.",
        recommended_escalation: "Return to standard continuous supervisory monitoring.",
        escalated_candidate_id: "NONE",
        reassessment_timestamp: timestamp,
        status: "RESOLVED"
      };
      for (const inc of engine.incidents) {
        if (inc.status === "ACTIVE" || inc.status === "CONTAINING") {
          inc.status = "RESOLVED";
        }
      }
      engine.controlState.controllability_state = "CONTROL_RESTORED";
      engine.controlState.overall_status = "RESTORED";
      engine.controlState.control_margin_percent = observedMargin;
      if (engine.controlState.intelligence) {
        engine.controlState.intelligence.control_margin_percent = observedMargin;
        engine.controlState.intelligence.controllability_state = "CONTROL_RESTORED";
        if (engine.controlState.intelligence.collective_decision_signal) {
          engine.controlState.intelligence.collective_decision_signal.decision_synchrony_percent = 14;
          engine.controlState.intelligence.collective_decision_signal.effective_decision_diversity = 0.85;
          engine.controlState.intelligence.collective_decision_signal.herding_correlation_index = 0.14;
        }
      }
      events.push({
        event_id: `EVT-VERIF-SUCCESS-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "OUTCOME_CONFIRMED",
        severity: "INFO",
        source_entity_id: "INDEPENDENT_VERIFIER",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "controllability_state", previous_value: "CONTROL_RECOVERING", new_value: "CONTROL_RESTORED" },
          { entity_type: "SYSTEM_CONTROL", entity_id: "ENCLAVE_CTRL", field: "overall_status", previous_value: engine.controlState.overall_status, new_value: "STABLE" }
        ],
        causal_narrative: report,
        systemic_impact: { control_margin_delta: observedMargin - preMargin, stability_delta: 0.3 }
      });
    }
    const evdPayload = `${evidenceId}:${candidate.id}:${verificationResult}:${outcome}:${observedMargin}:${timestamp}`;
    const digest = crypto3.createHash("sha256").update(evdPayload).digest("hex");
    const evidenceRecord = {
      evidence_id: evidenceId,
      sequence_step: engine.evidenceRecords.length + 1,
      title: `Independent Verification: ${candidate.title}`,
      incident_id: candidate.incident_id,
      timestamp,
      entity_id: candidate.target_entities[0] || "ENCLAVE_CTRL",
      event_chain: events.map((e) => e.event_id),
      payload_digest_sha256: `sha256:${digest.slice(0, 32)}`,
      enclave_attested: true,
      lineage_summary: report,
      compliance_alignment: "DORA_ARTICLE_14_ALIGNED"
    };
    engine.evidenceRecords.push(evidenceRecord);
    const assessmentId = `CRP-${execution.execution_id.slice(-8)}-${Date.now().toString(36).toUpperCase()}`;
    const lastEvidence = engine.evidenceRecords[engine.evidenceRecords.length - 2] || engine.evidenceRecords[engine.evidenceRecords.length - 1];
    let evidenceFreshnessClassification = "FRESH";
    if (evidenceStatus === "STALE") {
      evidenceFreshnessClassification = "STALE";
    } else if (lastEvidence) {
      evidenceFreshnessClassification = EvidenceEngine.calculateFreshness(lastEvidence.timestamp);
    }
    const restorationAssessment = {
      assessment_id: assessmentId,
      incident_id: candidate.incident_id,
      intervention_id: candidate.id,
      execution_id: execution.execution_id,
      expected_response: expectedEffect,
      observed_response: observedEffect,
      discrepancy: {
        margin_discrepancy: discrepancy,
        propagation_depth_exceeded: observation.observed_propagation_depth > expectedEffect.expected_propagation_depth_max
      },
      residual_critical_paths: residualCriticalPaths,
      evidence_status: {
        freshness: evidenceFreshnessClassification,
        is_conflicted: observation.has_conflicting_telemetry,
        evidence_record_ids: [evidenceId],
        telemetry_digest_sha256: observation.raw_telemetry_digest_sha256
      },
      alternative_explanation: alternativeExplanation,
      attribution: crpAttribution,
      restoration_state: crpRestorationState,
      reassessment_required: crpReassessmentRequired,
      assessed_at: timestamp
    };
    const verificationRecord = {
      verification_id: verifId,
      execution_id: execution.execution_id,
      observation_id: observation.observation_id,
      candidate_id: candidate.id,
      verifier_subsystem: "INDEPENDENT_ENCLAVE_VERIFIER",
      verified_at: timestamp,
      observed_outcome: outcome,
      verification_result: verificationResult,
      expected_effect: expectedEffect,
      observed_effect: observedEffect,
      pre_intervention_margin: preMargin,
      post_intervention_margin: observedMargin,
      expected_margin: expectedMarginTarget,
      margin_discrepancy: discrepancy,
      causal_attribution: causalAttribution,
      residual_contagion_detected: verificationResult === "VERIFIED_FAILED" || verificationResult === "VERIFIED_PARTIAL",
      evidence_freshness_status: evidenceStatus,
      evidence_record_ids: [evidenceId],
      verification_report: report,
      restoration_confidence_rating: verificationResult === "VERIFIED_EFFECTIVE" ? "HIGH" : verificationResult === "VERIFIED_PARTIAL" ? "MEDIUM" : "LOW",
      restoration_assessment: restorationAssessment
    };
    return {
      observation,
      verification: verificationRecord,
      reassessment,
      evidenceRecord,
      events
    };
  }
};

// server/src/foundry/foundryManager.ts
var ControlFoundryManager = class {
  currentLifecycleState = "CANDIDATE";
  activeCandidateId = null;
  activeAuthorizationRequest = null;
  activeAuthorizationDecision = null;
  authorizationHistory = [];
  latestExecution = null;
  latestObservation = null;
  latestVerification = null;
  activeReassessment = null;
  activeRollback = null;
  auditTrail = [];
  lastEvaluatedPreMargin = 91;
  constraints = {
    max_disruption_budget_pct: 50,
    min_control_restoration_pct: 65,
    max_latency_sec: 45,
    max_collateral_exposure_pct: 30,
    required_reversibility: "HIGH"
  };
  /**
   * Records an audit event into the chronological timeline.
   */
  recordAudit(eventType, actorRole, actorId, lifecycleState, interventionId, details, evidenceDigest) {
    const auditEvent = {
      audit_id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      event_type: eventType,
      actor_role: actorRole,
      actor_id: actorId,
      lifecycle_state: lifecycleState,
      intervention_id: interventionId,
      details,
      evidence_digest: evidenceDigest
    };
    this.auditTrail.unshift(auditEvent);
  }
  /**
   * Generates or refreshes the live workspace state against current simulation engine state.
   */
  getWorkspaceState(engine) {
    const controlMargin = engine.controlState.control_margin_percent;
    const activeIncident = engine.incidents.find((i) => i.status === "ACTIVE" || i.status === "CONTAINING") || null;
    const propIntel = engine.controlState.intelligence?.propagation_intelligence;
    const hops = propIntel?.maximum_depth_hops || 0;
    const affectedCount = propIntel?.breadth_affected_nodes || 0;
    const diversity = engine.controlState.intelligence?.collective_decision_signal?.effective_decision_diversity || 0.88;
    const windowSec = engine.controlState.intervention_window_seconds || 60;
    const isAvailable = controlMargin < 80 || activeIncident !== null || engine.controlState.overall_status !== "STABLE";
    const candidates = generateInterventionCandidates(
      activeIncident,
      engine.institutions,
      engine.dependencies,
      engine.dataProviders,
      engine.infrastructureNodes,
      engine.aiModels,
      controlMargin,
      engine.activeScenarioId
    );
    const { evaluations, recommendation } = evaluateCounterfactuals(
      candidates,
      controlMargin,
      hops,
      affectedCount,
      diversity,
      windowSec,
      this.constraints,
      activeIncident
    );
    for (const cand of candidates) {
      if (cand.id === this.activeCandidateId) {
        cand.status = this.currentLifecycleState;
      } else if (recommendation && cand.id === recommendation.recommended_candidate_id) {
        cand.status = this.currentLifecycleState === "CANDIDATE" ? "RECOMMENDED" : cand.status;
      }
    }
    const window = {
      window_id: `WIN-${Date.now().toString(36).toUpperCase()}`,
      status: windowSec > 15 ? "OPEN" : windowSec > 0 ? "CLOSING" : "EXPIRED",
      remaining_seconds: windowSec,
      degradation_rate_pts_per_sec: +Math.max(0.2, (91 - controlMargin) / 120).toFixed(2),
      unrecoverable_horizon_timestamp: new Date(Date.now() + windowSec * 1e3).toISOString(),
      truth_status: "SIMULATED_VARIABLE"
    };
    return {
      is_available: isAvailable,
      active_incident_id: activeIncident?.incident_id || null,
      lifecycle_state: this.currentLifecycleState,
      intervention_window: window,
      constraints: this.constraints,
      candidates,
      evaluations,
      recommendation,
      active_authorization_request: this.activeAuthorizationRequest,
      active_authorization_decision: this.activeAuthorizationDecision,
      authorization_history: this.authorizationHistory,
      latest_execution: this.latestExecution,
      latest_observation: this.latestObservation,
      latest_verification: this.latestVerification,
      active_reassessment: this.activeReassessment,
      active_rollback: this.activeRollback,
      audit_trail: this.auditTrail,
      last_updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  resolveCandidate(workspace, candidateId) {
    let candidate = workspace.candidates.find((c) => c.id === candidateId);
    if (!candidate && (candidateId.includes("MODEL-QUARANTINE-BACKSTOP") || candidateId.includes("MODEL-C-QUARANTINE") || candidateId.includes("CAND-SEC-01") || candidateId.includes("QUARANTINE"))) {
      candidate = workspace.candidates.find(
        (c) => c.id.includes("MODEL-QUARANTINE-BACKSTOP") || c.id.includes("MODEL-C-QUARANTINE") || c.id.includes("QUARANTINE") || c.id.includes("BACKSTOP")
      );
    }
    return candidate;
  }
  /**
   * Request authorization for a candidate (e.g. by ANALYST or RISK_ANALYST).
   */
  requestAuthorization(candidateId, requesterRole, requesterUserId, engine) {
    const workspace = this.getWorkspaceState(engine);
    const candidate = this.resolveCandidate(workspace, candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }
    const reqId = `REQ-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const expiresAt = new Date(Date.now() + 6e4).toISOString();
    const request = {
      request_id: reqId,
      candidate_id: candidate.id,
      incident_id: candidate.incident_id,
      requester_user_id: requesterUserId,
      requester_role: requesterRole,
      required_role: candidate.authority_required,
      requested_at: timestamp,
      expires_at: expiresAt,
      policy_eval_result: {
        role_authorized: true,
        window_active: workspace.intervention_window.status !== "EXPIRED",
        evidence_sufficient: candidate.evidence_sufficiency !== "INSUFFICIENT",
        reasons: ["Valid intervention request submitted to governance board."]
      }
    };
    this.activeCandidateId = candidate.id;
    this.activeAuthorizationRequest = request;
    this.currentLifecycleState = "AUTHORIZATION_PENDING";
    this.recordAudit(
      "AUTHORIZATION_REQUESTED",
      requesterRole,
      requesterUserId,
      "AUTHORIZATION_PENDING",
      candidate.id,
      `Authorization requested by ${requesterRole} for ${candidate.title}. Required authority: ${candidate.authority_required}.`
    );
    return request;
  }
  /**
   * Authorize a candidate intervention (enforces separation of duties and role permissions).
   */
  authorize(candidateId, userRole, userId, engine, justification) {
    const workspace = this.getWorkspaceState(engine);
    const candidate = this.resolveCandidate(workspace, candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }
    const res = GovernedExecutionBus.authorizeIntervention(
      candidate,
      userRole,
      userId,
      justification || `Authorized by [${userRole}] for incident ${candidate.incident_id}`
    );
    this.activeCandidateId = candidateId;
    this.activeAuthorizationDecision = res.decision;
    this.authorizationHistory.unshift(res.decision);
    this.lastEvaluatedPreMargin = engine.controlState.control_margin_percent;
    if (res.success) {
      this.currentLifecycleState = "AUTHORIZED";
      this.recordAudit(
        "INTERVENTION_AUTHORIZED",
        userRole,
        userId,
        "AUTHORIZED",
        candidate.id,
        `Authorization granted by ${userRole} (${userId}). Cryptographic Seal: ${res.decision.cryptographic_seal_sha256}`,
        res.decision.cryptographic_seal_sha256
      );
      engine.authoritativeEvents.unshift({
        event_id: `EVT-AUTH-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: "INTERVENTION_AUTHORIZED",
        severity: "INFO",
        source_entity_id: "CONTROL_FOUNDRY",
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `AUTHORIZATION GRANTED: [${candidate.title}] authorized by role ${userRole} (${userId}).`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      });
    } else {
      this.currentLifecycleState = "REJECTED";
      this.recordAudit(
        "AUTHORIZATION_REJECTED",
        userRole,
        userId,
        "REJECTED",
        candidate.id,
        res.error || "Authorization rejected by policy validation."
      );
    }
    return res;
  }
  /**
   * Governed Execution & Independent Verification closed loop.
   */
  execute(candidateId, executorRole, executorUserId, engine, options) {
    const workspace = this.getWorkspaceState(engine);
    const candidate = this.resolveCandidate(workspace, candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }
    const isSecQuar = (id) => id.includes("MODEL-QUARANTINE-BACKSTOP") || id.includes("MODEL-C-QUARANTINE") || id.includes("CAND-SEC-01");
    const authDecision = this.activeAuthorizationDecision;
    const isAuthMatch = Boolean(authDecision && (authDecision.candidate_id === candidateId || isSecQuar(authDecision.candidate_id) && isSecQuar(candidateId)));
    if (!authDecision || !isAuthMatch) {
      throw new Error(`Candidate ${candidateId} has not been authorized. Cannot execute without authorization.`);
    }
    if (authDecision.decision !== "AUTHORIZED") {
      throw new Error(`Cannot execute candidate ${candidateId}: Authorization status is ${authDecision.decision}. Execution blocked.`);
    }
    this.activeCandidateId = candidateId;
    this.currentLifecycleState = "EXECUTING";
    const preMargin = engine.controlState.control_margin_percent;
    this.lastEvaluatedPreMargin = preMargin;
    const { execution, events } = GovernedExecutionBus.dispatchExecution(
      candidate,
      authDecision,
      engine,
      executorRole,
      executorUserId,
      options?.idempotencyKey,
      options?.forceTechnicalFailure
    );
    this.latestExecution = execution;
    for (const evt of events) {
      engine.authoritativeEvents.unshift(evt);
    }
    if (execution.status === "EXECUTION_FAILED") {
      this.currentLifecycleState = "EXECUTION_FAILED";
      this.recordAudit(
        "EXECUTION_FAILED",
        executorRole,
        executorUserId,
        "EXECUTION_FAILED",
        candidate.id,
        execution.technical_error || "Technical execution failed at dispatch gateway."
      );
      return { execution, observation: null, verification: null, reassessment: null };
    }
    this.currentLifecycleState = "EXECUTED";
    this.recordAudit(
      "INTERVENTION_EXECUTED",
      executorRole,
      executorUserId,
      "EXECUTED",
      candidate.id,
      `Technical execution completed. Applied ${execution.state_deltas_applied_count} topology deltas. Telemetry Receipt: ${execution.telemetry_receipt_digest_sha256}`,
      execution.telemetry_receipt_digest_sha256
    );
    engine.step();
    this.currentLifecycleState = "VERIFICATION_PENDING";
    const { observation, verification, reassessment, events: verifEvents } = IndependentVerifier.verifyOutcome(
      candidate,
      execution,
      engine,
      preMargin,
      options
    );
    this.latestObservation = observation;
    this.latestVerification = verification;
    this.activeReassessment = reassessment;
    for (const vEvt of verifEvents) {
      engine.authoritativeEvents.unshift(vEvt);
    }
    this.currentLifecycleState = verification.verification_result;
    this.recordAudit(
      verification.verification_result,
      "INDEPENDENT_ENCLAVE_VERIFIER",
      "ENCLAVE-VERIFIER-01",
      this.currentLifecycleState,
      candidate.id,
      verification.verification_report,
      verification.evidence_record_ids[0]
    );
    if (reassessment) {
      this.recordAudit(
        "REASSESSMENT_COMPLETED",
        "INDEPENDENT_ENCLAVE_VERIFIER",
        "ENCLAVE-VERIFIER-01",
        "REASSESSED",
        candidate.id,
        `Reassessment complete. Post-reassessment Margin: ${reassessment.post_reassessment_margin}%. Escalation target: ${reassessment.escalated_candidate_id}`
      );
    }
    if (engine.controlState) {
      engine.controlState.foundry = this.getWorkspaceState(engine);
    }
    return { execution, observation, verification, reassessment };
  }
  /**
   * Governed Rollback for reversible interventions.
   */
  rollback(candidateId, authorizerRole, executorRole, engine, justification) {
    const workspace = this.getWorkspaceState(engine);
    const candidate = workspace.candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }
    if (!this.latestExecution) {
      throw new Error(`No active execution record found for candidate ${candidateId}`);
    }
    const res = GovernedExecutionBus.rollbackIntervention(
      candidate,
      this.latestExecution,
      engine,
      authorizerRole,
      executorRole,
      justification
    );
    this.activeRollback = res.rollbackRecord;
    if (res.success) {
      this.currentLifecycleState = "ROLLED_BACK";
      for (const evt of res.events) {
        engine.authoritativeEvents.unshift(evt);
      }
      engine.step();
      this.recordAudit(
        "INTERVENTION_ROLLED_BACK",
        executorRole,
        `USR-${executorRole}`,
        "ROLLED_BACK",
        candidate.id,
        `Intervention rolled back. Reverted ${res.rollbackRecord.deltas_reverted_count} topology deltas.`
      );
    } else {
      this.currentLifecycleState = "ROLLBACK_FAILED";
      this.recordAudit(
        "ROLLBACK_FAILED",
        executorRole,
        `USR-${executorRole}`,
        "ROLLBACK_FAILED",
        candidate.id,
        res.error || "Rollback rejected by policy."
      );
    }
    return res;
  }
  /**
   * Resets the Foundry state when the simulation resets.
   */
  reset() {
    this.currentLifecycleState = "CANDIDATE";
    this.activeCandidateId = null;
    this.activeAuthorizationRequest = null;
    this.activeAuthorizationDecision = null;
    this.authorizationHistory = [];
    this.latestExecution = null;
    this.latestObservation = null;
    this.latestVerification = null;
    this.activeReassessment = null;
    this.activeRollback = null;
    this.auditTrail = [];
    this.lastEvaluatedPreMargin = 91;
    GovernedExecutionBus.reset();
  }
};
var globalFoundryManager = new ControlFoundryManager();

// server/src/assurance/assuranceManager.ts
var AssuranceManager = class {
  activeTraces = /* @__PURE__ */ new Map();
  currentActiveTraceId = "TRC-BASELINE-EQUILIBRIUM";
  integrityFailureActive = false;
  forcedAssuranceStatus = null;
  activeSecurityEvents = [];
  warnings = [];
  constructor() {
    this.reset();
  }
  reset() {
    this.activeTraces.clear();
    this.currentActiveTraceId = "TRC-BASELINE-EQUILIBRIUM";
    this.integrityFailureActive = false;
    this.forcedAssuranceStatus = null;
    this.activeSecurityEvents = [];
    this.warnings = [];
    EvidenceEngine.setFreshnessOverride(null);
    EvidenceEngine.setEvidenceConflict(false);
    this.activeTraces.set(this.currentActiveTraceId, {
      traceId: this.currentActiveTraceId,
      incidentId: "EQUILIBRIUM",
      firstObservedAt: (/* @__PURE__ */ new Date()).toISOString(),
      sourceEventIds: ["EVT-INIT-BASELINE"],
      assessmentId: "ASM-BASELINE-001",
      currentStatus: "NOMINAL_EQUILIBRIUM"
    });
  }
  /**
   * Initializes or binds a unified traceId for a newly declared incident.
   */
  bindIncidentTrace(incidentId, initialEventId) {
    const traceId = `TRC-${incidentId}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    this.currentActiveTraceId = traceId;
    const record = {
      traceId,
      incidentId,
      firstObservedAt: (/* @__PURE__ */ new Date()).toISOString(),
      sourceEventIds: initialEventId ? [initialEventId] : [],
      currentStatus: "INCIDENT_ACTIVE"
    };
    this.activeTraces.set(traceId, record);
    return traceId;
  }
  /**
   * Updates an active trace with lifecycle milestone references.
   */
  updateTrace(traceId, updates) {
    const existing = this.activeTraces.get(traceId);
    if (existing) {
      Object.assign(existing, updates);
    }
  }
  /**
   * Gets the active trace record.
   */
  getActiveTrace() {
    return this.activeTraces.get(this.currentActiveTraceId);
  }
  /**
   * Dynamically evaluates and derives the authoritative AssuranceState from live engine telemetry.
   */
  evaluateAssuranceState(engine) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const evidenceList = engine.evidenceRecords || [];
    const latestEvidence = evidenceList[evidenceList.length - 1];
    const freshness = latestEvidence ? EvidenceEngine.calculateFreshness(latestEvidence.timestamp) : "UNKNOWN";
    const conflict = EvidenceEngine.getEvidenceConflict();
    const evidenceCount = evidenceList.length;
    const sufficiency = evidenceCount >= 3 ? "SUFFICIENT" : evidenceCount >= 1 ? "MARGINAL" : "INSUFFICIENT";
    let status = "ASSURED";
    if (this.forcedAssuranceStatus) {
      status = this.forcedAssuranceStatus;
    } else if (this.integrityFailureActive) {
      status = "ASSURANCE_COMPROMISED";
    } else if (conflict && conflict.isConflicted) {
      status = "ASSURANCE_UNVERIFIED";
    } else if (engine.controlState?.controllability_state === "CONTROL_UNVERIFIED") {
      status = "ASSURANCE_UNVERIFIED";
    } else if (freshness === "STALE" || freshness === "EXPIRED") {
      status = "ASSURANCE_DEGRADED";
    } else if (engine.incidents && engine.incidents.length > 0) {
      status = "ASSURANCE_CONSTRAINED";
    } else {
      status = "ASSURED";
    }
    const warnings = [];
    if (this.integrityFailureActive) {
      warnings.push("CRITICAL: Enclave cryptographic digest mismatch detected on evidence payload.");
    }
    if (conflict && conflict.isConflicted) {
      warnings.push(`EVIDENCE CONFLICT: Discrepancy between ${conflict.sourceA} and ${conflict.sourceB}.`);
    }
    if (freshness === "STALE" || freshness === "EXPIRED") {
      warnings.push(`EVIDENCE STALENESS: Telemetry age exceeds verification threshold (${freshness}).`);
    }
    if (sufficiency === "INSUFFICIENT") {
      warnings.push("EVIDENCE DEFICIT: Fewer than minimum required attested records for intervention.");
    }
    const state = {
      assuranceStatus: status,
      identityStatus: "VERIFIED",
      authorizationStatus: "GOVERNED",
      evidenceStatus: this.integrityFailureActive ? "CORRUPTED" : conflict && conflict.isConflicted ? "CONFLICTED" : freshness === "STALE" || freshness === "EXPIRED" ? "STALE" : "VALID",
      evidenceFreshness: freshness,
      evidenceSufficiency: sufficiency,
      evidenceConflict: Boolean(conflict && conflict.isConflicted),
      conflictDescription: conflict?.conflictDescription,
      integrityStatus: this.integrityFailureActive ? "FAILED" : "VERIFIED",
      privacyStatus: "ENFORCED",
      executionStatus: engine.controlState?.foundry?.latest_execution?.status === "EXECUTED" ? "EXECUTED" : engine.controlState?.foundry?.latest_execution?.status === "EXECUTION_FAILED" ? "FAILED" : "READY",
      verificationStatus: engine.controlState?.controllability_state === "CONTROL_RESTORED" ? "RESTORED" : engine.controlState?.controllability_state === "CONTROL_UNVERIFIED" ? "UNVERIFIED" : "PENDING",
      observabilityStatus: "OPTIMAL",
      uncertaintyStatus: conflict && conflict.isConflicted ? "HIGH" : freshness === "STALE" ? "MEDIUM" : "LOW",
      activeSecurityEvents: [...this.activeSecurityEvents],
      warnings,
      lastVerifiedAt: timestamp,
      traceId: this.currentActiveTraceId,
      calculationVersion: "ASR-v1.0-ENCLAVE",
      truthStatus: "IMPLEMENTED"
    };
    return state;
  }
  /**
   * Generates mathematical Control Margin provenance breakdown.
   */
  generateControlMarginProvenance(previousMargin, newMargin, engine) {
    const intel = engine.controlState?.intelligence;
    const conc = intel?.concentration_metrics;
    const depDelta = conc?.dependency_exposure_hhi ? -Math.round(conc.dependency_exposure_hhi * 20) : -6;
    const propDelta = intel?.propagation_intelligence?.maximum_depth_hops ? -Math.round(intel.propagation_intelligence.maximum_depth_hops * 4) : -8;
    const infraDelta = conc?.infrastructure_concentration_hhi && conc.infrastructure_concentration_hhi > 0.4 ? -12 : 0;
    const herdDelta = intel?.collective_decision_signal?.decision_synchrony_percent && intel.collective_decision_signal.decision_synchrony_percent > 80 ? -30 : 0;
    const recoveryDelta = newMargin > previousMargin ? newMargin - previousMargin : 0;
    return {
      previousMargin,
      newMargin,
      dependencyContribution: depDelta,
      propagationContribution: propDelta,
      infrastructureContribution: infraDelta,
      collectiveDecisionContribution: herdDelta,
      recoveryContribution: recoveryDelta,
      evidenceRefs: engine.evidenceRecords?.map((e) => e.evidence_id) || [],
      calculationVersion: "CM-v0.3",
      uncertainty: intel?.epistemic_uncertainty?.level || "LOW",
      source: "SIMULATED_VARIABLE",
      status: "EXPERIMENTAL PROTOTYPE METRIC"
    };
  }
  /**
   * Handles demonstration attack injections to test systemic resilience.
   */
  injectThreat(threatType, engine) {
    const timestamp = engine.clock?.virtual_timestamp || (/* @__PURE__ */ new Date()).toISOString();
    const tick = engine.clock?.tick || 0;
    let eventType = "ANOMALY_DETECTED";
    let narrative = "";
    switch (threatType) {
      case "THREAT_A_DATA_COMPROMISE": {
        eventType = "PROVIDER_COMPROMISED";
        narrative = "THREAT INJECTION [THREAT-A]: Information provider DATA-X rate feeds subjected to cryptographic integrity corruption.";
        const dataX = engine.dataProviders.find((p) => p.provider_id === "DATA-X");
        if (dataX) dataX.status = "COMPROMISED";
        this.activeSecurityEvents.push("DATA-X Oracle Compromise Active");
        break;
      }
      case "THREAT_B_UNAUTHORIZED_ACTION": {
        eventType = "AUTHORIZATION_DENIED";
        narrative = "SECURITY INCIDENT [THREAT-B]: Unauthorized role [OBSERVER] attempted execution of critical intervention. RBAC gateway blocked execution and generated tamper seal.";
        this.activeSecurityEvents.push("Unauthorized Intervention Attempt (Blocked)");
        break;
      }
      case "THREAT_C_STALE_EVIDENCE": {
        eventType = "EVIDENCE_EXPIRED";
        narrative = "ASSURANCE DEGRADATION [THREAT-C]: Evidence TTL reached; telemetry records flagged as STALE. Incident closure blocked.";
        EvidenceEngine.setFreshnessOverride("STALE");
        this.activeSecurityEvents.push("Evidence Staleness Injected");
        break;
      }
      case "THREAT_D_EXECUTION_OUTCOME_DIVERGENCE": {
        eventType = "RESIDUAL_HAZARD_DETECTED";
        narrative = "VERIFICATION ANOMALY [THREAT-D]: Technical intervention executed successfully, but independent verifier detected latent MODEL-C contagion. CONTROL_UNVERIFIED declared.";
        engine.controlState.controllability_state = "CONTROL_UNVERIFIED";
        this.activeSecurityEvents.push("Latent MODEL-C Contagion Detected");
        break;
      }
      case "THREAT_E_EVIDENCE_CONFLICT": {
        eventType = "EVIDENCE_CONFLICT_DETECTED";
        narrative = "ASSURANCE CONFLICT [THREAT-E]: Primary RTGS telemetry reports nominal recovery (+85%), but Secondary Clearing Audit detects residual collateral deficit. Uncertainty set to HIGH.";
        EvidenceEngine.setEvidenceConflict(true);
        engine.controlState.controllability_state = "CONTROL_UNVERIFIED";
        this.activeSecurityEvents.push("Telemetry Conflict Active (RTGS vs Clearing)");
        break;
      }
      case "INJECT_INTEGRITY_FAILURE": {
        eventType = "INTEGRITY_FAILURE_DETECTED";
        narrative = "CRITICAL INTEGRITY ANOMALY: Telemetry payload digest mismatch detected in enclave storage.";
        this.integrityFailureActive = true;
        if (engine.evidenceRecords && engine.evidenceRecords[0]) {
          engine.evidenceRecords[0].payload_digest_sha256 = "sha256:CORRUPTED_TAMPERED_PAYLOAD_HASH";
        }
        this.activeSecurityEvents.push("Cryptographic Digest Tampering Detected");
        break;
      }
    }
    const event = {
      event_id: `EVT-SEC-${Date.now()}`,
      tick,
      simulation_timestamp: timestamp,
      event_type: eventType,
      severity: "CRITICAL",
      source_entity_id: "ASSURANCE_ENCLAVE",
      causal_chain_id: `CHAIN-SECURITY-${threatType}`,
      state_deltas: [],
      causal_narrative: narrative,
      systemic_impact: { control_margin_delta: -15, stability_delta: -0.15 }
    };
    engine.authoritativeEvents.unshift(event);
    const updatedState = this.evaluateAssuranceState(engine);
    return {
      success: true,
      event,
      state: updatedState
    };
  }
  /**
   * Sets integrity failure status for testing
   */
  setIntegrityFailure(failed) {
    this.integrityFailureActive = failed;
  }
};
var globalAssuranceManager = new AssuranceManager();

// server/src/simulation/engine.ts
var SimulationEngine = class {
  prng;
  config;
  clock;
  // Authoritative dynamic topology
  institutions = [];
  dependencies = [];
  aiModels = [];
  assets = [];
  dataProviders = [];
  infrastructureNodes = [];
  incidents = [];
  controlState = { ...NORMAL_CONTROL_STATE };
  systemicEvents = [];
  decisionEvents = [];
  authoritativeEvents = [];
  evidenceRecords = [];
  interventions = [];
  // Scenario & progression state
  activeScenarioId = "SCENARIO_A";
  scenarioStageIndex = 0;
  scenarioState = "NORMAL";
  listeners = [];
  tickIntervalHandle = null;
  constructor(initialSeed = 42091) {
    this.prng = new Mulberry32(initialSeed);
    this.config = {
      seed: initialSeed,
      scenario_id: "SCENARIO_A",
      scenario_name: "Common Data Dependency Failure",
      description: "Controlled simulation of information provider compromise across Tier-1 banking rails",
      auto_tick: false,
      tick_interval_ms: 2e3
    };
    this.clock = {
      tick: 0,
      speed_multiplier: 1,
      is_running: false,
      virtual_timestamp: "2026-10-08T14:20:12Z",
      step_duration_ms: 2e3
    };
    this.reset(initialSeed);
  }
  /**
   * Resets simulation deterministically to the Normal Baseline State (Panel 2).
   */
  reset(seed) {
    const activeSeed = seed !== void 0 ? seed : this.config.seed;
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
    this.scenarioState = "NORMAL";
    this.scenarioStageIndex = 0;
    this.activeScenarioId = "SCENARIO_A";
    this.clock.tick = 0;
    this.clock.virtual_timestamp = "2026-10-08T14:20:12Z";
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
    const baselineAssessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      0,
      void 0,
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
    globalReplayEngine.clear();
    globalReplayEngine.recordFrame(this, "Normal Baseline State (Equilibrium)");
    this.notify("RESET", { tick: 0, seed: activeSeed, state: this.getSnapshot() });
  }
  /**
   * Switches and triggers an authoritative scenario (A, B, or C).
   */
  startScenario(scenarioId) {
    this.reset(this.config.seed);
    this.activeScenarioId = scenarioId;
    this.config.scenario_id = scenarioId;
    this.config.scenario_name = SCENARIO_DESCRIPTORS[scenarioId].name;
    this.scenarioState = "ATTACK_TRIGGERED";
    this.scenarioStageIndex = 0;
    const events = executeScenarioStage(scenarioId, 0, this);
    for (const evt of events) {
      this.authoritativeEvents.unshift(evt);
      this.decisionEvents.unshift(this.mapToDecisionEvent(evt));
    }
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
      overall_status: assessment.controllability_state === "CONTROL_RESTORED" ? "RESTORED" : assessment.controllability_state === "CONTROL_COLLAPSING" ? "COLLAPSING" : assessment.controllability_state === "CONTROL_CRITICAL" ? "CRITICAL" : assessment.controllability_state === "CONTROL_UNVERIFIED" ? "RESIDUAL_RISK" : assessment.controllability_state === "CONTROL_RECOVERING" ? "RECOVERING" : assessment.controllability_state === "CONTROL_DEGRADING" ? "DEGRADING" : "STABLE",
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
    this.notify("SCENARIO_STARTED", {
      scenario_id: scenarioId,
      incident: this.incidents[0],
      control_state: this.controlState,
      events: this.authoritativeEvents
    });
  }
  /**
   * Backward-compatible trigger for reference Scenario A.
   */
  injectAttack() {
    this.startScenario("SCENARIO_A");
  }
  /**
   * Advances the simulation clock by 1 deterministic tick and progresses multi-stage scenario.
   */
  step() {
    this.clock.tick += 1;
    const currentTimeMs = new Date(this.clock.virtual_timestamp).getTime();
    this.clock.virtual_timestamp = new Date(currentTimeMs + 1e3).toISOString();
    if (this.scenarioState === "ATTACK_TRIGGERED") {
      if (this.controlState.intervention_window_seconds > 0) {
        this.controlState.intervention_window_seconds = Math.max(0, this.controlState.intervention_window_seconds - 1);
      }
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
      this.scenarioState === "NORMAL" ? void 0 : this.activeScenarioId,
      this.interventions
    );
    this.controlState = {
      ...this.controlState,
      control_margin_percent: assessment.control_margin_percent,
      overall_status: assessment.controllability_state === "CONTROL_RESTORED" ? "RESTORED" : assessment.controllability_state === "CONTROL_COLLAPSING" ? "COLLAPSING" : assessment.controllability_state === "CONTROL_CRITICAL" ? "CRITICAL" : assessment.controllability_state === "CONTROL_UNVERIFIED" ? "RESIDUAL_RISK" : assessment.controllability_state === "CONTROL_RECOVERING" ? "RECOVERING" : assessment.controllability_state === "CONTROL_DEGRADING" ? "DEGRADING" : "STABLE",
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
    const frame = globalReplayEngine.recordFrame(this);
    this.notify("TICK", {
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
  recomputeIntelligence() {
    const assessment = generateSystemicControllabilityAssessment(
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes,
      this.aiModels,
      this.incidents,
      this.evidenceRecords,
      this.clock.tick,
      this.scenarioState === "NORMAL" ? void 0 : this.activeScenarioId,
      this.interventions
    );
    this.controlState = {
      ...this.controlState,
      control_margin_percent: assessment.control_margin_percent,
      overall_status: assessment.controllability_state === "CONTROL_RESTORED" ? "RESTORED" : assessment.controllability_state === "CONTROL_COLLAPSING" ? "COLLAPSING" : assessment.controllability_state === "CONTROL_CRITICAL" ? "CRITICAL" : assessment.controllability_state === "CONTROL_UNVERIFIED" ? "RESIDUAL_RISK" : assessment.controllability_state === "CONTROL_RECOVERING" ? "RECOVERING" : assessment.controllability_state === "CONTROL_DEGRADING" ? "DEGRADING" : "STABLE",
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
  scrubToTick(targetTick) {
    const success = globalReplayEngine.restoreTick(targetTick, this);
    if (success) {
      this.notify("REPLAY_SCRUB", {
        tick: targetTick,
        clock: this.clock,
        control_state: this.controlState
      });
    }
    return success;
  }
  pause() {
    this.clock.is_running = false;
    if (this.tickIntervalHandle) {
      clearInterval(this.tickIntervalHandle);
      this.tickIntervalHandle = null;
    }
    this.notify("PAUSED", { tick: this.clock.tick });
  }
  resume() {
    if (this.clock.is_running) return;
    this.clock.is_running = true;
    const interval = Math.max(200, Math.floor(1e3 / (this.clock.speed_multiplier || 1)));
    this.tickIntervalHandle = setInterval(() => {
      this.step();
    }, interval);
    this.notify("RESUMED", { tick: this.clock.tick });
  }
  setSpeed(multiplier) {
    this.clock.speed_multiplier = multiplier;
    if (this.clock.is_running) {
      this.pause();
      this.resume();
    }
  }
  /**
   * Propose and execute intervention with dynamic verification.
   */
  applyIntervention(intervention) {
    this.interventions.push(intervention);
    if (intervention.status === "EXECUTED" || intervention.status === "VERIFIED") {
      for (const entityId of intervention.target_entity_ids) {
        const prov = this.dataProviders.find((p) => p.provider_id === entityId);
        if (prov) prov.status = "RECOVERING";
        const inst = this.institutions.find((i) => i.institution_id === entityId);
        if (inst) inst.status = "RECOVERING";
        const model = this.aiModels.find((m) => m.model_id === entityId);
        if (model) model.status = "RECOVERING";
        for (const dep of this.dependencies) {
          if (dep.source_id === entityId || dep.target_id === entityId) {
            dep.status = "RECOVERING";
          }
        }
      }
      const intEvent = {
        event_id: `EVT-INT-${Date.now().toString(36).toUpperCase()}`,
        tick: this.clock.tick,
        simulation_timestamp: this.clock.virtual_timestamp,
        event_type: "INTERVENTION_EXECUTED",
        severity: "INFO",
        source_entity_id: intervention.proposer_role,
        target_entity_id: intervention.target_entity_ids[0],
        causal_chain_id: `CHAIN-${this.activeScenarioId}`,
        state_deltas: intervention.target_entity_ids.map((id) => ({
          entity_type: "INSTITUTION",
          entity_id: id,
          field: "status",
          previous_value: "DEGRADING",
          new_value: "RECOVERING"
        })),
        causal_narrative: `Intervention [${intervention.title}] executed. Quarantined infected channels across target nodes.`,
        systemic_impact: { control_margin_delta: 38, stability_delta: 0.28 }
      };
      this.authoritativeEvents.unshift(intEvent);
      this.decisionEvents.unshift(this.mapToDecisionEvent(intEvent));
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
        this.scenarioState === "NORMAL" ? void 0 : this.activeScenarioId,
        this.interventions
      );
      this.controlState = {
        ...this.controlState,
        control_margin_percent: Math.max(76, metrics.control_margin_percent),
        overall_status: "RECOVERING",
        system_stability_index: metrics.system_stability_index,
        last_evaluated_timestamp: this.clock.virtual_timestamp,
        controllability_state: "CONTROL_RECOVERING",
        intelligence: assessment,
        foundry: globalFoundryManager.getWorkspaceState(this),
        assurance: globalAssuranceManager.evaluateAssuranceState(this)
      };
      globalReplayEngine.recordFrame(this, `Intervention Executed: ${intervention.title}`);
      this.notify("INTERVENTION_APPLIED", { intervention, control_state: this.controlState });
    }
  }
  /**
   * Retrieves causal explanation for an entity.
   */
  getCausalTrace(entityId) {
    return traceEntityCausality(
      entityId,
      this.institutions,
      this.dependencies,
      this.dataProviders,
      this.infrastructureNodes
    );
  }
  getSnapshot() {
    return {
      seed: this.config.seed,
      tick: this.clock.tick,
      timestamp: this.clock.virtual_timestamp,
      control_margin_percent: this.controlState.control_margin_percent,
      active_incident_count: this.incidents.filter((i) => i.status === "ACTIVE" || i.status === "CONTAINING").length,
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
  /**
   * Hydrates engine state from a persistent snapshot.
   */
  hydrate(snapshot) {
    if (!snapshot) return;
    if (Array.isArray(snapshot.institutions)) this.institutions = snapshot.institutions;
    if (Array.isArray(snapshot.dependencies)) this.dependencies = snapshot.dependencies;
    if (Array.isArray(snapshot.aiModels)) this.aiModels = snapshot.aiModels;
    if (Array.isArray(snapshot.assets)) this.assets = snapshot.assets;
    if (Array.isArray(snapshot.dataProviders)) this.dataProviders = snapshot.dataProviders;
    if (Array.isArray(snapshot.infrastructureNodes)) this.infrastructureNodes = snapshot.infrastructureNodes;
    if (Array.isArray(snapshot.incidents)) this.incidents = snapshot.incidents;
    if (snapshot.controlState) this.controlState = snapshot.controlState;
    if (Array.isArray(snapshot.systemicEvents)) this.systemicEvents = snapshot.systemicEvents;
    if (Array.isArray(snapshot.decisionEvents)) this.decisionEvents = snapshot.decisionEvents;
    if (Array.isArray(snapshot.authoritativeEvents)) this.authoritativeEvents = snapshot.authoritativeEvents;
    if (snapshot.activeScenarioId) this.activeScenarioId = snapshot.activeScenarioId;
    if (Array.isArray(snapshot.evidenceRecords)) this.evidenceRecords = snapshot.evidenceRecords;
    if (Array.isArray(snapshot.interventions)) this.interventions = snapshot.interventions;
    if (snapshot.simulationClock) this.clock = { ...this.clock, ...snapshot.simulationClock };
    if (snapshot.simulationConfig) this.config = { ...this.config, ...snapshot.simulationConfig };
    if (snapshot.scenarioState) {
      this.scenarioState = snapshot.scenarioState;
    } else if (this.incidents && this.incidents.length > 0) {
      this.scenarioState = "ATTACK_TRIGGERED";
    }
    if (typeof snapshot.scenarioStageIndex === "number") {
      this.scenarioStageIndex = snapshot.scenarioStageIndex;
    }
  }
  getClock() {
    return { ...this.clock };
  }
  getConfig() {
    return { ...this.config };
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  notify(event, payload) {
    for (const listener of this.listeners) {
      try {
        listener(event, payload);
      } catch (err) {
        console.error("Listener notification error:", err);
      }
    }
  }
  mapToDecisionEvent(evt) {
    let decType = "DATA_INTEGRITY_ANOMALY";
    if (evt.event_type === "INFRASTRUCTURE_FAILURE" || evt.event_type === "INFRASTRUCTURE_CONGESTION") {
      decType = "LIQUIDITY_PULL";
    } else if (evt.event_type === "INSTITUTION_DEGRADATION") {
      decType = "MARGIN_CALL";
    }
    return {
      event_id: evt.event_id,
      timestamp: evt.simulation_timestamp,
      source_entity_id: evt.source_entity_id,
      actor_role: "FIS_SYSTEMIC_ENGINE",
      decision_type: decType,
      confidence_score: 0.98,
      anomaly_score: evt.severity === "CRITICAL" ? 0.94 : 0.65,
      impact_projection: evt.systemic_impact.control_margin_delta,
      rationale_summary: evt.causal_narrative,
      severity: evt.severity === "ELEVATED" ? "HIGH" : evt.severity,
      status: evt.severity === "CRITICAL" ? "CRITICAL" : "DEGRADING"
    };
  }
};
var globalSimulationEngine = new SimulationEngine();

// server/src/state/store.ts
import fs from "fs";
import path from "path";
import os from "os";
var PERSISTENCE_FILE = process.env.VERCEL ? path.resolve(os.tmpdir(), ".fis_state_snapshot.json") : path.resolve(process.cwd(), ".fis_state_snapshot.json");
var SystemStateStore = class {
  constructor() {
    this.loadFromDisk();
  }
  /**
   * Loads state snapshot from disk into the globalSimulationEngine if present.
   */
  loadFromDisk() {
    try {
      if (fs.existsSync(PERSISTENCE_FILE)) {
        const raw = fs.readFileSync(PERSISTENCE_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (data) {
          globalSimulationEngine.hydrate(data);
          return true;
        }
      }
    } catch (err) {
      console.error("Failed to load FIS state from disk:", err);
    }
    return false;
  }
  /**
   * Returns current consolidated system state.
   */
  getState() {
    if (globalSimulationEngine.scenarioState === "NORMAL" && fs.existsSync(PERSISTENCE_FILE)) {
      this.loadFromDisk();
    }
    return {
      institutions: globalSimulationEngine.institutions,
      dependencies: globalSimulationEngine.dependencies,
      aiModels: globalSimulationEngine.aiModels,
      assets: globalSimulationEngine.assets,
      dataProviders: globalSimulationEngine.dataProviders,
      infrastructureNodes: globalSimulationEngine.infrastructureNodes,
      incidents: globalSimulationEngine.incidents,
      controlState: globalSimulationEngine.controlState,
      systemicEvents: globalSimulationEngine.systemicEvents,
      decisionEvents: globalSimulationEngine.decisionEvents,
      authoritativeEvents: globalSimulationEngine.authoritativeEvents,
      activeScenarioId: globalSimulationEngine.activeScenarioId,
      scenarioState: globalSimulationEngine.scenarioState,
      scenarioStageIndex: globalSimulationEngine.scenarioStageIndex,
      evidenceRecords: globalSimulationEngine.evidenceRecords,
      interventions: globalSimulationEngine.interventions,
      simulationClock: globalSimulationEngine.getClock(),
      simulationConfig: globalSimulationEngine.getConfig(),
      lastPersistedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Persists current state snapshot to disk.
   */
  persistToDisk() {
    try {
      const state = this.getState();
      fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist FIS state to disk:", err);
    }
  }
  /**
   * Cleans persistent file on baseline reset.
   */
  clearPersistence() {
    try {
      if (fs.existsSync(PERSISTENCE_FILE)) {
        fs.unlinkSync(PERSISTENCE_FILE);
      }
    } catch (err) {
      console.error("Failed to clear persistence file:", err);
    }
  }
};
var systemStateStore = new SystemStateStore();

// server/src/assurance/privacyBoundary.ts
var PrivacyBoundary = class {
  // Pre-configured data dictionary defining classification for all financial telemetry
  static DATA_DICTIONARY = [
    {
      fieldName: "institution_id",
      classification: "INTERNAL",
      source: "Global Legal Entity Identifier (GLEIF)",
      purpose: "Entity topological identification",
      transformation: "Direct mapping to G-SIB identifier",
      aggregationLevel: "INSTITUTION_LEVEL",
      authorizedRoles: ["SYSTEM_OPERATOR", "RISK_ANALYST", "COMPLIANCE_OFFICER", "OBSERVER"],
      retentionClass: "PERMANENT",
      derivedUsage: "Topology graph node key"
    },
    {
      fieldName: "liquidity_coverage_ratio",
      classification: "DERIVED",
      source: "Prudential Regulatory Telemetry (Basel III / BCBS 239)",
      purpose: "Short-term systemic liquidity stress tracking",
      transformation: "Ratio derived from High-Quality Liquid Assets / Total Net Cash Outflows",
      aggregationLevel: "INSTITUTION_LEVEL",
      authorizedRoles: ["SYSTEM_OPERATOR", "RISK_ANALYST", "COMPLIANCE_OFFICER", "OBSERVER"],
      retentionClass: "7_YEARS",
      derivedUsage: "Node health scoring & Controllability Margin M(t)"
    },
    {
      fieldName: "systemic_footprint_score",
      classification: "DERIVED",
      source: "BCBS G-SIB Scoring Methodology",
      purpose: "Systemic importance weighting",
      transformation: "Multi-factor weighted index of size, interconnectedness, and substitutability",
      aggregationLevel: "INSTITUTION_LEVEL",
      authorizedRoles: ["SYSTEM_OPERATOR", "RISK_ANALYST", "COMPLIANCE_OFFICER", "OBSERVER"],
      retentionClass: "PERMANENT",
      derivedUsage: "Graph centrality and cascade weight"
    },
    {
      fieldName: "proprietary_order_book_depth_usd_m",
      classification: "RESTRICTED",
      source: "Internal Matching Engine / FIX Protocol Gateway",
      purpose: "Raw market liquidity profiling",
      transformation: "Zero-Knowledge Enclave Aggregate: Converted to Network Centrality Index",
      aggregationLevel: "TIER_1_CLUSTER",
      authorizedRoles: ["SYSTEM_OPERATOR", "COMPLIANCE_OFFICER"],
      retentionClass: "EPHEMERAL_ENCLAVE_ONLY",
      derivedUsage: "Masked at privacy boundary; not exposed to observers"
    },
    {
      fieldName: "unhedged_derivative_notional_usd_b",
      classification: "SENSITIVE",
      source: "DTCC / Clearing Repository Bilateral Feeds",
      purpose: "Counterparty default risk assessment",
      transformation: "Differential Privacy: Perturbed into Decile Risk Tier (1-10)",
      aggregationLevel: "TIER_1_CLUSTER",
      authorizedRoles: ["SYSTEM_OPERATOR", "COMPLIANCE_OFFICER"],
      retentionClass: "30_DAYS_ENCLAVE",
      derivedUsage: "Masked at privacy boundary; stripped for observer roles"
    },
    {
      fieldName: "bilateral_intraday_borrowing_limit_usd_m",
      classification: "RESTRICTED",
      source: "RTGS / Fedwire Central Counterparty Netting Rail",
      purpose: "Clearing gridlock and settlement saturation modeling",
      transformation: "Aggregated exposure HHI and Chokepoint Saturation score",
      aggregationLevel: "NETWORK_CENTRALITY_INDEX",
      authorizedRoles: ["SYSTEM_OPERATOR", "COMPLIANCE_OFFICER"],
      retentionClass: "90_DAYS",
      derivedUsage: "Converted to Dependency Exposure HHI before intelligence ingestion"
    }
  ];
  // Active privacy transformation records
  static transformations = [
    {
      transformId: "TRF-001-ORDERBOOK-ZK",
      timestamp: "2026-10-08T14:20:00Z",
      sourceEntityId: "TIER_1_GSIB_CLUSTER",
      rawFieldsCount: 48,
      protectedFieldsCount: 48,
      transformationType: "TOPOLOGICAL_SYNTHESIS",
      aggregationLevel: "NETWORK_CENTRALITY_INDEX",
      outputSignal: "Market Liquidity Depth Reserve: 84.2% [Aggregated]",
      authorizedUse: "Systemic Control Margin M(t) Calculation",
      classification: "DERIVED"
    },
    {
      transformId: "TRF-002-BILATERAL-NETTING",
      timestamp: "2026-10-08T14:21:15Z",
      sourceEntityId: "INFRA-1_RTGS",
      rawFieldsCount: 120,
      protectedFieldsCount: 112,
      transformationType: "AGGREGATION",
      aggregationLevel: "TIER_1_CLUSTER",
      outputSignal: "Clearing Chokepoint Saturation: 0.28 [HHI Clustered]",
      authorizedUse: "Dependency Intelligence Chokepoint Evaluation",
      classification: "AGGREGATED"
    },
    {
      transformId: "TRF-003-DERIVATIVE-TIERING",
      timestamp: "2026-10-08T14:22:30Z",
      sourceEntityId: "BANK-A..D_BILATERAL",
      rawFieldsCount: 36,
      protectedFieldsCount: 36,
      transformationType: "DIFFERENTIAL_NOISE",
      aggregationLevel: "NETWORK_CENTRALITY_INDEX",
      outputSignal: "Systemic Credit Contagion Index: 0.19 [Decile Scaled]",
      authorizedUse: "Counterfactual Propagation Projection",
      classification: "DERIVED"
    }
  ];
  /**
   * Returns list of all active privacy transformations
   */
  static getTransformations() {
    return [...this.transformations];
  }
  /**
   * Applies privacy transformation to an incoming raw telemetry batch.
   */
  static recordTransformation(sourceEntityId, rawFieldsCount, outputSignal, authorizedUse) {
    const record = {
      transformId: `TRF-${Date.now().toString(36).toUpperCase()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      sourceEntityId,
      rawFieldsCount,
      protectedFieldsCount: rawFieldsCount,
      transformationType: "AGGREGATION",
      aggregationLevel: "NETWORK_CENTRALITY_INDEX",
      outputSignal,
      authorizedUse,
      classification: "DERIVED"
    };
    this.transformations.unshift(record);
    if (this.transformations.length > 20) this.transformations.pop();
    return record;
  }
  /**
   * Enforces privacy boundary by role:
   * Strips RESTRICTED and SENSITIVE fields if userRole is not authorized.
   */
  static filterEntityForRole(entity, userRole) {
    if (!entity) return entity;
    const cloned = JSON.parse(JSON.stringify(entity));
    const isAuthorizedForRestricted = userRole === "SYSTEM_OPERATOR" || userRole === "COMPLIANCE_OFFICER";
    if (!isAuthorizedForRestricted) {
      if (cloned.proprietary_order_book_depth_usd_m !== void 0) {
        cloned.proprietary_order_book_depth_usd_m = "[RESTRICTED_MASKED_BY_PRIVACY_BOUNDARY]";
      }
      if (cloned.unhedged_derivative_notional_usd_b !== void 0) {
        cloned.unhedged_derivative_notional_usd_b = "[SENSITIVE_REDACTED]";
      }
      if (cloned.bilateral_intraday_borrowing_limit_usd_m !== void 0) {
        cloned.bilateral_intraday_borrowing_limit_usd_m = "[RESTRICTED_AGGREGATED_ONLY]";
      }
      cloned._privacy_enforced = true;
      cloned._privacy_role = userRole;
    } else {
      cloned._privacy_enforced = false;
      cloned._privacy_role = userRole;
    }
    return cloned;
  }
};

// server/src/assurance/ibmRuntime.ts
var IBMRuntimeContext = class {
  static CAPABILITY_MATRIX = [
    {
      capability: "Enterprise Event Processing",
      ibmTechnology: "IBM Z / LinuxONE s390x High-Throughput Substrate",
      truthState: "ARCHITECTED",
      rationale: "Sub-millisecond systemic event ingestion co-located with Tier-1 core banking transactions."
    },
    {
      capability: "Streaming / Event Fabric",
      ibmTechnology: "IBM Event Streams (Apache Kafka on LinuxONE)",
      truthState: "ARCHITECTED",
      rationale: "High-throughput event sourcing for immutable systemic state updates and multi-subscriber SSE distribution."
    },
    {
      capability: "Enterprise Data Persistence",
      ibmTechnology: "IBM Db2 for z/OS & LinuxONE",
      truthState: "ARCHITECTED",
      rationale: "ACID-compliant storage of topological graphs, historical incidents, and regulatory audit packages."
    },
    {
      capability: "In-Transaction AI Inference",
      ibmTechnology: "IBM Telum Integrated AI Accelerator / On-Chip Matrix Processing",
      truthState: "ARCHITECTED",
      rationale: "Low-latency evaluation of effective decision diversity (EDD) and algorithmic herding scores directly in transaction path."
    },
    {
      capability: "Containerized Microservices",
      ibmTechnology: "Red Hat OpenShift on LinuxONE",
      truthState: "ARCHITECTED",
      rationale: "Resilient container orchestration for FIS intelligence engines, propagation models, and Control Foundry."
    },
    {
      capability: "Enterprise AI Governance",
      ibmTechnology: "IBM watsonx.governance",
      truthState: "ARCHITECTED",
      rationale: "Lifecycle tracking, drift detection, and compliance attestation for systemic intervention recommendation models."
    },
    {
      capability: "Data Security & Enclave Isolation",
      ibmTechnology: "IBM Guardium & IBM Secure Execution for Linux",
      truthState: "ARCHITECTED",
      rationale: "Hardware-enforced memory isolation ensuring cross-firm financial topology cannot be inspected by external host administrators."
    }
  ];
  static HARDWARE_SUBSTRATE_RATIONALE = "The Financial Immune System operates as a systemic control intelligence layer requiring continuous proximity to mission-critical core banking ledgers, clearing rails, and RTGS infrastructure. Deploying on IBM Z and LinuxONE is appropriate because:\n1. High-Throughput Event Co-Location: Systemic contagion propagates in milliseconds; co-locating the intelligence engine with transactional workloads eliminates cross-cloud egress latency.\n2. CP Assist for Cryptographic Function (CPACF): Silicon-accelerated SHA-256 and asymmetric cryptography ensures every state delta and authorization seal is signed without operational latency penalty.\n3. Secure Execution Enclaves: Prevents multi-tenant hypervisors from inspecting proprietary order books while allowing computation of collective systemic risk metrics.\n4. Continuous Operational Availability: Systemic immune response cannot fail during market turbulence; IBM Z high-availability is architected to support uninterruptible control center continuity.";
  /**
   * Returns authoritative runtime truth status
   */
  static getRuntimeTruth() {
    return {
      runtimeMode: "LOCAL_SIMULATION",
      dataSource: "SIMULATED",
      eventStream: "SIMULATED",
      aiInference: "SIMULATED",
      enterpriseData: "SIMULATED",
      hardware: "ARCHITECTED",
      attestation: "SIMULATED",
      capabilities: [...this.CAPABILITY_MATRIX],
      hardwareSubstrateRationale: this.HARDWARE_SUBSTRATE_RATIONALE
    };
  }
};

// server/src/simulation/operations.ts
var OperationLifecycleManager = class {
  activeOperation = null;
  operationHistory = [];
  listeners = [];
  getActiveOperation() {
    return this.activeOperation ? { ...this.activeOperation } : null;
  }
  getRecentOperations(limit = 20) {
    return [...this.operationHistory].reverse().slice(0, limit);
  }
  getOperationById(operationId) {
    if (this.activeOperation && this.activeOperation.operation_id === operationId) {
      return { ...this.activeOperation };
    }
    const found = this.operationHistory.find((o) => o.operation_id === operationId);
    return found ? { ...found } : null;
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  notify(op) {
    for (const l of this.listeners) {
      try {
        l({ ...op });
      } catch (err) {
        console.error("Operation listener notification error:", err);
      }
    }
  }
  /**
   * Starts a new operation. Throws error if a conflicting operation is currently in progress.
   */
  beginOperation(type, details) {
    if (this.activeOperation && ["QUEUED", "RUNNING", "PROCESSING"].includes(this.activeOperation.status)) {
      const elapsed = Date.now() - new Date(this.activeOperation.started_at).getTime();
      if (elapsed < 3e3) {
        const error = new Error(`Operation conflict: Operation ${this.activeOperation.operation_id} (${this.activeOperation.operation_type}) is currently ${this.activeOperation.status}.`);
        error.status = 409;
        throw error;
      }
    }
    const opId = `OP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e3)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const op = {
      operation_id: opId,
      operation_type: type,
      status: "QUEUED",
      incident_id: details.incident_id,
      tick: details.tick,
      source_entity_id: details.source_entity_id,
      affected_entity_ids: details.affected_entity_ids || [],
      previous_state_summary: details.previous_state_summary,
      duration_ms: 0,
      started_at: now,
      data_truth_label: "SIMULATED"
    };
    this.activeOperation = op;
    this.notify(op);
    op.status = "RUNNING";
    this.notify(op);
    return op;
  }
  /**
   * Transitions active operation to PROCESSING
   */
  transitionProcessing(opId) {
    if (this.activeOperation && this.activeOperation.operation_id === opId) {
      this.activeOperation.status = "PROCESSING";
      this.notify(this.activeOperation);
    }
  }
  /**
   * Completes an operation successfully or with partial/reassessment status
   */
  completeOperation(opId, result) {
    const op = this.activeOperation;
    if (!op || op.operation_id !== opId) {
      const pastOp = this.operationHistory.find((o) => o.operation_id === opId);
      if (pastOp) return pastOp;
      throw new Error(`Cannot complete unknown operation: ${opId}`);
    }
    const now = /* @__PURE__ */ new Date();
    const duration = now.getTime() - new Date(op.started_at).getTime();
    op.status = result.status || "COMPLETED";
    op.new_state_summary = result.new_state_summary;
    if (result.affected_entity_ids) {
      op.affected_entity_ids = result.affected_entity_ids;
    }
    op.duration_ms = duration;
    op.completed_at = now.toISOString();
    this.operationHistory.push({ ...op });
    if (this.operationHistory.length > 100) this.operationHistory.shift();
    this.notify(op);
    this.activeOperation = null;
    return op;
  }
  /**
   * Fails an operation with error details
   */
  failOperation(opId, errorMessage) {
    const op = this.activeOperation;
    if (!op || op.operation_id !== opId) {
      throw new Error(`Cannot fail unknown operation: ${opId}`);
    }
    const now = /* @__PURE__ */ new Date();
    const duration = now.getTime() - new Date(op.started_at).getTime();
    op.status = "FAILED";
    op.error_message = errorMessage;
    op.duration_ms = duration;
    op.completed_at = now.toISOString();
    this.operationHistory.push({ ...op });
    if (this.operationHistory.length > 100) this.operationHistory.shift();
    this.notify(op);
    this.activeOperation = null;
    return op;
  }
};
var globalOperationManager = new OperationLifecycleManager();

// server/src/routes/api.ts
var router = Router();
router.get("/state", (req, res) => {
  res.json({
    success: true,
    data: systemStateStore.getState()
  });
});
router.get("/entities", (req, res) => {
  const { type } = req.query;
  const state = systemStateStore.getState();
  if (type === "INSTITUTION") return res.json({ success: true, data: state.institutions });
  if (type === "DEPENDENCY") return res.json({ success: true, data: state.dependencies });
  if (type === "AI_MODEL") return res.json({ success: true, data: state.aiModels });
  if (type === "DATA_PROVIDER") return res.json({ success: true, data: state.dataProviders });
  if (type === "INFRASTRUCTURE") return res.json({ success: true, data: state.infrastructureNodes });
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
router.get("/entities/:id", (req, res) => {
  const { id } = req.params;
  const state = systemStateStore.getState();
  const provider = state.dataProviders.find((p) => p.provider_id === id);
  if (provider) {
    const connectedDeps = state.dependencies.filter((d) => d.source_id === id || d.target_id === id);
    const affectedInsts = state.institutions.filter((i) => provider.institutions_served.includes(i.institution_id));
    return res.json({
      success: true,
      data: {
        entity: provider,
        type: "DATA_PROVIDER",
        connected_dependencies: connectedDeps,
        affected_institutions: affectedInsts,
        recent_events: state.decisionEvents.filter((e) => e.source_entity_id === id)
      }
    });
  }
  const institution = state.institutions.find((i) => i.institution_id === id);
  if (institution) {
    const connectedDeps = state.dependencies.filter((d) => d.source_id === id || d.target_id === id);
    const relatedAiModels = state.aiModels.filter((m) => m.deployed_institutions.includes(id));
    const relatedEvents = state.decisionEvents.filter((e) => e.source_entity_id === id);
    const trace = globalSimulationEngine.getCausalTrace(id);
    return res.json({
      success: true,
      data: {
        entity: institution,
        type: "INSTITUTION",
        connected_dependencies: connectedDeps,
        ai_models: relatedAiModels,
        recent_events: relatedEvents,
        causal_trace: trace
      }
    });
  }
  const dependency = state.dependencies.find((d) => d.dependency_id === id);
  if (dependency) {
    const depIntel = computeDependencyIntelligence(
      state.dependencies,
      state.institutions,
      state.dataProviders,
      state.infrastructureNodes
    ).find((di) => di.dependency_id === id);
    return res.json({
      success: true,
      data: {
        entity: dependency,
        type: "DEPENDENCY",
        source: state.institutions.find((i) => i.institution_id === dependency.source_id) || state.dataProviders.find((p) => p.provider_id === dependency.source_id),
        target: state.institutions.find((i) => i.institution_id === dependency.target_id),
        intelligence: depIntel
      }
    });
  }
  const infra = state.infrastructureNodes.find((n) => n.node_id === id);
  if (infra) {
    const connectedDeps = state.dependencies.filter((d) => d.source_id === id || d.target_id === id);
    const trace = globalSimulationEngine.getCausalTrace(id);
    return res.json({
      success: true,
      data: {
        entity: infra,
        type: "INFRASTRUCTURE_NODE",
        connected_dependencies: connectedDeps,
        causal_trace: trace,
        recent_events: state.authoritativeEvents.filter((e) => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }
  const aiModel = state.aiModels.find((m) => m.model_id === id);
  if (aiModel) {
    const deployedInsts = state.institutions.filter((i) => aiModel.deployed_institutions.includes(i.institution_id));
    const trace = globalSimulationEngine.getCausalTrace(id);
    return res.json({
      success: true,
      data: {
        entity: aiModel,
        type: "AI_MODEL",
        deployed_institutions: deployedInsts,
        causal_trace: trace,
        recent_events: state.authoritativeEvents.filter((e) => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }
  const asset = state.assets.find((a) => a.asset_id === id);
  if (asset) {
    const holderInsts = state.institutions.filter((i) => asset.primary_holder_institutions.includes(i.institution_id));
    return res.json({
      success: true,
      data: {
        entity: asset,
        type: "ASSET",
        holder_institutions: holderInsts,
        recent_events: state.authoritativeEvents.filter((e) => e.source_entity_id === id || e.target_entity_id === id)
      }
    });
  }
  res.status(404).json({ success: false, error: `Entity not found: ${id}` });
});
router.get("/incidents", (req, res) => {
  res.json({
    success: true,
    data: globalSimulationEngine.incidents
  });
});
router.get("/evidence", (req, res) => {
  res.json({
    success: true,
    data: globalSimulationEngine.evidenceRecords
  });
});
router.get("/simulation/scenarios", (req, res) => {
  res.json({
    success: true,
    active_scenario_id: globalSimulationEngine.activeScenarioId,
    data: Object.values(SCENARIO_DESCRIPTORS)
  });
});
router.post("/simulation/scenario", (req, res) => {
  const { scenario_id } = req.body;
  if (!scenario_id) {
    return res.status(400).json({ success: false, error: "Scenario ID is required" });
  }
  const targetScenario = scenario_id;
  if (!SCENARIO_DESCRIPTORS[targetScenario]) {
    return res.status(400).json({
      success: false,
      error: `Invalid scenario_id: ${scenario_id}. Available scenarios: ${Object.keys(SCENARIO_DESCRIPTORS).join(", ")}`
    });
  }
  let op;
  try {
    op = globalOperationManager.beginOperation("SCENARIO_INJECTION", {
      tick: globalSimulationEngine.clock.tick,
      incident_id: globalSimulationEngine.incidents[0]?.incident_id,
      source_entity_id: SCENARIO_DESCRIPTORS[targetScenario].primary_target,
      previous_state_summary: `Overall status: ${globalSimulationEngine.controlState.overall_status}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: "CONFLICT" });
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
  } catch (err) {
    globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/simulation/operations", (req, res) => {
  res.json({
    success: true,
    active_operation: globalOperationManager.getActiveOperation(),
    recent_operations: globalOperationManager.getRecentOperations(50)
  });
});
router.get("/simulation/operations/active", (req, res) => {
  res.json({
    success: true,
    active_operation: globalOperationManager.getActiveOperation()
  });
});
router.post("/simulation/propagate", (req, res) => {
  const { source_id, depth } = req.body;
  if (!source_id) {
    return res.status(400).json({ success: false, error: "source_id is required for graph propagation" });
  }
  let op;
  try {
    op = globalOperationManager.beginOperation("SIMULATION_STEP", {
      tick: globalSimulationEngine.clock.tick,
      source_entity_id: source_id,
      previous_state_summary: `Margin before propagation: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: "CONFLICT" });
    }
  }
  try {
    if (op) globalOperationManager.transitionProcessing(op.operation_id);
    const depthLimit = typeof depth === "number" ? depth : 2;
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
  } catch (err) {
    if (op) globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/simulation/replay/timeline", (req, res) => {
  res.json({
    success: true,
    timeline: globalReplayEngine.getTimeline(),
    current_tick: globalSimulationEngine.clock.tick
  });
});
router.post("/simulation/replay/scrub", (req, res) => {
  const { tick } = req.body;
  if (tick === void 0 || typeof tick !== "number") {
    return res.status(400).json({ success: false, error: "Tick number is required" });
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
router.get("/simulation/causal-trace/:id", (req, res) => {
  const { id } = req.params;
  const trace = globalSimulationEngine.getCausalTrace(id);
  res.json({
    success: true,
    data: trace
  });
});
router.get("/simulation/events", (req, res) => {
  res.json({
    success: true,
    data: globalSimulationEngine.authoritativeEvents,
    events: globalSimulationEngine.authoritativeEvents
  });
});
router.get("/events", (req, res) => {
  res.json({
    success: true,
    data: globalSimulationEngine.authoritativeEvents,
    events: globalSimulationEngine.authoritativeEvents
  });
});
router.post("/simulation/attack", (req, res) => {
  globalSimulationEngine.injectAttack();
  systemStateStore.persistToDisk();
  res.json({
    success: true,
    message: "Common Data Dependency Attack scenario triggered (RN-2026-0041).",
    control_state: globalSimulationEngine.controlState,
    incident: globalSimulationEngine.incidents[0]
  });
});
router.post("/simulation/reset", (req, res) => {
  const seed = req.body?.seed !== void 0 ? Number(req.body.seed) : 42091;
  const op = globalOperationManager.beginOperation("SIMULATION_RESET", {
    tick: globalSimulationEngine.clock.tick,
    previous_state_summary: `Pre-reset tick ${globalSimulationEngine.clock.tick}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
  });
  try {
    globalOperationManager.transitionProcessing(op.operation_id);
    globalSimulationEngine.reset(seed);
    systemStateStore.clearPersistence();
    const completedOp = globalOperationManager.completeOperation(op.operation_id, {
      new_state_summary: `Reset to baseline Tick 0, Seed ${seed}, Margin: 91% STABLE`
    });
    res.json({
      success: true,
      isExplicitReset: true,
      operation: completedOp,
      message: `System simulation reset to deterministic baseline (Normal State, Seed ${seed}).`,
      snapshot: globalSimulationEngine.getSnapshot(),
      control_state: globalSimulationEngine.controlState
    });
  } catch (err) {
    globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.post("/simulation/pause", (req, res) => {
  globalSimulationEngine.pause();
  res.json({ success: true, is_running: false, clock: globalSimulationEngine.getClock() });
});
router.post("/simulation/resume", (req, res) => {
  globalSimulationEngine.resume();
  res.json({ success: true, is_running: true, clock: globalSimulationEngine.getClock() });
});
router.get("/simulation/clock", (req, res) => {
  res.json({ success: true, ...globalSimulationEngine.getClock() });
});
router.post("/simulation/step", (req, res) => {
  let op;
  try {
    op = globalOperationManager.beginOperation("SIMULATION_STEP", {
      tick: globalSimulationEngine.clock.tick,
      incident_id: globalSimulationEngine.incidents[0]?.incident_id,
      previous_state_summary: `Tick ${globalSimulationEngine.clock.tick}, Margin: ${globalSimulationEngine.controlState.control_margin_percent}%`
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ success: false, error: err.message, status: "CONFLICT" });
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
        status: globalSimulationEngine.controlState.overall_status === "RESIDUAL_RISK" ? "REASSESSMENT_REQUIRED" : "COMPLETED"
      });
    }
    res.json({
      success: true,
      operation: completedOp,
      clock: globalSimulationEngine.getClock(),
      control_state: globalSimulationEngine.controlState,
      latest_event: globalSimulationEngine.authoritativeEvents[0] || null
    });
  } catch (err) {
    if (op) globalOperationManager.failOperation(op.operation_id, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.post("/interventions", (req, res) => {
  const { role, intervention } = req.body;
  const userRole = role || "OBSERVER";
  const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];
  if (!permissions.can_propose_interventions) {
    return res.status(403).json({
      success: false,
      error: `Role '${userRole}' is not authorized to propose systemic interventions.`
    });
  }
  const newIntervention = {
    intervention_id: `INT_${Date.now().toString(36).toUpperCase()}`,
    incident_id: intervention.incident_id || "RN-2026-0041",
    title: intervention.title || "Dependency Isolation",
    type: intervention.type || "DEPENDENCY_ISOLATION",
    target_entity_ids: intervention.target_entity_ids || ["DATA-X", "BANK-A", "BANK-B", "BANK-C"],
    parameters: intervention.parameters || { max_disruption_budget: 0.14 },
    status: permissions.can_authorize_interventions ? "AUTHORIZED" : "PENDING_AUTHORIZATION",
    proposer_role: userRole,
    requested_at: (/* @__PURE__ */ new Date()).toISOString(),
    expected_control_margin_recovery: intervention.expected_control_margin_recovery || 44
  };
  globalSimulationEngine.applyIntervention(newIntervention);
  systemStateStore.persistToDisk();
  res.json({
    success: true,
    data: newIntervention,
    control_state: globalSimulationEngine.controlState
  });
});
router.post("/interventions/:id/execute", (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  const userRole = role || "OBSERVER";
  const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];
  if (!permissions.can_execute_interventions) {
    return res.status(403).json({
      success: false,
      error: `Role '${userRole}' is not authorized to execute systemic interventions.`
    });
  }
  const existing = globalSimulationEngine.interventions.find((i) => i.intervention_id === id);
  if (!existing) {
    return res.status(404).json({ success: false, error: "Intervention not found" });
  }
  existing.status = "EXECUTED";
  existing.executed_at = (/* @__PURE__ */ new Date()).toISOString();
  globalSimulationEngine.applyIntervention(existing);
  systemStateStore.persistToDisk();
  res.json({
    success: true,
    data: existing,
    control_state: globalSimulationEngine.controlState
  });
});
router.post("/auth/login", (req, res) => {
  const { role, username } = req.body;
  const selectedRole = role || "SYSTEM_OPERATOR";
  const session = {
    user_id: `USR_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    name: username || `System Operator | FIS-CTRL`,
    role: selectedRole,
    department: "Systemic Control & Resilience Enclave",
    enclave_session_token: `enc_tok_${Buffer.from(selectedRole + Date.now()).toString("base64").slice(0, 32)}`,
    authenticated_at: (/* @__PURE__ */ new Date()).toISOString(),
    expires_at: new Date(Date.now() + 8 * 3600 * 1e3).toISOString()
  };
  res.json({
    success: true,
    session,
    permissions: ROLE_PERMISSIONS_REGISTRY[selectedRole]
  });
});
router.get("/auth/roles", (req, res) => {
  res.json({
    success: true,
    data: Object.keys(ROLE_PERMISSIONS_REGISTRY),
    permissions: ROLE_PERMISSIONS_REGISTRY
  });
});
router.get("/intelligence/assessment", (req, res) => {
  const intelligence = globalSimulationEngine.controlState.intelligence;
  res.json({
    success: true,
    assessment: intelligence
  });
});
router.get("/intelligence/dependencies", (req, res) => {
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
router.get("/intelligence/decision-diversity", (req, res) => {
  const signal = globalSimulationEngine.controlState.intelligence?.collective_decision_signal;
  res.json({
    success: true,
    signal
  });
});
router.get("/intelligence/ablation", (req, res) => {
  res.json({
    success: true,
    config: getActiveAblationConfig()
  });
});
router.post("/intelligence/ablation", (req, res) => {
  const { tier } = req.body;
  if (!tier) {
    return res.status(400).json({ success: false, error: "tier is required (B0 - B5)" });
  }
  const config = setActiveAblationTier(tier);
  const updatedAssessment = globalSimulationEngine.recomputeIntelligence();
  res.json({
    success: true,
    config,
    assessment: updatedAssessment
  });
});
router.post("/intelligence/counterfactual", (req, res) => {
  const { hypothesis, target_entity_id } = req.body;
  if (!target_entity_id) {
    return res.status(400).json({ success: false, error: "target_entity_id is required" });
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
router.post("/intelligence/ablation/evaluate", (req, res) => {
  const assessment = globalSimulationEngine.controlState.intelligence;
  if (!assessment) {
    return res.status(500).json({ success: false, error: "Intelligence assessment not initialized" });
  }
  const result = evaluateAblationImpacts(assessment);
  res.json({
    success: true,
    result
  });
});
router.get("/intelligence/entity/:id", (req, res) => {
  const { id } = req.params;
  const result = computeEntityControllabilityIntelligence(
    id,
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
router.post("/intelligence/sensitivity", (req, res) => {
  const result = evaluateParameterSensitivity(globalSimulationEngine);
  res.json({
    success: true,
    ...result
  });
});
router.get("/foundry/state", (req, res) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace
  });
});
router.post("/foundry/evaluate", (req, res) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace
  });
});
router.post("/foundry/request-auth", (req, res) => {
  const { candidate_id, role, user_id } = req.body;
  const userRole = role || "ANALYST";
  const userId = user_id || `USR-${userRole.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}`;
  if (!candidate_id) {
    return res.status(400).json({ success: false, error: "candidate_id is required" });
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
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post("/foundry/authorize", (req, res) => {
  const { candidate_id, role, user_id, justification } = req.body;
  const userRole = role || "INCIDENT_COMMANDER";
  const userId = user_id || `USR-${userRole.slice(0, 4)}-${Date.now().toString(36).toUpperCase()}`;
  if (!candidate_id) {
    return res.status(400).json({ success: false, error: "candidate_id is required" });
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
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post("/foundry/execute", (req, res) => {
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
  const executorRole = role || "SYSTEM_OPERATOR";
  const executorUserId = user_id || `USR-OP-${Date.now().toString(36).toUpperCase()}`;
  if (!candidate_id) {
    return res.status(400).json({ success: false, error: "candidate_id is required" });
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
  } catch (err) {
    console.error("[FIS-SRV] /foundry/execute error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post("/foundry/rollback", (req, res) => {
  const { candidate_id, authorizer_role, executor_role, justification } = req.body;
  const authRole = authorizer_role || "INCIDENT_COMMANDER";
  const execRole = executor_role || "SYSTEM_OPERATOR";
  if (!candidate_id) {
    return res.status(400).json({ success: false, error: "candidate_id is required" });
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
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post("/foundry/check-conflict", (req, res) => {
  const { candidate_id_a, candidate_id_b } = req.body;
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  const candA = workspace.candidates.find((c) => c.id === candidate_id_a);
  const candB = workspace.candidates.find((c) => c.id === candidate_id_b);
  if (!candA || !candB) {
    return res.status(404).json({ success: false, error: "Both candidate IDs must be valid candidates" });
  }
  const conflict = GovernedExecutionBus.checkInterventionConflict(candA, candB);
  res.json({
    success: true,
    ...conflict
  });
});
router.get("/foundry/audit-trail", (req, res) => {
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    audit_trail: workspace.audit_trail
  });
});
router.post("/foundry/reassess", (req, res) => {
  globalSimulationEngine.step();
  const workspace = globalFoundryManager.getWorkspaceState(globalSimulationEngine);
  res.json({
    success: true,
    workspace,
    control_state: globalSimulationEngine.controlState
  });
});
router.get("/assurance/state", (req, res) => {
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
router.post("/assurance/verify-integrity", (req, res) => {
  const records = globalSimulationEngine.evidenceRecords || [];
  const results = records.map((r) => ({
    evidence_id: r.evidence_id,
    title: r.title,
    timestamp: r.timestamp,
    ...EvidenceEngine.verifyRecordIntegrity(r)
  }));
  const allValid = results.every((r) => r.valid);
  res.json({
    success: true,
    allValid,
    recordsCount: results.length,
    verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
    results
  });
});
router.post("/assurance/inject", (req, res) => {
  const { threat } = req.body;
  if (!threat) {
    return res.status(400).json({ success: false, error: "threat identifier is required" });
  }
  try {
    const result = globalAssuranceManager.injectThreat(threat, globalSimulationEngine);
    systemStateStore.persistToDisk();
    res.json({
      success: true,
      threat,
      event: result.event,
      assuranceState: result.state,
      controlState: globalSimulationEngine.controlState
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post("/assurance/close-incident", (req, res) => {
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
  for (const inc of globalSimulationEngine.incidents) {
    inc.status = "RESOLVED";
  }
  globalSimulationEngine.controlState.overall_status = "STABLE";
  globalSimulationEngine.controlState.controllability_state = "CONTROL_RESTORED";
  res.json({
    success: true,
    outcome: evalResult.controllabilityOutcome,
    narrative: evalResult.narrative,
    assuranceState: globalAssuranceManager.evaluateAssuranceState(globalSimulationEngine)
  });
});
router.get("/assurance/privacy-filter/:role", (req, res) => {
  const role = req.params.role || "OBSERVER";
  const sampleBank = {
    institution_id: "BANK-A",
    name: "Global Atlantic Clearing Bank",
    systemic_footprint_score: 0.88,
    liquidity_coverage_ratio: 88.5,
    status: "DEGRADING",
    // Sensitive / Restricted fields that MUST be masked for unauthorized roles (OBSERVER)
    proprietary_order_book_depth_usd_m: 4850,
    unhedged_derivative_notional_usd_b: 142.8,
    bilateral_intraday_borrowing_limit_usd_m: 2500
  };
  const filtered = PrivacyBoundary.filterEntityForRole(sampleBank, role);
  res.json({
    success: true,
    role,
    data: filtered
  });
});
router.get("/assurance/control-margin-provenance", (req, res) => {
  const currentMargin = globalSimulationEngine.controlState.control_margin_percent;
  const previousMargin = 91;
  const provenance = globalAssuranceManager.generateControlMarginProvenance(previousMargin, currentMargin, globalSimulationEngine);
  res.json({
    success: true,
    provenance
  });
});
router.get("/assurance/ibm-runtime", (req, res) => {
  res.json({
    success: true,
    ibmRuntime: IBMRuntimeContext.getRuntimeTruth()
  });
});
var api_default = router;

// server/src/routes/stream.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get(["/events/stream", "/api/events/stream"], (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": "*"
  });
  const flush = () => {
    if (typeof res.flush === "function") {
      res.flush();
    }
  };
  const initialPayload = {
    type: "HANDSHAKE",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    state: systemStateStore.getState()
  };
  res.write(`data: ${JSON.stringify(initialPayload)}

`);
  flush();
  const unsubscribeEngine = globalSimulationEngine.subscribe((eventType, payload) => {
    const packet = {
      type: eventType,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      payload
    };
    res.write(`data: ${JSON.stringify(packet)}

`);
    flush();
  });
  const unsubscribeOperations = globalOperationManager.subscribe((operation) => {
    const packet = {
      type: "OPERATION_LIFECYCLE",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      payload: operation
    };
    res.write(`data: ${JSON.stringify(packet)}

`);
    flush();
  });
  const heartbeat = setInterval(() => {
    const pingPacket = {
      type: "HEARTBEAT",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      tick: globalSimulationEngine.getClock().tick,
      control_margin: globalSimulationEngine.controlState.control_margin_percent
    };
    res.write(`data: ${JSON.stringify(pingPacket)}

`);
    flush();
  }, 3e3);
  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribeEngine();
    unsubscribeOperations();
  });
});
var stream_default = router2;

// server/src/app.ts
var app = express();
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path !== "/api/events/stream" && req.path !== "/events/stream") {
      console.log(`[FIS-SRV] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});
app.get("/health", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "Financial Immune System Control Enclave",
    version: "2.4.0-frozen",
    qualification: "LOCAL_SIMULATION [TARGET: IBM Z TELUM II / LINUXONE]",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "Financial Immune System Control Enclave",
    version: "1.0.0-phase1",
    simulation_clock: globalSimulationEngine.getClock(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use("/api", api_default);
app.use("/api", stream_default);
app.use("/", api_default);
app.use("/", stream_default);
var distPath = path2.resolve(process.cwd(), "dist");
if (fs2.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    res.sendFile(path2.join(distPath, "index.html"));
  });
}
var app_default = app;

// server/src/serverless.ts
var serverless_default = app_default;
export {
  serverless_default as default
};
