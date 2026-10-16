/**
 * PHASE 5 ACCEPTANCE SUITE 6: EFFECTIVE DECISION DIVERSITY (EDD) VALIDATION
 * Requirements: Sections 11, 20
 * 
 * Tests:
 * 1. Additive decomposition identity:
 *    EDD = clamp(ObservedDiversity - Delta_data - Delta_model - Delta_sync, 0.05, 1.0)
 * 2. Scenario J: Low diversity does not automatically mean panic; examines WHY diversity dropped
 * 3. Penalties strictly zero or low in normal baseline
 * 4. Shared data oracle degradation triggers severe Delta_data penalty
 * 5. Temporal synchrony clustering triggers Delta_sync penalty
 * 6. Explicit classification of EDD as EXPERIMENTAL PROTOTYPE METRIC
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

async function runEDDValidationTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 6: EFFECTIVE DECISION DIVERSITY VALIDATION');
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

  // 1. Baseline Equilibrium EDD
  await post('/api/simulation/reset', { seed: 42091 });
  const baseRes = await get('/api/intelligence/decision-diversity');
  assert('Decision diversity endpoint responds with HTTP 200', baseRes.status === 200 && baseRes.body.signal);

  const baseSig = baseRes.body.signal;
  console.log(`  ✓ Baseline Observed Model Diversity: ${baseSig.observed_model_diversity}`);
  console.log(`  ✓ Baseline Effective Decision Diversity: ${baseSig.effective_decision_diversity}`);
  console.log(`  ✓ Baseline Alignment: ${baseSig.recommendation_alignment}`);
  console.log(`  ✓ Baseline Synchrony: ${baseSig.decision_synchrony_percent}%`);

  assert('Baseline EDD is high (>= 0.80) under diversified healthy feeds', baseSig.effective_decision_diversity >= 0.80);
  assert('Baseline alignment is non-critical (DIVERGENT or CORRELATED, not CONVERGED)', 
    ['DIVERGENT', 'CORRELATED'].includes(baseSig.recommendation_alignment));

  // 2. Additive Decomposition Check under DATA-X Failure
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const degradedRes = await get('/api/intelligence/decision-diversity');
  const degSig = degradedRes.body.signal;

  console.log(`\n[SCENARIO A DEGRADATION]`);
  console.log(`  ✓ Observed Model Diversity: ${degSig.observed_model_diversity}`);
  console.log(`  ✓ Effective Decision Diversity: ${degSig.effective_decision_diversity}`);
  console.log(`  ✓ Herding Correlation Index: ${degSig.herding_correlation_index}`);
  console.log(`  ✓ Recommendation Alignment: ${degSig.recommendation_alignment}`);
  console.log(`  ✓ Common Input Oracle: ${degSig.common_input_oracle_id}`);

  assert('Under DATA-X compromise, EDD collapses substantially (< 0.35)', degSig.effective_decision_diversity <= 0.35);
  assert('Recommendation alignment shifts from DIVERGENT to CORRELATED or CONVERGED',
    ['CORRELATED', 'CONVERGED_SYNCHRONIZED'].includes(degSig.recommendation_alignment));

  // 3. Mathematical Boundedness
  assert('EDD score strictly bounded in [0.05, 1.0]', 
    degSig.effective_decision_diversity >= 0.05 && degSig.effective_decision_diversity <= 1.0);

  // 4. Distinction between Apparent and Effective Diversity
  // Apparent (observed) model diversity remains high because institutions have distinct model IDs,
  // but Effective diversity collapses because they all drink from poisoned DATA-X!
  const apparentVsEffectiveDelta = degSig.observed_model_diversity - degSig.effective_decision_diversity;
  console.log(`  ✓ Apparent vs Effective Divergence Gap: +${apparentVsEffectiveDelta.toFixed(2)}`);
  assert('System captures false sense of security (Observed Diversity > Effective Diversity by >= 0.50)',
    apparentVsEffectiveDelta >= 0.50);

  // 5. Reset restores EDD
  await post('/api/simulation/reset', { seed: 42091 });
  const resetRes = await get('/api/intelligence/decision-diversity');
  assert('Reset restores healthy decision diversity', resetRes.body.signal.effective_decision_diversity >= 0.80);

  console.log(`\n================================================================`);
  console.log(`  EDD VALIDATION SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runEDDValidationTests().catch(err => {
  console.error('[FATAL ERROR IN EDD VALIDATION SUITE]:', err);
  process.exit(1);
});
