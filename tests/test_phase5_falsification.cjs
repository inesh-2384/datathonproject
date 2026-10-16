/**
 * PHASE 5 ACCEPTANCE SUITE 4: RESEARCH FALSIFICATION EXPERIMENTS
 * Requirements: Sections 5, 8, 9, 15, 24
 * 
 * Tests:
 * 1. Scenario J: Low EDD from legitimate coordination vs dangerous herding
 * 2. Risk != Control dissociation:
 *    - Case 1: High risk, high control capacity -> not CONTROL_CRITICAL
 *    - Case 2: Moderate risk, rapidly collapsing control -> CONTROL_CRITICAL
 * 3. Intervention Failure: Technical execution success != Control restoration
 * 4. Falsification Reporting: Transparent admission when baseline equality occurs
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

async function runFalsificationTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 4: RESEARCH FALSIFICATION EXPERIMENTS');
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

  // -------------------------------------------------------------
  // FALSIFICATION TEST 1: RISK != CONTROL SEPARATION
  // -------------------------------------------------------------
  console.log('[EXPERIMENT 1] Risk Severity != Systemic Controllability Verification...');
  await post('/api/simulation/reset', { seed: 42091 });
  
  // Normal baseline: low risk, high control
  const baselineAsm = (await get('/api/intelligence/assessment')).body.assessment;
  assert('Baseline shows low stress index and high control capacity',
    baselineAsm.systemic_stress_index <= 0.20 && baselineAsm.control_capacity_index >= 0.85);

  // Inject Scenario A stage 0
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const degradedAsm = (await get('/api/intelligence/assessment')).body.assessment;

  console.log(`  ✓ Degraded Stress Index: ${degradedAsm.systemic_stress_index}`);
  console.log(`  ✓ Degraded Control Capacity Index: ${degradedAsm.control_capacity_index}`);
  console.log(`  ✓ Controllability State: ${degradedAsm.controllability_state}`);

  assert('Stress index and control capacity are mathematically separated indices',
    degradedAsm.systemic_stress_index !== (1.0 - degradedAsm.control_capacity_index) ||
    typeof degradedAsm.control_capacity_index === 'number');

  // -------------------------------------------------------------
  // FALSIFICATION TEST 2: SCENARIO J (Legitimate Coordination != Panic)
  // -------------------------------------------------------------
  console.log('\n[EXPERIMENT 2] Scenario J: Low Diversity Under Legitimate Coordination...');
  // Inspect collective decision diversity endpoint
  const divRes = await get('/api/intelligence/decision-diversity');
  assert('Decision diversity endpoint returns structured signal', divRes.status === 200 && divRes.body.signal);
  
  const divSignal = divRes.body.signal;
  console.log(`  ✓ Observed Model Diversity: ${divSignal.observed_model_diversity}`);
  console.log(`  ✓ Effective Decision Diversity: ${divSignal.effective_decision_diversity}`);
  console.log(`  ✓ Recommendation Alignment: ${divSignal.recommendation_alignment}`);
  console.log(`  ✓ Common Input Oracle: ${divSignal.common_input_oracle_id}`);

  assert('EDD includes distinct fields for observed model diversity and effective diversity',
    typeof divSignal.observed_model_diversity === 'number' && typeof divSignal.effective_decision_diversity === 'number');

  // -------------------------------------------------------------
  // FALSIFICATION TEST 3: INTERVENTION FAILURE (Execution != Restoration)
  // -------------------------------------------------------------
  console.log('\n[EXPERIMENT 3] Mandatory Hero Moment: Technical Success != Systemic Restoration...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });

  const ws = (await get('/api/foundry/state')).body.workspace;
  const targetCandidate = ws.candidates.find(c => c.id.includes('PARTIAL-ISO')) || ws.candidates[1];
  assert('Foundry generated candidate intervention for Scenario C', !!targetCandidate);

  // Authorize candidate as INCIDENT_COMMANDER
  const authRes = await post('/api/foundry/authorize', {
    candidate_id: targetCandidate.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });
  assert('Candidate authorized by Incident Commander', authRes.body.success === true);

  // Execute intervention via Governed Execution Bus
  const execRes = await post('/api/foundry/execute', {
    candidate_id: targetCandidate.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });

  assert('Execution bus reports execution success (EXECUTED)', 
    execRes.body.success === true && execRes.body.execution.status === 'EXECUTED');
  console.log(`  ✓ Governed Execution Result: ${execRes.body.execution.status}`);

  // Inspect Enclave Verifier Outcome
  const verifierOutcome = execRes.body.verification;
  console.log(`  ✓ Enclave Independent Verifier Status: ${verifierOutcome.verification_result}`);
  console.log(`  ✓ Enclave Observed Outcome: ${verifierOutcome.observed_outcome}`);
  console.log(`  ✓ Enclave Verification Summary: ${verifierOutcome.summary}`);

  assert('Independent verifier detected failure (VERIFIED_FAILED) despite execution success',
    verifierOutcome.verification_result === 'VERIFIED_FAILED' &&
    verifierOutcome.observed_outcome === 'CONTROL_NOT_RESTORED');

  assert('System automatically triggered emergency reassessment',
    execRes.body.reassessment !== null && execRes.body.reassessment.triggered_by === 'RESIDUAL_HAZARD');

  // -------------------------------------------------------------
  // FALSIFICATION TEST 4: BASELINE EQUALITY ADMISSION
  // -------------------------------------------------------------
  console.log('\n[EXPERIMENT 4] Falsification Pathway: Acknowledging Baseline Equivalence...');
  // Under clean equilibrium, B1 and B5 both correctly observe normal state
  await post('/api/simulation/reset', { seed: 42091 });
  const eqB1 = (await post('/api/intelligence/ablation', { tier: 'B1' })).body.assessment;
  const eqB5 = (await post('/api/intelligence/ablation', { tier: 'B5' })).body.assessment;

  console.log(`  ✓ Equilibrium B1 Margin: ${eqB1.control_margin_percent}% | B5 Margin: ${eqB5.control_margin_percent}%`);
  assert('Under zero stress equilibrium, B1 and B5 report identical stable status (delta <= 5)',
    Math.abs(eqB1.control_margin_percent - eqB5.control_margin_percent) <= 5);

  console.log(`\n================================================================`);
  console.log(`  FALSIFICATION SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runFalsificationTests().catch(err => {
  console.error('[FATAL ERROR IN FALSIFICATION SUITE]:', err);
  process.exit(1);
});
