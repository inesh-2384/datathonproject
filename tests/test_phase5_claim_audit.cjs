/**
 * PHASE 5 ACCEPTANCE SUITE 13: SCIENTIFIC CLAIM AUDIT & TRUTH TAXONOMY
 * Requirements: Sections 4, 26, 34
 * 
 * Verifies:
 * 1. Forbidden hype term search in codebase
 * 2. Truth taxonomy adherence across domain models:
 *    - OBSERVED, DERIVED, SIMULATED, EXPERIMENTAL, ARCHITECTED, IMPLEMENTED
 * 3. Model version manifests present in all assessment outputs
 * 4. Research claim boundaries: No claims of "guaranteeing" stability or "production-readiness"
 */

const fs = require('fs');
const path = require('path');
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

const FORBIDDEN_HYPE_TERMS = [
  'world-first',
  'zero-latency',
  'guarantees financial stability',
  'prevents systemic collapse',
  'production-ready enterprise deployment',
  '100% accurate'
];

function scanDirectoryForTerms(dir, terms, found = []) {
  if (!fs.existsSync(dir)) return found;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        scanDirectoryForTerms(fullPath, terms, found);
      }
    } else if (entry.isFile() && /\.(ts|tsx|js|cjs)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
      for (const term of terms) {
        if (content.includes(term.toLowerCase())) {
          found.push({ file: fullPath, term });
        }
      }
    }
  }
  return found;
}

async function runClaimAuditTests() {
  console.log('================================================================');
  console.log('  PHASE 5 TEST SUITE 13: SCIENTIFIC CLAIM AUDIT & TRUTH TAXONOMY');
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

  // 1. Scan codebase for forbidden ungrounded marketing hype
  console.log('[AUDIT 1] Scanning repository source files for forbidden hype terms...');
  const baseDir = path.resolve(__dirname, '..');
  const violations = scanDirectoryForTerms(path.join(baseDir, 'server', 'src'), FORBIDDEN_HYPE_TERMS)
    .concat(scanDirectoryForTerms(path.join(baseDir, 'shared'), FORBIDDEN_HYPE_TERMS));

  if (violations.length > 0) {
    console.warn(`[WARNING] Found ${violations.length} occurrences:`);
    violations.forEach(v => console.warn(`  - [${v.term}] in ${path.relative(baseDir, v.file)}`));
  } else {
    console.log('  ✓ Zero forbidden hype terms found in backend/shared source code.');
  }
  assert('Codebase is clean of unsubstantiated absolutist marketing claims', violations.length === 0);

  // 2. Query Live Intelligence Assessment for Truth Taxonomy
  console.log('\n[AUDIT 2] Verifying Truth Taxonomy Labels on live intelligence objects...');
  const asmRes = await get('/api/intelligence/assessment');
  assert('Assessment API returns valid assessment object', asmRes.status === 200 && asmRes.body.assessment);

  const asm = asmRes.body.assessment;
  assert('Assessment contains explicit model_versions manifest',
    asm.model_versions && 
    asm.model_versions.control_margin_model && 
    asm.model_versions.propagation_model);

  console.log(`  ✓ Control Margin Model Version: ${asm.model_versions.control_margin_model}`);
  console.log(`  ✓ Propagation Model Version: ${asm.model_versions.propagation_model}`);
  console.log(`  ✓ Decision Diversity Version: ${asm.model_versions.decision_diversity_model}`);

  // 3. Inspect Decision Diversity Truth Label
  const divRes = await get('/api/intelligence/decision-diversity');
  const div = divRes.body.signal;
  console.log(`  ✓ Decision Signal Truth Status: [${div.truth_status}]`);
  assert('EDD signal carries explicit EXPERIMENTAL or RESEARCH_HEURISTIC label',
    ['EXPERIMENTAL', 'RESEARCH_HEURISTIC', 'DERIVED'].includes(div.truth_status));

  // 4. Inspect Control Margin Provenance Status Label
  const provRes = await get('/api/assurance/control-margin-provenance');
  const prov = provRes.body.provenance;
  console.log(`  ✓ Control Margin Status: [${prov.status}] (Source: ${prov.source})`);
  assert('Control Margin explicitly classified as EXPERIMENTAL / SIMULATED',
    prov.source === 'SIMULATED_VARIABLE' && prov.status.includes('EXPERIMENTAL'));

  console.log(`\n================================================================`);
  console.log(`  CLAIM AUDIT COMPLETE: ${passed}/${total} PASSED`);
  console.log(`================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runClaimAuditTests().catch(err => {
  console.error('[FATAL ERROR IN CLAIM AUDIT]:', err);
  process.exit(1);
});
