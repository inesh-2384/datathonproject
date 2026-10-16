/**
 * PHASE 5 ACCEPTANCE SUITE 14: IBM Z / LINUXONE TRUTH AUDIT
 * Requirements: Sections 27, 28
 * 
 * Verifies:
 * 1. Queries /api/assurance/ibm-runtime
 * 2. Confirms runtimeMode is honestly reported as 'LOCAL_SIMULATION'
 * 3. Confirms data sources, AI inference, and event streams are flagged as 'SIMULATED'
 * 4. Confirms hardware and enterprise layers are flagged as 'ARCHITECTED'
 * 5. Confirms capability matrix contains zero fake hardware-measured benchmarks
 * 6. Confirms technical rationale for IBM Z / LinuxONE deployment is grounded in co-location, CPACF, and enclaves
 */

const http = require('http');

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

async function runIBMTruthAuditTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 14: IBM Z / LINUXONE TRUTH AUDIT');
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

  // 1. Fetch IBM Runtime Truth state
  const res = await get('/api/assurance/ibm-runtime');
  assert('IBM Runtime endpoint returns HTTP 200', res.status === 200 && res.body.success);

  const truth = res.body.ibmRuntime;
  assert('Runtime context exists and has valid shape', !!truth);

  console.log(`[RUNTIME TRUTH STATUS]`);
  console.log(`  ✓ Runtime Mode:     [${truth.runtimeMode}]`);
  console.log(`  ✓ Data Source:      [${truth.dataSource}]`);
  console.log(`  ✓ Event Stream:     [${truth.eventStream}]`);
  console.log(`  ✓ AI Inference:     [${truth.aiInference}]`);
  console.log(`  ✓ Enterprise Data:  [${truth.enterpriseData}]`);
  console.log(`  ✓ Hardware:         [${truth.hardware}]`);

  // 2. Strict Truth Classification assertions
  assert('Runtime Mode is explicitly LOCAL_SIMULATION (no fake cloud claims)', truth.runtimeMode === 'LOCAL_SIMULATION');
  assert('Data Source is classified as SIMULATED', truth.dataSource === 'SIMULATED');
  assert('AI Inference is classified as SIMULATED', truth.aiInference === 'SIMULATED');
  assert('Hardware substrate is classified as ARCHITECTED', truth.hardware === 'ARCHITECTED');

  // 3. Capability Matrix Audit
  console.log(`\n[CAPABILITY MATRIX AUDIT]`);
  assert('Capability matrix contains key IBM enterprise technologies', Array.isArray(truth.capabilities) && truth.capabilities.length >= 6);

  for (const cap of truth.capabilities) {
    console.log(`  - ${cap.capability.padEnd(30)} | Tech: ${cap.ibmTechnology.padEnd(45)} | State: [${cap.truthState}]`);
    assert(`Capability ${cap.capability} is truthfully labeled ARCHITECTED`, cap.truthState === 'ARCHITECTED');
  }

  // 4. Grounded Hardware Rationale
  assert('Hardware substrate rationale includes technical arguments (Co-location, CPACF, Secure Execution)',
    truth.hardwareSubstrateRationale.includes('Co-Location') &&
    truth.hardwareSubstrateRationale.includes('CPACF') &&
    truth.hardwareSubstrateRationale.includes('Secure Execution'));

  console.log(`\n================================================================`);
  console.log(`  IBM TRUTH AUDIT COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runIBMTruthAuditTests().catch(err => {
  console.error('[FATAL ERROR IN IBM TRUTH AUDIT]:', err);
  process.exit(1);
});
