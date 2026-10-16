/**
 * PHASE 3.1 TEST SUITE: Causal Monotonicity Sweeps
 * Tests properties A through G:
 * Holding all other variables constant, monotonic stress increases must
 * yield monotonic control margin degradation (or recovery improvement).
 */

const BASE_URL = 'http://localhost:3001';

async function resetSimulation() {
  const res = await fetch(`${BASE_URL}/api/simulation/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
  return res.json();
}

async function getAssessment() {
  const res = await fetch(`${BASE_URL}/api/intelligence/assessment`);
  if (!res.ok) throw new Error(`Get assessment failed: ${res.statusText}`);
  const json = await res.json();
  return json.assessment;
}

async function testMonotonicity() {
  console.log('================================================================');
  console.log('PHASE 3.1: CAUSAL MONOTONICITY SWEEPS TEST SUITE');
  console.log('================================================================');

  await resetSimulation();

  // Test 1: Monotonic Cascade Progression across ticks
  console.log('\n[Sweep 1] Multi-Hop Cascade Temporal Propagation (Scenario A)');
  await fetch(`${BASE_URL}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: 'SCENARIO_A' })
  });

  const margins = [];
  // Tick 0 (initial injection)
  let asm = await getAssessment();
  margins.push({ tick: 0, margin: asm.control_margin_percent, depth: asm.propagation_intelligence.maximum_depth_hops });

  // Ticks 1 to 3 (cascading propagation)
  for (let t = 1; t <= 3; t++) {
    await fetch(`${BASE_URL}/api/simulation/step`, { method: 'POST' });
    asm = await getAssessment();
    margins.push({ tick: t, margin: asm.control_margin_percent, depth: asm.propagation_intelligence.maximum_depth_hops });
  }

  console.log('Observed temporal cascade trajectory:');
  for (let i = 0; i < margins.length; i++) {
    console.log(`  Tick ${margins[i].tick}: Depth ${margins[i].depth} hops -> Margin ${margins[i].margin}%`);
    if (i > 0) {
      if (margins[i].margin > margins[i - 1].margin) {
        throw new Error(`FAIL: Temporal cascade monotonicity violated! Tick ${i} margin ${margins[i].margin}% > Tick ${i - 1} margin ${margins[i - 1].margin}%`);
      }
      if (margins[i].depth < margins[i - 1].depth) {
        throw new Error(`FAIL: Cascade depth non-monotonic! Tick ${i} depth ${margins[i].depth} < Tick ${i - 1} depth ${margins[i - 1].depth}`);
      }
    }
  }
  console.log('  ✓ Sweep 1 Passed: M(t) is strictly monotonically non-increasing as cascade propagates.');

  // Test 2: Parametric Derivative Monotonicity Sweep via /api/intelligence/sensitivity
  console.log('\n[Sweep 2] Parametric Derivatives & Elasticity Monotonicity');
  const sensRes = await fetch(`${BASE_URL}/api/intelligence/sensitivity`, { method: 'POST' });
  const sens = await sensRes.json();

  console.log(`Base Margin under Scenario A: ${sens.base_margin}%`);
  console.log(`Evaluated ${sens.parameters_evaluated.length} causal parameters with ${sens.sensitivity_sweeps.length} perturbation sweeps:`);

  for (const sweep of sens.sensitivity_sweeps) {
    console.log(`  Param: ${sweep.parameter.padEnd(28)} | Var: ${sweep.variation_pct > 0 ? '+' : ''}${sweep.variation_pct}% | Perturbed: ${sweep.perturbed_value.toString().padEnd(5)} | Sim Margin: ${sweep.simulated_margin}% | Delta: ${sweep.delta_margin > 0 ? '+' : ''}${sweep.delta_margin} pts | Elasticity: ${sweep.elasticity}`);

    // Directional Monotonicity Invariants:
    // When penalty weights increase (+20%), simulated margin must NOT increase (delta_margin <= 0)
    // When recovery weight increases (+20%), simulated margin must NOT decrease (delta_margin >= 0)
    if (sweep.parameter !== 'recovery_rate_weight') {
      if (sweep.variation_pct > 0 && sweep.delta_margin > 0) {
        throw new Error(`FAIL: Penalty weight increase caused margin increase for ${sweep.parameter}!`);
      }
      if (sweep.variation_pct < 0 && sweep.delta_margin < 0) {
        throw new Error(`FAIL: Penalty weight decrease caused margin decrease for ${sweep.parameter}!`);
      }
    } else {
      if (sweep.variation_pct > 0 && sweep.delta_margin < 0) {
        throw new Error(`FAIL: Recovery weight increase caused margin decrease!`);
      }
    }
  }
  console.log(`  ✓ Sweep 2 Passed: All model derivatives satisfy strict directional monotonicity.`);
  console.log(`  Most Sensitive Parameter Dynamically Identified: [${sens.most_sensitive_parameter}] (Max Elasticity: ${sens.max_elasticity})`);

  // Test 3: Infrastructure Shock Progression Monotonicity (Scenario B)
  console.log('\n[Sweep 3] Infrastructure Gridlock Progression (Scenario B)');
  await resetSimulation();
  await fetch(`${BASE_URL}/api/simulation/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: 'SCENARIO_B' })
  });

  const infraTrajectory = [];
  asm = await getAssessment();
  infraTrajectory.push({ tick: 0, margin: asm.control_margin_percent, infraDelta: asm.contributions.delta_infrastructure_stress });

  for (let t = 1; t <= 3; t++) {
    await fetch(`${BASE_URL}/api/simulation/step`, { method: 'POST' });
    asm = await getAssessment();
    infraTrajectory.push({ tick: t, margin: asm.control_margin_percent, infraDelta: asm.contributions.delta_infrastructure_stress });
  }

  for (let i = 0; i < infraTrajectory.length; i++) {
    console.log(`  Tick ${infraTrajectory[i].tick}: Delta Infra ${infraTrajectory[i].infraDelta} pts -> Margin ${infraTrajectory[i].margin}%`);
    if (i > 0) {
      if (infraTrajectory[i].margin > infraTrajectory[i - 1].margin) {
        throw new Error(`FAIL: Infra gridlock margin non-monotonic at tick ${i}!`);
      }
    }
  }
  console.log('  ✓ Sweep 3 Passed: Infrastructure shock trajectory is strictly non-increasing.');

  console.log('\n================================================================');
  console.log('ALL MONOTONICITY & CAUSAL DIRECTIONALITY TESTS PASSED (3/3)');
  console.log('================================================================');
  process.exitCode = 0;
}

testMonotonicity().catch(err => {
  console.error('\n❌ MONOTONICITY TEST SUITE FAILED:', err.message);
  process.exit(1);
});
