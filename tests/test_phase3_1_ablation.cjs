/**
 * PHASE 3.1 TEST SUITE: Ablation Tiers & Incremental Information Gain
 * Verifies that active ablation tiers B0 through B5 actually govern model
 * behavior and prove incremental capability gain (Delta B_i -> B_{i+1}).
 */

const BASE_URL = 'http://localhost:3001';

async function resetSimulation() {
  const res = await fetch(`${BASE_URL}/api/simulation/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
  return res.json();
}

async function setAblationTier(tier) {
  const res = await fetch(`${BASE_URL}/api/intelligence/ablation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier })
  });
  if (!res.ok) throw new Error(`Set ablation tier ${tier} failed: ${res.statusText}`);
  return res.json();
}

async function getAssessment() {
  const res = await fetch(`${BASE_URL}/api/intelligence/assessment`);
  if (!res.ok) throw new Error(`Get assessment failed: ${res.statusText}`);
  const json = await res.json();
  return json.assessment;
}

async function testAblations() {
  console.log('================================================================');
  console.log('PHASE 3.1: ABLATION TIERS & INCREMENTAL INFORMATION GAIN TEST SUITE');
  console.log('================================================================');

  // Test under Scenario A (Cascading Oracle Compromise)
  console.log('\n[Ablation Progression: Scenario A]');
  await resetSimulation();
  await fetch(`${BASE_URL}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: 'SCENARIO_A' })
  });
  for (let i = 0; i < 3; i++) {
    await fetch(`${BASE_URL}/api/simulation/step`, { method: 'POST' });
  }

  // Tier B0 / B1: Naive (No topology or propagation)
  await setAblationTier('B0');
  const asmB0 = await getAssessment();
  console.log(`  Tier B0 (Raw Monitoring):         Margin ${asmB0.control_margin_percent}% | Dep: ${asmB0.contributions.delta_dependency_concentration} | Prop: ${asmB0.contributions.delta_propagation_depth}`);
  if (asmB0.control_margin_percent !== 91 || asmB0.contributions.delta_dependency_concentration !== 0 || asmB0.contributions.delta_propagation_depth !== 0) {
    throw new Error(`FAIL: Tier B0 should ignore topology! Got margin ${asmB0.control_margin_percent}%`);
  }
  console.log('  ✓ Tier B0 verified: Naive baseline blind to systemic topology (Margin remains 91%).');

  // Tier B2: Dependency-Aware (1-hop dependencies only)
  await setAblationTier('B2');
  const asmB2 = await getAssessment();
  console.log(`  Tier B2 (Dependency-Aware):       Margin ${asmB2.control_margin_percent}% | Dep: ${asmB2.contributions.delta_dependency_concentration} | Prop: ${asmB2.contributions.delta_propagation_depth}`);
  if (asmB2.contributions.delta_dependency_concentration === 0 || asmB2.contributions.delta_propagation_depth !== 0) {
    throw new Error(`FAIL: Tier B2 should detect dependencies but NOT multi-hop propagation!`);
  }
  if (asmB2.control_margin_percent !== 59) {
    throw new Error(`FAIL: Tier B2 margin expected 59%, got ${asmB2.control_margin_percent}%`);
  }
  console.log('  ✓ Tier B2 verified: Discovers 1-hop dependency concentration (-32 pts, Margin 59%), misses multi-hop cascade.');

  // Tier B3: Propagation-Aware (Multi-hop cascade included)
  await setAblationTier('B3');
  const asmB3 = await getAssessment();
  console.log(`  Tier B3 (Propagation-Aware):      Margin ${asmB3.control_margin_percent}% | Dep: ${asmB3.contributions.delta_dependency_concentration} | Prop: ${asmB3.contributions.delta_propagation_depth}`);
  if (asmB3.contributions.delta_propagation_depth === 0) {
    throw new Error(`FAIL: Tier B3 should detect multi-hop propagation!`);
  }
  if (asmB3.control_margin_percent !== 34) {
    throw new Error(`FAIL: Tier B3 margin expected 34%, got ${asmB3.control_margin_percent}%`);
  }
  console.log('  ✓ Tier B3 verified: Discovers multi-hop cascade depth (-25 pts, Margin 34%).');

  // Test Tier B5: Epistemic Uncertainty Gating under Scenario C
  console.log('\n[Ablation Gating: Scenario C (Residual Contagion)]');
  await resetSimulation();
  await fetch(`${BASE_URL}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: 'SCENARIO_C' })
  });
  for (let i = 0; i < 4; i++) {
    await fetch(`${BASE_URL}/api/simulation/step`, { method: 'POST' });
  }

  // Under B4 (No uncertainty gating)
  await setAblationTier('B4');
  const asmB4 = await getAssessment();
  console.log(`  Tier B4 (Uncertainty Disabled):   State [${asmB4.controllability_state}]`);
  if (asmB4.controllability_state === 'CONTROL_UNVERIFIED') {
    throw new Error(`FAIL: Tier B4 has uncertainty gating disabled, should NOT be CONTROL_UNVERIFIED!`);
  }

  // Under B5 (Full Systemic Controllability with uncertainty gating)
  await setAblationTier('B5');
  const asmB5 = await getAssessment();
  console.log(`  Tier B5 (Full Model with Gating): State [${asmB5.controllability_state}]`);
  if (asmB5.controllability_state !== 'CONTROL_UNVERIFIED') {
    throw new Error(`FAIL: Tier B5 must gate state to CONTROL_UNVERIFIED when residual risk is present!`);
  }
  console.log('  ✓ Tier B5 verified: Epistemic uncertainty gating strictly prevents false declarations of control restored.');

  console.log('\n================================================================');
  console.log('ALL ABLATION & INCREMENTAL GAIN TESTS PASSED (4/4)');
  console.log('================================================================');
  process.exitCode = 0;
}

testAblations().catch(err => {
  console.error('\n❌ ABLATION TEST SUITE FAILED:', err.message);
  process.exitCode = 1;
});
