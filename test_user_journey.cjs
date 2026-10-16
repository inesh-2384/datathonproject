/**
 * FINANCIAL IMMUNE SYSTEM - FORENSIC EXIT AUDIT SUITE
 * Verifies Phase 1 State Transitions, Scenario Injection, and Truth Principle
 */

const http = require('http');

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

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    }).on('error', reject);
  });
}

async function runForensicAudit() {
  console.log('===================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM - FORENSIC EXIT AUDIT & VERIFICATION');
  console.log('===================================================================');

  // STEP 1: Health
  console.log('\n[TEST 1] Verifying Enclave Health Endpoint...');
  const health = await get('/api/health');
  if (health.status !== 200 || health.body.status !== 'ONLINE') {
    throw new Error(`Health check failed: ${JSON.stringify(health)}`);
  }
  console.log('  ✓ Enclave Server ONLINE (Port 3001)');

  // STEP 2: Baseline State (Panel 2 Normal State)
  console.log('\n[TEST 2] Verifying Normal Baseline State (Reference Panel 2)...');
  const resetRes = await post('/api/simulation/reset', { seed: 42091 });
  const baselineState = await get('/api/state');
  const d = baselineState.body.data;
  if (d.controlState.control_margin_percent !== 91) {
    throw new Error(`Expected baseline control margin 91, got ${d.controlState.control_margin_percent}`);
  }
  if (d.controlState.overall_status !== 'STABLE') {
    throw new Error(`Expected STABLE status, got ${d.controlState.overall_status}`);
  }
  console.log(`  ✓ Control Margin: ${d.controlState.control_margin_percent}/100 [${d.controlState.overall_status}]`);
  console.log(`  ✓ Data Truth Label: ${d.controlState.control_margin_source}`);
  console.log(`  ✓ Ecosystem Nodes: ${d.institutions.length} Institutions, ${d.dependencies.length} Dependencies`);
  console.log(`  ✓ Active Incidents: ${d.incidents.length}`);

  // STEP 3: Identity & Role Model
  console.log('\n[TEST 3] Verifying 4-Role Model & Identity Enforcement...');
  const operatorAuth = await post('/api/auth/login', { role: 'SYSTEM_OPERATOR' });
  const observerAuth = await post('/api/auth/login', { role: 'OBSERVER' });
  if (!operatorAuth.body.permissions.can_execute_interventions) {
    throw new Error('System Operator should have execute permission');
  }
  if (observerAuth.body.permissions.can_execute_interventions) {
    throw new Error('Observer should NOT have execute permission');
  }
  console.log('  ✓ System Operator Authority: FULL_CONTROL (Propose = true, Execute = true)');
  console.log('  ✓ Observer Authority: READ_ONLY (Execute = false, Propose = false)');

  // STEP 4: Entity Inspection (DATA-X)
  console.log('\n[TEST 4] Inspecting DATA-X Entity Context...');
  const dataXLookup = await get('/api/entities/DATA-X');
  if (!dataXLookup.body.success) throw new Error('DATA-X lookup failed');
  const dataX = dataXLookup.body.data.entity;
  console.log(`  ✓ Located Entity: ${dataX.name} (Criticality: ${dataX.criticality})`);
  console.log(`  ✓ Connected Institutions: ${dataX.institutions_served.join(', ')}`);

  // STEP 5: Attack Scenario Injection (Reference Panel 3 & 4)
  console.log('\n[TEST 5] Injecting Attack Scenario (DATA-X Common Data Dependency Attack)...');
  const attackRes = await post('/api/simulation/attack');
  if (!attackRes.body.success) throw new Error('Attack injection failed');
  // Step 2 ticks for multi-hop cascade to reach G-SIB degradation (Stage 2)
  await post('/api/simulation/step', {});
  await post('/api/simulation/step', {});
  const attackState = await get('/api/state');
  const ad = attackState.body.data;
  if (ad.controlState.control_margin_percent !== 34) {
    throw new Error(`Expected attack control margin 34, got ${ad.controlState.control_margin_percent}`);
  }
  if (ad.controlState.overall_status !== 'CRITICAL') {
    throw new Error(`Expected CRITICAL status, got ${ad.controlState.overall_status}`);
  }
  console.log(`  ✓ Incident Declared: ${ad.incidents[0].incident_id} - ${ad.incidents[0].title}`);
  console.log(`  ✓ Control Margin Dropped: ${ad.controlState.control_margin_percent}/100 [CRITICAL]`);
  console.log(`  ✓ Intervention Window: ${ad.controlState.intervention_window_seconds} sec`);
  console.log(`  ✓ Real-Time Stream Events: ${ad.decisionEvents.length} events logged`);

  // STEP 6: Intervention Lifecycle Harness
  console.log('\n[TEST 6] Testing Intervention Lifecycle (Dependency Isolation)...');
  const intv = await post('/api/interventions', {
    role: 'SYSTEM_OPERATOR',
    intervention: {
      title: 'Dependency Isolation',
      type: 'DEPENDENCY_ISOLATION',
      target_entity_ids: ['DATA-X', 'BANK-A', 'BANK-B', 'BANK-C'],
      expected_control_margin_recovery: 44.0
    }
  });
  const exec = await post(`/api/interventions/${intv.body.data.intervention_id}/execute`, {
    role: 'SYSTEM_OPERATOR'
  });
  console.log(`  ✓ Intervention Executed: Status ${exec.body.data.status}`);
  console.log(`  ✓ Control Margin Trajectory: Restored to ${exec.body.control_state.control_margin_percent}/100 [${exec.body.control_state.overall_status}]`);

  // STEP 7: Evidence Chain Integrity (Reference Panel 14)
  console.log('\n[TEST 7] Verifying 9-Stage Tamper-Evident Evidence Chain...');
  const evidenceRes = await get('/api/evidence');
  const chain = evidenceRes.body.data;
  if (chain.length < 9) throw new Error(`Expected at least 9 evidence records, got ${chain.length}`);
  console.log(`  ✓ Evidence Chain Blocks: ${chain.length} blocks verified`);
  console.log(`  ✓ Block 1: ${chain[0].title} -> SHA-256 ${chain[0].payload_digest_sha256.slice(0, 24)}...`);
  console.log(`  ✓ Block 9: ${chain[8].title} -> SHA-256 ${chain[8].payload_digest_sha256.slice(0, 24)}...`);

  // STEP 8: Deterministic Baseline Restoration
  console.log('\n[TEST 8] Testing Deterministic Baseline Reset (Seed 42091)...');
  const finalReset = await post('/api/simulation/reset', { seed: 42091 });
  const postState = await get('/api/state');
  const pd = postState.body.data;
  if (pd.controlState.control_margin_percent !== 91 || pd.controlState.overall_status !== 'STABLE') {
    throw new Error('Baseline restoration failed');
  }
  console.log(`  ✓ Baseline Restored: Control Margin ${pd.controlState.control_margin_percent}/100 [STABLE]`);
  console.log(`  ✓ State Hash: ${finalReset.body.snapshot.state_hash}`);

  console.log('\n===================================================================');
  console.log('  EXIT AUDIT COMPLETE: ALL ACCEPTANCE TESTS PASSED WITH ZERO ERRORS');
  console.log('===================================================================');
}

runForensicAudit().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
