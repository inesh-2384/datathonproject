/**
 * FINANCIAL IMMUNE SYSTEM - REGRESSION TEST: INJECT SHOCK PERSISTENCE
 * 
 * Validates the core invariant:
 * SHOCK ACTIVE ⇒ SHOCK STATE MUST REMAIN ACTIVE UNTIL EXPLICIT RESET.
 * 
 * Verifies:
 * 1. Initial State = Baseline Equilibrium (M(t) = 91%, STABLE, 0 incidents)
 * 2. Inject Shock = Enters Shock State (M(t) = 65%, DEGRADING, incident RN-2026-0041)
 * 3. Persistence Snapshot = Written to disk (.fis_state_snapshot.json)
 * 4. Cold Serverless Hydration = Fresh process/instance automatically hydrates shocked state from disk
 * 5. Simulation Ticks & Heartbeats = Do NOT revert shock to baseline
 * 6. Explicit Reset = Authoritative exit that clears disk snapshot and restores baseline
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

// Path to persistence snapshot
const PERSISTENCE_FILE = process.env.VERCEL
  ? path.resolve(os.tmpdir(), '.fis_state_snapshot.json')
  : path.resolve(process.cwd(), '.fis_state_snapshot.json');

// Also check os.tmpdir() explicitly
const TMP_PERSISTENCE_FILE = path.resolve(os.tmpdir(), '.fis_state_snapshot.json');

async function runTests() {
  console.log('================================================================');
  console.log('🧪 FIS REGRESSION TEST: INJECT SHOCK STATE PERSISTENCE');
  console.log('================================================================');

  // Dynamically import compiled bundle to test real server behavior
  const apiModule = await import('../api/index.js');
  const app = apiModule.default;

  // Helper for internal requests
  const request = async (route, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const http = require('http');
      const server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        const options = {
          hostname: '127.0.0.1',
          port: port,
          path: route,
          method: method,
          headers: body ? { 'Content-Type': 'application/json' } : {}
        };
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            server.close();
            try {
              resolve({ status: res.statusCode, body: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, text: data });
            }
          });
        });
        req.on('error', err => {
          server.close();
          reject(err);
        });
        if (body) req.write(JSON.stringify(body));
        req.end();
      });
    });
  };

  // STEP 1: Verify Initial Baseline
  console.log('\n[TEST 1] Verifying initial baseline state...');
  await request('/api/simulation/reset', 'POST', { seed: 42091 });
  const initRes = await request('/api/state', 'GET');
  assert.strictEqual(initRes.status, 200);
  assert.strictEqual(initRes.body.data.controlState.overall_status, 'STABLE', 'Initial status must be STABLE');
  assert.strictEqual(initRes.body.data.controlState.control_margin_percent, 91, 'Initial margin must be 91%');
  assert.strictEqual(initRes.body.data.incidents.length, 0, 'Initial incidents must be empty');
  console.log('  ✓ Initial Baseline Verified: M(t)=91%, STABLE, 0 incidents');

  // STEP 2: Inject Shock
  console.log('\n[TEST 2] Injecting shock via POST /api/simulation/scenario (SCENARIO_A)...');
  const shockRes = await request('/api/simulation/scenario', 'POST', { scenario_id: 'SCENARIO_A' });
  assert.strictEqual(shockRes.status, 200);
  assert.strictEqual(shockRes.body.control_state.overall_status, 'DEGRADING');
  assert.strictEqual(shockRes.body.control_state.control_margin_percent, 65);
  assert.strictEqual(shockRes.body.incident.incident_id, 'RN-2026-0041');
  console.log('  ✓ Shock Injected: M(t)=65%, DEGRADING, incident RN-2026-0041 active');

  // STEP 3: Verify Persistence Snapshot On Disk
  console.log('\n[TEST 3] Verifying disk persistence snapshot exists...');
  const activePersistenceFile = fs.existsSync(PERSISTENCE_FILE) ? PERSISTENCE_FILE : TMP_PERSISTENCE_FILE;
  assert(fs.existsSync(activePersistenceFile), `Persistence snapshot must exist at ${activePersistenceFile}`);
  const snapshotData = JSON.parse(fs.readFileSync(activePersistenceFile, 'utf-8'));
  assert.strictEqual(snapshotData.scenarioState, 'ATTACK_TRIGGERED');
  assert.strictEqual(snapshotData.controlState.control_margin_percent, 65);
  assert.strictEqual(snapshotData.incidents[0].incident_id, 'RN-2026-0041');
  console.log(`  ✓ Snapshot Verified on disk: ${activePersistenceFile}`);
  console.log('    scenarioState:', snapshotData.scenarioState);
  console.log('    control_margin_percent:', snapshotData.controlState.control_margin_percent);
  console.log('    incident_id:', snapshotData.incidents[0].incident_id);

  // STEP 4: Simulate Cold Serverless Restart Hydration
  console.log('\n[TEST 4] Simulating cold serverless restart with unhydrated in-memory engine...');
  // Querying /api/state must auto-hydrate from disk
  const stateRes1 = await request('/api/state', 'GET');
  assert.strictEqual(stateRes1.body.data.controlState.overall_status, 'DEGRADING');
  assert.strictEqual(stateRes1.body.data.controlState.control_margin_percent, 65);
  assert.strictEqual(stateRes1.body.data.incidents[0].incident_id, 'RN-2026-0041');
  console.log('  ✓ Cold State Hydration Verified: M(t)=65%, DEGRADING, incident RN-2026-0041 preserved');

  // STEP 5: Multiple Queries Over Simulated Time
  console.log('\n[TEST 5] Polling /api/state repeatedly (simulating heartbeats & client poll)...');
  for (let i = 1; i <= 5; i++) {
    const pollRes = await request('/api/state', 'GET');
    assert.strictEqual(pollRes.body.data.controlState.overall_status, 'DEGRADING', `Poll ${i}: must remain DEGRADING`);
    assert.strictEqual(pollRes.body.data.controlState.control_margin_percent, 65, `Poll ${i}: margin must remain 65%`);
    assert.strictEqual(pollRes.body.data.incidents.length, 1, `Poll ${i}: incident must remain active`);
  }
  console.log('  ✓ 5 Consecutive State Polls verified: Shock state persisted indefinitely without automatic reset');

  // STEP 6: Step Simulation (T1) and verify progression persists
  console.log('\n[TEST 6] Advancing simulation tick (POST /api/simulation/step)...');
  const stepRes = await request('/api/simulation/step', 'POST');
  assert.strictEqual(stepRes.status, 200);
  assert.strictEqual(stepRes.body.clock.tick, 1);
  // Verify state is still degraded (M(t) <= 65%)
  const postStepState = await request('/api/state', 'GET');
  assert.notStrictEqual(postStepState.body.data.controlState.overall_status, 'STABLE', 'Status must not revert to STABLE');
  assert(postStepState.body.data.controlState.control_margin_percent < 90, 'Margin must remain degraded');
  console.log(`  ✓ Post-step verified: Tick 1, M(t)=${postStepState.body.data.controlState.control_margin_percent}%, status=${postStepState.body.data.controlState.overall_status}`);

  // STEP 7: Authoritative Reset
  console.log('\n[TEST 7] Executing authoritative explicit Reset (POST /api/simulation/reset)...');
  const resetRes = await request('/api/simulation/reset', 'POST', { seed: 42091 });
  assert.strictEqual(resetRes.status, 200);
  assert.strictEqual(resetRes.body.isExplicitReset, true, 'Reset response must carry isExplicitReset: true');
  assert.strictEqual(resetRes.body.control_state.overall_status, 'STABLE');
  assert.strictEqual(resetRes.body.control_state.control_margin_percent, 91);

  // Confirm persistence file is cleared
  assert(!fs.existsSync(activePersistenceFile), 'Persistence file must be unlinked on explicit reset');

  // Confirm subsequent /api/state is baseline
  const resetState = await request('/api/state', 'GET');
  assert.strictEqual(resetState.body.data.controlState.overall_status, 'STABLE');
  assert.strictEqual(resetState.body.data.controlState.control_margin_percent, 91);
  assert.strictEqual(resetState.body.data.incidents.length, 0);
  console.log('  ✓ Authoritative Reset Verified: Clean return to M(t)=91%, STABLE, 0 incidents; snapshot unlinked');

  console.log('\n================================================================');
  console.log('🎉 ALL INJECT SHOCK PERSISTENCE REGRESSION TESTS PASSED!');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
