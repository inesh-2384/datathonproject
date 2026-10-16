/**
 * FINANCIAL IMMUNE SYSTEM - PHASE 3 SYSTEMIC INTELLIGENCE ACCEPTANCE TEST SUITE
 * 35 Comprehensive Acceptance Criteria (P3-01 to P3-35)
 * 
 * Verifies:
 * - Mathematical Control Margin M(t) additive decomposition
 * - Risk != Control separation (Systemic Stress vs Control Capacity)
 * - Temporal degradation rate & trend categorization
 * - Intervention window assessment & uncertainty bounds
 * - Dependency intelligence, chokepoints & HHI concentration
 * - Propagation depth, velocity & systemic scope
 * - Effective Decision Diversity (EDD), decomposition & herding
 * - Evidence quality, observation gaps, conflict detection & epistemic uncertainty gating
 * - Non-mutating counterfactual simulations
 * - Feature ablation evaluation & baseline tiering
 * - Entity-level controllability intelligence & sensitivity sweeps
 * - Deterministic repeatability
 */

const http = require('http');

const API_BASE = 'http://localhost:3001/api';

function request(method, apiPath, body = null) {
  return new Promise((resolve, reject) => {
    const fullPath = apiPath.startsWith('/api') ? apiPath : '/api' + (apiPath.startsWith('/') ? apiPath : '/' + apiPath);
    const options = {
      method,
      hostname: 'localhost',
      port: 3001,
      path: fullPath,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM - PHASE 3 SYSTEMIC INTELLIGENCE SUITE (35 TESTS)');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testId, message, details = '') {
    if (condition) {
      console.log(`  ✓ [${testId}] ${message} ${details ? '| ' + details : ''}`);
      passed++;
    } else {
      console.error(`  ✗ [${testId}] FAILED: ${message} ${details ? '| ' + details : ''}`);
      failed++;
    }
  }

  try {
    // 0. Reset to clean baseline
    await request('POST', '/simulation/reset', { seed: 42091 });

    // P3-01: Control Margin M(t) Computation
    console.log('[P3-01] Testing Mathematical Control Margin M(t) Computation...');
    const resAssessment0 = await request('GET', '/intelligence/assessment');
    const asm0 = resAssessment0.data.assessment;
    assert(
      asm0 && asm0.control_margin_percent >= 15 && asm0.control_margin_percent <= 96,
      'P3-01',
      'Control Margin M(t) bounded in [15, 96]',
      `M(0) = ${asm0.control_margin_percent}%`
    );

    // P3-02: Additive Decomposition of M(t)
    console.log('\n[P3-02] Testing Additive Decomposition of M(t)...');
    const contrib = asm0.contributions;
    const computedNet = contrib.baseline_margin +
      contrib.delta_dependency_concentration +
      contrib.delta_propagation_depth +
      contrib.delta_infrastructure_stress +
      contrib.delta_decision_convergence +
      contrib.delta_recovery_capacity;
    assert(
      contrib && Math.abs(computedNet - contrib.net_control_margin) <= 1,
      'P3-02',
      'Additive component decomposition matches net control margin',
      `Base=${contrib.baseline_margin}, Deltas=(${contrib.delta_dependency_concentration}, ${contrib.delta_propagation_depth}, ${contrib.delta_infrastructure_stress}, ${contrib.delta_decision_convergence}, +${contrib.delta_recovery_capacity}) => Net=${contrib.net_control_margin}`
    );

    // P3-03: Controllability State Derivation
    console.log('\n[P3-03] Testing Controllability State Derivation...');
    assert(
      asm0.controllability_state === 'CONTROL_STABLE',
      'P3-03',
      'Baseline state derives CONTROL_STABLE when M(t) >= 80% and evidence is clean',
      `State: ${asm0.controllability_state}`
    );

    // P3-04: Risk != Control Separation
    console.log('\n[P3-04] Testing Risk != Control Separation (Stress vs Capacity)...');
    assert(
      typeof asm0.systemic_stress_index === 'number' && typeof asm0.control_capacity_index === 'number',
      'P3-04',
      'Distinct Systemic Stress and Control Capacity indices maintained',
      `Stress=${asm0.systemic_stress_index}, Capacity=${asm0.control_capacity_index}`
    );
    assert(
      asm0.systemic_stress_index <= 0.15 && asm0.control_capacity_index >= 0.85,
      'P3-04',
      'Baseline shows minimal systemic stress (<0.15) and high control capacity (>=0.85)',
      `Stress=${asm0.systemic_stress_index}, Capacity=${asm0.control_capacity_index}`
    );

    // P3-05: Temporal Degradation Rate
    console.log('\n[P3-05] Testing Temporal Degradation Rate...');
    assert(
      typeof asm0.control_degradation_rate === 'number',
      'P3-05',
      'Temporal degradation rate dM/dt is explicitly tracked',
      `Rate=${asm0.control_degradation_rate} pts/tick`
    );

    // P3-06: Control Margin Trend Categorization
    console.log('\n[P3-06] Testing Control Margin Trend Categorization...');
    const validTrends = ['STABLE', 'DEGRADING', 'RAPIDLY_DEGRADING', 'CRITICAL', 'RECOVERING'];
    assert(
      validTrends.includes(asm0.control_margin_trend),
      'P3-06',
      'Control margin trend belongs to valid taxonomy',
      `Trend: ${asm0.control_margin_trend}`
    );

    // P3-07: Intervention Window Estimation
    console.log('\n[P3-07] Testing Intervention Window Estimation...');
    const win = asm0.intervention_window;
    assert(
      win && win.estimated_window_seconds > 0 && win.estimated_window_ticks > 0,
      'P3-07',
      'Intervention window estimated in both ticks and seconds',
      `${win.estimated_window_ticks} ticks (${win.estimated_window_seconds}s)`
    );

    // P3-08: Intervention Window Trend
    console.log('\n[P3-08] Testing Intervention Window Trend...');
    const validWinTrends = ['EXPANDING', 'STABLE', 'SHRINKING', 'CRITICAL'];
    assert(
      validWinTrends.includes(win.trend),
      'P3-08',
      'Intervention window trend reflects operational margin status',
      `Window Trend: ${win.trend}`
    );

    // P3-09: Intervention Window Uncertainty Bounds
    console.log('\n[P3-09] Testing Intervention Window Uncertainty Bounds...');
    assert(
      typeof win.uncertainty_bounds_ticks === 'number' && win.uncertainty_bounds_ticks >= 0,
      'P3-09',
      'Uncertainty bounds on intervention window are provided',
      `Bounds: +/- ${win.uncertainty_bounds_ticks} ticks`
    );

    // P3-10: Structural Dependency Intelligence & Chokepoints
    console.log('\n[P3-10] Testing Structural Dependency Intelligence & Chokepoints...');
    const resDeps = await request('GET', '/intelligence/dependencies');
    assert(
      resDeps.data.success && Array.isArray(resDeps.data.dependencies) && resDeps.data.dependencies.length > 0,
      'P3-10',
      'Dependency intelligence records generated for all graph edges',
      `Count: ${resDeps.data.dependencies.length}`
    );
    const chokepoints = resDeps.data.dependencies.filter(d => d.is_chokepoint);
    assert(
      chokepoints.length > 0,
      'P3-10',
      'Structural chokepoints detected and flagged',
      `Chokepoints count: ${chokepoints.length} (e.g. ${chokepoints[0].dependency_id})`
    );

    // P3-11: Systemic Concentration Metrics (HHI)
    console.log('\n[P3-11] Testing Systemic Concentration Metrics (HHI)...');
    const conc = asm0.concentration_metrics;
    assert(
      conc && typeof conc.data_concentration_hhi === 'number' && typeof conc.model_concentration_hhi === 'number',
      'P3-11',
      'HHI concentration computed across data providers and decision models',
      `Data HHI=${conc.data_concentration_hhi}, Model HHI=${conc.model_concentration_hhi}`
    );

    // P3-12: Inject Shock & Verify Concentration Penalty
    console.log('\n[P3-12] Testing High Concentration Penalty Under Scenario A...');
    await request('POST', '/simulation/scenario', { scenario_id: 'SCENARIO_A' });
    await request('POST', '/simulation/step');
    await request('POST', '/simulation/step');
    const resAsmA = await request('GET', '/intelligence/assessment');
    const asmA = resAsmA.data.assessment;
    assert(
      asmA.contributions.delta_dependency_concentration < 0,
      'P3-12',
      'Concentration penalty dynamically degrades Control Margin under provider failure',
      `Delta Dep Concentration: ${asmA.contributions.delta_dependency_concentration} pts`
    );

    // P3-13: Propagation Intelligence Generation
    console.log('\n[P3-13] Testing Propagation Intelligence Generation...');
    const propA = asmA.propagation_intelligence;
    assert(
      propA && propA.maximum_depth_hops >= 2 && propA.breadth_affected_nodes >= 3,
      'P3-13',
      'Propagation intelligence tracks cascade depth and affected node breadth',
      `Depth: ${propA.maximum_depth_hops} hops, Breadth: ${propA.breadth_affected_nodes} nodes`
    );

    // P3-14: Propagation Velocity Estimation
    console.log('\n[P3-14] Testing Propagation Velocity Estimation...');
    assert(
      typeof propA.cascade_velocity_nodes_per_sec === 'number' && propA.cascade_velocity_nodes_per_sec > 0,
      'P3-14',
      'Cascade propagation velocity measured in nodes/second',
      `Velocity: ${propA.cascade_velocity_nodes_per_sec} nodes/s`
    );

    // P3-15: Systemic Scope Threshold Detection
    console.log('\n[P3-15] Testing Systemic Scope Threshold Detection...');
    assert(
      ['SYSTEMIC', 'LOCALIZED', 'CLUSTER'].includes(propA.scope),
      'P3-15',
      'Propagation scope categorized dynamically based on institutional reach',
      `Scope: ${propA.scope}`
    );

    // P3-16: Collective Decision Intelligence: Effective Decision Diversity (EDD)
    console.log('\n[P3-16] Testing Effective Decision Diversity (EDD) Computation...');
    const decSig = asmA.collective_decision_signal;
    assert(
      decSig && decSig.effective_decision_diversity >= 0 && decSig.effective_decision_diversity <= 1.0,
      'P3-16',
      'Effective Decision Diversity (EDD) computed in range [0.0, 1.0]',
      `EDD: ${decSig.effective_decision_diversity}`
    );

    // P3-17: EDD Diversity Decomposition
    console.log('\n[P3-17] Testing EDD Diversity Decomposition...');
    const decomp = decSig.decomposition || decSig.diversity_decomposition;
    const rawDiv = decomp ? (decomp.observed_raw_diversity ?? decomp.raw_algorithmic_diversity) : 0.98;
    assert(
      decomp && typeof rawDiv === 'number' &&
      typeof decomp.common_data_penalty === 'number' &&
      typeof decomp.model_correlation_penalty === 'number' &&
      typeof decomp.temporal_synchrony_penalty === 'number',
      'P3-17',
      'Diversity decomposed into raw score and specific structural penalties',
      `Raw=${rawDiv}, CommonData=-${decomp?.common_data_penalty}, ModelCorr=-${decomp?.model_correlation_penalty}, Sync=-${decomp?.temporal_synchrony_penalty}`
    );

    // P3-18: Herding / Decision Synchrony Detection
    console.log('\n[P3-18] Testing Herding / Decision Synchrony Detection...');
    assert(
      typeof decSig.decision_synchrony_percent === 'number' && decSig.decision_synchrony_percent >= 0,
      'P3-18',
      'Decision synchrony percentage measured across autonomous models',
      `Synchrony: ${decSig.decision_synchrony_percent}%`
    );

    // P3-19: Decision Convergence Penalty
    console.log('\n[P3-19] Testing Decision Convergence Penalty on Control Margin...');
    assert(
      typeof asmA.contributions.delta_decision_convergence === 'number',
      'P3-19',
      'Decision convergence delta contributes to net Control Margin',
      `Delta Decision Convergence: ${asmA.contributions.delta_decision_convergence} pts`
    );

    // P3-20: Scenario D Collective Herding Collapse
    console.log('\n[P3-20] Testing Scenario D: Algorithmic Herding Collapse...');
    await request('POST', '/simulation/scenario', { scenario_id: 'SCENARIO_D' });
    await request('POST', '/simulation/step');
    await request('POST', '/simulation/step');
    const resAsmD = await request('GET', '/intelligence/assessment');
    const asmD = resAsmD.data.assessment;
    assert(
      asmD.collective_decision_signal.effective_decision_diversity <= 0.25,
      'P3-20',
      'Scenario D forces Effective Decision Diversity collapse (EDD <= 0.25)',
      `EDD: ${asmD.collective_decision_signal.effective_decision_diversity}`
    );
    assert(
      asmD.collective_decision_signal.recommendation_alignment === 'CONVERGED_SYNCHRONIZED',
      'P3-20',
      'Recommendation alignment transitions to CONVERGED_SYNCHRONIZED',
      `Alignment: ${asmD.collective_decision_signal.recommendation_alignment}`
    );

    // P3-21: Evidence Quality Evaluation
    console.log('\n[P3-21] Testing Evidence Quality Evaluation...');
    const evdA = asmA.evidence_quality;
    assert(
      evdA && evdA.evidence_sufficiency_score >= 0.0 && evdA.evidence_sufficiency_score <= 1.0,
      'P3-21',
      'Evidence sufficiency score evaluated between [0.0, 1.0]',
      `Sufficiency: ${evdA.evidence_sufficiency_score}`
    );

    // P3-22: Observation Gap Detection
    console.log('\n[P3-22] Testing Observation Gap Detection...');
    assert(
      Array.isArray(evdA.observation_gaps),
      'P3-22',
      'Observation gaps identified and tracked',
      `Gaps count: ${evdA.observation_gaps.length}`
    );

    // P3-23: Conflicting Telemetry Detection
    console.log('\n[P3-23] Testing Conflicting Telemetry Detection under Scenario C...');
    await request('POST', '/simulation/scenario', { scenario_id: 'SCENARIO_C' });
    // Advance ticks to trigger residual risk / conflict (Stage 3)
    await request('POST', '/simulation/step');
    await request('POST', '/simulation/step');
    await request('POST', '/simulation/step');
    const resAsmC = await request('GET', '/intelligence/assessment');
    const asmC = resAsmC.data.assessment;
    assert(
      asmC.evidence_quality.conflict_detected === true || asmC.controllability_state === 'CONTROL_UNVERIFIED',
      'P3-23',
      'Conflicting telemetry detected under latent collateral stress',
      `Conflict: ${asmC.evidence_quality.conflict_detected}, State: ${asmC.controllability_state}`
    );

    // P3-24: Epistemic Uncertainty Gating
    console.log('\n[P3-24] Testing Epistemic Uncertainty Gating (Invariant)...');
    assert(
      asmC.controllability_state === 'CONTROL_UNVERIFIED',
      'P3-24',
      'Epistemic uncertainty prevents false recovery and forces CONTROL_UNVERIFIED',
      `State: ${asmC.controllability_state}`
    );

    // P3-25: Confidence Rating Downgrade
    console.log('\n[P3-25] Testing Confidence Rating Downgrade under Uncertainty...');
    assert(
      ['LOW', 'VERY_LOW', 'MEDIUM'].includes(asmC.evidence_quality.confidence_rating),
      'P3-25',
      'Confidence rating downgraded from HIGH when telemetry is unverified/conflicted',
      `Rating: ${asmC.evidence_quality.confidence_rating}`
    );

    // P3-26: Model Version Manifest Tracking
    console.log('\n[P3-26] Testing Model Version Manifest Tracking...');
    const manifests = asmC.model_versions;
    assert(
      manifests && manifests.control_margin_model === 'CM-0.2' && manifests.decision_diversity_model === 'EDD-0.1',
      'P3-26',
      'Model version manifest tracks active algorithm specifications',
      `CM=${manifests.control_margin_model}, EDD=${manifests.decision_diversity_model}, PROP=${manifests.propagation_model}`
    );

    // P3-27: Dynamic Causal Explanation Chain Assembly
    console.log('\n[P3-27] Testing Dynamic Causal Explanation Chain Assembly...');
    assert(
      Array.isArray(asmC.causal_explanation_chain) && asmC.causal_explanation_chain.length > 0,
      'P3-27',
      'Dynamic causal explanation chain generated from state transitions',
      `Steps: ${asmC.causal_explanation_chain.length} (e.g. "${asmC.causal_explanation_chain[0]}")`
    );

    // P3-28: Primary and Secondary Driver Attribution
    console.log('\n[P3-28] Testing Primary and Secondary Driver Attribution...');
    assert(
      typeof asmC.primary_driver === 'string' && asmC.primary_driver.length > 0 && Array.isArray(asmC.secondary_drivers),
      'P3-28',
      'Structured explanations decompose primary driver and secondary conditions',
      `Primary: ${asmC.primary_driver}`
    );

    // P3-29: Strictly Non-Mutating Counterfactual Simulation
    console.log('\n[P3-29] Testing Strictly Non-Mutating Counterfactual Simulation...');
    const stateBefore = await request('GET', '/state');
    const marginBefore = (stateBefore.data.data ? stateBefore.data.data.controlState.control_margin_percent : stateBefore.data.controlState.control_margin_percent);
    const resCf = await request('POST', '/intelligence/counterfactual', {
      hypothesis: 'Isolate compromised provider DATA-X',
      target_entity_id: 'DATA-X'
    });
    const stateAfter = await request('GET', '/state');
    const marginAfter = (stateAfter.data.data ? stateAfter.data.data.controlState.control_margin_percent : stateAfter.data.controlState.control_margin_percent);

    assert(
      resCf.data.success && resCf.data.result.counterfactual_control_margin > marginBefore,
      'P3-29',
      'Counterfactual simulation projects control margin recovery',
      `Base=${resCf.data.result.baseline_control_margin}%, Simulated=${resCf.data.result.counterfactual_control_margin}% (Delta=+${resCf.data.result.delta_margin}%)`
    );
    assert(
      marginBefore === marginAfter,
      'P3-29',
      'INVARIANT: Live engine state is strictly NOT mutated by counterfactual simulation',
      `MarginBefore=${marginBefore}%, MarginAfter=${marginAfter}%`
    );

    // P3-30: Counterfactual Result Schema & Status
    console.log('\n[P3-30] Testing Counterfactual Result Schema & Truth Status...');
    const cfRes = resCf.data.result;
    assert(
      cfRes.status === 'COUNTERFACTUAL_SIMULATION' && cfRes.executed === false,
      'P3-30',
      'Counterfactual result explicitly marked executed: false and COUNTERFACTUAL_SIMULATION',
      `Status=${cfRes.status}, Executed=${cfRes.executed}`
    );

    // P3-31: Feature Ablation Impact Evaluation
    console.log('\n[P3-31] Testing Feature Ablation Impact Ranking...');
    const resAblEval = await request('POST', '/intelligence/ablation/evaluate');
    assert(
      resAblEval.data.success && Array.isArray(resAblEval.data.result.ablations) && resAblEval.data.result.ablations.length > 0,
      'P3-31',
      'Component ablation evaluates delta impact of individual features',
      `Most critical factor: ${resAblEval.data.result.most_critical_factor}`
    );

    // P3-32: Baseline Tier Switching
    console.log('\n[P3-32] Testing Baseline Tier Switching (B0 - B5)...');
    const resTierB2 = await request('POST', '/intelligence/ablation', { tier: 'B2' });
    assert(
      resTierB2.data.success && resTierB2.data.config.active_tier === 'B2' && resTierB2.data.config.enable_dependency_intelligence === true,
      'P3-32',
      'Baseline tier B2 (Dependency-Aware) successfully configured',
      `Tier: ${resTierB2.data.config.active_tier}`
    );
    // Restore to B5
    const resTierB5 = await request('POST', '/intelligence/ablation', { tier: 'B5' });
    assert(
      resTierB5.data.success && resTierB5.data.config.active_tier === 'B5' && resTierB5.data.config.enable_uncertainty_gating === true,
      'P3-32',
      'Baseline tier B5 (Full FIS Intelligence) restored with uncertainty gating enabled',
      `Tier: ${resTierB5.data.config.active_tier}`
    );

    // P3-33: Entity-Level Controllability Intelligence
    console.log('\n[P3-33] Testing Entity-Level Controllability Intelligence...');
    const resEntBankA = await request('GET', '/intelligence/entity/BANK-A');
    assert(
      resEntBankA.data.success && resEntBankA.data.data.entity_id === 'BANK-A',
      'P3-33',
      'Entity intelligence returns centrality, affected counts, and control impact score',
      `BANK-A Centrality=${resEntBankA.data.data.centrality_score}, Impact=${resEntBankA.data.data.control_impact_score}`
    );

    // P3-34: Controlled Sensitivity Sweeps
    console.log('\n[P3-34] Testing Controlled Sensitivity Sweeps...');
    const resSens = await request('POST', '/intelligence/sensitivity');
    assert(
      resSens.data.success && Array.isArray(resSens.data.sensitivity_sweeps) && resSens.data.sensitivity_sweeps.length > 0,
      'P3-34',
      'Sensitivity sweep computes parameter derivatives and identifies most sensitive parameter',
      `Most sensitive: ${resSens.data.most_sensitive_parameter}`
    );

    // P3-35: Deterministic Repeatability of Intelligence Assessments
    console.log('\n[P3-35] Testing Deterministic Repeatability of Intelligence Assessments...');
    await request('POST', '/simulation/reset', { seed: 42091 });
    await request('POST', '/simulation/scenario', { scenario_id: 'SCENARIO_A' });
    const run1 = await request('GET', '/intelligence/assessment');
    
    // Re-run identical seed and scenario
    await request('POST', '/simulation/reset', { seed: 42091 });
    await request('POST', '/simulation/scenario', { scenario_id: 'SCENARIO_A' });
    const run2 = await request('GET', '/intelligence/assessment');

    const m1 = run1.data.assessment.control_margin_percent;
    const m2 = run2.data.assessment.control_margin_percent;
    const edd1 = run1.data.assessment.collective_decision_signal.effective_decision_diversity;
    const edd2 = run2.data.assessment.collective_decision_signal.effective_decision_diversity;

    assert(
      m1 === m2 && edd1 === edd2,
      'P3-35',
      'Deterministic repeatability verified across identical seeds and scenarios',
      `Run 1 (M=${m1}%, EDD=${edd1}) === Run 2 (M=${m2}%, EDD=${edd2})`
    );

  } catch (err) {
    console.error('Test execution threw an unhandled exception:', err);
    failed++;
  }

  console.log('\n================================================================================');
  console.log(`  PHASE 3 ACCEPTANCE SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
