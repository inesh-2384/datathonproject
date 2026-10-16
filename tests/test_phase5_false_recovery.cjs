/**
 * PHASE 5 ACCEPTANCE SUITE 8: FALSE RECOVERY DETECTION
 * Requirements: Section 24
 * 
 * Verifies:
 * 1. Independent Enclave Verifier detects false recovery / latent contagion
 * 2. Execution success (EXECUTED) does NOT fool the independent verifier
 * 3. Superficial metric improvements are flagged when latent unaddressed dependencies propagate
 * 4. Verifier assigns VERIFIED_FAILED and CONTROL_NOT_RESTORED
 * 5. Automatic trigger of emergency reassessment
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

async function runFalseRecoveryTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 8: FALSE RECOVERY & LATENT CONTAGION DETECTION');
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

  // 1. Reset and load Scenario C (Latent algorithmic contagion through MODEL-C / ASSET-17)
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });

  // 2. Query candidates: candidate 1 is partial isolation (isolates provider, misses latent model path)
  const wsRes = await get('/api/foundry/state');
  const candidates = wsRes.body.workspace.candidates;
  assert('Foundry generates candidates for Scenario C', Array.isArray(candidates) && candidates.length > 0);

  const partialCandidate = candidates.find(c => c.id.includes('PARTIAL-ISO')) || candidates[1];
  assert('Identified partial isolation candidate with latent residual exposure', !!partialCandidate);

  console.log(`  ✓ Candidate ID: ${partialCandidate.id}`);
  console.log(`  ✓ Action Type: ${partialCandidate.action_type}`);
  console.log(`  ✓ Target Entity: ${partialCandidate.target_entity_id}`);
  console.log(`  ✓ Projected Margin: ${partialCandidate.projected_margin}%`);

  // 3. Authorize partial candidate
  const authRes = await post('/api/foundry/authorize', {
    candidate_id: partialCandidate.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });
  assert('Partial candidate authorized by Incident Commander', authRes.body.success === true);

  // 4. Execute partial candidate
  const execRes = await post('/api/foundry/execute', {
    candidate_id: partialCandidate.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });

  assert('Governed Execution Bus executes partial candidate successfully', 
    execRes.body.success === true && execRes.body.execution.status === 'EXECUTED');

  // 5. Independent Verification: Enclave verifier inspects full graph telemetry
  const obs = execRes.body.observation;
  const v = execRes.body.verification;
  assert('Independent verifier receives raw observation digest', 
    obs !== null && typeof obs.raw_telemetry_digest_sha256 === 'string' && obs.raw_telemetry_digest_sha256.startsWith('sha256:'));

  console.log(`\n[ENCLAVE VERIFIER JUDGMENT]`);
  console.log(`  ✓ Verification Result: ${v.verification_result}`);
  console.log(`  ✓ Observed Outcome: ${v.observed_outcome}`);
  console.log(`  ✓ Discrepancy Points: ${v.margin_discrepancy} pts`);
  console.log(`  ✓ Report: ${v.verification_report}`);

  assert('Independent verifier detects failure (VERIFIED_FAILED)', v.verification_result === 'VERIFIED_FAILED');
  assert('Verifier refuses to grant CONTROL_RESTORED (marks CONTROL_NOT_RESTORED)', v.observed_outcome === 'CONTROL_NOT_RESTORED');
  assert('Verifier quantifies discrepancy between expected vs observed effect', Math.abs(v.margin_discrepancy) > 0);

  // 6. Emergency Reassessment Triggered
  const reassessment = execRes.body.reassessment;
  assert('Failed outcome triggers automated reassessment record', reassessment !== null && !!reassessment.reassessment_id);
  assert('Reassessment reason flagged as RESIDUAL_HAZARD', reassessment.triggered_by === 'RESIDUAL_HAZARD');
  assert('Reassessment identifies escalated secondary backstop candidate', 
    reassessment.escalated_candidate_id && reassessment.escalated_candidate_id.includes('MODEL-QUARANTINE-BACKSTOP'));

  console.log(`\n[EMERGENCY REASSESSMENT RECORD]`);
  console.log(`  ✓ Reassessment ID: ${reassessment.reassessment_id}`);
  console.log(`  ✓ Triggered By: ${reassessment.triggered_by}`);
  console.log(`  ✓ Escalated Candidate: ${reassessment.escalated_candidate_id}`);

  console.log(`\n================================================================`);
  console.log(`  FALSE RECOVERY SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runFalseRecoveryTests().catch(err => {
  console.error('[FATAL ERROR IN FALSE RECOVERY SUITE]:', err);
  process.exit(1);
});
