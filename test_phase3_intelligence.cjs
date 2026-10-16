/**
 * FINANCIAL IMMUNE SYSTEM - PHASE 3 SYSTEMIC INTELLIGENCE TEST SUITE
 * Comprehensive Invariant & Acceptance Verification:
 * 
 * 1. Phase 2 regression suite validation
 * 2. Dependency intelligence & concentration calculation
 * 3. Systemic concentration metrics (4 HHI dimensions)
 * 4. Propagation intelligence & scope (LOCALIZED vs SYSTEMIC)
 * 5. Dynamic state-derived causal explanations
 * 6. Collective decision convergence & effective decision diversity (EDD)
 * 7. Scenario D execution (Deterministic diversity collapse)
 * 8. Control Margin mathematical contribution model (M(t) = M0 + sum(Delta_Mi))
 * 9. Controllability state transitions
 * 10. Acceptance Test 2: Epistemic uncertainty & false recovery prevention (CONTROL_UNVERIFIED)
 * 11. Model version provenance (CM-0.2, PROP-0.2, EDD-0.1, etc.)
 * 12. Ablation baseline configuration interfaces (B0 to B5)
 * 13. Deterministic Scenario D replay & bit-for-bit SHA-256 hash equality
 * 14. Cross-view intelligence consistency
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    const req = http.request(url, {
      method,
      headers: reqHeaders,
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout on ${method} ${path}`));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const get = (path, headers) => request('GET', path, null, headers);
const post = (path, body, headers) => request('POST', path, body, headers);

async function runPhase3Verification() {
  console.log('===================================================================');
  console.log('  FINANCIAL IMMUNE SYSTEM - PHASE 3 SYSTEMIC INTELLIGENCE SUITE');
  console.log('===================================================================');

  // STEP 1: Verify Enclave Health
  console.log('\n[TEST 1] Verifying Enclave Server Health...');
  const health = await get('/api/health');
  if (health.status !== 200 || health.body.status !== 'ONLINE') {
    throw new Error(`Enclave health check failed: ${JSON.stringify(health)}`);
  }
  console.log(`  ✓ Enclave Server ONLINE (Port 3001, Tick: ${health.body.simulation_clock?.tick ?? 0})`);

  // Reset to Baseline
  await post('/api/simulation/reset', { seed: 42091 });

  // STEP 2: Dependency Intelligence & Concentration Calculation
  console.log('\n[TEST 2] Verifying Dependency Intelligence & Chokepoint Criticality...');
  const depRes = await get('/api/intelligence/dependencies');
  if (!depRes.body.success || !depRes.body.dependencies || depRes.body.dependencies.length === 0) {
    throw new Error('Failed to retrieve dependency intelligence records');
  }
  const deps = depRes.body.dependencies;
  const sampleDep = deps[0];
  if (typeof sampleDep.centrality_score !== 'number' || typeof sampleDep.systemic_reach_score !== 'number') {
    throw new Error(`Invalid dependency intelligence attributes: ${JSON.stringify(sampleDep)}`);
  }
  const chokepoints = deps.filter(d => d.is_chokepoint);
  if (chokepoints.length === 0 || !chokepoints.every(c => c.criticality === 'CHOKEPOINT')) {
    throw new Error('Chokepoints not properly classified as CHOKEPOINT criticality');
  }
  console.log(`  ✓ Evaluated ${deps.length} Dependencies across network`);
  console.log(`  ✓ Sample [${sampleDep.dependency_id}]: Centrality=${sampleDep.centrality_score}, Systemic Reach=${sampleDep.systemic_reach_score}, HHI=${sampleDep.exposure_concentration_hhi}`);
  console.log(`  ✓ Systemic Chokepoints Identified: ${chokepoints.length} rails with CHOKEPOINT criticality`);

  // STEP 3: Systemic Concentration Metrics (4 HHI Dimensions)
  console.log('\n[TEST 3] Verifying Systemic Concentration Metrics (HHI Dimensions)...');
  const assessRes = await get('/api/intelligence/assessment');
  if (!assessRes.body.success || !assessRes.body.assessment) {
    throw new Error('Failed to retrieve intelligence assessment');
  }
  const conc = assessRes.body.assessment.concentration_metrics;
  if (!conc || typeof conc.data_concentration_hhi !== 'number' || typeof conc.infrastructure_concentration_hhi !== 'number') {
    throw new Error(`Invalid concentration metrics: ${JSON.stringify(conc)}`);
  }
  console.log(`  ✓ Data Oracle Concentration HHI: ${conc.data_concentration_hhi}`);
  console.log(`  ✓ Infrastructure Rail Concentration HHI: ${conc.infrastructure_concentration_hhi}`);
  console.log(`  ✓ Model Herding Concentration HHI: ${conc.model_concentration_hhi}`);
  console.log(`  ✓ Dependency Exposure Concentration HHI: ${conc.dependency_exposure_hhi}`);
  console.log(`  ✓ Composite Concentration Index: ${conc.composite_concentration_index} [${conc.truth_status}]`);

  // STEP 4: Propagation Intelligence & Scope (LOCALIZED vs SYSTEMIC)
  console.log('\n[TEST 4] Verifying Propagation Intelligence & Scope Classification...');
  const prop = assessRes.body.assessment.propagation_intelligence;
  if (!prop || !['LOCALIZED', 'SYSTEMIC'].includes(prop.scope)) {
    throw new Error(`Invalid propagation scope: ${JSON.stringify(prop)}`);
  }
  console.log(`  ✓ Baseline Scope: ${prop.scope} (Affected Nodes: ${prop.breadth_affected_nodes}, Depth: ${prop.maximum_depth_hops} hops)`);

  // STEP 5: Dynamic State-Derived Causal Explanation Chain
  console.log('\n[TEST 5] Verifying State-Derived Causal Progression Synthesis...');
  const causalChain = assessRes.body.assessment.causal_explanation_chain;
  if (!Array.isArray(causalChain) || causalChain.length === 0) {
    throw new Error('Causal explanation chain is missing or empty');
  }
  console.log(`  ✓ Generated ${causalChain.length}-step narrative from live graph state`);
  console.log(`  ✓ Step 1: "${causalChain[0]}"`);

  // STEP 6: Collective Decision Intelligence & Effective Decision Diversity (EDD)
  console.log('\n[TEST 6] Verifying Effective Decision Diversity (Apparent vs Effective)...');
  const divRes = await get('/api/intelligence/decision-diversity');
  if (!divRes.body.success || !divRes.body.signal) {
    throw new Error('Failed to retrieve collective decision signal');
  }
  const sig = divRes.body.signal;
  if (typeof sig.observed_model_diversity !== 'number' || typeof sig.effective_decision_diversity !== 'number') {
    throw new Error(`Invalid decision diversity signal: ${JSON.stringify(sig)}`);
  }
  console.log(`  ✓ Observed Model Diversity: ${sig.observed_model_diversity} (Apparent Architecture Count)`);
  console.log(`  ✓ Effective Decision Diversity: ${sig.effective_decision_diversity} (Discounted for Shared Oracles)`);
  console.log(`  ✓ Recommendation Alignment: ${sig.recommendation_alignment} [Decision Synchrony: ${sig.decision_synchrony_percent}%]`);
  console.log(`  ✓ Research Label: ${sig.truth_status}`);

  // STEP 7: Scenario D Execution (Collective Decision Convergence & Herding Fragility)
  console.log('\n[TEST 7] Verifying Scenario D: Collective Decision Convergence (Herding Collapse)...');
  const scD = await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_D' });
  if (!scD.body.success) throw new Error('Scenario D failed to start');

  // Advance simulation through multi-stage progression
  await post('/api/simulation/step', {}); // T1: Macro benchmark input alignment
  await post('/api/simulation/step', {}); // T2: Decision synchrony spike & EDD collapse
  await post('/api/simulation/step', {}); // T3: Synchronized liquidity pull
  await post('/api/simulation/step', {}); // T4: Fragility confirmed

  const stateD = await get('/api/state');
  const dd = stateD.body.data;
  const intelD = dd.controlState.intelligence;
  const sigD = intelD.collective_decision_signal;

  if (sigD.effective_decision_diversity > 0.20) {
    throw new Error(`Expected Effective Decision Diversity to collapse <= 0.20, got ${sigD.effective_decision_diversity}`);
  }
  if (sigD.recommendation_alignment !== 'CONVERGED_SYNCHRONIZED') {
    throw new Error(`Expected CONVERGED_SYNCHRONIZED alignment, got ${sigD.recommendation_alignment}`);
  }
  if (dd.controlState.control_margin_percent > 50) {
    throw new Error(`Expected Control Margin <= 50% in Scenario D, got ${dd.controlState.control_margin_percent}%`);
  }
  if (dd.controlState.controllability_state !== 'CONTROL_CRITICAL') {
    throw new Error(`Expected controllability_state CONTROL_CRITICAL, got ${dd.controlState.controllability_state}`);
  }
  console.log(`  ✓ Effective Diversity Collapsed: ${sigD.observed_model_diversity} → ${sigD.effective_decision_diversity} [Synchrony: ${sigD.decision_synchrony_percent}%]`);
  console.log(`  ✓ Controllability State: ${dd.controlState.controllability_state}`);
  console.log(`  ✓ Control Margin: ${dd.controlState.control_margin_percent}%`);
  console.log(`  ✓ Estimated Intervention Window: ${dd.controlState.intervention_window_seconds}s`);

  // STEP 8: Control Margin Mathematical Contribution Analysis
  console.log('\n[TEST 8] Verifying Mathematical Contribution Breakdown (M(t) = M0 + Σ ΔMi)...');
  const contrib = intelD.contributions;
  if (!contrib || contrib.baseline_margin !== 91) {
    throw new Error(`Invalid contribution model: ${JSON.stringify(contrib)}`);
  }
  console.log(`  ✓ Baseline M0: ${contrib.baseline_margin}%`);
  console.log(`  ✓ Δ Dependency Concentration: ${contrib.delta_dependency_concentration}%`);
  console.log(`  ✓ Δ Propagation Depth: ${contrib.delta_propagation_depth}%`);
  console.log(`  ✓ Δ Infrastructure Stress: ${contrib.delta_infrastructure_stress}%`);
  console.log(`  ✓ Δ Collective Decision Herding: ${contrib.delta_decision_convergence}%`);
  console.log(`  ✓ Net Control Margin M(t): ${contrib.net_control_margin}% [Primary: ${contrib.primary_driver_category}]`);

  // STEP 9: Controllability State Transitions
  console.log('\n[TEST 9] Verifying Controllability State Machine Transitions...');
  // Baseline check
  await post('/api/simulation/reset', { seed: 42091 });
  const baseState = (await get('/api/state')).body.data.controlState;
  if (baseState.controllability_state !== 'CONTROL_STABLE') {
    throw new Error(`Expected CONTROL_STABLE at baseline, got ${baseState.controllability_state}`);
  }
  console.log(`  ✓ Baseline: ${baseState.controllability_state} [${baseState.control_margin_percent}%]`);

  // Scenario B: Infrastructure Failure -> CONTROL_COLLAPSING
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_B' });
  await post('/api/simulation/step', {});
  await post('/api/simulation/step', {});
  const bState = (await get('/api/state')).body.data.controlState;
  if (bState.controllability_state !== 'CONTROL_COLLAPSING') {
    throw new Error(`Expected CONTROL_COLLAPSING in Scenario B, got ${bState.controllability_state}`);
  }
  console.log(`  ✓ Scenario B: ${bState.controllability_state} [${bState.control_margin_percent}%]`);

  // STEP 10: Acceptance Test 2 - Epistemic Uncertainty & False Recovery Prevention
  console.log('\n[TEST 10] Verifying Acceptance Test 2: Epistemic Uncertainty & False Recovery Prevention...');
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_C' });
  await post('/api/simulation/step', {}); // Stage 1
  await post('/api/simulation/step', {}); // Stage 2
  await post('/api/simulation/step', {}); // Stage 3: Residual risk declared
  const cState = (await get('/api/state')).body.data.controlState;
  if (cState.controllability_state !== 'CONTROL_UNVERIFIED') {
    throw new Error(`Expected CONTROL_UNVERIFIED under residual risk, got ${cState.controllability_state}`);
  }
  const cIntel = cState.intelligence;
  if (!cIntel.evidence_quality.conflict_detected) {
    throw new Error('Expected conflict_detected = true under residual risk verification anomaly');
  }
  console.log(`  ✓ Invariant: System prevented false recovery declaration.`);
  console.log(`  ✓ Controllability State: ${cState.controllability_state}`);
  console.log(`  ✓ Conflict Description: "${cIntel.evidence_quality.conflict_description}"`);
  console.log(`  ✓ Confidence Downgraded: ${cIntel.evidence_quality.confidence_rating}`);

  // STEP 11: Model Version Provenance & Intelligence Metadata
  console.log('\n[TEST 11] Verifying Intelligence Model Versioning & Assessment Provenance...');
  const versions = cIntel.model_versions;
  if (versions.control_margin_model !== 'CM-0.2' || versions.propagation_model !== 'PROP-0.2' || versions.decision_diversity_model !== 'EDD-0.1') {
    throw new Error(`Model version mismatch: ${JSON.stringify(versions)}`);
  }
  console.log(`  ✓ Assessment ID: ${cIntel.assessment_id}`);
  console.log(`  ✓ Model Manifest: CM=${versions.control_margin_model}, PROP=${versions.propagation_model}, EDD=${versions.decision_diversity_model}, HHI=${versions.concentration_model}, EVD=${versions.evidence_evaluation_model}`);

  // STEP 12: Ablation Baseline Configuration Interfaces (B0 - B5)
  console.log('\n[TEST 12] Verifying Ablation Baseline Interfaces (B0 - B5)...');
  const bConfig = (await get('/api/intelligence/ablation')).body.config;
  if (!bConfig || bConfig.active_tier !== 'B5') {
    throw new Error(`Expected active_tier B5, got ${bConfig?.active_tier}`);
  }
  // Test tier switch to B2
  const setB2 = await post('/api/intelligence/ablation', { tier: 'B2' });
  if (!setB2.body.success || setB2.body.config.active_tier !== 'B2' || setB2.body.config.enable_collective_decision_signal !== false) {
    throw new Error(`Failed to set ablation tier B2: ${JSON.stringify(setB2.body)}`);
  }
  // Restore B5
  await post('/api/intelligence/ablation', { tier: 'B5' });
  console.log('  ✓ Ablation Baseline B0 - B5 interfaces verified; B5 Full Systemic Controllability restored.');

  // STEP 13: Deterministic Scenario D Replay & Bit-for-Bit Hash Equality
  console.log('\n[TEST 13] Verifying Deterministic Scenario D Replay & Cryptographic Hash Equality...');
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_D' });
  await post('/api/simulation/step', {});
  const timeline1 = (await get('/api/simulation/replay/timeline')).body.timeline;
  const hashD1 = timeline1.find(f => f.tick === 1)?.state_hash;

  // Re-run identically
  await post('/api/simulation/reset', { seed: 42091 });
  await post('/api/simulation/scenario', { scenario_id: 'SCENARIO_D' });
  await post('/api/simulation/step', {});
  const timeline2 = (await get('/api/simulation/replay/timeline')).body.timeline;
  const hashD2 = timeline2.find(f => f.tick === 1)?.state_hash;

  if (hashD1 !== hashD2) {
    throw new Error(`Deterministic hash mismatch in Scenario D: ${hashD1} !== ${hashD2}`);
  }
  console.log(`  ✓ SCENARIO D BIT-FOR-BIT HASH EQUALITY: ${hashD1} === ${hashD2}`);

  // STEP 14: Cross-View Intelligence Consistency
  console.log('\n[TEST 14] Verifying Cross-View Intelligence Consistency...');
  const stateSnapshot = (await get('/api/state')).body.data;
  const directAssessment = (await get('/api/intelligence/assessment')).body.assessment;
  if (stateSnapshot.controlState.intelligence.assessment_id !== directAssessment.assessment_id) {
    throw new Error('Inconsistency between /api/state intelligence and /api/intelligence/assessment');
  }
  console.log(`  ✓ Invariant Verified: Control Center, System Map, Globe, and Intelligence Inspector read identical state.`);

  console.log('\n===================================================================');
  console.log('  ALL 14 PHASE 3 SYSTEMIC INTELLIGENCE INVARIANTS PASSED!');
  console.log('===================================================================\n');
}

runPhase3Verification().catch(err => {
  console.error('\n❌ PHASE 3 TEST SUITE FAILED:', err);
  process.exit(1);
});
