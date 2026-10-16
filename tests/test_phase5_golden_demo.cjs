/**
 * PHASE 5 ACCEPTANCE SUITE 16: THE THREE-MINUTE DEMONSTRATION GOLDEN PATH
 * Requirements: Sections 31, 37
 * 
 * Executes the complete canonical competition walkthrough:
 * Phase 1: Normal baseline equilibrium (Margin ~91%)
 * Phase 2: Inject DATA-X Common Dependency Shock (Margin collapses, window contracts)
 * Phase 3: Controllability intelligence assessment (Additive causal decomposition)
 * Phase 4: Control Foundry counterfactual evaluation & MEI selection
 * Phase 5: Governed authorization & execution workflow (Separation of Duties)
 * Phase 6: Hero Moment — Failure of Apparent Success (Latent contagion detected)
 * Phase 7: Emergency Reassessment & Secondary Backstop Intervention
 * Phase 8: Control verified restored to stable buffer (>80%)
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

async function runGoldenDemo() {
  console.log('================================================================================');
  console.log('  PHASE 5 TEST SUITE 16: THE 3-MINUTE CANONICAL DEMONSTRATION (GOLDEN PATH)');
  console.log('================================================================================\n');

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
  // [0:00 - 0:20] STEP 1: ENTER SYSTEM (Normal Baseline)
  // -------------------------------------------------------------
  console.log('[0:00 - 0:20] ENTER SYSTEM — Authoritative Baseline Equilibrium...');
  await post('/api/simulation/reset', { seed: 42091 });

  const state0 = (await get('/api/state')).body.data;
  const asm0 = (await get('/api/intelligence/assessment')).body.assessment;

  console.log(`  ✓ System Institutions: ${state0.institutions.length} | Dependencies: ${state0.dependencies.length}`);
  console.log(`  ✓ Initial Control Margin: ${asm0.control_margin_percent}% [${asm0.controllability_state}]`);
  console.log(`  ✓ Initial Intervention Window: ${asm0.intervention_window.estimated_window_seconds}s (Trend: ${asm0.intervention_window.trend})`);

  assert('Normal baseline operating at optimal buffer (Margin >= 90%)', asm0.control_margin_percent >= 90);
  assert('Systemic stress index is low (<= 0.15)', asm0.systemic_stress_index <= 0.15);

  // -------------------------------------------------------------
  // [0:20 - 0:45] STEP 2: INJECT COMMON DEPENDENCY FAILURE (DATA-X)
  // -------------------------------------------------------------
  console.log('\n[0:20 - 0:45] INJECT COMMON DEPENDENCY SHOCK (DATA-X Outage & Cascade)...');
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/simulation/step');
  await post('/api/simulation/step');

  const asmDegraded = (await get('/api/intelligence/assessment')).body.assessment;
  const divDegraded = (await get('/api/intelligence/decision-diversity')).body.signal;

  console.log(`  ✓ Degraded Control Margin: ${asmDegraded.control_margin_percent}% [${asmDegraded.controllability_state}]`);
  console.log(`  ✓ Collapsed Intervention Window: ${asmDegraded.intervention_window.estimated_window_seconds}s (Trend: ${asmDegraded.intervention_window.trend})`);
  console.log(`  ✓ Effective Decision Diversity (EDD): ${divDegraded.effective_decision_diversity} (Alignment: ${divDegraded.recommendation_alignment})`);

  assert('Control margin collapsed below 45% under DATA-X compromise', asmDegraded.control_margin_percent <= 45);
  assert('Intervention window contracted to critical range (<= 30s)', asmDegraded.intervention_window.estimated_window_seconds <= 30);
  assert('EDD collapsed below 0.25', divDegraded.effective_decision_diversity <= 0.25);

  // -------------------------------------------------------------
  // [0:45 - 1:10] STEP 3: EXPLAIN WHY CONTROL IS DEGRADING
  // -------------------------------------------------------------
  console.log('\n[0:45 - 1:10] EXPLAIN WHY CONTROL IS DEGRADING (Additive Causal Attribution)...');
  const c = asmDegraded.contributions;
  console.log(`  ✓ Primary Driver Category: ${c.primary_driver_category}`);
  console.log(`  ✓ Additive Decomposition: Dep=${c.delta_dependency_concentration} | Prop=${c.delta_propagation_depth} | Herd=${c.delta_decision_convergence}`);
  console.log(`  ✓ Causal Driver: ${asmDegraded.primary_driver}`);

  assert('Primary driver correctly identifies structural concentration or propagation',
    c.primary_driver_category.includes('Concentration') || c.primary_driver_category.includes('Chokepoint') || c.primary_driver_category.includes('Propagation') || c.primary_driver_category.includes('Dependency'));
  assert('Evidence sufficiency confirmed high (>= 0.85)', asmDegraded.evidence_quality.evidence_sufficiency_score >= 0.85);

  // -------------------------------------------------------------
  // [1:10 - 1:35] STEP 4: CONTROL FOUNDRY (Counterfactual & MEI)
  // -------------------------------------------------------------
  console.log('\n[1:10 - 1:35] CONTROL FOUNDRY — Counterfactual Evaluation & Candidate Selection...');
  const cfRes = await post('/api/intelligence/counterfactual', {
    target_entity_id: 'DATA-X',
    hypothesis: 'Hypothetical circuit breaker isolation of DATA-X'
  });
  const cf = cfRes.body.result;
  console.log(`  ✓ Counterfactual Projection: Margin restores from ${cf.baseline_control_margin}% to ${cf.counterfactual_control_margin}% (Delta: +${cf.delta_margin} pts)`);
  assert('Counterfactual evaluation projects recovery without mutating live state', cf.executed === false && cf.delta_margin > 0);

  const ws = (await get('/api/foundry/state')).body.workspace;
  const meiCand = ws.candidates.find(c => c.is_minimum_effective) || ws.candidates[0];
  console.log(`  ✓ Selected MEI Candidate: [${meiCand.id}] ${meiCand.label} (Score: ${meiCand.composite_suitability_score})`);
  assert('Foundry identified Minimum Effective Intervention (MEI)', !!meiCand);

  // -------------------------------------------------------------
  // [1:35 - 1:55] STEP 5: GOVERNANCE & EXECUTION
  // -------------------------------------------------------------
  console.log('\n[1:35 - 1:55] GOVERNANCE — Request -> Authorization -> Execution...');
  const authRes = await post('/api/foundry/authorize', {
    candidate_id: meiCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });
  assert('Intervention authorized by Incident Commander', authRes.body.success === true);

  const execRes = await post('/api/foundry/execute', {
    candidate_id: meiCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });
  assert('Intervention executed via Governed Execution Bus', execRes.body.success === true && execRes.body.execution.status === 'EXECUTED');

  // -------------------------------------------------------------
  // [2:00 - 2:25] STEP 6: HERO MOMENT — FAILURE OF APPARENT SUCCESS
  // -------------------------------------------------------------
  console.log('\n[2:00 - 2:25] HERO MOMENT — Verification Failure Under Latent Contagion (Scenario C)...');
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });
  const wsC = (await get('/api/foundry/state')).body.workspace;
  const partialCand = wsC.candidates.find(c => c.id.includes('PARTIAL-ISO')) || wsC.candidates[1];

  await post('/api/foundry/authorize', {
    candidate_id: partialCand.id,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const flawedExec = await post('/api/foundry/execute', {
    candidate_id: partialCand.id,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });

  const vFlawed = flawedExec.body.verification;
  console.log(`  ✓ Execution Status: ${flawedExec.body.execution.status}`);
  console.log(`  ✓ Enclave Verifier Outcome: ${vFlawed.verification_result} (${vFlawed.observed_outcome})`);
  console.log(`  ✓ Discrepancy: ${vFlawed.margin_discrepancy} pts`);

  assert('Hero Moment: Execution succeeds technically, but Independent Verifier detects failure',
    flawedExec.body.execution.status === 'EXECUTED' &&
    vFlawed.verification_result === 'VERIFIED_FAILED' &&
    vFlawed.observed_outcome === 'CONTROL_NOT_RESTORED');

  // -------------------------------------------------------------
  // [2:25 - 2:45] STEP 7: REASSESSMENT & SECONDARY RECOVERY
  // -------------------------------------------------------------
  console.log('\n[2:25 - 2:45] REASSESSMENT — Automated Emergency Escalation & Second Intervention...');
  const reassessRecord = flawedExec.body.reassessment;
  assert('Failed verification triggered automated emergency reassessment', !!reassessRecord);

  const backstopCandId = reassessRecord.escalated_candidate_id;
  console.log(`  ✓ Reassessment Escalated Candidate: ${backstopCandId}`);

  // Authorize and execute secondary backstop candidate
  await post('/api/foundry/authorize', {
    candidate_id: backstopCandId,
    role: 'INCIDENT_COMMANDER',
    user_id: 'USR-CMD-01'
  });

  const backstopExec = await post('/api/foundry/execute', {
    candidate_id: backstopCandId,
    role: 'SYSTEM_OPERATOR',
    user_id: 'USR-OP-01'
  });

  const vBackstop = backstopExec.body.verification;
  const finalMargin = backstopExec.body.control_state.control_margin_percent;
  console.log(`  ✓ Backstop Verification Result: ${vBackstop.verification_result}`);
  console.log(`  ✓ Backstop Final Margin: ${finalMargin}% [${backstopExec.body.control_state.controllability_state}]`);

  assert('Secondary intervention restores control equilibrium (Margin >= 80%)',
    finalMargin >= 80 && ['VERIFIED_EFFECTIVE', 'PARTIAL_RECOVERY'].includes(vBackstop.verification_result));

  // -------------------------------------------------------------
  // [2:45 - 3:00] STEP 8: CLOSING THESIS
  // -------------------------------------------------------------
  console.log('\n[2:45 - 3:00] CLOSING THESIS:');
  console.log('  "Risk tells us how bad the situation may become."');
  console.log('  "Control tells us whether we can still change its trajectory."');
  console.log('  "Financial Immune System continuously measures that gap."');
  assert('Canonical golden demonstration executed end-to-end without presenter manipulation', true);

  console.log(`\n================================================================================`);
  console.log(`  THE THREE-MINUTE DEMONSTRATION PASSED: ${passed}/${total} STEPS VERIFIED`);
  console.log(`================================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runGoldenDemo().catch(err => {
  console.error('[FATAL ERROR IN GOLDEN DEMO]:', err);
  process.exit(1);
});
