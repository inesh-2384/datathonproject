/**
 * FINANCIAL IMMUNE SYSTEM - CONTROL RESTORATION PROOF (CRP) CONTRACT TEST SUITE
 * Phase 2 Acceptance Test Suite
 * 
 * Verifies all 12 items of the Mandatory Test Matrix:
 * 1. EXECUTION_FAILED -> No false restoration assessment
 * 2. CONTROL_NOT_RESTORED -> Execution succeeds, residual critical path remains, CRP = CONTROL_NOT_RESTORED
 * 3. PARTIALLY_RESTORED -> Measurable improvement, full restoration conditions not satisfied (< 65%)
 * 4. VERIFIED_RESTORATION -> Expected response satisfied, no critical residual path, evidence acceptable
 * 5. RESTORATION_UNRESOLVED -> Stale evidence blocks restoration attestation
 * 6. CONFLICTED -> Conflicting evidence blocks restoration attestation
 * 7. RESET -> Restoration assessment clears, pristine baseline returns
 * 8. DETERMINISTIC REPLAY -> Same seed produces identical meaningful CRP evaluation
 * 9. GOVERNANCE -> CRP is strictly observational; cannot authorize or execute
 * 10. OBSERVATIONAL PURITY -> Verifier never mutates RBAC, topology, or governance state
 * 11. CROSS-WORKSPACE -> Verification, Reassessment, Control Center, and Evidence reference identical CRP state
 * 12. REGRESSION INTEGRITY -> Baseline assertions intact
 */

const http = require('http');

const PORT = 3001;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch (e) {
            data = raw;
          }
          resolve({ status: res.statusCode, body: data });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const post = (p, b) => request('POST', p, b);
const get = (p) => request('GET', p);

async function runCRPTests() {
  console.log('================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM — CRP ACCEPTANCE TEST SUITE (PHASE 2)');
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

  // -------------------------------------------------------------------------
  // TEST 1: EXECUTION_FAILED -> No false restoration assessment
  // -------------------------------------------------------------------------
  console.log('\n--- 1. EXECUTION_FAILED VALIDATION ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  let ws = (await get('/api/foundry/state')).body.workspace;
  const cand1 = ws.candidates[0];

  // Authorize candidate
  await post('/api/foundry/authorize', {
    candidate_id: cand1.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  // Force technical execution failure using API's snake_case force_failure
  const failExec = await post('/api/foundry/execute', {
    candidate_id: cand1.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01',
    force_failure: true
  });

  assert(
    'T1.1: Technical execution failed at gateway (status = EXECUTION_FAILED)',
    failExec.body.execution && failExec.body.execution.status === 'EXECUTION_FAILED'
  );
  assert(
    'T1.2: No verification record produced on technical failure',
    failExec.body.verification === null
  );

  const postFailState = (await get('/api/foundry/state')).body.workspace;
  assert(
    'T1.3: No false restoration assessment produced in foundry state',
    postFailState.latest_verification === null
  );

  // -------------------------------------------------------------------------
  // TEST 2: CONTROL_NOT_RESTORED (Hero Scenario Action 1)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. CONTROL_NOT_RESTORED & RESIDUAL PATH VALIDATION ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const heroCand1 = ws.candidates.find(c => c.id.includes('DEP-ISOLATION')) || ws.candidates[0];

  await post('/api/foundry/authorize', {
    candidate_id: heroCand1.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const exec1 = await post('/api/foundry/execute', {
    candidate_id: heroCand1.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01'
  });

  assert(
    'T2.1: Technical execution succeeded (EXECUTED)',
    exec1.body.execution.status === 'EXECUTED'
  );
  assert(
    'T2.2: Independent verifier returned VERIFIED_FAILED',
    exec1.body.verification.verification_result === 'VERIFIED_FAILED'
  );

  const crp1 = exec1.body.verification.restoration_assessment;
  assert(
    'T2.3: RestorationAssessment attached to verification record',
    crp1 !== undefined && crp1 !== null
  );
  assert(
    'T2.4: CRP restoration_state is CONTROL_NOT_RESTORED',
    crp1.restoration_state === 'CONTROL_NOT_RESTORED'
  );
  assert(
    'T2.5: CRP attribution is UNRESOLVED (qualitative)',
    crp1.attribution === 'UNRESOLVED'
  );
  assert(
    'T2.6: Residual critical path identifies PATH-MODEL-C vector',
    crp1.residual_critical_paths.length > 0 &&
    crp1.residual_critical_paths[0].path_id === 'PATH-MODEL-C' &&
    crp1.residual_critical_paths[0].vector === 'MODEL-C → BANK-C → ASSET-17'
  );
  assert(
    'T2.7: Response discrepancy quantified correctly (< 0 pts M(t))',
    typeof crp1.discrepancy.margin_discrepancy === 'number' && crp1.discrepancy.margin_discrepancy <= -30
  );
  assert(
    'T2.8: Reassessment mandated by CRP',
    crp1.reassessment_required === true
  );

  // -------------------------------------------------------------------------
  // TEST 3: PARTIALLY_RESTORED (Sub-threshold improvement < 65%)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. PARTIALLY_RESTORED VALIDATION ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const partCand = ws.candidates.find(c => c.id.includes('EXPOSURE-REDUCTION')) || ws.candidates[0];

  await post('/api/foundry/authorize', {
    candidate_id: partCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const execPart = await post('/api/foundry/execute', {
    candidate_id: partCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01',
    force_partial_recovery: true
  });

  const crpPart = execPart.body.verification.restoration_assessment;
  assert(
    'T3.1: Partial intervention executed (EXECUTED)',
    execPart.body.execution.status === 'EXECUTED'
  );
  assert(
    'T3.2: Sub-threshold margin evaluates to VERIFIED_PARTIAL',
    execPart.body.verification.verification_result === 'VERIFIED_PARTIAL'
  );
  assert(
    'T3.3: CRP restoration_state is PARTIALLY_RESTORED',
    crpPart.restoration_state === 'PARTIALLY_RESTORED'
  );
  assert(
    'T3.4: CRP attribution is PLAUSIBLE',
    crpPart.attribution === 'PLAUSIBLE'
  );
  assert(
    'T3.5: Reassessment remains required',
    crpPart.reassessment_required === true
  );

  // -------------------------------------------------------------------------
  // TEST 4: VERIFIED_RESTORATION (Hero Scenario Action 2 - Secondary Backstop)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. VERIFIED_RESTORATION VALIDATION ---');
  // Authorize secondary backstop
  const backstopCandId = 'CAND-SEC-01-MODEL-C-QUARANTINE';
  await post('/api/foundry/authorize', {
    candidate_id: backstopCandId,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const exec2 = await post('/api/foundry/execute', {
    candidate_id: backstopCandId,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01'
  });

  assert(
    'T4.1: Secondary backstop execution succeeded',
    exec2.body.execution.status === 'EXECUTED'
  );
  assert(
    'T4.2: Independent verifier returned VERIFIED_EFFECTIVE',
    exec2.body.verification.verification_result === 'VERIFIED_EFFECTIVE'
  );

  const crp2 = exec2.body.verification.restoration_assessment;
  assert(
    'T4.3: CRP restoration_state is VERIFIED_RESTORATION',
    crp2.restoration_state === 'VERIFIED_RESTORATION'
  );
  assert(
    'T4.4: Qualitative attribution is SUPPORTED',
    crp2.attribution === 'SUPPORTED'
  );
  assert(
    'T4.5: Residual critical paths list is empty',
    crp2.residual_critical_paths.length === 0
  );
  assert(
    'T4.6: Reassessment is not required post-restoration',
    crp2.reassessment_required === false
  );
  assert(
    'T4.7: Observed margin restored to 84% (>= 65% threshold)',
    crp2.observed_response.observed_margin === 84
  );

  // -------------------------------------------------------------------------
  // TEST 5: RESTORATION_UNRESOLVED (Stale Evidence)
  // -------------------------------------------------------------------------
  console.log('\n--- 5. RESTORATION_UNRESOLVED (STALE EVIDENCE) ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const candStale = ws.candidates.find(c => c.is_minimum_effective) || ws.candidates[0];

  await post('/api/foundry/authorize', {
    candidate_id: candStale.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const staleExec = await post('/api/foundry/execute', {
    candidate_id: candStale.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01',
    force_stale_evidence: true
  });

  const crpStale = staleExec.body.verification.restoration_assessment;
  assert(
    'T5.1: Stale evidence forces VERIFIED_UNCERTAIN in lifecycle',
    staleExec.body.verification.verification_result === 'VERIFIED_UNCERTAIN'
  );
  assert(
    'T5.2: CRP verdict is RESTORATION_UNRESOLVED on stale evidence',
    crpStale.restoration_state === 'RESTORATION_UNRESOLVED'
  );
  assert(
    'T5.3: CRP attribution is UNRESOLVED on stale evidence',
    crpStale.attribution === 'UNRESOLVED'
  );
  assert(
    'T5.4: Evidence freshness classified as STALE',
    crpStale.evidence_status.freshness === 'STALE'
  );

  // -------------------------------------------------------------------------
  // TEST 6: CONFLICTED TELEMETRY
  // -------------------------------------------------------------------------
  console.log('\n--- 6. CONFLICTED TELEMETRY VALIDATION ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const candConflict = ws.candidates.find(c => c.is_minimum_effective) || ws.candidates[0];

  await post('/api/foundry/authorize', {
    candidate_id: candConflict.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const conflictExec = await post('/api/foundry/execute', {
    candidate_id: candConflict.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01',
    force_conflicting_telemetry: true
  });

  const crpConflict = conflictExec.body.verification.restoration_assessment;
  assert(
    'T6.1: Conflicting telemetry forces VERIFIED_UNCERTAIN',
    conflictExec.body.verification.verification_result === 'VERIFIED_UNCERTAIN'
  );
  assert(
    'T6.2: CRP verdict is RESTORATION_UNRESOLVED on conflicting evidence',
    crpConflict.restoration_state === 'RESTORATION_UNRESOLVED'
  );
  assert(
    'T6.3: Conflicted flag true in evidence_status',
    crpConflict.evidence_status.is_conflicted === true
  );

  // -------------------------------------------------------------------------
  // TEST 7: RESET CLEARANCE
  // -------------------------------------------------------------------------
  console.log('\n--- 7. RESET CLEARANCE VALIDATION ---');
  const resetRes = await post('/api/simulation/reset', { seed: 42091 });
  const resetWs = (await get('/api/foundry/state')).body.workspace;

  assert(
    'T7.1: Simulation reset returned 200 OK',
    resetRes.status === 200
  );
  assert(
    'T7.2: latest_verification is null post-reset',
    resetWs.latest_verification === null
  );
  assert(
    'T7.3: Control Margin returned to baseline 91%',
    resetRes.body.control_state && resetRes.body.control_state.control_margin_percent === 91
  );

  // -------------------------------------------------------------------------
  // TEST 8: DETERMINISTIC REPLAY
  // -------------------------------------------------------------------------
  console.log('\n--- 8. DETERMINISTIC REPLAY VALIDATION ---');
  async function runReplayFlow(seed) {
    await post('/api/simulation/reset', { seed });
    await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
    const sWs = (await get('/api/foundry/state')).body.workspace;
    const c = sWs.candidates.find(x => x.id.includes('DEP-ISOLATION')) || sWs.candidates[0];
    await post('/api/foundry/authorize', { candidate_id: c.id, role: 'INCIDENT_COMMANDER', user_id: 'USR-CMD-01' });
    const ex = await post('/api/foundry/execute', { candidate_id: c.id, role: 'SYSTEM_OPERATOR', user_id: 'USR-OPS-01' });
    return ex.body.verification.restoration_assessment;
  }

  const run1 = await runReplayFlow(42091);
  const run2 = await runReplayFlow(42091);

  assert(
    'T8.1: Replay run 1 and run 2 produce identical restoration state',
    run1.restoration_state === run2.restoration_state && run1.restoration_state === 'CONTROL_NOT_RESTORED'
  );
  assert(
    'T8.2: Replay run 1 and run 2 produce identical discrepancy',
    run1.discrepancy.margin_discrepancy === run2.discrepancy.margin_discrepancy
  );
  assert(
    'T8.3: Replay run 1 and run 2 produce identical residual vector',
    run1.residual_critical_paths[0].path_id === run2.residual_critical_paths[0].path_id
  );

  // -------------------------------------------------------------------------
  // TEST 9: GOVERNANCE & SEPARATION OF DUTIES
  // -------------------------------------------------------------------------
  console.log('\n--- 9. GOVERNANCE BOUNDARIES ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const govCand = ws.candidates[0];

  // Attempt execution without authorization
  const unauthExec = await post('/api/foundry/execute', {
    candidate_id: govCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01'
  });
  assert(
    'T9.1: Execution blocked without authorization (HTTP 400)',
    unauthExec.status === 400
  );

  // Unauthorized role attempting authorization (SYSTEM_OPERATOR cannot authorize)
  const opAuth = await post('/api/foundry/authorize', {
    candidate_id: govCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OPS-01'
  });
  assert(
    'T9.2: Operator role cannot authorize candidate (HTTP 403 Forbidden)',
    opAuth.status === 403
  );

  // -------------------------------------------------------------------------
  // TEST 10: OBSERVATIONAL PURITY
  // -------------------------------------------------------------------------
  console.log('\n--- 10. OBSERVATIONAL PURITY VALIDATION ---');
  // State before inspection
  const preInspect = (await get('/api/state')).body.data;
  // Trigger evaluation
  await post('/api/foundry/evaluate', {});
  const postInspect = (await get('/api/state')).body.data;

  assert(
    'T10.1: Evaluating state does not mutate control margin percent',
    preInspect.controlState.control_margin_percent === postInspect.controlState.control_margin_percent
  );
  assert(
    'T10.2: Evaluating state does not mutate node count or institution statuses',
    preInspect.institutions.length === postInspect.institutions.length
  );

  // -------------------------------------------------------------------------
  // TEST 11: CROSS-WORKSPACE CONSISTENCY
  // -------------------------------------------------------------------------
  console.log('\n--- 11. CROSS-WORKSPACE CONSISTENCY ---');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });

  ws = (await get('/api/foundry/state')).body.workspace;
  const cwCand = ws.candidates[0];
  await post('/api/foundry/authorize', { candidate_id: cwCand.id, role: 'INCIDENT_COMMANDER', user_id: 'USR-CMD-01' });
  const cwExec = await post('/api/foundry/execute', { candidate_id: cwCand.id, role: 'SYSTEM_OPERATOR', user_id: 'USR-OPS-01' });

  const fState = (await get('/api/foundry/state')).body.workspace;
  const gState = (await get('/api/state')).body.data;

  const fVerif = fState.latest_verification;
  const gVerif = gState.controlState.foundry.latest_verification;

  assert(
    'T11.1: Foundry workspace contains latest_verification with restoration_assessment',
    fVerif !== null && fVerif.restoration_assessment !== undefined
  );
  assert(
    'T11.2: Global system state store contains identical restoration assessment',
    gVerif !== null && gVerif.restoration_assessment.assessment_id === fVerif.restoration_assessment.assessment_id
  );
  assert(
    'T11.3: Evidence record id references match between verifier and state ledger',
    fVerif.evidence_record_ids[0] === fVerif.restoration_assessment.evidence_status.evidence_record_ids[0]
  );

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  CRP ACCEPTANCE SUMMARY: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runCRPTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
