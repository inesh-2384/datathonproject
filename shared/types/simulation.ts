/**
 * FINANCIAL IMMUNE SYSTEM - SIMULATION DOMAIN MODEL
 * Section 9: Deterministic Simulation Foundation
 * 
 * Guarantees:
 * 1. Seedable PRNG (Mulberry32) for deterministic scenario runs.
 * 2. Independent from presentation layer.
 * 3. Supports reset to exact baseline state.
 */

export interface SimulationClock {
  tick: number; // Discrete simulation step
  speed_multiplier: number; // 1x, 2x, 5x, 0 (paused)
  is_running: boolean;
  virtual_timestamp: string;
  step_duration_ms: number;
}

export interface SimulationConfig {
  seed: number;
  scenario_id: string;
  scenario_name: string;
  description: string;
  auto_tick: boolean;
  tick_interval_ms: number;
  initial_incident_id?: string;
}

export interface SimulationSnapshot {
  seed: number;
  tick: number;
  timestamp: string;
  control_margin_percent: number;
  active_incident_count: number;
  system_stability_index: number;
  event_count: number;
  state_hash: string;
}

export interface ScenarioDefinition {
  scenario_id: string;
  name: string;
  subtitle: string;
  description: string;
  initial_seed: number;
  initial_control_margin: number;
  initial_stability: number;
  key_stressors: string[];
}

export const BASELINE_SCENARIOS: ScenarioDefinition[] = [
  {
    scenario_id: 'SCENARIO_BASELINE_CORRELATED_AI_DRAIN',
    name: 'Correlated AI Liquidity Drain Baseline',
    subtitle: 'Synchronized algorithmic margin calls across Tier-1 institutions',
    description: 'A shared algorithmic optimization model triggers simultaneous liquidity contraction across 4 G-SIBs, testing systemic control reserves.',
    initial_seed: 42091,
    initial_control_margin: 78.4,
    initial_stability: 0.88,
    key_stressors: [
      'Shared LLM risk assessment model across 3 clearing nodes',
      'High-frequency repo collateral withdrawal',
      'Cross-border RTGS settlement velocity spikes'
    ]
  },
  {
    scenario_id: 'SCENARIO_ORACLE_DESYNC_CASCADE',
    name: 'Cross-Border Oracle Desynchronization',
    subtitle: 'Latency shock in global sovereign debt pricing feed',
    description: 'A 240ms telemetry drift between Tokyo and London rates feeds introduces counterparty reconciliation gridlock.',
    initial_seed: 88102,
    initial_control_margin: 62.1,
    initial_stability: 0.72,
    key_stressors: [
      'Transpacific subsea cable telemetry latency anomaly',
      'Automated CCP margin discrepancy rejections',
      'Rapid clearing bottleneck accumulation'
    ]
  }
];
