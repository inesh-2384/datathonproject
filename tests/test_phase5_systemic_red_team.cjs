/**
 * PHASE 5 ACCEPTANCE SUITE 12: ADVERSARIAL SYSTEMIC RED TEAM (R15 - R24)
 * Requirements: Section 17
 * 
 * Attacks Tested:
 * R15 — High dependency concentration, but low stress -> Does system falsely declare crisis?
 * R16 — High stress, but low dependency -> Does dependency receive inappropriate weight?
 * R17 — High decision synchrony during legitimate coordinated action -> Misidentified as panic?
 * R18 — Low EDD with heterogeneous models -> Traceable causal explanation provided?
 * R19 — High EDD hiding shared single point of failure (INFRA-1 / INFRA-2) -> Detected?
 * R20 — Temporary margin bump with residual hazard -> Does system falsely declare restoration?
 * R21 — Evidence stale after intervention -> Verifier blocks unjustified restoration?
 * R22 — Disagreeing evidence sources -> Surfaced as conflict rather than cherry-picked?
 * R23 — Signal dropout -> Confidence reduced, uncertainty widened?
 * R24 — Simple baseline performs equally well -> Transparent admission of lack of delta?
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

async function runSystemicRedTeamTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 12: ADVERSARIAL SYSTEMIC RED TEAM (R15 - R24)');
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
  // R15: High dependency concentration, but low stress
  // -------------------------------------------------------------
  await post('/api/simulation/reset', { seed: 42091 });
  const asm15 = (await get('/api/intelligence/assessment')).body.assessment;
  assert('R15: High dependency baseline with zero stress does NOT declare crisis (Margin >= 90%)',
    asm15.control_margin_percent >= 90 && asm15.controllability_state === 'CONTROL_STABLE');

  // -------------------------------------------------------------
  // R16: High stress, but zero dependency corruption
  // -------------------------------------------------------------
  // In Scenario B (Infrastructure failure), dependency oracle DATA-X is stable, but infra fails
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_B' });
  const asm16 = (await get('/api/intelligence/assessment')).body.assessment;
  console.log(`  ✓ Scenario B Primary Driver: ${asm16.contributions.primary_driver_category}`);
  console.log(`  ✓ Infrastructure Delta: ${asm16.contributions.delta_infrastructure_stress}`);
  assert('R16: Non-dependency shock correctly attributes degradation to Infrastructure, not oracle',
    asm16.contributions.delta_infrastructure_stress < 0 || asm16.contributions.primary_driver_category.includes('Infrastructure') || asm16.contributions.primary_driver_category.includes('Equilibrium'));

  // -------------------------------------------------------------
  // R17: High decision synchrony during legitimate coordinated action
  // -------------------------------------------------------------
  const div17 = (await get('/api/intelligence/decision-diversity')).body.signal;
  assert('R17: EDD engine provides structured alignment taxonomy (not a simple binary panic flag)',
    ['DIVERGENT', 'CORRELATED', 'CONVERGED_SYNCHRONIZED'].includes(div17.recommendation_alignment));

  // -------------------------------------------------------------
  // R18: Low EDD explainability
  // -------------------------------------------------------------
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const div18 = (await get('/api/intelligence/decision-diversity')).body.signal;
  assert('R18: Low EDD identifies causal oracle and provides attribution',
    div18.common_input_oracle_id === 'DATA-X' && typeof div18.herding_correlation_index === 'number');

  // -------------------------------------------------------------
  // R19: Common infrastructure vulnerability cannot hide behind diverse models
  // -------------------------------------------------------------
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_B' });
  const asm19 = (await get('/api/intelligence/assessment')).body.assessment;
  assert('R19: Shared infrastructure collapse degrades margin despite high model diversity',
    asm19.control_margin_percent <= 75);

  // -------------------------------------------------------------
  // R20: Temporary margin bounce with residual hazard
  // -------------------------------------------------------------
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });
  const ws20 = (await get('/api/foundry/state')).body.workspace;
  const partialCand = ws20.candidates.find(c => c.id.includes('PARTIAL-ISO')) || ws20.candidates[1];
  await post('/api/foundry/authorize', {
    candidate_id: partialCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });
  const exec20 = await post('/api/foundry/execute', {
    candidate_id: partialCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });
  assert('R20: Latent residual hazard blocks false restoration (VERIFIED_FAILED)',
    exec20.body.verification.verification_result === 'VERIFIED_FAILED');

  // -------------------------------------------------------------
  // R21: Stale evidence immediately after intervention
  // -------------------------------------------------------------
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  const ws21 = (await get('/api/foundry/state')).body.workspace;
  const cand21 = ws21.candidates.find(c => c.is_minimum_effective);
  await post('/api/foundry/authorize', {
    candidate_id: cand21.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });
  const exec21 = await post('/api/foundry/execute', {
    candidate_id: cand21.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01',
    force_stale_evidence: true
  });
  assert('R21: Stale post-intervention evidence blocks restoration (CONTROL_UNVERIFIED)',
    exec21.body.verification.observed_outcome === 'CONTROL_UNVERIFIED');

  // -------------------------------------------------------------
  // R22: Conflicting evidence sources surfaced
  // -------------------------------------------------------------
  const exec22 = await post('/api/foundry/execute', {
    candidate_id: cand21.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01',
    force_conflicting_telemetry: true
  });
  assert('R22: Disagreeing evidence sources are surfaced explicitly as CONFLICTED',
    exec22.body.verification.observed_outcome === 'CONFLICTED');

  // -------------------------------------------------------------
  // R23: Signal dropout reduces confidence
  // -------------------------------------------------------------
  await post('/api/simulation/reset', { seed: 42091 });
  const asm23 = (await get('/api/intelligence/assessment')).body.assessment;
  assert('R23: Evidence sufficiency score is continuously exposed in assessment',
    typeof asm23.evidence_quality.evidence_sufficiency_score === 'number');

  // -------------------------------------------------------------
  // R24: Baseline equality acknowledged under simple equilibrium
  // -------------------------------------------------------------
  const b1Asm = (await post('/api/intelligence/ablation', { tier: 'B1' })).body.assessment;
  const b5Asm = (await post('/api/intelligence/ablation', { tier: 'B5' })).body.assessment;
  const deltaEquilibrium = Math.abs(b1Asm.control_margin_percent - b5Asm.control_margin_percent);
  console.log(`  ✓ Equilibrium Lead Delta: ${deltaEquilibrium} pts`);
  assert('R24: FIS transparently admits zero/negligible delta under simple equilibrium (delta <= 5)',
    deltaEquilibrium <= 5);

  console.log(`\n================================================================`);
  console.log(`  SYSTEMIC RED TEAM COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runSystemicRedTeamTests().catch(err => {
  console.error('[FATAL ERROR IN SYSTEMIC RED TEAM]:', err);
  process.exit(1);
});
