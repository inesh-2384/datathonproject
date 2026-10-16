/**
 * PHASE 4 ACCEPTANCE SUITE 1: LIFECYCLE & GOVERNED RBAC
 * Tests: P4-01 through P4-11, P4-26 (Role separation), P4-28 (Idempotency)
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
  console.log('  PHASE 4 TEST SUITE 1: LIFECYCLE & GOVERNANCE ACCEPTANCE TESTS');
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

  // Baseline: Reset simulation
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  // P4-01: Recommendation created from real intelligence state
  const stateRes = await get('/api/foundry/state');
  const ws = stateRes.body.workspace;
  assert('P4-01: Recommendation created from real intelligence state', 
    ws.recommendation !== null && ws.recommendation.recommended_candidate_id !== undefined);

  // P4-02: Recommendation contains evidence references
  assert('P4-02: Recommendation contains evidence references',
    Array.isArray(ws.recommendation.evidence_refs) && ws.recommendation.evidence_refs.length > 0);

  // P4-03: Recommendation contains expected effect
  const recCand = ws.candidates.find(c => c.id === ws.recommendation.recommended_candidate_id);
  assert('P4-03: Recommendation contains expected effect',
    recCand && recCand.expected_effect.length > 0 && recCand.expected_control_margin_delta > 0);

  // P4-04: Recommendation contains failure consequences
  assert('P4-04: Recommendation contains failure consequences',
    typeof ws.recommendation.risk_if_not_executed === 'string' && ws.recommendation.risk_if_not_executed.length > 0);

  // P4-05: Authority requirements are evaluated
  assert('P4-05: Authority requirements are evaluated per candidate',
    recCand.authority_required === 'INCIDENT_COMMANDER' || recCand.authority_required === 'RISK_OFFICER');

  // P4-06: Unauthorized intervention cannot execute (execution without auth)
  const unauthExec = await post('/api/foundry/execute', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR'
  });
  assert('P4-06: Unauthorized intervention cannot execute without authorization',
    unauthExec.status === 400 || (unauthExec.body.success === false));

  // P4-26: Server-side Separation of Duties (SYSTEM_OPERATOR cannot self-authorize)
  const opSelfAuth = await post('/api/foundry/authorize', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-01'
  });
  assert('P4-26: Server-side RBAC: SYSTEM_OPERATOR cannot self-authorize (403 Forbidden)',
    opSelfAuth.status === 403 && opSelfAuth.body.success === false && opSelfAuth.body.decision.decision === 'REJECTED');

  // P4-07: Rejected authorization cannot execute
  const rejectedExec = await post('/api/foundry/execute', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR'
  });
  assert('P4-07: Rejected authorization cannot execute',
    rejectedExec.status === 400 || rejectedExec.body.success === false);

  // P4-09: Authorized intervention can execute when approved by INCIDENT_COMMANDER
  const validAuth = await post('/api/foundry/authorize', {
    candidate_id: recCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01',
    justification: 'Approved for emergency containment.'
  });
  assert('P4-09a: Authorized by valid INCIDENT_COMMANDER',
    validAuth.status === 200 && validAuth.body.success === true && validAuth.body.decision.decision === 'AUTHORIZED');

  // P4-10: Execution creates lifecycle events
  const validExec = await post('/api/foundry/execute', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-02',
    idempotency_key: 'IDEMP-TEST-001'
  });
  assert('P4-10: Execution succeeds and returns execution record with applied deltas',
    validExec.status === 200 && validExec.body.success === true && validExec.body.execution.status === 'EXECUTED');

  // P4-28: Idempotency: duplicate execution request resolves safely
  const dupeExec = await post('/api/foundry/execute', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-02',
    idempotency_key: 'IDEMP-TEST-001'
  });
  assert('P4-28: Duplicate execution request is idempotent (returns existing execution)',
    dupeExec.status === 200 && dupeExec.body.execution.execution_id === validExec.body.execution.execution_id);

  // P4-11: Execution failure creates failure state when gateway fails
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const authAgain = await post('/api/foundry/authorize', {
    candidate_id: recCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-COMMANDER-01'
  });
  const failExec = await post('/api/foundry/execute', {
    candidate_id: recCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPERATOR-02',
    force_failure: true
  });
  assert('P4-11: Forced technical failure creates EXECUTION_FAILED state',
    failExec.body.execution.status === 'EXECUTION_FAILED' && failExec.body.execution.technical_error !== undefined);

  console.log(`\nResults: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%).`);
  if (passed === total) {
    console.log('PASS: All lifecycle and governance acceptance tests passed.\n');
  } else {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Test run failed:', e);
  process.exit(1);
});
