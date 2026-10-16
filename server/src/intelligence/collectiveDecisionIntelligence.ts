/**
 * FINANCIAL IMMUNE SYSTEM - COLLECTIVE DECISION INTELLIGENCE (PHASE 3)
 * Intelligence Layer 4: Collective Decision Signals & Effective Decision Diversity
 * 
 * Rules:
 * 1. Research heuristic: Explicitly labeled EXPERIMENTAL.
 * 2. Distinguishes Apparent (Observed) Decision Diversity from Effective Decision Diversity.
 * 3. Shows how shared upstream inputs and synchronized timing collapse systemic diversity.
 */

import { Institution, AIModel, DataProvider } from '../../../shared/types/domain';
import { CollectiveDecisionSignal } from '../../../shared/types/intelligence';

/**
 * Computes Effective Decision Diversity and Collective Decision Signals.
 */
export function computeCollectiveDecisionSignal(
  institutions: Institution[],
  aiModels: AIModel[],
  dataProviders: DataProvider[],
  activeScenarioId?: string
): CollectiveDecisionSignal {
  // 1. Observed Model Diversity (apparent diversity based on distinct models in use)
  const allAssignedModels = new Set<string>();
  for (const inst of institutions) {
    for (const mId of inst.active_ai_models || []) {
      allAssignedModels.add(mId);
    }
  }
  const totalPossibleModels = Math.max(1, aiModels.length);
  // Apparent diversity is high if institutions use distinct model names
  const observedDiversity = +(Math.min(1.0, allAssignedModels.size / totalPossibleModels) * 0.9 + 0.08).toFixed(2);

  // 2. Shared Data Oracle Vulnerability
  // If common oracle (e.g. DATA-X) is degraded, or if Scenario D is active
  const dataX = dataProviders.find(p => p.provider_id === 'DATA-X');
  const isDataTainted = dataX && (dataX.status === 'COMPROMISED' || dataX.status === 'DEGRADING');
  const isScenarioD = activeScenarioId === 'SCENARIO_D';
  // Check if secondary backstop / quarantine is active on MODEL-C
  const modelC = aiModels.find(m => m.model_id === 'MODEL-C');
  const isBackstopQuarantined = Boolean(
    modelC && (modelC.effective_diversity_score >= 0.80 || modelC.herd_correlation_risk <= 0.15)
  );

  if (isBackstopQuarantined) {
    const rawDiversity = 0.95;
    const deltaData = 0.05;
    const deltaModel = 0.03;
    const deltaSync = 0.02;
    const effectiveDiversity = 0.85;
    const decisionSynchrony = 14; // Canonical 0.14 synchrony
    const herdingCorrelationIndex = 0.14;
    const alignment: 'DIVERGENT' | 'CORRELATED' | 'CONVERGED_SYNCHRONIZED' = 'DIVERGENT';

    return {
      observed_model_diversity: rawDiversity,
      effective_decision_diversity: effectiveDiversity,
      decision_synchrony_percent: decisionSynchrony,
      herding_correlation_index: herdingCorrelationIndex,
      recommendation_alignment: alignment,
      common_input_oracle_id: 'DATA-X',
      decomposition: {
        observed_raw_diversity: rawDiversity,
        common_data_penalty: deltaData,
        model_correlation_penalty: deltaModel,
        temporal_synchrony_penalty: deltaSync,
        net_effective_decision_diversity: effectiveDiversity,
        explanatory_narrative: 'Enclave MODEL-C quarantine and parameter clamp restored effective decision diversity to 85% and decoupled temporal synchrony to 14% (0.14).'
      },
      truth_status: 'EXPERIMENTAL'
    };
  }

  // 3. Average Herd Correlation Index across models
  let herdCorrelationSum = 0;
  for (const m of aiModels) {
    herdCorrelationSum += (m.herd_correlation_risk || 0.22);
  }
  let herdingCorrelationIndex = aiModels.length > 0 ? +(herdCorrelationSum / aiModels.length).toFixed(2) : 0.22;

  // In Scenario D or during data taint, model correlation spikes
  if (isScenarioD && herdingCorrelationIndex < 0.75) {
    herdingCorrelationIndex = 0.78;
  } else if (isDataTainted && herdingCorrelationIndex < 0.70) {
    herdingCorrelationIndex = 0.78;
  }

  // 4. Decision Synchrony: Temporal clustering of risk aversion actions
  const isDiversityCollapsed = isScenarioD || aiModels.some(m => (m.effective_diversity_score !== undefined && m.effective_diversity_score <= 0.20));
  let decisionSynchrony = Math.round(18 + herdingCorrelationIndex * 70);
  if (isDiversityCollapsed) {
    decisionSynchrony = 94; // Extreme temporal convergence
  }

  // 5. Effective Decision Diversity (Exact Additive Decomposition)
  // Mathematical Formulation:
  // EDD = ObservedDiversity - Delta_data - Delta_model - Delta_sync
  let deltaData = 0.05;
  let deltaModel = 0.03;
  let deltaSync = 0.02;

  if (isDiversityCollapsed || isScenarioD) {
    deltaData = 0.35;
    deltaModel = +(herdingCorrelationIndex * 0.32).toFixed(2); // 0.78 * 0.32 = 0.25
    deltaSync = +((decisionSynchrony / 100) * 0.255).toFixed(2); // (94/100) * 0.255 = 0.24
  } else if (isDataTainted) {
    deltaData = 0.45;
    deltaModel = +(herdingCorrelationIndex * 0.28).toFixed(2); // 0.22
    deltaSync = +((decisionSynchrony / 100) * 0.22).toFixed(2);  // 0.16
  } else {
    deltaData = 0.05;
    deltaModel = 0.03;
    deltaSync = 0.02;
  }

  // Exact arithmetic derivation:
  const rawDiversity = observedDiversity;
  let effectiveDiversity = +(rawDiversity - deltaData - deltaModel - deltaSync).toFixed(2);
  effectiveDiversity = Math.max(0.05, Math.min(1.0, effectiveDiversity));

  // 6. Recommendation Alignment Classification
  let alignment: 'DIVERGENT' | 'CORRELATED' | 'CONVERGED_SYNCHRONIZED' = 'DIVERGENT';
  if (herdingCorrelationIndex > 0.85 || decisionSynchrony > 80 || isDiversityCollapsed) {
    alignment = 'CONVERGED_SYNCHRONIZED';
  } else if (herdingCorrelationIndex > 0.50 || decisionSynchrony > 40) {
    alignment = 'CORRELATED';
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
    common_input_oracle_id: 'DATA-X',
    decomposition,
    truth_status: 'EXPERIMENTAL'
  };
}

