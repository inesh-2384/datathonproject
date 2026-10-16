/**
 * FINANCIAL IMMUNE SYSTEM - CONTROL FOUNDRY CANDIDATE GENERATOR (PHASE 4)
 * Section 5 & 6: Intervention Library & Candidate Synthesis
 * 
 * Rules:
 * 1. Generates 4-6 deeply connected intervention types tailored to current threat state.
 * 2. ALWAYS includes NO_ACTION as the mandatory counterfactual baseline.
 * 3. Integrates with authoritative topology entities (nodes, dependencies, models, oracles).
 * 4. Respects role authority requirements and separation of duties.
 */

import { 
  InterventionCandidate, 
  FoundryInterventionType, 
  DisruptionLevel, 
  ReversibilityLevel 
} from '../../../shared/types/foundry';
import { 
  Institution, 
  Dependency, 
  DataProvider, 
  InfrastructureNode, 
  AIModel, 
  Incident 
} from '../../../shared/types/domain';

export function generateInterventionCandidates(
  incident: Incident | null,
  institutions: Institution[],
  dependencies: Dependency[],
  dataProviders: DataProvider[],
  infrastructureNodes: InfrastructureNode[],
  aiModels: AIModel[],
  controlMargin: number,
  activeScenarioId?: string
): InterventionCandidate[] {
  const incidentId = incident?.incident_id || 'RN-2026-0041';
  const candidates: InterventionCandidate[] = [];

  // 1. MANDATORY COUNTERFACTUAL BASELINE: NO ACTION
  candidates.push({
    id: `CAND-${incidentId}-NO-ACTION`,
    incident_id: incidentId,
    type: 'NO_ACTION',
    title: 'No Action (Counterfactual Baseline)',
    description: 'Maintain status quo without active enclave intervention. System absorbs full uncontained contagion propagation.',
    target_entities: [],
    target_dependencies: [],
    trigger_condition: 'Operator elects passive observation.',
    expected_effect: 'Unimpeded cascade propagation across connected dependency rails.',
    expected_control_margin_delta: -Math.min(25, Math.max(12, Math.round(controlMargin * 0.40))),
    estimated_disruption: 'NONE',
    estimated_disruption_cost_score: 0,
    estimated_cost_usd_m: 0,
    estimated_latency_sec: 0,
    reversibility: 'HIGH',
    collateral_exposure_pct: 85,
    authority_required: 'OBSERVER',
    evidence_required: [],
    confidence: 'HIGH',
    uncertainty: 0.05,
    risk_if_executed: 'No immediate operational disruption, but systemic exposure compounds.',
    risk_if_not_executed: 'Systemic contagion cascades into unrecoverable liquidity horizon.',
    execution_capability: 'AVAILABLE',
    is_minimum_effective: false,
    status: 'CANDIDATE',
    scientific_truth_label: 'SIMULATED'
  });

  // Determine active threat vector
  const compromisedProvider = dataProviders.find(p => ['COMPROMISED', 'CRITICAL', 'DEGRADING'].includes(p.status));
  const compromisedInfra = infrastructureNodes.find(n => ['CRITICAL', 'COLLAPSING'].includes(n.status) || (n.current_load_percent || 0) > 90);
  const isHerdingCrisis = activeScenarioId === 'SCENARIO_D' || aiModels.some(m => (m.effective_diversity_score !== undefined && m.effective_diversity_score <= 0.20));
  const hasResidualRisk = institutions.some(i => i.status === 'RESIDUAL_RISK') || activeScenarioId === 'SCENARIO_C';

  if (isHerdingCrisis) {
    // -------------------------------------------------------------
    // SCENARIO D: COLLECTIVE DECISION CONVERGENCE (HERDING FRAGILITY)
    // -------------------------------------------------------------
    candidates.push({
      id: `CAND-${incidentId}-MODEL-DIV`,
      incident_id: incidentId,
      type: 'MODEL_DIVERSIFICATION',
      title: 'Algorithmic Model Diversification & Rule Fallback',
      description: 'Force institutional risk algorithms (MODEL-A, MODEL-C) into decoupled fallback execution modes utilizing uncorrelated synthetic rates.',
      target_entities: ['MODEL-A', 'MODEL-C'],
      target_dependencies: ['DEP_MODEL_C_ASSET_17'],
      trigger_condition: 'Effective Decision Diversity dropped below 0.20 with >85% synchrony.',
      expected_effect: 'Breaks collective decision synchrony; restores effective diversity above 0.70.',
      expected_control_margin_delta: +36,
      estimated_disruption: 'LOW',
      estimated_disruption_cost_score: 18,
      estimated_cost_usd_m: 3.5,
      estimated_latency_sec: 8,
      reversibility: 'HIGH',
      collateral_exposure_pct: 12,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-007', 'EVD-2026-008'],
      confidence: 'HIGH',
      uncertainty: 0.12,
      risk_if_executed: 'Temporary degradation in algorithmic execution latency (5-15ms).',
      risk_if_not_executed: 'Runaway herd liquidation triggers synthetic margin default cascade.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: true,
      status: 'RECOMMENDED',
      scientific_truth_label: 'EXPERIMENTAL'
    });

    candidates.push({
      id: `CAND-${incidentId}-TEMPORAL-STAGGER`,
      incident_id: incidentId,
      type: 'TEMPORAL_STAGGERING',
      title: 'Order Submission Temporal Jitter Injection',
      description: 'Inject randomized 150-600ms network buffers across institutional execution gateways to disrupt temporal liquidity withdrawal synchronization.',
      target_entities: ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'],
      target_dependencies: [],
      trigger_condition: 'Simultaneous liquidity pull clustering detected.',
      expected_effect: 'Partial desynchronization of trade orders; reduces peak liquidity drain.',
      expected_control_margin_delta: +22,
      estimated_disruption: 'MEDIUM',
      estimated_disruption_cost_score: 34,
      estimated_cost_usd_m: 8.2,
      estimated_latency_sec: 14,
      reversibility: 'HIGH',
      collateral_exposure_pct: 28,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-007'],
      confidence: 'MEDIUM',
      uncertainty: 0.22,
      risk_if_executed: 'Slight delay in settlement execution windows.',
      risk_if_not_executed: 'Synchronous liquidity drain exceeds clearing capacity.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'EXPERIMENTAL'
    });

    candidates.push({
      id: `CAND-${incidentId}-BROAD-THROTTLE`,
      incident_id: incidentId,
      type: 'EXPOSURE_REDUCTION',
      title: 'System-Wide Algorithmic Execution Throttle (60%)',
      description: 'Impose regulatory throughput cap on all autonomous trading models across G-SIB banking nodes.',
      target_entities: ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_BANK_A_BANK_B', 'DEP_BANK_B_BANK_C'],
      trigger_condition: 'Systemic liquidity contagion threat.',
      expected_effect: 'Forces immediate volume dampening at the expense of market efficiency.',
      expected_control_margin_delta: +32,
      estimated_disruption: 'HIGH',
      estimated_disruption_cost_score: 68,
      estimated_cost_usd_m: 42.0,
      estimated_latency_sec: 20,
      reversibility: 'MEDIUM',
      collateral_exposure_pct: 45,
      authority_required: 'RISK_OFFICER',
      evidence_required: ['EVD-2026-007'],
      confidence: 'MEDIUM',
      uncertainty: 0.25,
      risk_if_executed: 'Significant reduction in intraday market liquidity and trading volume.',
      risk_if_not_executed: 'Uncapped algorithmic order flow exacerbates herd sell-off.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

  } else if (compromisedInfra) {
    // -------------------------------------------------------------
    // SCENARIO B: SHARED INFRASTRUCTURE FAILURE (RTGS / CCP)
    // -------------------------------------------------------------
    candidates.push({
      id: `CAND-${incidentId}-RTGS-BYPASS`,
      incident_id: incidentId,
      type: 'DEPENDENCY_ISOLATION',
      title: 'RTGS Queue Shedding & Priority Netting (INFRA-1)',
      description: 'Shed non-critical retail payment traffic and establish dedicated bilateral netting channels for CCP margin calls.',
      target_entities: [compromisedInfra.node_id],
      target_dependencies: ['DEP_INFRA_1_BANK_A', 'DEP_INFRA_1_BANK_B'],
      trigger_condition: 'RTGS buffer load exceeded 95% with clearing timeouts.',
      expected_effect: 'Restores core interbank clearing rail liquidity and clears payment backlog.',
      expected_control_margin_delta: +48,
      estimated_disruption: 'MEDIUM',
      estimated_disruption_cost_score: 38,
      estimated_cost_usd_m: 14.5,
      estimated_latency_sec: 15,
      reversibility: 'HIGH',
      collateral_exposure_pct: 22,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-004', 'EVD-2026-005'],
      confidence: 'HIGH',
      uncertainty: 0.15,
      risk_if_executed: 'Retail transaction queuing delay for 30-45 minutes.',
      risk_if_not_executed: 'Wholesale clearing default triggers settlement gridlock.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: true,
      status: 'RECOMMENDED',
      scientific_truth_label: 'SIMULATED'
    });

    candidates.push({
      id: `CAND-${incidentId}-COLLATERAL-BACKSTOP`,
      incident_id: incidentId,
      type: 'HUMAN_ESCALATION',
      title: 'Central Bank Emergency Intraday Liquidity Backstop',
      description: 'Activate standing central bank intraday discount window to absorb clearing shortfall across Pacific and Atlantic clearing banks.',
      target_entities: ['GCCB-US', 'BANK-A', 'BANK-B'],
      target_dependencies: [],
      trigger_condition: 'Impending cross-border settlement desynchronization.',
      expected_effect: 'Provides sovereign backstop collateral to prevent default cascade.',
      expected_control_margin_delta: +44,
      estimated_disruption: 'HIGH',
      estimated_disruption_cost_score: 72,
      estimated_cost_usd_m: 85.0,
      estimated_latency_sec: 45,
      reversibility: 'MEDIUM',
      collateral_exposure_pct: 60,
      authority_required: 'RISK_OFFICER',
      evidence_required: ['EVD-2026-005'],
      confidence: 'HIGH',
      uncertainty: 0.20,
      risk_if_executed: 'Fiscal balance sheet exposure and sovereign credit underwriting.',
      risk_if_not_executed: 'Direct default of Tier-1 clearing participant.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

  } else if (hasResidualRisk) {
    // -------------------------------------------------------------
    // SCENARIO C: INCOMPLETE INTERVENTION & LATENT CONTAGION
    // -------------------------------------------------------------
    // Candidate 1: Flawed Partial Isolation (triggers failed outcome demonstration!)
    candidates.push({
      id: `CAND-${incidentId}-PARTIAL-ISO`,
      incident_id: incidentId,
      type: 'DATA_QUARANTINE',
      title: 'Surface Oracle Feed Quarantine Only (DATA-X)',
      description: 'Quarantine DATA-X rate updates while omitting pre-tainted algorithmic decision tensors in MODEL-C.',
      target_entities: ['DATA-X'],
      target_dependencies: ['DEP_DATA_X_BANK_A', 'DEP_DATA_X_BANK_B'],
      trigger_condition: 'Initial DATA-X anomaly flag.',
      expected_effect: 'Surface recovery telemetry appears positive, but latent contagion remains active.',
      expected_control_margin_delta: +12,
      estimated_disruption: 'LOW',
      estimated_disruption_cost_score: 15,
      estimated_cost_usd_m: 2.1,
      estimated_latency_sec: 10,
      reversibility: 'HIGH',
      collateral_exposure_pct: 45,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-001'],
      confidence: 'LOW',
      uncertainty: 0.40,
      risk_if_executed: 'Fails to neutralize tainted MODEL-C tensors, allowing covert fire-sales.',
      risk_if_not_executed: 'Immediate feed corruption continues feeding G-SIB models.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

    // Candidate 2: Complete Multi-Vector Remediation (Escalated MEI)
    candidates.push({
      id: `CAND-${incidentId}-MODEL-QUARANTINE-BACKSTOP`,
      incident_id: incidentId,
      type: 'DEPENDENCY_ISOLATION',
      title: 'Enclave MODEL-C Quarantine & Synthetic Asset Backstop',
      description: 'Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.',
      target_entities: ['MODEL-C', 'ASSET-17', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_MODEL_C_ASSET_17'],
      trigger_condition: 'Latent algorithmic divergence detected during verification.',
      expected_effect: 'Halts secondary fire-sale cascade and resolves residual risk completely.',
      expected_control_margin_delta: +48,
      estimated_disruption: 'MEDIUM',
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16.0,
      estimated_latency_sec: 18,
      reversibility: 'HIGH',
      collateral_exposure_pct: 18,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-006'],
      confidence: 'HIGH',
      uncertainty: 0.14,
      risk_if_executed: 'Temporary suspension of automated trading on ASSET-17 pair.',
      risk_if_not_executed: 'Latent contagion completes cross-market asset contamination.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: true,
      status: 'RECOMMENDED',
      scientific_truth_label: 'SIMULATED'
    });

  } else {
    // -------------------------------------------------------------
    // SCENARIO A: COMMON DATA DEPENDENCY COMPROMISE (DATA-X)
    // -------------------------------------------------------------
    const targetProvId = compromisedProvider?.provider_id || 'DATA-X';

    // 1. Minimum Effective Intervention: Target Dependency Isolation
    candidates.push({
      id: `CAND-${incidentId}-DEP-ISOLATION`,
      incident_id: incidentId,
      type: 'DEPENDENCY_ISOLATION',
      title: `Targeted Dependency Isolation (${targetProvId} -> Tier-1 G-SIBs)`,
      description: `Quarantine incoming ${targetProvId} telemetry feeds and failover affected banking rails (BANK-A, BANK-B, BANK-C, BANK-D) to secondary verified B-PIPE feeds.`,
      target_entities: [targetProvId, 'BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_DATA_X_BANK_A', 'DEP_DATA_X_BANK_B', 'DEP_DATA_X_BANK_C', 'DEP_DATA_X_BANK_D'],
      trigger_condition: `${targetProvId} payload corruption detected. Control Margin breached critical threshold.`,
      expected_effect: `Halts downstream contagion across 4 banking rails; stabilizes Tier-1 liquidity coverage ratios.`,
      expected_control_margin_delta: +42,
      estimated_disruption: 'LOW',
      estimated_disruption_cost_score: 22,
      estimated_cost_usd_m: 4.8,
      estimated_latency_sec: 12,
      reversibility: 'HIGH',
      collateral_exposure_pct: 15,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-001', 'EVD-2026-002'],
      confidence: 'HIGH',
      uncertainty: 0.10,
      risk_if_executed: 'Brief 2-second rate publication gap during secondary feed handoff.',
      risk_if_not_executed: 'Corrupted rates poison valuation models across all 4 Tier-1 institutions.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: true,
      status: 'RECOMMENDED',
      scientific_truth_label: 'SIMULATED'
    });

    // 2. Broad Exposure Reduction
    candidates.push({
      id: `CAND-${incidentId}-EXPOSURE-REDUCTION`,
      incident_id: incidentId,
      type: 'EXPOSURE_REDUCTION',
      title: 'Interbank Bilateral Limit Haircut (50%)',
      description: 'Halve interbank bilateral settlement and credit limits across all connected G-SIB pairs to ringfence potential insolvency.',
      target_entities: ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_BANK_A_BANK_B', 'DEP_BANK_B_BANK_C'],
      trigger_condition: 'Cross-bank contagion propagation threat.',
      expected_effect: 'Reduces credit contagion velocity, but causes moderate intraday liquidity contraction.',
      expected_control_margin_delta: +25,
      estimated_disruption: 'HIGH',
      estimated_disruption_cost_score: 62,
      estimated_cost_usd_m: 32.0,
      estimated_latency_sec: 24,
      reversibility: 'MEDIUM',
      collateral_exposure_pct: 42,
      authority_required: 'RISK_OFFICER',
      evidence_required: ['EVD-2026-001'],
      confidence: 'MEDIUM',
      uncertainty: 0.24,
      risk_if_executed: 'Credit contraction across interbank lending markets.',
      risk_if_not_executed: 'Unmitigated counterparty credit contagion if any G-SIB defaults.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

    // 3. Selective Suspension (Irreversible action example)
    candidates.push({
      id: `CAND-${incidentId}-SELECTIVE-SUSPENSION`,
      incident_id: incidentId,
      type: 'SELECTIVE_SUSPENSION',
      title: 'Selective Channel Suspension & Settlement Freeze',
      description: 'Permanently revoke algorithmic trading access and freeze intraday settlement lines for non-compliant participants.',
      target_entities: [targetProvId, 'BANK-C'],
      target_dependencies: ['DEP_DATA_X_BANK_C'],
      trigger_condition: 'Severe data corruption and regulatory non-compliance.',
      expected_effect: 'Completely blocks rogue feed flow with severe operational finality.',
      expected_control_margin_delta: +30,
      estimated_disruption: 'HIGH',
      estimated_disruption_cost_score: 75,
      estimated_cost_usd_m: 55.0,
      estimated_latency_sec: 30,
      reversibility: 'IRREVERSIBLE',
      collateral_exposure_pct: 55,
      authority_required: 'COMPLIANCE_OFFICER',
      evidence_required: ['EVD-2026-001', 'EVD-2026-002'],
      confidence: 'HIGH',
      uncertainty: 0.18,
      risk_if_executed: 'Irreversible contract termination; legal claims and reputational fallout.',
      risk_if_not_executed: 'Continued exposure to non-compliant settlement defaults.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

    // 4. Emergency Escalation Backstop: Model Quarantine & Backstop
    candidates.push({
      id: `CAND-${incidentId}-MODEL-QUARANTINE-BACKSTOP`,
      incident_id: incidentId,
      type: 'DEPENDENCY_ISOLATION',
      title: 'Enclave MODEL-C Quarantine & Synthetic Asset Backstop',
      description: 'Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.',
      target_entities: ['MODEL-C', 'ASSET-17', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_MODEL_C_ASSET_17'],
      trigger_condition: 'Latent algorithmic divergence detected during verification or secondary escalation.',
      expected_effect: 'Halts secondary fire-sale cascade and resolves residual risk completely.',
      expected_control_margin_delta: +48,
      estimated_disruption: 'MEDIUM',
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16.0,
      estimated_latency_sec: 18,
      reversibility: 'HIGH',
      collateral_exposure_pct: 18,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-006'],
      confidence: 'HIGH',
      uncertainty: 0.14,
      risk_if_executed: 'Temporary suspension of automated trading on ASSET-17 pair.',
      risk_if_not_executed: 'Latent contagion completes cross-market asset contamination.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });

    // 5. Reassessment View Alias: CAND-SEC-01-MODEL-C-QUARANTINE
    candidates.push({
      id: 'CAND-SEC-01-MODEL-C-QUARANTINE',
      incident_id: incidentId,
      type: 'DEPENDENCY_ISOLATION',
      title: 'Enclave MODEL-C Quarantine & Parameter Clamp',
      description: 'Quarantine MODEL-C execution enclave, isolate ASSET-17 liquidation pipeline, and inject synthetic collateral floor across BANK-C and BANK-D.',
      target_entities: ['MODEL-C', 'ASSET-17', 'BANK-C', 'BANK-D'],
      target_dependencies: ['DEP_MODEL_C_ASSET_17'],
      trigger_condition: 'Latent algorithmic divergence detected during verification or secondary escalation.',
      expected_effect: 'Halts secondary fire-sale cascade and resolves residual risk completely.',
      expected_control_margin_delta: +48,
      estimated_disruption: 'MEDIUM',
      estimated_disruption_cost_score: 36,
      estimated_cost_usd_m: 16.0,
      estimated_latency_sec: 18,
      reversibility: 'HIGH',
      collateral_exposure_pct: 18,
      authority_required: 'INCIDENT_COMMANDER',
      evidence_required: ['EVD-2026-006'],
      confidence: 'HIGH',
      uncertainty: 0.14,
      risk_if_executed: 'Temporary suspension of automated trading on ASSET-17 pair.',
      risk_if_not_executed: 'Latent contagion completes cross-market asset contamination.',
      execution_capability: 'AVAILABLE',
      is_minimum_effective: false,
      status: 'CANDIDATE',
      scientific_truth_label: 'SIMULATED'
    });
  }

  return candidates;
}
