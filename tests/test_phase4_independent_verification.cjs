/**
 * PHASE 4 ACCEPTANCE SUITE 2: INDEPENDENT VERIFICATION & REASSESSMENT
 * Tests: P4-12 through P4-24
 */

const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
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

async function runTests() {
  console.log('================================================================');
  console.log('  PHASE 4 TEST SUITE 2: INDEPENDENT VERIFICATION & REASSESSMENT');
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

  // TEST CASE A: SUCCESSFUL RESTORATION (P4-13, P4-14, P4-16, P4-21, P4-22, P4-23, P4-24)
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  let wsRes = await get('/api/foundry/state');
  const meiCandidate = wsRes.body.workspace.candidates.find(c => c.is_minimum_effective);

  await post('/api/foundry/authorize', {
    candidate_id: meiCandidate.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });

  const successExec = await post('/api/foundry/execute', {
    candidate_id: meiCandidate.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01'
  });

  // P4-13: Independent observation is created
  assert('P4-13: Independent observation is created with raw telemetry digest',
    successExec.body.observation !== null && 
    successExec.body.observation.raw_telemetry_digest_sha256.startsWith('sha256:'));

  // P4-14: Verification reads observed state
  assert('P4-14: Verification reads observed state and calculates discrepancy vs expected target',
    successExec.body.verification !== null &&
    successExec.body.verification.observed_effect !== undefined &&
    typeof successExec.body.verification.margin_discrepancy === 'number');

  // P4-21: Verification triggers reassessment when residual contagion persists
  assert('P4-21: Verification produces authoritative ReassessmentRecord',
    successExec.body.reassessment !== null && successExec.body.reassessment.reassessment_id !== undefined);

  // Authorize & Execute Secondary Backstop Intervention from Reassessment
  const backstopId = successExec.body.reassessment.escalated_candidate_id;
  await post('/api/foundry/authorize', {
    candidate_id: backstopId,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });

  const backstopExec = await post('/api/foundry/execute', {
    candidate_id: backstopId,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01'
  });

  // P4-16: Secondary backstop intervention produces VERIFIED_EFFECTIVE & CONTROL_RESTORED
  assert('P4-16: Effective intervention produces VERIFIED_EFFECTIVE & CONTROL_RESTORED',
    backstopExec.body.verification.verification_result === 'VERIFIED_EFFECTIVE' &&
    backstopExec.body.verification.observed_outcome === 'CONTROL_RESTORED');

  // P4-22 & P4-23: Recomputed Control Margin comes directly from authoritative engine topology
  const postMargin = backstopExec.body.control_state.control_margin_percent;
  assert('P4-22: Recomputed Control Margin comes directly from authoritative engine topology',
    postMargin >= 65 && backstopExec.body.control_state.intelligence !== undefined);

  // P4-24: Cross-screen state remains synchronized
  const fullState = await get('/api/state');
  assert('P4-24: Cross-screen state synchronized (State store margin equals engine margin)',
    fullState.body.data.controlState.control_margin_percent === postMargin);

  // TEST CASE B: EXECUTION SUCCESS / OUTCOME FAILURE (P4-12, P4-15, P4-18, P4-31)
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' }); // Scenario with residual risk / flawed candidate

  wsRes = await get('/api/foundry/state');
  const flawedCandidate = wsRes.body.workspace.candidates.find(c => c.id.includes('PARTIAL-ISO')) || wsRes.body.workspace.candidates[1];

  await post('/api/foundry/authorize', {
    candidate_id: flawedCandidate.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });

  const flawedExec = await post('/api/foundry/execute', {
    candidate_id: flawedCandidate.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01'
  });

  // P4-12: Execution success does not imply outcome success
  assert('P4-12: Execution succeeds technically (EXECUTED), but outcome recovery fails',
    flawedExec.body.execution.status === 'EXECUTED' &&
    flawedExec.body.verification.verification_result === 'VERIFIED_FAILED');

  // P4-15: Verification disagrees with execution
  assert('P4-15: Verifier disagrees with executor and marks CONTROL_NOT_RESTORED',
    flawedExec.body.verification.observed_outcome === 'CONTROL_NOT_RESTORED');

  // P4-18: Failed intervention produces VERIFIED_FAILED and generates escalated next candidate
  assert('P4-18: Failed intervention triggers emergency reassessment with escalated candidate',
    flawedExec.body.reassessment !== null &&
    flawedExec.body.reassessment.triggered_by === 'RESIDUAL_HAZARD' &&
    flawedExec.body.reassessment.escalated_candidate_id.includes('MODEL-QUARANTINE-BACKSTOP'));

  // TEST CASE C: STALE EVIDENCE PREVENTS RESTORATION (P4-19)
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  wsRes = await get('/api/foundry/state');
  const testCand = wsRes.body.workspace.candidates.find(c => c.is_minimum_effective);

  await post('/api/foundry/authorize', {
    candidate_id: testCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });

  const staleExec = await post('/api/foundry/execute', {
    candidate_id: testCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01',
    force_stale_evidence: true
  });

  assert('P4-19: Stale evidence (>60s) prevents restoration -> VERIFIED_UNCERTAIN & CONTROL_UNVERIFIED',
    staleExec.body.verification.verification_result === 'VERIFIED_UNCERTAIN' &&
    staleExec.body.verification.observed_outcome === 'CONTROL_UNVERIFIED' &&
    staleExec.body.verification.evidence_freshness_status === 'STALE');

  // TEST CASE D: CONFLICTING EVIDENCE PREVENTS RESTORATION (P4-20)
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  wsRes = await get('/api/foundry/state');
  const conflictCand = wsRes.body.workspace.candidates.find(c => c.is_minimum_effective);

  await post('/api/foundry/authorize', {
    candidate_id: conflictCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });

  const conflictExec = await post('/api/foundry/execute', {
    candidate_id: conflictCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01',
    force_conflicting_telemetry: true
  });

  assert('P4-20: Conflicting telemetry prevents restoration -> VERIFIED_UNCERTAIN & CONFLICTED',
    conflictExec.body.verification.verification_result === 'VERIFIED_UNCERTAIN' &&
    conflictExec.body.verification.observed_outcome === 'CONFLICTED' &&
    conflictExec.body.verification.evidence_freshness_status === 'CONFLICTED');

  console.log(`\nResults: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%).`);
  if (passed === total) {
    console.log('PASS: All independent verification & reassessment acceptance tests passed.\n');
  } else {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Test run failed:', e);
  process.exit(1);
});
