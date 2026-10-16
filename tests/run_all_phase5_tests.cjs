/**
 * MASTER PHASE 5 AUTOMATED SUITE RUNNER
 * Executes all 16 Phase 5 test suites and reports final pass/fail matrix.
 */

const { execSync } = require('child_process');
const path = require('path');

const SUITES = [
  'test_phase5_baseline_comparison.cjs',
  'test_phase5_ablation.cjs',
  'test_phase5_sensitivity.cjs',
  'test_phase5_falsification.cjs',
  'test_phase5_control_margin_validation.cjs',
  'test_phase5_edd_validation.cjs',
  'test_phase5_counterfactual_integrity.cjs',
  'test_phase5_false_recovery.cjs',
  'test_phase5_evidence_degradation.cjs',
  'test_phase5_deterministic_replay.cjs',
  'test_phase5_governance_red_team.cjs',
  'test_phase5_systemic_red_team.cjs',
  'test_phase5_claim_audit.cjs',
  'test_phase5_ibm_truth_audit.cjs',
  'test_phase5_performance.cjs',
  'test_phase5_golden_demo.cjs'
];

async function runAll() {
  console.log('================================================================================');
  console.log('       FINANCIAL IMMUNE SYSTEM — PHASE 5 MASTER AUDIT & TEST RUNNER             ');
  console.log('================================================================================\n');

  const results = [];

  for (const suite of SUITES) {
    const fullPath = path.join(__dirname, suite);
    process.stdout.write(`Executing ${suite.padEnd(45)} `);
    const t0 = Date.now();
    try {
      execSync(`node "${fullPath}"`, { stdio: 'pipe' });
      const durationMs = Date.now() - t0;
      console.log(`[PASS] (${durationMs}ms)`);
      results.push({ suite, passed: true, durationMs });
    } catch (err) {
      const durationMs = Date.now() - t0;
      console.log(`[FAIL] (${durationMs}ms)`);
      console.error(err.stdout ? err.stdout.toString() : err.message);
      results.push({ suite, passed: false, durationMs });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  console.log('\n================================================================================');
  console.log(`  PHASE 5 TEST SUITE SUMMARY: ${passedCount} / ${results.length} SUITES PASSED (${Math.round(passedCount/results.length*100)}%)`);
  console.log('================================================================================\n');

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runAll();
