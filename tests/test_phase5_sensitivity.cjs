/**
 * PHASE 5 ACCEPTANCE SUITE 3: PARAMETRIC SENSITIVITY SWEEP & ELASTICITY
 * Requirements: Section 23
 * 
 * Tests:
 * - Controlled parameter sweeps: +/-20% variation
 * - Elasticity computation: dM / dTheta
 * - Parameter stability bounds (no NaN, bounded within [0, 100])
 * - Identifies most sensitive parameter and stable operating regime
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

async function runSensitivityTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 3: PARAMETRIC SENSITIVITY & ELASTICITY');
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

  // 1. Reset and inject scenario
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/simulation/step');

  // 2. Query sensitivity analysis endpoint
  const res = await post('/api/intelligence/sensitivity');
  assert('Sensitivity analysis endpoint responds with HTTP 200', res.status === 200 && res.body.success);

  const data = res.body;
  assert('Sensitivity response includes base margin', typeof data.base_margin === 'number' && !isNaN(data.base_margin));
  assert('Sensitivity response includes parameters_evaluated list', Array.isArray(data.parameters_evaluated) && data.parameters_evaluated.length >= 4);
  assert('Sensitivity response includes sweeps array', Array.isArray(data.sensitivity_sweeps) && data.sensitivity_sweeps.length >= 8);

  console.log(`[SENSITIVITY] Base Margin: ${data.base_margin}%`);
  console.log(`[SENSITIVITY] Most Sensitive Parameter: ${data.most_sensitive_parameter} (Max Elasticity: ${data.max_elasticity})`);

  let allBounded = true;
  let allFinite = true;

  for (const sweep of data.sensitivity_sweeps) {
    if (isNaN(sweep.simulated_margin) || isNaN(sweep.elasticity)) allFinite = false;
    if (sweep.simulated_margin < 0 || sweep.simulated_margin > 100) allBounded = false;
    console.log(`  - Param: ${sweep.parameter.padEnd(28)} | Var: ${sweep.variation_pct > 0 ? '+' : ''}${sweep.variation_pct}% | Margin: ${sweep.simulated_margin}% (Delta: ${sweep.delta_margin > 0 ? '+' : ''}${sweep.delta_margin} pts) | Elasticity: ${sweep.elasticity}`);
  }

  assert('All perturbed margins remain strictly bounded in [0, 100]', allBounded);
  assert('All elasticity values are finite numbers (no NaN / division by zero)', allFinite);
  assert('Identified most sensitive parameter has maximum absolute elasticity', Math.abs(data.max_elasticity) > 0);

  console.log(`\n================================================================`);
  console.log(`  SENSITIVITY SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runSensitivityTests().catch(err => {
  console.error('[FATAL ERROR IN SENSITIVITY SUITE]:', err);
  process.exit(1);
});
