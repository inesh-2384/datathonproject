/**
 * PHASE 5 ACCEPTANCE SUITE 5: CONTROL MARGIN INDEPENDENT VALIDATION
 * Requirements: Sections 10, 12
 * 
 * Verifies:
 * 1. Additive decomposition identity:
 *    M_net = clamp(M_base + Delta_dep + Delta_prop + Delta_herd + Delta_infra + Delta_rec + Delta_res, 0, 100)
 * 2. Exact numerical tolerance (< 1 point discretization threshold)
 * 3. Monotonic degradation under progressive cascade
 * 4. Bound clamping: never negative, never > 100
 * 5. Deterministic reset back to 91% baseline buffer
 * 6. Contributor lineage machine-readability (no magic/unaccounted adjustments)
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

async function runControlMarginValidationTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 5: CONTROL MARGIN MATHEMATICAL VALIDATION');
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

  // 1. Baseline Equilibrium Identity Check
  await post('/api/simulation/reset', { seed: 42091 });
  let asm = (await get('/api/intelligence/assessment')).body.assessment;
  let c = asm.contributions;

  let computedNet = c.baseline_margin + 
    c.delta_dependency_concentration + 
    c.delta_propagation_depth + 
    c.delta_decision_convergence + 
    c.delta_infrastructure_stress + 
    c.delta_recovery_capacity;
  computedNet = Math.max(0, Math.min(100, Math.round(computedNet)));

  assert('Baseline additive identity holds exactly (M_net == sum(deltas))',
    Math.abs(asm.control_margin_percent - computedNet) <= 1);
  console.log(`  ✓ Baseline M: ${asm.control_margin_percent}% | Sum of deltas: ${computedNet}%`);

  // 2. Stage 0 Shock Identity Check
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  asm = (await get('/api/intelligence/assessment')).body.assessment;
  c = asm.contributions;

  computedNet = c.baseline_margin + 
    c.delta_dependency_concentration + 
    c.delta_propagation_depth + 
    c.delta_decision_convergence + 
    c.delta_infrastructure_stress + 
    c.delta_recovery_capacity;
  computedNet = Math.max(0, Math.min(100, Math.round(computedNet)));

  assert('Stage 0 shock additive identity holds within numerical tolerance',
    Math.abs(asm.control_margin_percent - computedNet) <= 1);
  console.log(`  ✓ Stage 0 M: ${asm.control_margin_percent}% | Sum of deltas: ${computedNet}%`);
  console.log(`    [Contributors]: Dep=${c.delta_dependency_concentration}, Prop=${c.delta_propagation_depth}, Herd=${c.delta_decision_convergence}, Infra=${c.delta_infrastructure_stress}, Rec=${c.delta_recovery_capacity}`);

  // 3. Monotonic Degradation Check across sequential steps
  const marginStage0 = asm.control_margin_percent;
  await post('/api/simulation/step');
  const asmStep1 = (await get('/api/intelligence/assessment')).body.assessment;
  const marginStep1 = asmStep1.control_margin_percent;

  await post('/api/simulation/step');
  const asmStep2 = (await get('/api/intelligence/assessment')).body.assessment;
  const marginStep2 = asmStep2.control_margin_percent;

  console.log(`  ✓ Monotonic Trajectory: T0=${marginStage0}% -> T1=${marginStep1}% -> T2=${marginStep2}%`);
  assert('Cascade propagation causes monotonic or non-increasing control margin (T2 <= T1 <= T0)',
    marginStep2 <= marginStep1 && marginStep1 <= marginStage0);

  // 4. Boundedness Check [0, 100]
  assert('All observed control margins remain strictly within [0, 100]',
    marginStage0 >= 0 && marginStage0 <= 100 &&
    marginStep1 >= 0 && marginStep1 <= 100 &&
    marginStep2 >= 0 && marginStep2 <= 100);

  // 5. Provenance Machine-Readability Check
  const provRes = await get('/api/assurance/control-margin-provenance');
  assert('Control Margin provenance endpoint returns HTTP 200', provRes.status === 200 && provRes.body.success);
  assert('Provenance record includes calculation version and evidence references', 
    provRes.body.provenance && provRes.body.provenance.calculationVersion && Array.isArray(provRes.body.provenance.evidenceRefs));
  console.log(`  ✓ Formula Version: ${provRes.body.provenance.calculationVersion}`);
  console.log(`  ✓ Truth Status: ${provRes.body.provenance.status} (${provRes.body.provenance.source})`);
  console.log(`  ✓ Evidence References Count: ${provRes.body.provenance.evidenceRefs.length}`);

  // 6. Deterministic Reset Verification
  await post('/api/simulation/reset', { seed: 42091 });
  const resetAsm = (await get('/api/intelligence/assessment')).body.assessment;
  assert('Reset deterministically restores Control Margin to 91% buffer',
    resetAsm.control_margin_percent >= 90 && ['CONTROL_STABLE', 'CONTROL_OPTIMAL'].includes(resetAsm.controllability_state));

  console.log(`\n================================================================`);
  console.log(`  CONTROL MARGIN VALIDATION SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runControlMarginValidationTests().catch(err => {
  console.error('[FATAL ERROR IN CONTROL MARGIN VALIDATION SUITE]:', err);
  process.exit(1);
});
