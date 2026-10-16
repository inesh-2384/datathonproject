/**
 * PHASE 3.1 TEST SUITE: Determinism & Exact Reproducibility
 * Proves that identical simulation runs generate bitwise identical
 * state metrics, causal hashes, and intelligence assessments.
 */

const crypto = require('crypto');
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

async function getStateSnapshot() {
  const [stateRes, asmRes] = await Promise.all([
    fetch(`${BASE_URL}/api/state`),
    fetch(`${BASE_URL}/api/intelligence/assessment`)
  ]);

  const stateJson = await stateRes.json();
  const asmJson = await asmRes.json();

  // Extract core deterministic state fields (excluding dynamic wall-clock timestamps)
  const canonical = {
    institutions: stateJson.data.institutions.map(i => ({ id: i.institution_id, status: i.status, lcr: i.liquidity_coverage_ratio })),
    dependencies: stateJson.data.dependencies.map(d => ({ id: d.dependency_id, status: d.status, weight: d.exposure_weight })),
    providers: stateJson.data.dataProviders.map(p => ({ id: p.provider_id, status: p.status })),
    infrastructure: stateJson.data.infrastructureNodes.map(n => ({ id: n.node_id, status: n.status, load: n.current_load_percent })),
    control_margin: asmJson.assessment.control_margin_percent,
    controllability_state: asmJson.assessment.controllability_state,
    contributions: asmJson.assessment.contributions,
    edd: asmJson.assessment.collective_decision_signal.effective_decision_diversity,
    cascade_depth: asmJson.assessment.propagation_intelligence.maximum_depth_hops,
    affected_nodes: asmJson.assessment.propagation_intelligence.breadth_affected_nodes
  };

  const hash = crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  return { canonical, hash };
}

async function testDeterminism() {
  console.log('================================================================');
  console.log('PHASE 3.1: DETERMINISM & REPRODUCIBILITY TEST SUITE (3 TRIALS)');
  console.log('================================================================');

  const scenario = 'SCENARIO_A';
  const hashes = [];

  for (let trial = 1; trial <= 3; trial++) {
    console.log(`\nExecuting Trial ${trial}/3: Reset -> Scenario A -> Step 3 ticks...`);
    await resetSimulation();
    await startScenario(scenario);
    await advanceTicks(3);

    const { canonical, hash } = await getStateSnapshot();
    hashes.push(hash);
    console.log(`  Trial ${trial} SHA-256 State Hash: ${hash}`);
    console.log(`  Trial ${trial} Margin: ${canonical.control_margin}% | State: ${canonical.controllability_state} | EDD: ${canonical.edd} | Cascade Depth: ${canonical.cascade_depth}`);
  }

  if (hashes[0] !== hashes[1] || hashes[1] !== hashes[2]) {
    throw new Error(`FAIL: Determinism violation! Hashes differed between trials:\n  Trial 1: ${hashes[0]}\n  Trial 2: ${hashes[1]}\n  Trial 3: ${hashes[2]}`);
  }

  console.log(`\n  ✓ Strict Determinism Verified: All 3 independent runs produced bitwise identical hash (${hashes[0]}).`);

  // Repeat for Scenario C (Uncertainty Gating Determinism)
  console.log(`\nExecuting Scenario C Determinism Audit (3 Trials)...`);
  const hashesC = [];
  for (let trial = 1; trial <= 3; trial++) {
    await resetSimulation();
    await startScenario('SCENARIO_C');
    await advanceTicks(4);
    const { canonical, hash } = await getStateSnapshot();
    hashesC.push(hash);
  }

  if (hashesC[0] !== hashesC[1] || hashesC[1] !== hashesC[2]) {
    throw new Error(`FAIL: Scenario C Determinism violation!`);
  }
  console.log(`  ✓ Scenario C Determinism Verified: Bitwise identical hash (${hashesC[0]}).`);

  console.log('\n================================================================');
  console.log('ALL DETERMINISM & REPRODUCIBILITY TESTS PASSED (6/6 TRIALS)');
  console.log('================================================================');
  process.exitCode = 0;
}

testDeterminism().catch(err => {
  console.error('\n❌ DETERMINISM TEST SUITE FAILED:', err.message);
  process.exitCode = 1;
});
