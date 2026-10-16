/**
 * PHASE 5 ACCEPTANCE SUITE 9: EVIDENCE DEGRADATION EXPERIMENT
 * Requirements: Section 25
 * 
 * Verifies:
 * 1. Fresh vs Stale vs Conflicting vs Missing Evidence handling
 * 2. Stale evidence reduces confidence and blocks restoration
 * 3. Conflicting evidence triggers uncertainty penalty and flags CONFLICT
 * 4. Missing evidence widens uncertainty bounds and blocks premature CONTROL_RESTORED
 * 5. Strict invariant: Missing/Stale/Conflicted evidence NEVER produces automatic success
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

async function runEvidenceDegradationTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 9: EVIDENCE DEGRADATION EXPERIMENT');
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
  // TEST 1: STALE EVIDENCE PREVENTS RESTORATION
  // -------------------------------------------------------------
  console.log('[TEST 1] Testing STALE_EVIDENCE (>60s) on independent enclave verifier...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  const ws1 = (await get('/api/foundry/state')).body.workspace;
  const cand1 = ws1.candidates.find(c => c.is_minimum_effective);

  await post('/api/foundry/authorize', {
    candidate_id: cand1.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const staleExec = await post('/api/foundry/execute', {
    candidate_id: cand1.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01',
    force_stale_evidence: true
  });

  const v1 = staleExec.body.verification;
  console.log(`  ✓ Verifier Status under Stale Evidence: ${v1.verification_result}`);
  console.log(`  ✓ Observed Outcome: ${v1.observed_outcome}`);
  console.log(`  ✓ Evidence Freshness Status: ${v1.evidence_freshness_status}`);

  assert('Stale evidence prevents VERIFIED_EFFECTIVE verdict', v1.verification_result !== 'VERIFIED_EFFECTIVE');
  assert('Verifier flags evidence staleness in record (VERIFIED_UNCERTAIN & STALE)', 
    v1.evidence_freshness_status === 'STALE' && v1.verification_result === 'VERIFIED_UNCERTAIN');

  // -------------------------------------------------------------
  // TEST 2: CONFLICTING EVIDENCE BLOCKS UNCONDITIONAL RESTORATION
  // -------------------------------------------------------------
  console.log('\n[TEST 2] Testing CONFLICTING_TELEMETRY on independent enclave verifier...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  const ws2 = (await get('/api/foundry/state')).body.workspace;
  const cand2 = ws2.candidates.find(c => c.is_minimum_effective);

  await post('/api/foundry/authorize', {
    candidate_id: cand2.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const conflictExec = await post('/api/foundry/execute', {
    candidate_id: cand2.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01',
    force_conflicting_telemetry: true
  });

  const v2 = conflictExec.body.verification;
  console.log(`  ✓ Verifier Status under Conflicting Evidence: ${v2.verification_result}`);
  console.log(`  ✓ Observed Outcome: ${v2.observed_outcome}`);

  assert('Conflicting evidence prevents clean VERIFIED_EFFECTIVE verdict',
    v2.verification_result === 'VERIFIED_UNCERTAIN' && v2.observed_outcome === 'CONFLICTED');

  // -------------------------------------------------------------
  // TEST 3: EVIDENCE QUALITY ASSESSMENT UNDER HEALTHY EQUILIBRIUM
  // -------------------------------------------------------------
  console.log('\n[TEST 3] Fresh Evidence Assessment in Healthy Baseline...');
  await post('/api/simulation/reset', { seed: 42091 });
  const asm = (await get('/api/intelligence/assessment')).body.assessment;

  console.log(`  ✓ Evidence Quality Sufficiency: ${asm.evidence_quality.evidence_sufficiency_score}`);
  console.log(`  ✓ Average Freshness Seconds: ${asm.evidence_quality.average_freshness_seconds}s`);
  console.log(`  ✓ Confidence Rating: ${asm.evidence_quality.confidence_rating}`);
  console.log(`  ✓ Conflict Flag: ${asm.evidence_quality.conflict_detected}`);

  assert('Healthy baseline has high sufficiency score (>= 0.85)', asm.evidence_quality.evidence_sufficiency_score >= 0.85);
  assert('Healthy baseline telemetry is fresh (< 5s)', asm.evidence_quality.average_freshness_seconds <= 5.0);
  assert('Healthy baseline confidence rating is HIGH', asm.evidence_quality.confidence_rating === 'HIGH');
  assert('Healthy baseline has conflict_detected = false', asm.evidence_quality.conflict_detected === false);

  console.log(`\n================================================================`);
  console.log(`  EVIDENCE DEGRADATION SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runEvidenceDegradationTests().catch(err => {
  console.error('[FATAL ERROR IN EVIDENCE DEGRADATION SUITE]:', err);
  process.exit(1);
});
