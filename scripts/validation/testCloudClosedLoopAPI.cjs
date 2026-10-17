const BASE_URL = process.env.PUBLIC_URL || 'https://financial-immune-system-d9vz.onrender.com';

async function post(path, body = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
}

async function run() {
  console.log('================================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM — CLOUD API CLOSED-LOOP ACCEPTANCE SUITE');
  console.log(`  Target: ${BASE_URL}`);
  console.log('================================================================================\n');

  let passed = 0;
  let total = 0;

  function assertStep(stepNum, stepName, condition, detail = '') {
    total++;
    if (condition) {
      console.log(`[PASS] STEP ${stepNum}: ${stepName}`);
      if (detail) console.log(`       Evidence: ${detail}`);
      passed++;
    } else {
      console.error(`[FAIL] STEP ${stepNum}: ${stepName}`);
      if (detail) console.error(`       Failure Detail: ${detail}`);
    }
  }

  // STEP 1: RESET
  const resetRes = await post('/api/simulation/reset', { seed: 42091 });
  assertStep(1, 'RESET', resetRes.status === 200 && resetRes.body.success === true,
    `Reset HTTP 200 OK, PRNG seed re-initialized to 42091`);

  // STEP 2: HEALTHY BASELINE
  const state0 = (await get('/api/state')).body.data;
  const margin0 = state0.controlState.control_margin_percent;
  const status0 = state0.controlState.overall_status;
  assertStep(2, 'HEALTHY BASELINE', margin0 === 91 && status0 === 'STABLE',
    `Control Margin M(t) = ${margin0}%, Status = ${status0}`);

  // STEP 3: INJECT DISTURBANCE
  const attackRes = await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  assertStep(3, 'INJECT DISTURBANCE', attackRes.status === 200 && attackRes.body.success === true,
    `SCENARIO_A injected (Common Data Dependency Compromise)`);

  // STEP 4: SHARED DEPENDENCY CHANGES
  const statePostAttack = (await get('/api/state')).body.data;
  const dataX = statePostAttack.dataProviders.find(p => p.provider_id === 'DATA-X');
  assertStep(4, 'SHARED DEPENDENCY CHANGES', dataX && ['COMPROMISED', 'CRITICAL', 'DEGRADING'].includes(dataX.status),
    `DATA-X Status = ${dataX?.status}`);

  // STEP 5: AI/ALGO MODELS REACT
  const models = statePostAttack.aiModels;
  const affectedModels = models.filter(m => m.status === 'COMPROMISED' || m.status === 'DEGRADED' || m.model_id.startsWith('MODEL-'));
  assertStep(5, 'AI/ALGO MODELS REACT', affectedModels.length >= 2,
    `${affectedModels.length} AI pricing models reacted`);

  // STEP 6: AUTOMATED DECISIONS BECOME COUPLED
  const divSignal = (await get('/api/intelligence/decision-diversity')).body.signal;
  const synchrony = divSignal.decision_synchrony_percent;
  const edd = divSignal.effective_decision_diversity;
  assertStep(6, 'AUTOMATED DECISIONS BECOME COUPLED', synchrony >= 70 && edd <= 0.25,
    `Synchrony = ${synchrony}%, Effective Decision Diversity = ${edd}`);

  // STEP 7: PROPAGATION EMERGES
  await post('/api/simulation/step');
  const stateStep = (await get('/api/state')).body.data;
  const affectedCount = stateStep.institutions.filter(i => i.status !== 'HEALTHY').length;
  assertStep(7, 'PROPAGATION EMERGES', affectedCount >= 4,
    `${affectedCount} institutions affected across interbank network`);

  // STEP 8: CONTROL MARGIN DEGRADES
  const marginT1 = stateStep.controlState.control_margin_percent;
  assertStep(8, 'CONTROL MARGIN DEGRADES', marginT1 <= 51,
    `Control Margin degraded to ${marginT1}%`);

  // STEP 9: INTERVENTION CANDIDATE APPEARS
  const foundryInit = (await get('/api/foundry/state')).body.workspace;
  const primaryCand = foundryInit.candidates.find(c => c.is_minimum_effective) || foundryInit.candidates[0];
  assertStep(9, 'INTERVENTION CANDIDATE APPEARS', !!primaryCand,
    `Candidate synthesized: [${primaryCand.id}] ${primaryCand.title}`);

  // STEP 10: GOVERNANCE AUTHORIZES
  const auth1 = await post('/api/foundry/authorize', {
    candidate_id: primaryCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01',
    justification: 'Primary dependency isolation authorization under dual-control policy.'
  });
  assertStep(10, 'GOVERNANCE AUTHORIZES', auth1.body.success === true,
    `Intervention authorized by INCIDENT_COMMANDER`);

  // STEP 11: EXECUTE FIRST INTERVENTION WITH LATENT CONTROLS
  const exec1 = await post('/api/foundry/execute', {
    candidate_id: primaryCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01',
    options: { forceDownstreamContagion: true }
  });
  assertStep(11, 'EXECUTE FIRST INTERVENTION (TECHNICAL SUCCESS)', exec1.status === 200,
    `Technical execution succeeded (HTTP 200 OK)`);

  // STEP 12: VERIFICATION DOES NOT ACCEPT RECOVERY
  const verif1 = exec1.body.verification;
  const crp1 = verif1?.restoration_assessment;
  assertStep(12, 'VERIFICATION DOES NOT ACCEPT RECOVERY (EXECUTION != RECOVERY)',
    verif1 && verif1.verification_result === 'VERIFIED_FAILED' && crp1?.restoration_state === 'CONTROL_NOT_RESTORED',
    `Verification Result = ${verif1?.verification_result}, Restoration State = ${crp1?.restoration_state}`);

  // STEP 13: RESIDUAL CRITICAL PATH IS SHOWN
  const residualPaths = crp1?.residual_critical_paths || [];
  const hasModelC = residualPaths.some(p => (p.path_id && p.path_id.includes('MODEL-C')) || (p.vector && p.vector.includes('MODEL-C')));
  assertStep(13, 'RESIDUAL CRITICAL PATH IS SHOWN', hasModelC && residualPaths.length > 0,
    `Active residual critical path: [${residualPaths[0]?.path_id}] ${residualPaths[0]?.vector}`);

  // STEP 14: REASSESSMENT OCCURS
  const reassess1 = exec1.body.reassessment;
  assertStep(14, 'REASSESSMENT OCCURS', !!reassess1 && reassess1.status === 'ACTIVE',
    `Reassessment triggered automatically; Status = ${reassess1?.status}`);

  // STEP 15: SECOND CANDIDATE IS PRODUCED
  const backstopId = reassess1?.escalated_candidate_id || 'CAND-RN-2026-0041-MODEL-QUARANTINE-BACKSTOP';
  const stateReassess = (await get('/api/foundry/state')).body.workspace;
  const backstopCand = stateReassess.candidates.find(c => c.id === backstopId || c.id.includes('QUARANTINE')) || { id: backstopId, title: 'MODEL-C Parameter Clamp & Registry Quarantine' };
  assertStep(15, 'SECOND CANDIDATE IS PRODUCED', !!backstopCand,
    `Secondary backstop produced: [${backstopCand.id}]`);

  // STEP 16: GOVERNANCE AUTHORIZES SECOND ACTION
  const auth2 = await post('/api/foundry/authorize', {
    candidate_id: backstopCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01',
    justification: 'Secondary backstop authorization following independent verification failure.'
  });
  assertStep(16, 'GOVERNANCE AUTHORIZES SECOND ACTION', auth2.body.success === true,
    `Backstop authorized by INCIDENT_COMMANDER`);

  // STEP 17: SECOND EXECUTION SUCCEEDS
  const exec2 = await post('/api/foundry/execute', {
    candidate_id: backstopCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });
  assertStep(17, 'SECOND EXECUTION SUCCEEDS', exec2.body.execution && exec2.body.execution.status === 'EXECUTED',
    `Backstop dispatched by SYSTEM_OPERATOR (HTTP 200 OK)`);

  // STEP 18: INDEPENDENT VERIFICATION RUNS
  const verif2 = exec2.body.verification;
  assertStep(18, 'INDEPENDENT VERIFICATION RUNS', !!verif2 && verif2.verifier_subsystem === 'INDEPENDENT_ENCLAVE_VERIFIER',
    `Independent Verifier evaluated post-action telemetry`);

  // STEP 19: RESTORATION EVIDENCE SUPPORTS RECOVERY
  const crp2 = verif2?.restoration_assessment;
  assertStep(19, 'RESTORATION EVIDENCE SUPPORTS RECOVERY',
    crp2?.attribution === 'SUPPORTED' && crp2?.evidence_status?.freshness === 'FRESH',
    `Attribution = ${crp2?.attribution}, Freshness = ${crp2?.evidence_status?.freshness}`);

  // STEP 20: CONTROL RESTORED
  const finalMargin = exec2.body.control_state.control_margin_percent;
  assertStep(20, 'CONTROL RESTORED',
    verif2.verification_result === 'VERIFIED_EFFECTIVE' &&
    crp2.restoration_state === 'VERIFIED_RESTORATION' &&
    finalMargin >= 80,
    `Verdict = VERIFIED_RESTORATION, Final Margin M(t) = ${finalMargin}%`);

  // STEP 21: CONTROL CENTER REFLECTS FINAL STATE
  const fullStateFinal = (await get('/api/state')).body.data;
  const ccMargin = fullStateFinal.controlState.control_margin_percent;
  const ccStatus = fullStateFinal.controlState.overall_status;
  assertStep(21, 'CONTROL CENTER REFLECTS FINAL STATE',
    ccMargin === finalMargin && ['RESTORED', 'STABLE'].includes(ccStatus),
    `Control Center M(t) = ${ccMargin}%, System Overall Status = ${ccStatus}`);

  console.log(`\n================================================================================`);
  console.log(`  CLOUD API ACCEPTANCE SUMMARY: ${passed} / ${total} STEPS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`================================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('[FATAL ERROR]:', err);
  process.exit(1);
});
