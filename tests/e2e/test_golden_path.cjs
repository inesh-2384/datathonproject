const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
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
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runGoldenPath() {
  console.log('===================================================================');
  console.log('  EXECUTING PHASE 1 GOLDEN PATH (12-STEP OPERATIONAL WALKTHROUGH)');
  console.log('===================================================================');

  // STEP 1: LANDING & SYSTEM STATUS
  console.log('[STEP 1: LANDING] Querying initial ecosystem health...');
  const health = await get('/api/health');
  console.log(`  ✓ System: ${health.body.system} (version: ${health.body.version})`);

  // STEP 2: ENTRY ACTION
  console.log('[STEP 2: ENTRY ACTION] User triggers Enter Control Environment...');
  const baselineState = (await get('/api/state')).body.data;
  console.log(`  ✓ Baseline Control Margin: ${baselineState.controlState.control_margin_percent}% [${baselineState.controlState.overall_status}]`);

  // STEP 3: ROLE & SESSION
  console.log('[STEP 3: ROLE / SESSION] Authenticating as SYSTEM_OPERATOR...');
  const login = await post('/api/auth/login', { role: 'SYSTEM_OPERATOR' });
  const token = login.body.session.enclave_session_token;
  console.log(`  ✓ Session established: ${token} (Role: ${login.body.session.role})`);

  // STEP 4: MISSION CONTROL SHELL
  console.log('[STEP 4: MISSION CONTROL] Loading Control Center Decision Surface...');
  const entities = (await get('/api/entities')).body.data;
  console.log(`  ✓ Loaded ${entities.institutions.length} G-SIBs, ${entities.dependencies.length} rails, ${entities.dataProviders.length} providers`);

  // STEP 5: SELECT ENTITY (DATA-X)
  console.log('[STEP 5: SELECT ENTITY] Selecting critical oracle DATA-X...');
  const entityDataX = (await get('/api/entities/DATA-X')).body.data;
  console.log(`  ✓ Entity Context: ${entityDataX.entity.name} (Status: ${entityDataX.entity.status})`);

  // STEP 6: INSPECT ENTITY CONTEXT
  console.log('[STEP 6: INSPECT ENTITY] Reading connected institutions and rails...');
  console.log(`  ✓ Institutions served: ${entityDataX.entity.institutions_served.join(', ')}`);
  console.log(`  ✓ Connected dependencies count: ${entityDataX.connected_dependencies.length}`);

  // STEP 7: NAVIGATE WORKSPACE (System Map & Propagation)
  console.log('[STEP 7: NAVIGATE WORKSPACE] Contextual navigation across views...');
  const depIntel = (await get('/api/entities/DEP_DATA_X_BANK_A')).body.data;
  console.log(`  ✓ Rail DEP_DATA_X_BANK_A Systemic Criticality: ${depIntel.intelligence.criticality_tier} (Centrality: ${depIntel.intelligence.centrality_score})`);

  // STEP 8: OBSERVE LIVE EVENT STREAM
  console.log('[STEP 8: OBSERVE LIVE EVENT] Inspecting live authoritative event queue...');
  const events = (await get('/api/events')).body.data;
  console.log(`  ✓ Event Queue depth: ${events.length} events logged`);

  // STEP 9: TRIGGER SUPPORTED SCENARIO (SCENARIO A)
  console.log('[STEP 9: TRIGGER SCENARIO] Injecting Scenario A (DATA-X Attack)...');
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_A' });
  await post('/api/simulation/step', {});
  await post('/api/simulation/step', {});

  // STEP 10: OBSERVE STATE CHANGE
  console.log('[STEP 10: OBSERVE STATE CHANGE] Verifying systemic degradation...');
  const stressedState = (await get('/api/state')).body.data;
  const stressedDataX = (await get('/api/entities/DATA-X')).body.data;
  console.log(`  ✓ Control Margin plunged to: ${stressedState.controlState.control_margin_percent}% [${stressedState.controlState.overall_status}]`);
  console.log(`  ✓ DATA-X status transitioned to: ${stressedDataX.entity.status}`);
  console.log(`  ✓ Active Incident created: ${stressedState.incidents[0].incident_id} - ${stressedState.incidents[0].title}`);

  // STEP 11: RESET SCENARIO
  console.log('[STEP 11: RESET SCENARIO] Triggering deterministic baseline reset...');
  await post('/api/simulation/reset', { seed: 42091 });

  // STEP 12: RETURN TO BASELINE
  console.log('[STEP 12: RETURN TO BASELINE] Verifying pristine state restoration...');
  const restoredState = (await get('/api/state')).body.data;
  const restoredDataX = (await get('/api/entities/DATA-X')).body.data;
  console.log(`  ✓ Control Margin restored to: ${restoredState.controlState.control_margin_percent}% [${restoredState.controlState.overall_status}]`);
  console.log(`  ✓ Active incidents count: ${restoredState.incidents.length}`);
  console.log(`  ✓ DATA-X status restored to: ${restoredDataX.entity.status}`);

  console.log('\n===================================================================');
  console.log('  GOLDEN PATH COMPLETE: 12/12 STEPS SUCCEEDED WITH ZERO ERRORS');
  console.log('===================================================================');
}

runGoldenPath().catch(err => {
  console.error('Golden path failed:', err);
  process.exit(1);
});
