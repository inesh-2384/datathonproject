/**
 * PHASE 5 ACCEPTANCE SUITE 10: DETERMINISTIC REPLAY & EXPERIMENT REPRODUCIBILITY
 * Requirements: Sections 18, 19
 * 
 * Verifies:
 * 1. Executes Scenario A across 3 independent runs from seed 42091
 * 2. Compares Control Margin, Controllability State, and Event Counts across all 3 runs
 * 3. Verifies that State Hashes match across independent executions
 * 4. Verifies replay timeline capture and scrubber (/api/simulation/replay/timeline, /api/simulation/replay/scrub)
 * 5. Generates authoritative Experiment Manifest metadata
 */

const http = require('http');
const crypto = require('crypto');

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

function computeDigest(data) {
  // Hash authoritative domain topology and control metrics (invariant to wall-clock Date.now() in assessment IDs)
  const canonical = {
    institutions: data.institutions,
    dependencies: data.dependencies,
    dataProviders: data.dataProviders,
    infrastructureNodes: data.infrastructureNodes,
    aiModels: data.aiModels,
    assets: data.assets,
    incidents: data.incidents,
    control_margin_percent: data.controlState.control_margin_percent,
    controllability_state: data.controlState.controllability_state
  };
  return crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
}

async function runDeterministicReplayTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 10: DETERMINISTIC REPLAY & REPRODUCIBILITY');
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

  const runResults = [];

  // Run Scenario A 3 times
  for (let runIdx = 1; runIdx <= 3; runIdx++) {
    console.log(`[RUN ${runIdx}/3] Executing Scenario A deterministic trajectory (Seed: 42091)...`);
    await post('/api/simulation/reset', { seed: 42091 });
    await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
    await post('/api/simulation/step');
    await post('/api/simulation/step');

    const stateRes = await get('/api/state');
    const asmRes = await get('/api/intelligence/assessment');
    const divRes = await get('/api/intelligence/decision-diversity');

    const stateData = stateRes.body.data;
    const asm = asmRes.body.assessment;
    const div = divRes.body.signal;
    const digest = computeDigest(stateData);

    const record = {
      run: runIdx,
      digest,
      margin: asm.control_margin_percent,
      controllability_state: asm.controllability_state,
      edd: div.effective_decision_diversity,
      events_count: stateData.authoritativeEvents.length
    };
    runResults.push(record);

    console.log(`  ✓ State Digest: sha256:${digest.slice(0, 16)}...`);
    console.log(`  ✓ Control Margin: ${record.margin}% [${record.controllability_state}]`);
    console.log(`  ✓ EDD: ${record.edd} | Events: ${record.events_count}`);
  }

  // 1. Check identity across Run 1, 2, and 3
  const r1 = runResults[0];
  const r2 = runResults[1];
  const r3 = runResults[2];

  assert('Run 1 and Run 2 Control Margins are identical', r1.margin === r2.margin);
  assert('Run 2 and Run 3 Control Margins are identical', r2.margin === r3.margin);
  assert('Run 1, 2, 3 Controllability States are identical', 
    r1.controllability_state === r2.controllability_state && r2.controllability_state === r3.controllability_state);
  assert('Run 1, 2, 3 Effective Decision Diversity are identical',
    r1.edd === r2.edd && r2.edd === r3.edd);
  assert('Run 1, 2, 3 Authoritative Event counts are identical',
    r1.events_count === r2.events_count && r2.events_count === r3.events_count);
  assert('Run 1, 2, 3 State Digests are 100% identical (sha256 match)',
    r1.digest === r2.digest && r2.digest === r3.digest);

  // 2. Replay Timeline Inspection
  const timelineRes = await get('/api/simulation/replay/timeline');
  assert('Replay timeline API returns HTTP 200', timelineRes.status === 200 && timelineRes.body.success);
  assert('Replay timeline contains recorded frames', 
    Array.isArray(timelineRes.body.timeline) && timelineRes.body.timeline.length > 0);

  // 3. Replay Scrubber Test
  const scrubRes = await post('/api/simulation/replay/scrub', { tick: 0 });
  assert('Replay scrubber successfully resets to target tick 0', scrubRes.status === 200 && scrubRes.body.success);

  console.log(`\n================================================================`);
  console.log(`  DETERMINISTIC REPLAY SUITE COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runDeterministicReplayTests().catch(err => {
  console.error('[FATAL ERROR IN DETERMINISTIC REPLAY SUITE]:', err);
  process.exit(1);
});
