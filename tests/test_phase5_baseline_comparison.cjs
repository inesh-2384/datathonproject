/**
 * PHASE 5 ACCEPTANCE SUITE 1: BASELINE COMPARISON BENCHMARK (B0 - B5)
 * Requirements: Sections 6, 7, 20, 21
 * 
 * Evaluates the evaluation hierarchy:
 * - B0: No Control / No intelligence
 * - B1: Simple Risk Threshold
 * - B2: Dependency-Aware Monitoring
 * - B3: Propagation-Aware Monitoring
 * - B4: FIS without Collective Decision Intelligence
 * - B5: Full FIS (Controllability + CDI + Governed Execution + Verification)
 */

const http = require('http');

function post(path, body = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body || {});
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, body: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001${path}`, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, body: buf });
        }
      });
    }).on('error', reject);
  });
}

async function runBaselineComparisonTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 1: BASELINE COMPARISON BENCHMARK (B0 - B5)');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(desc, condition) {
    total++;
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
    }
  }

  // 1. Reset system to clean equilibrium
  await post('/api/simulation/reset', { seed: 42091 });
  const initialState = await get('/api/state');
  const initialMargin = initialState.body.data.controlState.control_margin_percent;
  assert('System initial state is STABLE with Control Margin >= 90%', initialMargin >= 90);

  // 2. Query baseline ablation configs
  const ablationRes = await get('/api/intelligence/ablation');
  assert('Ablation API returns valid configuration object', ablationRes.status === 200 && ablationRes.body.config);

  // 3. Inject Hero Scenario (SCENARIO_A: DATA-X Common Data Dependency Failure)
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/simulation/step');
  await post('/api/simulation/step');

  // 4. Test B0 (No Control / No Intelligence)
  const setB0 = await post('/api/intelligence/ablation', { tier: 'B0' });
  assert('B0 Tier activated: all intelligence layers disabled', 
    setB0.status === 200 && 
    !setB0.body.config.enable_dependency_intelligence && 
    !setB0.body.config.enable_propagation_intelligence &&
    !setB0.body.config.enable_collective_decision_signal);

  // B0 does not compute control margin or intervention windows (margin remains pinned or defaults to 100)
  const b0Assessment = setB0.body.assessment;
  assert('B0 does not provide early degradation detection', b0Assessment.control_margin_percent >= 80);

  // 5. Test B1 (Simple Risk Threshold)
  const setB1 = await post('/api/intelligence/ablation', { tier: 'B1' });
  assert('B1 Tier activated: dependency and propagation disabled', 
    setB1.status === 200 && !setB1.body.config.enable_dependency_intelligence);

  // 6. Test B2 (Dependency-Aware Monitoring)
  const setB2 = await post('/api/intelligence/ablation', { tier: 'B2' });
  assert('B2 Tier activated: dependency intelligence enabled, propagation disabled',
    setB2.status === 200 && 
    setB2.body.config.enable_dependency_intelligence && 
    !setB2.body.config.enable_propagation_intelligence);

  // 7. Test B3 (Propagation-Aware Monitoring)
  const setB3 = await post('/api/intelligence/ablation', { tier: 'B3' });
  assert('B3 Tier activated: dependency + propagation intelligence enabled',
    setB3.status === 200 && 
    setB3.body.config.enable_dependency_intelligence && 
    setB3.body.config.enable_propagation_intelligence &&
    !setB3.body.config.enable_collective_decision_signal);

  // 8. Test B4 (FIS without Collective Decision Intelligence)
  const setB4 = await post('/api/intelligence/ablation', { tier: 'B4' });
  assert('B4 Tier activated: collective decision signal enabled without full uncertainty gating',
    setB4.status === 200 && setB4.body.config.enable_collective_decision_signal);

  // 9. Test B5 (Full FIS with Uncertainty Gating & Full Control Controllability)
  const setB5 = await post('/api/intelligence/ablation', { tier: 'B5' });
  assert('B5 Tier activated: full controllability model with uncertainty gating active',
    setB5.status === 200 && setB5.body.config.enable_uncertainty_gating);

  const fullAssessment = setB5.body.assessment;
  assert('B5 accurately detects control degradation under DATA-X compromise', 
    fullAssessment.control_margin_percent <= 50);
  assert('B5 estimates intervention window contraction (< 60s)', 
    fullAssessment.intervention_window.estimated_window_seconds <= 60);

  // 10. Quantitative Comparison & Falsification Delta Reporting
  // Compare B1 vs B5 on detection sensitivity
  const b1Margin = setB1.body.assessment.control_margin_percent;
  const b5Margin = setB5.body.assessment.control_margin_percent;
  const leadMarginDelta = b1Margin - b5Margin;
  assert('B5 provides quantitative control sensitivity lead over simple baseline B1 (delta >= 15 pts)', 
    leadMarginDelta >= 15);
  console.log(`[METRIC] Lead Margin Delta (B1 - B5): ${leadMarginDelta} pts`);
  console.log(`[METRIC] B5 Intervention Window: ${fullAssessment.intervention_window.estimated_window_seconds}s (Trend: ${fullAssessment.intervention_window.trend})`);

  // Reset tier to B5 for subsequent tests
  await post('/api/intelligence/ablation', { tier: 'B5' });

  console.log(`\n================================================================`);
  console.log(`  BASELINE COMPARISON SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runBaselineComparisonTests().catch(err => {
  console.error('[FATAL ERROR IN BASELINE COMPARISON SUITE]:', err);
  process.exit(1);
});
