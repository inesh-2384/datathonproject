/**
 * FINANCIAL IMMUNE SYSTEM - ABLATION & BENCHMARK INTERFACES (PHASE 3)
 * Evaluation Tiers for Systematic Capability Comparison (Preparation for Phase 7)
 * 
 * Baselines:
 * - B0: No systemic intelligence (raw metrics)
 * - B1: Simple threshold monitoring
 * - B2: Dependency-aware monitoring
 * - B3: Propagation-aware monitoring
 * - B4: Dependency + propagation + collective decision signals
 * - B5: Full systemic controllability assessment
 */

import { BaselineTier, AblationConfig } from '../../../shared/types/intelligence';

export const BASELINE_CONFIGURATIONS: Record<BaselineTier, AblationConfig> = {
  B0: {
    active_tier: 'B0',
    enable_dependency_intelligence: false,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B1: {
    active_tier: 'B1',
    enable_dependency_intelligence: false,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B2: {
    active_tier: 'B2',
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: false,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B3: {
    active_tier: 'B3',
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: false,
    enable_uncertainty_gating: false
  },
  B4: {
    active_tier: 'B4',
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: true,
    enable_uncertainty_gating: false
  },
  B5: {
    active_tier: 'B5',
    enable_dependency_intelligence: true,
    enable_propagation_intelligence: true,
    enable_collective_decision_signal: true,
    enable_uncertainty_gating: true
  }
};

let currentAblationConfig: AblationConfig = BASELINE_CONFIGURATIONS.B5;

export function getActiveAblationConfig(): AblationConfig {
  return { ...currentAblationConfig };
}

export function setActiveAblationTier(tier: BaselineTier): AblationConfig {
  if (BASELINE_CONFIGURATIONS[tier]) {
    currentAblationConfig = { ...BASELINE_CONFIGURATIONS[tier] };
  }
  return getActiveAblationConfig();
}
