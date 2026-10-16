/**
 * FINANCIAL IMMUNE SYSTEM - AUTHORITATIVE SCENARIO DEFINITIONS
 * Phase 2 Multi-Scenario Deterministic Execution Engine
 * 
 * Defines 3 rigorous scenarios:
 * 1. Scenario A: Common Data Dependency Failure (DATA-X -> BANK-A..D)
 * 2. Scenario B: Shared Infrastructure Failure (INFRA-1 / INFRA-2 RTGS/CCP Outage)
 * 3. Scenario C: Incomplete Intervention & Residual Impact (Apparent recovery -> latent contagion -> unverified -> reassess)
 */

import { ScenarioDescriptor, ScenarioId, AuthoritativeEvent } from '../../../shared/types/events';
import { Incident, SystemControlState } from '../../../shared/types/domain';
import { computeSystemicGraphMetrics } from './propagation';

export const SCENARIO_DESCRIPTORS: Record<ScenarioId, ScenarioDescriptor> = {
  SCENARIO_A: {
    scenario_id: 'SCENARIO_A',
    name: 'Common Data Dependency Failure',
    short_code: 'SCENARIO_A',
    category: 'INFORMATION_CHOKEPOINT',
    root_cause: 'DATA-X Rates Oracle Payload Corruption',
    description: 'Controlled simulation of information provider compromise (DATA-X) propagating across Tier-1 G-SIB banking rails (BANK-A, BANK-B, BANK-C, BANK-D).',
    primary_target: 'DATA-X',
    expected_min_control_margin: 34,
    stages_count: 4
  },
  SCENARIO_B: {
    scenario_id: 'SCENARIO_B',
    name: 'Shared Infrastructure Failure',
    short_code: 'SCENARIO_B',
    category: 'CORE_CLEARING_GRIDLOCK',
    root_cause: 'Global RTGS / Central Counterparty Rail Saturation',
    description: 'Catastrophic settlement timeout and clearing queue congestion across INFRA-1 (RTGS Rail) and INFRA-2 (CCP Hub), threatening multi-jurisdictional liquidity gridlock.',
    primary_target: 'INFRA-1',
    expected_min_control_margin: 28,
    stages_count: 4
  },
  SCENARIO_C: {
    scenario_id: 'SCENARIO_C',
    name: 'Incomplete Intervention & Residual Impact',
    short_code: 'SCENARIO_C',
    category: 'RESIDUAL_CONTAGION',
    root_cause: 'Pre-Isolate Latent Algorithmic Infection (MODEL-C)',
    description: 'Primary dependency isolation appears to restore control margin, but unaddressed latent path through algorithmic model (MODEL-C) triggers secondary fire-sale contagion on synthetic credit (ASSET-17).',
    primary_target: 'MODEL-C',
    expected_min_control_margin: 42,
    stages_count: 5
  },
  SCENARIO_D: {
    scenario_id: 'SCENARIO_D',
    name: 'Collective Decision Convergence',
    short_code: 'SCENARIO_D',
    category: 'ALGORITHMIC_HERDING',
    root_cause: 'Benchmark Shock & Synchronized Model Drift',
    description: 'Multiple institutions appear diverse, but common input feeds and correlated risk-weights cause model recommendations to synchronize (>92%), collapsing effective decision diversity and triggering collective liquidity withdrawal.',
    primary_target: 'MODEL-A',
    expected_min_control_margin: 48,
    stages_count: 5
  }
};

/**
 * Executes a deterministic scenario transition step on the engine.
 */
export function executeScenarioStage(
  scenarioId: ScenarioId,
  stageIndex: number,
  engine: any
): AuthoritativeEvent[] {
  const events: AuthoritativeEvent[] = [];
  const tick = engine.clock.tick;
  const timestamp = engine.clock.virtual_timestamp;

  switch (scenarioId) {
    case 'SCENARIO_A': {
      // SCENARIO A: Common Data Dependency Failure
      if (stageIndex === 0) {
        // T0: Initial Compromise of DATA-X
        const dataX = engine.dataProviders.find((p: any) => p.provider_id === 'DATA-X');
        if (dataX) {
          const prevStatus = dataX.status;
          dataX.status = 'COMPROMISED';
          dataX.updated_at = timestamp;

          const incident: Incident = {
            incident_id: 'RN-2026-0041',
            title: 'Common Information Provider Compromised (DATA-X)',
            status: 'ACTIVE',
            severity: 'SYSTEMIC_THREAT',
            declared_at: timestamp,
            root_cause_vector: 'Rates Oracle Cryptographic Invalidation',
            affected_node_ids: ['DATA-X'],
            affected_dependency_ids: ['DEP_DATA_X_BANK_A', 'DEP_DATA_X_BANK_B', 'DEP_DATA_X_BANK_C', 'DEP_DATA_X_BANK_D'],
            containment_margin_percent: 34,
            estimated_intervention_window_sec: 41,
            evidence_record_ids: ['EVD-2026-001', 'EVD-2026-002', 'EVD-2026-003']
          };
          engine.incidents = [incident];

          events.push({
            event_id: 'RN-2026-0041',
            tick,
            simulation_timestamp: timestamp,
            event_type: 'PROVIDER_COMPROMISED',
            severity: 'CRITICAL',
            source_entity_id: 'DATA-X',
            causal_chain_id: 'CHAIN-SCENARIO-A',
            parent_event_id: null,
            state_deltas: [{
              entity_type: 'DATA_PROVIDER',
              entity_id: 'DATA-X',
              field: 'status',
              previous_value: prevStatus,
              new_value: 'COMPROMISED'
            }],
            causal_narrative: 'Common Information Provider DATA-X suffered cryptographic hash mismatch on live benchmark telemetry. Feed integrity collapsed.',
            systemic_impact: { control_margin_delta: -24, stability_delta: -0.22 }
          });
        }
      } else if (stageIndex === 1) {
        // T1: 1-Hop Outgoing Feeds Degrade
        const deps = engine.dependencies.filter((d: any) => d.source_id === 'DATA-X');
        const deltas: any[] = [];
        for (const dep of deps) {
          deltas.push({
            entity_type: 'DEPENDENCY',
            entity_id: dep.dependency_id,
            field: 'status',
            previous_value: dep.status,
            new_value: 'DEGRADING'
          });
          dep.status = 'DEGRADING';
        }

        events.push({
          event_id: 'EVT-A1-FEED-TAINT',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'DEPENDENCY_PROPAGATION',
          severity: 'HIGH',
          source_entity_id: 'DATA-X',
          target_entity_id: 'DEP_DATA_X_BANK_A',
          parent_event_id: 'RN-2026-0041',
          causal_chain_id: 'CHAIN-SCENARIO-A',
          state_deltas: deltas,
          causal_narrative: 'Tainted rates and sovereign debt pricing vectors propagated along all 4 high-speed feed lines.',
          systemic_impact: { control_margin_delta: -18, stability_delta: -0.15 }
        });
      } else if (stageIndex === 2) {
        // T2: G-SIB Institutions Degrade
        const bankIds = ['BANK-A', 'BANK-B', 'BANK-C'];
        const deltas: any[] = [];
        for (const id of bankIds) {
          const bank = engine.institutions.find((i: any) => i.institution_id === id);
          if (bank) {
            deltas.push({
              entity_type: 'INSTITUTION',
              entity_id: id,
              field: 'status',
              previous_value: bank.status,
              new_value: 'DEGRADING'
            });
            bank.status = 'DEGRADING';
            bank.liquidity_coverage_ratio = +(bank.liquidity_coverage_ratio * 0.65).toFixed(1);
          }
        }

        if (engine.incidents.length > 0) {
          engine.incidents[0].affected_node_ids = ['DATA-X', ...bankIds];
        }

        events.push({
          event_id: 'EVT-A2-INSTITUTIONS-DEGRADING',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INSTITUTION_DEGRADATION',
          severity: 'CRITICAL',
          source_entity_id: 'DATA-X',
          target_entity_id: 'BANK-A',
          parent_event_id: 'EVT-A1-FEED-TAINT',
          causal_chain_id: 'CHAIN-SCENARIO-A',
          state_deltas: deltas,
          causal_narrative: 'Atlantic Tier-1 Bank (BANK-A), European Settlement (BANK-B), and Rhine Liquidity (BANK-C) models reject skewed inputs; LCR buffer compromised.',
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.18 }
        });
      } else if (stageIndex === 3) {
        // T3: Secondary Interbank Contagion to BANK-D
        const bankD = engine.institutions.find((i: any) => i.institution_id === 'BANK-D');
        const interbankDep = engine.dependencies.find((d: any) => d.dependency_id === 'DEP_BANK_A_BANK_B');
        if (bankD) bankD.status = 'DEGRADING';
        if (interbankDep) interbankDep.status = 'DEGRADING';

        events.push({
          event_id: 'EVT-A3-INTERBANK-SPREAD',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INSTITUTION_DEGRADATION',
          severity: 'CRITICAL',
          source_entity_id: 'BANK-A',
          target_entity_id: 'BANK-D',
          parent_event_id: 'EVT-A2-INSTITUTIONS-DEGRADING',
          causal_chain_id: 'CHAIN-SCENARIO-A',
          state_deltas: [
            { entity_type: 'INSTITUTION', entity_id: 'BANK-D', field: 'status', previous_value: 'STABLE', new_value: 'DEGRADING' },
            { entity_type: 'DEPENDENCY', entity_id: 'DEP_BANK_A_BANK_B', field: 'status', previous_value: 'STABLE', new_value: 'DEGRADING' }
          ],
          causal_narrative: 'Interbank credit line between BANK-A and BANK-B frozen. Pacific Core Clearing (BANK-D) triggers emergency margin reserve.',
          systemic_impact: { control_margin_delta: -5, stability_delta: -0.06 }
        });
      }
      break;
    }

    case 'SCENARIO_B': {
      // SCENARIO B: Shared Infrastructure Failure (RTGS / CCP)
      if (stageIndex === 0) {
        // T0: INFRA-1 Saturation & Outage
        const infra1 = engine.infrastructureNodes.find((n: any) => n.node_id === 'INFRA-1');
        if (infra1) {
          infra1.status = 'CRITICAL';
          infra1.current_load_percent = 98.6;

          const incident: Incident = {
            incident_id: 'RN-2026-0092',
            title: 'Global Real-Time Settlement Rail Desynchronization (INFRA-1)',
            status: 'ACTIVE',
            severity: 'SYSTEMIC_THREAT',
            declared_at: timestamp,
            root_cause_vector: 'RTGS Queue Backlog & Throughput Choke',
            affected_node_ids: ['INFRA-1'],
            affected_dependency_ids: ['DEP_INFRA_1_BANK_A', 'DEP_INFRA_1_BANK_B'],
            containment_margin_percent: 28,
            estimated_intervention_window_sec: 32,
            evidence_record_ids: ['EVD-2026-004', 'EVD-2026-005']
          };
          engine.incidents = [incident];

          events.push({
            event_id: 'RN-2026-0092',
            tick,
            simulation_timestamp: timestamp,
            event_type: 'INFRASTRUCTURE_FAILURE',
            severity: 'CRITICAL',
            source_entity_id: 'INFRA-1',
            causal_chain_id: 'CHAIN-SCENARIO-B',
            parent_event_id: null,
            state_deltas: [
              { entity_type: 'INFRASTRUCTURE_NODE', entity_id: 'INFRA-1', field: 'status', previous_value: 'STABLE', new_value: 'CRITICAL' },
              { entity_type: 'INFRASTRUCTURE_NODE', entity_id: 'INFRA-1', field: 'current_load_percent', previous_value: 48.2, new_value: 98.6 }
            ],
            causal_narrative: 'Global Real-Time Settlement Rail (INFRA-1) processing throughput dropped below 1,200 TPS. Unsettled queue backlog exceeded 48,000 transactions.',
            systemic_impact: { control_margin_delta: -32, stability_delta: -0.30 }
          });
        }
      } else if (stageIndex === 1) {
        // T1: Settlement Lines Latency Surge
        const infraDeps = engine.dependencies.filter((d: any) => ['DEP_INFRA_1_BANK_A', 'DEP_INFRA_1_BANK_B'].includes(d.dependency_id));
        for (const dep of infraDeps) {
          dep.status = 'DEGRADING';
          dep.latency_ms = 940;
        }

        events.push({
          event_id: 'EVT-B1-SETTLEMENT-CHOKE',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'DEPENDENCY_PROPAGATION',
          severity: 'HIGH',
          source_entity_id: 'INFRA-1',
          target_entity_id: 'DEP_INFRA_1_BANK_A',
          parent_event_id: 'RN-2026-0092',
          causal_chain_id: 'CHAIN-SCENARIO-B',
          state_deltas: infraDeps.map((d: any) => ({
            entity_type: 'DEPENDENCY',
            entity_id: d.dependency_id,
            field: 'latency_ms',
            previous_value: 18,
            new_value: 940
          })),
          causal_narrative: 'Settlement rails to BANK-A and BANK-B degraded due to unconfirmed settlement timeout spikes.',
          systemic_impact: { control_margin_delta: -16, stability_delta: -0.15 }
        });
      } else if (stageIndex === 2) {
        // T2: Liquidity Traps Hit Clearing Institutions
        const insts = engine.institutions.filter((i: any) => ['BANK-A', 'BANK-B', 'GCCB-US', 'TISC-UK'].includes(i.institution_id));
        for (const inst of insts) {
          inst.status = 'CRITICAL';
          inst.liquidity_coverage_ratio = +(inst.liquidity_coverage_ratio * 0.58).toFixed(1);
        }

        events.push({
          event_id: 'EVT-B2-CLEARING-GRIDLOCK',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INSTITUTION_DEGRADATION',
          severity: 'CRITICAL',
          source_entity_id: 'INFRA-1',
          target_entity_id: 'GCCB-US',
          parent_event_id: 'EVT-B1-SETTLEMENT-CHOKE',
          causal_chain_id: 'CHAIN-SCENARIO-B',
          state_deltas: insts.map((i: any) => ({
            entity_type: 'INSTITUTION',
            entity_id: i.institution_id,
            field: 'status',
            previous_value: 'STABLE',
            new_value: 'CRITICAL'
          })),
          causal_narrative: 'Cross-border clearing banks facing intraday liquidity trap; unable to post margin collateral.',
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.19 }
        });
      } else if (stageIndex === 3) {
        // T3: CCP Emergency Margin Desync
        const infra2 = engine.infrastructureNodes.find((n: any) => n.node_id === 'INFRA-2');
        if (infra2) {
          infra2.status = 'DEGRADING';
          infra2.current_load_percent = 92.4;
        }

        events.push({
          event_id: 'EVT-B3-CCP-MARGIN-DESYNC',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INFRASTRUCTURE_FAILURE',
          severity: 'CRITICAL',
          source_entity_id: 'INFRA-2',
          parent_event_id: 'EVT-B2-CLEARING-GRIDLOCK',
          causal_chain_id: 'CHAIN-SCENARIO-B',
          state_deltas: [
            { entity_type: 'INFRASTRUCTURE_NODE', entity_id: 'INFRA-2', field: 'status', previous_value: 'STABLE', new_value: 'DEGRADING' }
          ],
          causal_narrative: 'Cross-Border Clearing Hub (INFRA-2) activated emergency collateral haircuts. System enters critical containment threshold.',
          systemic_impact: { control_margin_delta: -4, stability_delta: -0.05 }
        });
      }
      break;
    }

    case 'SCENARIO_C': {
      // SCENARIO C: Incomplete Intervention & Residual Impact
      if (stageIndex === 0) {
        // T0: Primary Isolation Executed -> Apparent Recovery
        const dataX = engine.dataProviders.find((p: any) => p.provider_id === 'DATA-X');
        if (dataX) dataX.status = 'RECOVERING';
        for (const dep of engine.dependencies.filter((d: any) => d.source_id === 'DATA-X')) {
          dep.status = 'RECOVERING';
        }

        const incident: Incident = {
          incident_id: 'RN-2026-0108',
          title: 'Residual Contagion Under Pre-Tainted Algorithmic Balancing',
          status: 'CONTAINING',
          severity: 'HIGH',
          declared_at: timestamp,
          root_cause_vector: 'Unobserved Latent Algorithmic Propagation via MODEL-C',
          affected_node_ids: ['DATA-X', 'MODEL-C', 'ASSET-17'],
          affected_dependency_ids: ['DEP_MODEL_C_ASSET_17'],
          containment_margin_percent: 76,
          estimated_intervention_window_sec: 120,
          evidence_record_ids: ['EVD-2026-006']
        };
        engine.incidents = [incident];

        events.push({
          event_id: 'EVT-C0-SURFACE-ISOLATION',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INTERVENTION_EXECUTED',
          severity: 'INFO',
          source_entity_id: 'DATA-X',
          causal_chain_id: 'CHAIN-SCENARIO-C',
          parent_event_id: null,
          state_deltas: [
            { entity_type: 'DATA_PROVIDER', entity_id: 'DATA-X', field: 'status', previous_value: 'COMPROMISED', new_value: 'RECOVERING' }
          ],
          causal_narrative: 'Primary data dependency isolation executed. Surface telemetry reports upward recovery trajectory.',
          systemic_impact: { control_margin_delta: +42, stability_delta: +0.35 }
        });
      } else if (stageIndex === 1) {
        // T1: Latent Drift in Pre-Tainted MODEL-C
        const modelC = engine.aiModels.find((m: any) => m.model_id === 'MODEL-C');
        if (modelC) {
          modelC.status = 'CONFLICTED';
          modelC.herd_correlation_risk = 0.94;
        }

        events.push({
          event_id: 'EVT-C1-LATENT-DRIFT',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'ANOMALY_DETECTED',
          severity: 'WARNING',
          source_entity_id: 'MODEL-C',
          parent_event_id: 'EVT-C0-SURFACE-ISOLATION',
          causal_chain_id: 'CHAIN-SCENARIO-C',
          state_deltas: [
            { entity_type: 'AI_MODEL', entity_id: 'MODEL-C', field: 'status', previous_value: 'STABLE', new_value: 'CONFLICTED' }
          ],
          causal_narrative: 'Enclave telemetry detects algorithmic divergence: MODEL-C was operating on cached pre-isolation synthetic rate tensors.',
          systemic_impact: { control_margin_delta: -10, stability_delta: -0.10 }
        });
      } else if (stageIndex === 2) {
        // T2: Liquidation Contagion on ASSET-17
        const asset17 = engine.assets.find((a: any) => a.asset_id === 'ASSET-17');
        const modelC = engine.aiModels.find((m: any) => m.model_id === 'MODEL-C');
        if (asset17) asset17.status = 'DEGRADING';
        if (modelC) modelC.status = 'COMPROMISED';

        events.push({
          event_id: 'EVT-C2-SYNTHETIC-FIRE-SALE',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'DEPENDENCY_PROPAGATION',
          severity: 'HIGH',
          source_entity_id: 'MODEL-C',
          target_entity_id: 'ASSET-17',
          parent_event_id: 'EVT-C1-LATENT-DRIFT',
          causal_chain_id: 'CHAIN-SCENARIO-C',
          state_deltas: [
            { entity_type: 'ASSET', entity_id: 'ASSET-17', field: 'status', previous_value: 'STABLE', new_value: 'DEGRADING' },
            { entity_type: 'AI_MODEL', entity_id: 'MODEL-C', field: 'status', previous_value: 'CONFLICTED', new_value: 'COMPROMISED' }
          ],
          causal_narrative: 'MODEL-C initiated automated liquidation on Synthetic Credit Benchmark ASSET-17 across BANK-C and BANK-D balances.',
          systemic_impact: { control_margin_delta: -14, stability_delta: -0.16 }
        });
      } else if (stageIndex === 3) {
        // T3: Residual Risk Detected! Reversal of Status
        const bankC = engine.institutions.find((i: any) => i.institution_id === 'BANK-C');
        const bankD = engine.institutions.find((i: any) => i.institution_id === 'BANK-D');
        if (bankC) bankC.status = 'RESIDUAL_RISK';
        if (bankD) bankD.status = 'RESIDUAL_RISK';

        events.push({
          event_id: 'EVT-C3-RESIDUAL-RISK-DECLARED',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'RESIDUAL_RISK_DETECTED',
          severity: 'CRITICAL',
          source_entity_id: 'MODEL-C',
          target_entity_id: 'BANK-C',
          parent_event_id: 'EVT-C2-SYNTHETIC-FIRE-SALE',
          causal_chain_id: 'CHAIN-SCENARIO-C',
          state_deltas: [
            { entity_type: 'INSTITUTION', entity_id: 'BANK-C', field: 'status', previous_value: 'RECOVERING', new_value: 'RESIDUAL_RISK' },
            { entity_type: 'INSTITUTION', entity_id: 'BANK-D', field: 'status', previous_value: 'STABLE', new_value: 'RESIDUAL_RISK' }
          ],
          causal_narrative: 'VERIFICATION ANOMALY: Reported containment does NOT match collateral reality. Status downgraded to UNVERIFIED / RESIDUAL_RISK.',
          systemic_impact: { control_margin_delta: -10, stability_delta: -0.12 }
        });
      } else if (stageIndex === 4) {
        // T4: Systemic Reassessment Order
        events.push({
          event_id: 'EVT-C4-REASSESSMENT-MANDATE',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'SYSTEM_REASSESSMENT',
          severity: 'HIGH',
          source_entity_id: 'ENCLAVE_CTRL',
          parent_event_id: 'EVT-C3-RESIDUAL-RISK-DECLARED',
          causal_chain_id: 'CHAIN-SCENARIO-C',
          state_deltas: [],
          causal_narrative: 'Enclave Control mandates multi-point intervention: Quarantine MODEL-C and inject Synthetic Credit Liquidity Backstop.',
          systemic_impact: { control_margin_delta: 0, stability_delta: +0.05 }
        });
      }
      break;
    }

    case 'SCENARIO_D': {
      // SCENARIO D: Collective Decision Convergence (Herding & Diversity Collapse)
      if (stageIndex === 0) {
        // T0: Incident Declaration with High Apparent Diversity
        const incident: Incident = {
          incident_id: 'RN-2026-0155',
          title: 'Collective Algorithmic Decision Convergence & Herding Fragility',
          status: 'ACTIVE',
          severity: 'HIGH',
          declared_at: timestamp,
          root_cause_vector: 'Benchmark Shock & Synchronized Model Drift',
          affected_node_ids: ['MODEL-A', 'MODEL-B', 'MODEL-C', 'MODEL-D'],
          affected_dependency_ids: ['DEP_MODEL_C_ASSET_17'],
          containment_margin_percent: 78,
          estimated_intervention_window_sec: 90,
          evidence_record_ids: ['EVD-2026-007', 'EVD-2026-008']
        };
        engine.incidents = [incident];

        events.push({
          event_id: 'EVT-D0-APPARENT-DIVERSITY',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'ANOMALY_DETECTED',
          severity: 'INFO',
          source_entity_id: 'MODEL-A',
          causal_chain_id: 'CHAIN-SCENARIO-D',
          parent_event_id: null,
          state_deltas: [
            { entity_type: 'AI_MODEL', entity_id: 'MODEL-A', field: 'effective_diversity_score', previous_value: 0.88, new_value: 0.88 }
          ],
          causal_narrative: 'Baseline model inventory indicates apparent high diversity (0.88) across 4 institutional model architectures.',
          systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
        });
      } else if (stageIndex === 1) {
        // T1: Shared Macro Shock & Oracle Input Alignment
        for (const m of engine.aiModels) {
          m.herd_correlation_risk = 0.78;
        }

        events.push({
          event_id: 'EVT-D1-INPUT-ALIGNMENT',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'COLLECTIVE_DECISION_CONVERGENCE',
          severity: 'WARNING',
          source_entity_id: 'DATA-X',
          target_entity_id: 'MODEL-A',
          parent_event_id: 'EVT-D0-APPARENT-DIVERSITY',
          causal_chain_id: 'CHAIN-SCENARIO-D',
          state_deltas: engine.aiModels.map((m: any) => ({
            entity_type: 'AI_MODEL',
            entity_id: m.model_id,
            field: 'herd_correlation_risk',
            previous_value: 0.22,
            new_value: 0.78
          })),
          causal_narrative: 'Cross-model telemetry reveals shared rates shock: Pairwise recommendation correlation rose to 0.78 across all institutional risk engines.',
          systemic_impact: { control_margin_delta: -8, stability_delta: -0.10 }
        });
      } else if (stageIndex === 2) {
        // T2: Decision Synchrony Spike & Effective Diversity Collapse
        for (const m of engine.aiModels) {
          m.effective_diversity_score = 0.14;
          m.status = 'DEGRADING';
        }

        events.push({
          event_id: 'EVT-D2-DIVERSITY-COLLAPSE',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'DIVERSITY_COLLAPSE',
          severity: 'HIGH',
          source_entity_id: 'MODEL-A',
          parent_event_id: 'EVT-D1-INPUT-ALIGNMENT',
          causal_chain_id: 'CHAIN-SCENARIO-D',
          state_deltas: engine.aiModels.map((m: any) => ({
            entity_type: 'AI_MODEL',
            entity_id: m.model_id,
            field: 'effective_diversity_score',
            previous_value: 0.88,
            new_value: 0.14
          })),
          causal_narrative: 'EFFECTIVE DIVERSITY COLLAPSE: Apparent vendor diversity was negated by shared input tensors. Decision synchrony reached 94%.',
          systemic_impact: { control_margin_delta: -15, stability_delta: -0.18 }
        });
      } else if (stageIndex === 3) {
        // T3: Synchronized Liquidity Pull Across Institutions
        const insts = engine.institutions.filter((i: any) => ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D'].includes(i.institution_id));
        for (const inst of insts) {
          inst.status = 'DEGRADING';
          inst.liquidity_coverage_ratio = +(inst.liquidity_coverage_ratio * 0.82).toFixed(1);
        }

        events.push({
          event_id: 'EVT-D3-SYNCHRONIZED-LIQUIDITY-PULL',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'INSTITUTION_DEGRADATION',
          severity: 'CRITICAL',
          source_entity_id: 'MODEL-A',
          target_entity_id: 'BANK-A',
          parent_event_id: 'EVT-D2-DIVERSITY-COLLAPSE',
          causal_chain_id: 'CHAIN-SCENARIO-D',
          state_deltas: insts.map((i: any) => ({
            entity_type: 'INSTITUTION',
            entity_id: i.institution_id,
            field: 'status',
            previous_value: 'STABLE',
            new_value: 'DEGRADING'
          })),
          causal_narrative: 'Synchronized risk algorithms simultaneously triggered credit line freezes across Atlantic and European clearing nodes.',
          systemic_impact: { control_margin_delta: -12, stability_delta: -0.15 }
        });
      } else if (stageIndex === 4) {
        // T4: Systemic Fragility Realized (Control Margin Drops to 48%)
        events.push({
          event_id: 'EVT-D4-SYSTEMIC-FRAGILITY-ALERT',
          tick,
          simulation_timestamp: timestamp,
          event_type: 'ANOMALY_DETECTED',
          severity: 'CRITICAL',
          source_entity_id: 'ENCLAVE_CTRL',
          parent_event_id: 'EVT-D3-SYNCHRONIZED-LIQUIDITY-PULL',
          causal_chain_id: 'CHAIN-SCENARIO-D',
          state_deltas: [],
          causal_narrative: 'Systemic Controllability degraded to CONTROL_CRITICAL. Effective intervention window compressed to 52 seconds.',
          systemic_impact: { control_margin_delta: -8, stability_delta: -0.10 }
        });
      }
      break;
    }
  }

  // Update dynamic Control Margin and Graph Metrics
  const metrics = computeSystemicGraphMetrics(
    engine.institutions,
    engine.dependencies,
    engine.dataProviders,
    engine.infrastructureNodes,
    engine.aiModels
  );

  // Apply metrics to authoritative controlState
  engine.controlState = {
    ...engine.controlState,
    control_margin_percent: metrics.control_margin_percent,
    overall_status: metrics.overall_status,
    system_stability_index: metrics.system_stability_index,
    chokepoint_saturation: metrics.chokepoint_saturation,
    key_metrics: metrics.key_metrics,
    active_threat_count: metrics.affected_nodes_count,
    active_incident_count: engine.incidents.filter((i: any) => i.status === 'ACTIVE' || i.status === 'CONTAINING').length,
    active_incident_id: engine.incidents.length > 0 ? engine.incidents[0].incident_id : null,
    last_evaluated_timestamp: timestamp,
    scenario_name: SCENARIO_DESCRIPTORS[scenarioId].name
  };

  return events;
}
