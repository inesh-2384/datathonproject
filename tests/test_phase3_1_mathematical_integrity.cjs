/**
 * PHASE 3.1 TEST SUITE: Mathematical Integrity & Causal Accounting
 * Verifies exact arithmetic identity:
 *   1. M(t) = Baseline + Delta_dep + Delta_prop + Delta_infra + Delta_herd + Delta_rec
 *   2. EDD = Raw_Diversity - Delta_data - Delta_model - Delta_sync
 *   3. Scenario targets reconcile exactly without overrides
 */

const BASE_URL = 'http://localhost:3001';

async function resetSimulation() {
  const res = await fetch(`${BASE_URL}/api/simulation/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
  return res.json();
}

async function startScenario(scenarioId) {
  const res = await fetch(`${BASE_URL}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: scenarioId })
  });
  if (!res.ok) throw new Error(`Start scenario ${scenarioId} failed: ${res.statusText}`);
  return res.json();
}

async function advanceTicks(n = 3) {
  for (let i = 0; i < n; i++) {
    const res = await fetch(`${BASE_URL}/api/simulation/step`, { method: 'POST' });
    if (!res.ok) throw new Error(`Step failed: ${res.statusText}`);
  }
}

async function getAssessment() {
  const res = await fetch(`${BASE_URL}/api/intelligence/assessment`);
  if (!res.ok) throw new Error(`Get assessment failed: ${res.statusText}`);
  const json = await res.json();
  return json.assessment;
}

async function testScenario(scenarioId, expectedMargin, expectedState, stepsToAdvance = 0) {
  console.log(`\n--------------------------------------------------`);
  console.log(`Evaluating Scenario: ${scenarioId} (Advance: ${stepsToAdvance} ticks)`);
  console.log(`--------------------------------------------------`);

  if (scenarioId === 'BASELINE') {
    await resetSimulation();
  } else {
    await resetSimulation();
    await startScenario(scenarioId);
    if (stepsToAdvance > 0) {
      await advanceTicks(stepsToAdvance);
    }
  }

  const asm = await getAssessment();
  const c = asm.contributions;
  const d = asm.collective_decision_signal;

  // 1. Check Control Margin Additive Invariant:
  // Baseline + sum(deltas) === Net Margin
  const expectedSum = c.baseline_margin +
    c.delta_dependency_concentration +
    c.delta_propagation_depth +
    c.delta_infrastructure_stress +
    c.delta_decision_convergence +
    c.delta_recovery_capacity;

  console.log(`[Margin Breakdown]`);
  console.log(`  Baseline:                ${c.baseline_margin}`);
  console.log(`  Delta Dependency:        ${c.delta_dependency_concentration}`);
  console.log(`  Delta Propagation:       ${c.delta_propagation_depth}`);
  console.log(`  Delta Infrastructure:    ${c.delta_infrastructure_stress}`);
  console.log(`  Delta Decision Converg:  ${c.delta_decision_convergence}`);
  console.log(`  Delta Recovery:         +${c.delta_recovery_capacity}`);
  console.log(`  Computed Sum:            ${expectedSum}`);
  console.log(`  Reported Net Margin:     ${c.net_control_margin}%`);
  console.log(`  Assessment Margin:       ${asm.control_margin_percent}%`);

  if (expectedSum !== c.net_control_margin) {
    throw new Error(`FAIL: Additive identity violated! Sum: ${expectedSum} !== Net Margin: ${c.net_control_margin}`);
  }
  if (asm.control_margin_percent !== c.net_control_margin) {
    throw new Error(`FAIL: Inconsistency between assessment margin (${asm.control_margin_percent}) and contribution net margin (${c.net_control_margin})`);
  }
  if (expectedMargin !== null && c.net_control_margin !== expectedMargin) {
    throw new Error(`FAIL: Target mismatch! Expected ${expectedMargin}%, got ${c.net_control_margin}%`);
  }
  console.log(`  ✓ Additive Control Margin Identity Holds: ${c.baseline_margin} + (${c.delta_dependency_concentration}) + (${c.delta_propagation_depth}) + (${c.delta_infrastructure_stress}) + (${c.delta_decision_convergence}) + (${c.delta_recovery_capacity}) = ${c.net_control_margin}`);

  // 2. Check Effective Decision Diversity Additive Invariant:
  if (d.decomposition) {
    const decomp = d.decomposition;
    const computedEDD = +(decomp.observed_raw_diversity - decomp.common_data_penalty - decomp.model_correlation_penalty - decomp.temporal_synchrony_penalty).toFixed(2);
    console.log(`[EDD Decomposition]`);
    console.log(`  Raw Diversity:           ${decomp.observed_raw_diversity}`);
    console.log(`  Data Overlap Discount:  -${decomp.common_data_penalty}`);
    console.log(`  Model Corr Discount:    -${decomp.model_correlation_penalty}`);
    console.log(`  Synchrony Discount:     -${decomp.temporal_synchrony_penalty}`);
    console.log(`  Decomposed Result:       ${computedEDD}`);
    console.log(`  Reported EDD:            ${d.effective_decision_diversity}`);

    if (Math.abs(computedEDD - d.effective_decision_diversity) > 0.01) {
      throw new Error(`FAIL: EDD arithmetic mismatch! Decomp sum ${computedEDD} !== reported ${d.effective_decision_diversity}`);
    }
    console.log(`  ✓ EDD Decomposition Identity Holds: ${decomp.observed_raw_diversity} - ${decomp.common_data_penalty} - ${decomp.model_correlation_penalty} - ${decomp.temporal_synchrony_penalty} = ${d.effective_decision_diversity}`);
  }

  // 3. State Invariant:
  if (expectedState && asm.controllability_state !== expectedState) {
    throw new Error(`FAIL: Controllability state mismatch! Expected ${expectedState}, got ${asm.controllability_state}`);
  }
  console.log(`  ✓ State verification passed: ${asm.controllability_state}`);
}

async function run() {
  console.log('================================================================');
  console.log('PHASE 3.1: MATHEMATICAL INTEGRITY & CAUSAL ACCOUNTING TEST SUITE');
  console.log('================================================================');

  try {
    // 1. Baseline Equilibrium
    await testScenario('BASELINE', 91, 'CONTROL_STABLE', 0);

    // 2. Scenario A: Common Oracle Poisoning (DATA-X)
    await testScenario('SCENARIO_A', 34, 'CONTROL_CRITICAL', 3);

    // 3. Scenario B: Core Infrastructure Latency & Settlement Gridlock
    await testScenario('SCENARIO_B', 28, 'CONTROL_COLLAPSING', 3);

    // 4. Scenario C: Latent Model Poisoning & Collateral Contagion
    await testScenario('SCENARIO_C', 44, 'CONTROL_UNVERIFIED', 4);

    // 5. Scenario D: Multi-Agent Algorithmic Herding Run
    await testScenario('SCENARIO_D', 42, 'CONTROL_CRITICAL', 4);

    console.log(`\n================================================================`);
    console.log('ALL MATHEMATICAL INTEGRITY & CAUSAL ACCOUNTING TESTS PASSED (5/5)');
    console.log('================================================================');
    process.exitCode = 0;
  } catch (err) {
    console.error(`\n❌ TEST SUITE FAILED:`, err.message);
    process.exit(1);
  }
}

run();
