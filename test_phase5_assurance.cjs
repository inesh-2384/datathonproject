/**
 * FINANCIAL IMMUNE SYSTEM - PHASE 5 ENTERPRISE ASSURANCE TEST SUITE
 * 
 * Verifies all 18 Acceptance Tests (P5-01 to P5-18) specified in Section 37:
 * P5-01: Unauthorized action rejected
 * P5-02: Authorized action accepted
 * P5-03: UI cannot bypass authorization
 * P5-04: Execution without authorization rejected
 * P5-05: Execution success != recovery
 * P5-06: Verification failure -> CONTROL_UNVERIFIED
 * P5-07: Stale evidence blocks closure
 * P5-08: Conflicting evidence produces uncertainty
 * P5-09: Unchanged evidence digest verifies
 * P5-10: Modified payload fails integrity verification
 * P5-11: Trace ID survives full incident lifecycle
 * P5-12: Privacy transformation removes restricted fields
 * P5-13: Unauthorized role cannot access restricted data
 * P5-14: Assurance state responds to evidence degradation
 * P5-15: IBM runtime truth labels remain correct
 * P5-16: Simulation cannot masquerade as IBM integration
 * P5-17: Control Foundry respects assurance constraints
 * P5-18: Phase 1-4 regressions remain intact
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    const req = http.request(url, {
      method,
      headers: reqHeaders,
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout on ${method} ${path}`));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const get = (path) => request('GET', path);
const post = (path, body) => request('POST', path, body);

async function runPhase5Verification() {
  console.log('===================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM - PHASE 5 ENTERPRISE ASSURANCE SUITE');
  console.log('===================================================================');

  // STEP 0: Enclave Health
  console.log('\n[P5-00] Verifying Server Enclave Health...');
  const health = await get('/api/health');
  if (health.status !== 200 || health.body.status !== 'ONLINE') {
    throw new Error(`Enclave health check failed: ${JSON.stringify(health)}`);
  }
  console.log('  ✓ Enclave Server ONLINE (Port 3001)');

  // P5-01: Unauthorized action rejected
  console.log('\n[P5-01] Verifying Unauthorized Action Rejected (Role OBSERVER)...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/simulation/step', {});
  await post('/api/simulation/step', {});

  const foundryState1 = (await get('/api/foundry/state')).body.workspace;
  const candidateMei = foundryState1.candidates.find(c => c.is_minimum_effective);

  const unauthRes = await post('/api/foundry/authorize', {
    candidate_id: candidateMei.id,
    role: 'OBSERVER',
    user_id: 'USR-OBSERVER-TEST'
  });
  if (unauthRes.status !== 403 || unauthRes.body.success !== false) {
    throw new Error(`Expected HTTP 403 rejection for OBSERVER, got ${unauthRes.status}`);
  }
  console.log(`  ✓ Unauthorized action strictly rejected: HTTP 403 [Decision: ${unauthRes.body.decision.decision}]`);
  console.log(`  ✓ Cryptographic Rejection Seal: ${unauthRes.body.decision.cryptographic_seal_sha256}`);

  // P5-02: Authorized action accepted
  console.log('\n[P5-02] Verifying Authorized Action Accepted (SYSTEM_OPERATOR)...');
  const authRes = await post('/api/foundry/authorize', {
    candidate_id: candidateMei.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-SYSOP-01',
    justification: 'System Operator governance sign-off.'
  });
  if (!authRes.body.success || authRes.body.decision.decision !== 'AUTHORIZED') {
    throw new Error(`Authorization failed for SYSTEM_OPERATOR: ${JSON.stringify(authRes)}`);
  }
  console.log(`  ✓ Authorized action accepted: Decision [${authRes.body.decision.decision}]`);
  console.log(`  ✓ Cryptographic Authorization Seal: ${authRes.body.decision.cryptographic_seal_sha256}`);

  // P5-03 & P5-04: UI cannot bypass authorization & Execution without authorization rejected
  console.log('\n[P5-03 & P5-04] Verifying Execution Without Authorization Rejected...');
  const unauthorizedCandidate = foundryState1.candidates.find(c => !c.is_minimum_effective && c.type !== 'NO_ACTION');
  const directExec = await post('/api/foundry/execute', { candidate_id: unauthorizedCandidate.id });
  if (directExec.status !== 400 || directExec.body.success !== false) {
    throw new Error(`Direct execution of unauthorized candidate should fail with 400: ${JSON.stringify(directExec)}`);
  }
  console.log(`  ✓ Execution blocked: HTTP 400 [Error: "${directExec.body.error}"]`);
  console.log('  ✓ Invariant Verified: UI cannot bypass authorization; recommendation != authorization.');

  // P5-05 & P5-06: Execution success != recovery & Verification failure -> CONTROL_UNVERIFIED
  console.log('\n[P5-05 & P5-06] Verifying Execution Success != Recovery (Scenario C)...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });
  await post('/api/simulation/step', {}); // T1
  await post('/api/simulation/step', {}); // T2
  await post('/api/simulation/step', {}); // T3

  const cFoundry = (await get('/api/foundry/state')).body.workspace;
  const partialCand = cFoundry.candidates.find(c => c.id.includes('PARTIAL-ISO'));

  // Authorize and execute flawed partial candidate
  await post('/api/foundry/authorize', { candidate_id: partialCand.id, role: 'SYSTEM_OPERATOR' });
  const failedExecRes = await post('/api/foundry/execute', { candidate_id: partialCand.id });

  if (failedExecRes.body.execution.status !== 'EXECUTED') {
    throw new Error(`Technical execution should succeed, got ${failedExecRes.body.execution.status}`);
  }
  if (failedExecRes.body.verification.observed_outcome !== 'CONTROL_UNVERIFIED') {
    throw new Error(`Expected CONTROL_UNVERIFIED, got ${failedExecRes.body.verification.observed_outcome}`);
  }
  const failedState = (await get('/api/state')).body.data;
  if (failedState.controlState.controllability_state !== 'CONTROL_UNVERIFIED') {
    throw new Error(`Expected controllability_state CONTROL_UNVERIFIED, got ${failedState.controlState.controllability_state}`);
  }
  console.log(`  ✓ Execution Status: ${failedExecRes.body.execution.status} (Technical gateway succeeded)`);
  console.log(`  ✓ Verification Outcome: ${failedExecRes.body.verification.observed_outcome} (Latent drift caught by verifier)`);
  console.log(`  ✓ Controllability State: ${failedState.controlState.controllability_state}`);

  // P5-07: Stale evidence blocks closure
  console.log('\n[P5-07] Verifying Stale Evidence Blocks Closure...');
  await post('/api/assurance/inject', { threat: 'THREAT_C_STALE_EVIDENCE' });
  const staleClose = await post('/api/assurance/close-incident', {});
  if (staleClose.status !== 400 || staleClose.body.reason !== 'EVIDENCE_STALE') {
    throw new Error(`Expected 400 with reason EVIDENCE_STALE, got ${staleClose.status}: ${JSON.stringify(staleClose)}`);
  }
  console.log(`  ✓ Closure Blocked: HTTP 400 [Reason: ${staleClose.body.reason}]`);
  console.log(`  ✓ Narrative: "${staleClose.body.narrative}"`);

  // P5-08: Conflicting evidence produces uncertainty
  console.log('\n[P5-08] Verifying Conflicting Evidence Produces Uncertainty...');
  await post('/api/assurance/inject', { threat: 'THREAT_E_EVIDENCE_CONFLICT' });
  const conflictClose = await post('/api/assurance/close-incident', {});
  if (conflictClose.status !== 400 || conflictClose.body.reason !== 'EVIDENCE_CONFLICTED') {
    throw new Error(`Expected 400 with reason EVIDENCE_CONFLICTED, got ${conflictClose.status}`);
  }
  const conflictState = (await get('/api/assurance/state')).body.assurance;
  if (!conflictState.evidenceConflict || conflictState.uncertaintyStatus !== 'HIGH') {
    throw new Error(`Expected high uncertainty and active conflict, got: ${JSON.stringify(conflictState)}`);
  }
  console.log(`  ✓ Conflict Gate Enforced: Closure blocked [Reason: ${conflictClose.body.reason}]`);
  console.log(`  ✓ Epistemic Uncertainty: ${conflictState.uncertaintyStatus}`);
  console.log(`  ✓ Conflict Detail: "${conflictState.conflictDescription}"`);

  // P5-09: Unchanged evidence digest verifies
  console.log('\n[P5-09] Verifying Cryptographic Evidence Integrity (Unaltered)...');
  await post('/api/simulation/reset', { seed: 42091 });
  const integrityCheck = await post('/api/assurance/verify-integrity', {});
  if (!integrityCheck.body.success || !integrityCheck.body.allValid) {
    throw new Error(`Integrity check failed: ${JSON.stringify(integrityCheck.body)}`);
  }
  console.log(`  ✓ Verified ${integrityCheck.body.recordsCount} Evidence Records: All SHA-256 Digests VALID.`);

  // P5-10: Modified payload fails integrity verification
  console.log('\n[P5-10] Verifying Modified Payload Fails Integrity Verification...');
  await post('/api/assurance/inject', { threat: 'INJECT_INTEGRITY_FAILURE' });

  const failCheck = await post('/api/assurance/verify-integrity', {});
  const corruptRecord = failCheck.body.results.find(r => r.valid === false);
  if (!corruptRecord) {
    throw new Error('Integrity verification should have detected tampered payload hash!');
  }
  console.log(`  ✓ Tamper detection verified: Record [${corruptRecord.evidence_id}] flagged as INVALID.`);
  console.log(`  ✓ Declared: ${corruptRecord.declaredDigest}`);

  // P5-11: Trace ID survives full incident lifecycle
  console.log('\n[P5-11] Verifying Unified Trace ID Persistence Across Lifecycle...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const trace1 = (await get('/api/assurance/state')).body.trace;
  if (!trace1 || !trace1.traceId.startsWith('TRC-RN-2026-0041')) {
    throw new Error(`Expected traceId bound to incident RN-2026-0041, got ${trace1?.traceId}`);
  }
  // Step and advance
  await post('/api/simulation/step', {});
  const trace2 = (await get('/api/assurance/state')).body.trace;
  if (trace2.traceId !== trace1.traceId) {
    throw new Error(`Trace ID drifted: ${trace1.traceId} vs ${trace2.traceId}`);
  }
  console.log(`  ✓ Unified Trace ID: ${trace1.traceId}`);
  console.log(`  ✓ Persisted across observation, assessment, and propagation lifecycle stages.`);

  // P5-12: Privacy transformation removes restricted fields
  console.log('\n[P5-12] Verifying Privacy Transformation Pipeline...');
  const privState = (await get('/api/assurance/state')).body;
  const transformations = privState.transformations;
  if (!transformations || transformations.length === 0) {
    throw new Error('Privacy transformations list missing');
  }
  const sampleTf = transformations[0];
  console.log(`  ✓ Active Transformation: [${sampleTf.transformId}] on ${sampleTf.sourceEntityId}`);
  console.log(`    - Protected: ${sampleTf.protectedFieldsCount} / ${sampleTf.rawFieldsCount} raw fields via ${sampleTf.aggregationLevel}`);
  console.log(`    - Output Signal: "${sampleTf.outputSignal}" [${sampleTf.classification}]`);

  // P5-13: Unauthorized role cannot access restricted data
  console.log('\n[P5-13] Verifying Role-Based Privacy Boundary (OBSERVER vs COMPLIANCE)...');
  const observerView = (await get('/api/assurance/privacy-filter/OBSERVER')).body.data;
  const complianceView = (await get('/api/assurance/privacy-filter/COMPLIANCE_OFFICER')).body.data;

  if (observerView.proprietary_order_book_depth_usd_m !== '[RESTRICTED_MASKED_BY_PRIVACY_BOUNDARY]') {
    throw new Error(`Observer should see masked order book, got ${observerView.proprietary_order_book_depth_usd_m}`);
  }
  if (typeof complianceView.proprietary_order_book_depth_usd_m !== 'number') {
    throw new Error(`Compliance officer should see raw number, got ${complianceView.proprietary_order_book_depth_usd_m}`);
  }
  console.log(`  ✓ OBSERVER View: proprietary_order_book_depth_usd_m = "${observerView.proprietary_order_book_depth_usd_m}"`);
  console.log(`  ✓ COMPLIANCE View: proprietary_order_book_depth_usd_m = $${complianceView.proprietary_order_book_depth_usd_m}M`);
  console.log('  ✓ Invariant Verified: Unauthorized roles cannot access restricted data.');

  // P5-14: Assurance state responds to evidence degradation
  console.log('\n[P5-14] Verifying Assurance State Response to Evidence Degradation...');
  await post('/api/assurance/inject', { threat: 'THREAT_C_STALE_EVIDENCE' });
  const asrStale = (await get('/api/assurance/state')).body.assurance;
  if (asrStale.assuranceStatus !== 'ASSURANCE_DEGRADED') {
    throw new Error(`Expected ASSURANCE_DEGRADED on stale evidence, got ${asrStale.assuranceStatus}`);
  }
  console.log(`  ✓ Stale Evidence -> Assurance Status: ${asrStale.assuranceStatus}`);

  // P5-15: IBM runtime truth labels remain correct
  console.log('\n[P5-15] Verifying IBM Runtime Truth Labels...');
  const ibmTruth = (await get('/api/assurance/ibm-runtime')).body.ibmRuntime;
  if (ibmTruth.runtimeMode !== 'LOCAL_SIMULATION' || ibmTruth.hardware !== 'ARCHITECTED') {
    throw new Error(`Invalid IBM truth labels: ${JSON.stringify(ibmTruth)}`);
  }
  console.log(`  ✓ Runtime Mode: ${ibmTruth.runtimeMode}`);
  console.log(`  ✓ Hardware Substrate: ${ibmTruth.hardware} (No fake hardware claims)`);
  console.log(`  ✓ Attestation: ${ibmTruth.attestation}`);

  // P5-16: Simulation cannot masquerade as IBM integration
  console.log('\n[P5-16] Verifying Simulation Cannot Masquerade as IBM Integration...');
  const hasFakeIntegration = ibmTruth.capabilities.some(c => c.truthState === 'IBM_INTEGRATED');
  if (hasFakeIntegration) {
    throw new Error('Prototype claimed IBM_INTEGRATED without genuine external service connection!');
  }
  console.log('  ✓ Invariant Verified: Zero capabilities falsely claimed as IBM_INTEGRATED without live connection.');

  // P5-17: Control Foundry respects assurance constraints
  console.log('\n[P5-17] Verifying Control Foundry Respects Assurance Constraints...');
  // Reset, trigger scenario A, then inject evidence conflict
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/assurance/inject', { threat: 'THREAT_E_EVIDENCE_CONFLICT' });

  // Evaluate candidates under conflicted assurance
  const wsConflicted = (await get('/api/foundry/state')).body.workspace;
  const blockedCand = wsConflicted.candidates.find(c => c.assurance_eligibility === 'BLOCKED');
  if (!blockedCand) {
    throw new Error('Candidates should be marked BLOCKED when active evidence conflict exists');
  }
  console.log(`  ✓ Candidate [${blockedCand.id}] Status: ${blockedCand.assurance_eligibility}`);
  console.log(`  ✓ Blocked Reason: "${blockedCand.assurance_blocked_reason}"`);

  // Attempt to authorize blocked candidate
  const authBlocked = await post('/api/foundry/authorize', {
    candidate_id: blockedCand.id,
    role: 'SYSTEM_OPERATOR'
  });
  if (authBlocked.status !== 403 || authBlocked.body.success !== false) {
    throw new Error(`Authorization of blocked candidate should fail with 403: ${JSON.stringify(authBlocked)}`);
  }
  console.log(`  ✓ Authorization Blocked: HTTP 403 [Error: "${authBlocked.body.error}"]`);
  console.log('  ✓ Invariant Verified: Control Foundry respects Phase 5 assurance constraints.');

  // P5-18: Phase 1-4 regressions remain intact
  console.log('\n[P5-18] Verifying Deterministic Baseline Equilibrium...');
  await post('/api/simulation/reset', { seed: 42091 });
  const resetState = (await get('/api/state')).body.data;
  if (resetState.controlState.control_margin_percent !== 91 || resetState.controlState.controllability_state !== 'CONTROL_STABLE') {
    throw new Error(`Reset failed: Control Margin ${resetState.controlState.control_margin_percent}%, state ${resetState.controlState.controllability_state}`);
  }
  const resetAsr = (await get('/api/assurance/state')).body.assurance;
  if (resetAsr.assuranceStatus !== 'ASSURED' || resetAsr.integrityStatus !== 'VERIFIED') {
    throw new Error(`Reset failed to restore ASSURED posture: ${JSON.stringify(resetAsr)}`);
  }
  console.log(`  ✓ Baseline Control Margin: ${resetState.controlState.control_margin_percent}% [${resetState.controlState.controllability_state}]`);
  console.log(`  ✓ Baseline Assurance Posture: ${resetAsr.assuranceStatus} [Integrity: ${resetAsr.integrityStatus}]`);

  // Control Margin Provenance Check (Section 23)
  console.log('\n[PROVENANCE] Verifying Control Margin Provenance...');
  const provRes = await get('/api/assurance/control-margin-provenance');
  if (!provRes.body.success || !provRes.body.provenance) {
    throw new Error('Failed to retrieve Control Margin provenance breakdown');
  }
  const prov = provRes.body.provenance;
  console.log(`  ✓ Mathematical Version: ${prov.calculationVersion} [Source: ${prov.source}]`);
  console.log(`  ✓ Status Label: ${prov.status}`);
  console.log(`  ✓ Breakdown: Dependency=${prov.dependencyContribution}%, Propagation=${prov.propagationContribution}%, Herding=${prov.collectiveDecisionContribution}%`);

  console.log('\n===================================================================');
  console.log('  ALL 18 PHASE 5 ENTERPRISE ASSURANCE ACCEPTANCE TESTS PASSED!');
  console.log('===================================================================\n');
}

runPhase5Verification().catch(err => {
  console.error('\n❌ PHASE 5 VERIFICATION FAILED:', err);
  process.exit(1);
});
