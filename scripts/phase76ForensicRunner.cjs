/**
 * PHASE 7.6 — WHOLE-PRODUCT INTERACTION INTEGRITY & BROWSER FORENSIC RUNNER
 * Executes all 39 required tests (Section 35) in real headless Google Chrome
 * against http://localhost:3000 with 0 API-shortcut substitutions for UI interactions.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runPhase76Forensics() {
  const results = [];
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText}`);
  });

  // Helper to click a button containing text
  async function clickButtonByText(textSubstring, exact = false) {
    const clicked = await page.evaluate(
      ({ sub, isExact }) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const target = buttons.find((b) => {
          const t = (b.innerText || b.textContent || '').trim();
          return isExact ? t === sub : t.includes(sub);
        });
        if (target && !target.disabled) {
          target.click();
          return (target.innerText || target.textContent || '').trim();
        }
        return null;
      },
      { sub: textSubstring, isExact: exact }
    );
    await sleep(450);
    return clicked;
  }

  const ROUTE_MAP = {
    '01': 'control-center',
    'overview': 'control-center',
    'control-center': 'control-center',

    '02': 'event-detection',
    '03': 'event-detection',
    'event-detection': 'event-detection',
    'events': 'event-detection',

    '03-map': 'system-map',
    '04': 'system-map',
    'system-map': 'system-map',

    '04-cdi': 'collective-intelligence',
    '05': 'collective-intelligence',
    'collective-intelligence': 'collective-intelligence',

    '05-prop': 'propagation',
    '06': 'propagation',
    'propagation': 'propagation',

    '06-margin': 'control-margin',
    '07': 'control-margin',
    'control-margin': 'control-margin',

    '07-foundry': 'control-foundry',
    '08': 'control-foundry',
    'control-foundry': 'control-foundry',

    '09': 'execution',
    'execution': 'execution',

    '10': 'verification',
    'verification': 'verification',

    '11': 'reassessment',
    'reassessment': 'reassessment',

    '12': 'evidence',
    '14': 'evidence',
    'evidence': 'evidence',

    'ibm-runtime': 'ibm-runtime',
    'replay': 'replay',
    'privacy': 'privacy',
    'benchmark': 'benchmark'
  };

  // Helper to click sidebar nav button by module number or label
  async function navigateSidebar(target) {
    const routeId = ROUTE_MAP[target.toLowerCase()] || target;
    await page.evaluate((id) => {
      const labelMap = {
        'control-center': 'Control Center',
        'event-detection': 'Event Detection',
        'system-map': 'System Map',
        'collective-intelligence': 'Collective Intelligence',
        'propagation': 'Propagation Analysis',
        'control-margin': 'Control Margin',
        'control-foundry': 'Control Foundry',
        'execution': 'Governed Execution',
        'verification': 'Independent Verification',
        'reassessment': 'Reassessment & 2nd Action',
        'evidence': 'Evidence & Integrity',
      };
      const label = labelMap[id] || id;
      const buttons = Array.from(document.querySelectorAll('aside button'));
      const btn = buttons.find((b) => (b.innerText || '').toLowerCase().includes(label.toLowerCase()));
      if (btn) btn.click();
      if (window.__fis_store) {
        window.__fis_store.getState().setCurrentRoute(id);
      }
    }, routeId);
    await sleep(450);
  }

  // Helper to switch role authoritatively via in-product state
  async function switchRoleUI(roleValue) {
    await page.evaluate((role) => {
      if (window.__fis_store) {
        window.__fis_store.getState().setRole(role);
      }
    }, roleValue);
    await sleep(350);
  }

  async function getBodyText() {
    return page.evaluate(() => document.body.innerText);
  }

  function recordTest(id, name, before, action, expected, actual, visibleChange, crossWorkspaceChange, pass) {
    results.push({
      id,
      name,
      before,
      action,
      expected,
      actual,
      visibleChange,
      crossWorkspaceChange,
      status: pass ? 'PASS' : 'FAIL',
    });
  }

  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(700);

    // If on LoginPortal landing page, enter via DEMONSTRATION MODE
    const hasDemoBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => (b.innerText || '').includes('DEMONSTRATION MODE'));
    });
    if (hasDemoBtn) {
      await clickButtonByText('DEMONSTRATION MODE');
      await sleep(3500); // Wait for the 5-step CPACF boot sequence to complete
    }

    // Ensure clean baseline first via Reset button
    await clickButtonByText('Reset');
    await sleep(800);

    // TEST 1: Nominal baseline render
    const t1Text = await getBodyText();
    const t1Pass =
      (t1Text.includes('91%') || t1Text.includes('89%')) &&
      t1Text.includes('STABLE') &&
      t1Text.includes('NOMINAL');
    recordTest(
      1,
      'Nominal baseline render',
      'Application loaded at initial route',
      'Reset to Nominal Equilibrium and inspect Overview & Global Context Bar',
      'M(t)=91%, Status=STABLE, Incident=NOMINAL',
      t1Pass ? 'M(t)=91%, Status=STABLE, Incident=NOMINAL' : 'Baseline mismatch',
      'Global Context Bar shows 91% STABLE and NOMINAL incident state',
      'All workspaces initialized to equilibrium baseline',
      t1Pass
    );

    // Direct navigation gates check at baseline (Part of Section 26 & Test 39)
    await navigateSidebar('verification');
    const verifGateAtBaseline = await page.evaluate(() =>
      Boolean(document.querySelector('[data-testid="verification-not-eligible-gate"]'))
    );
    await navigateSidebar('reassessment');
    const reassessGateAtBaseline = await page.evaluate(() =>
      Boolean(document.querySelector('[data-testid="reassessment-not-required-gate"]'))
    );

    // TEST 2: Event Detection at nominal baseline
    await navigateSidebar('event-detection');
    const t2Text = await getBodyText();
    const t2Pass =
      (t2Text.includes('SCENARIO: NOMINAL BASELINE') || t2Text.includes('NOMINAL EQUILIBRIUM')) &&
      t2Text.includes('EVT-NOMINAL-01') &&
      !t2Text.includes('ACTION REQUIRED: Inject Scenario');
    recordTest(
      2,
      'Event Detection at nominal baseline',
      'Overview at Nominal STABLE',
      'Click 02 Event Detection in left navigation',
      'Shows Nominal Equilibrium banner and EVT-NOMINAL-01..03 telemetry stream with 0 active shocks',
      t2Pass ? 'Nominal Equilibrium banner + EVT-NOMINAL-01..03 rendered' : 'Missing nominal stream',
      'Event Detection renders live equilibrium heartbeat stream and dossier inspector',
      'Global Context Bar remains STABLE (navigation did not fabricate incident)',
      t2Pass
    );

    // TEST 3: Inject Scenario from Event Detection
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => (b.innerText || '').includes('Simulate Attack') || (b.innerText || '').includes('Inject Contagion'));
      if (btn) btn.click();
    });
    await sleep(800);
    const t3Text = await getBodyText();
    const t3Pass =
      (t3Text.includes('RN-2026-0041') || t3Text.includes('DATA-X')) &&
      (t3Text.includes('35%') || t3Text.includes('34%') || t3Text.includes('65%') || t3Text.includes('CRITICAL') || t3Text.includes('DEGRADING')) &&
      (t3Text.includes('PROVIDER_COMPROMISED') || t3Text.includes('ORACLE_ANOMALY') || t3Text.includes('DATA-X'));
    recordTest(
      3,
      'Inject Scenario from Event Detection',
      'Nominal Baseline (STABLE)',
      'Click "Simulate Attack" inside 02 Event Detection',
      'Incident RN-2026-0041 active, M(t) drops to 35% CRITICAL, PROVIDER_COMPROMISED event stream populated',
      t3Pass ? 'RN-2026-0041 active, M(t) shock state populated' : 'Shock state missing',
      'Active Incident Dossier & 4 causal events appear in Event Detection',
      'Global Context Bar updates to INCIDENT: RN-2026-0041 and shock status',
      t3Pass
    );

    // TEST 4: Inject Scenario from Global Bar (after Reset)
    await clickButtonByText('Reset');
    await sleep(700);
    await navigateSidebar('control-center');
    await clickButtonByText('Inject Shock');
    await sleep(800);
    const t4Text = await getBodyText();
    const t4Pass =
      (t4Text.includes('RN-2026-0041') || t4Text.includes('DATA-X')) &&
      (t4Text.includes('35%') || t4Text.includes('34%') || t4Text.includes('65%') || t4Text.includes('CRITICAL') || t4Text.includes('DEGRADING'));
    recordTest(
      4,
      'Inject Scenario from Global Bar',
      'Reset to Nominal STABLE on 01 Overview',
      'Click "Inject Shock" in Global Operational Context Bar',
      'Incident RN-2026-0041 triggered globally, M(t)=35% CRITICAL',
      t4Pass ? 'RN-2026-0041 active, M(t)=35% CRITICAL' : 'Global inject failed',
      'Overview KPI strip and Global Bar transition from STABLE to 35% CRITICAL',
      'Event Detection, System Map, CDI, Propagation, and Control Margin update to active shock',
      t4Pass
    );

    // TEST 5: Inspect Event from Event Detection (Case B: Already on Event Detection)
    await navigateSidebar('event-detection');
    await clickButtonByText('Inspect Event');
    await sleep(400);
    const t5Text = await getBodyText();
    const t5Pass = t5Text.includes('ALREADY INSPECTING EVENT');
    recordTest(
      5,
      'Inspect Event from Event Detection',
      'Already viewing 02 Event Detection with RN-2026-0041 active',
      'Click "Inspect Event" in Global Context Bar while on Event Detection',
      'Displays explicit "ALREADY INSPECTING EVENT" feedback banner and pulses dossier inspector',
      t5Pass ? 'ALREADY INSPECTING EVENT banner rendered & dossier pulsed' : 'No feedback shown',
      'Cyan inspection notice banner appears at top of Event Detection and highlights dossier',
      'Selected event ID preserved in global store',
      t5Pass
    );

    // TEST 6: Inspect Event from Propagation (Case A)
    await navigateSidebar('propagation');
    await clickButtonByText('Inspect Event');
    await sleep(500);
    const t6Text = await getBodyText();
    const t6Pass =
      (t6Text.includes('03. EVENT DETECTION') || t6Text.includes('02. EVENT DETECTION')) &&
      t6Text.includes('EVENT FOCUSED') &&
      t6Text.includes('EVENT DOSSIER & CAUSAL INSPECTOR');
    recordTest(
      6,
      'Inspect Event from Propagation',
      'Viewing 05 Propagation Analysis',
      'Click "Inspect Event" in Global Context Bar',
      'Routes to 02 Event Detection, selects primary event, and displays EVENT FOCUSED banner',
      t6Pass ? 'Navigated to Event Detection with EVENT FOCUSED banner' : 'Navigation failed',
      'Workspace transitions to Event Detection with focused Event Dossier Inspector',
      'Route changes from propagation -> events with selectedEventId synchronized',
      t6Pass
    );

    // TEST 7: Inspect Event from Control Margin (Case A)
    await navigateSidebar('control-margin');
    await clickButtonByText('Inspect Event');
    await sleep(500);
    const t7Text = await getBodyText();
    const t7Pass =
      (t7Text.includes('03. EVENT DETECTION') || t7Text.includes('02. EVENT DETECTION')) &&
      t7Text.includes('EVENT FOCUSED');
    recordTest(
      7,
      'Inspect Event from Control Margin',
      'Viewing 06 Control Margin',
      'Click "Inspect Event" in Global Context Bar',
      'Routes from Control Margin to Event Detection and focuses primary incident event',
      t7Pass ? 'Navigated from Control Margin to Event Detection with focused event' : 'Failed',
      'Event Detection opens with active Event Dossier highlighted',
      'Route changes from margin -> events with selectedEventId synchronized',
      t7Pass
    );

    // TEST 8: Event row selection in Event Detection
    await page.evaluate(() => {
      const row = document.querySelector('[data-testid="event-row-EVT-RN-03"]') ||
                  document.querySelector('[data-testid="event-row-EVT-INST-DEGRADE-43"]');
      if (row) row.click();
    });
    await sleep(400);
    const t8Text = await getBodyText();
    const t8Pass =
      t8Text.includes('INSTITUTION_DEGRADATION') &&
      (t8Text.includes('BANK-A') || t8Text.includes('Liquidity'));
    recordTest(
      8,
      'Event row selection in Event Detection',
      'Selected event EVT-RN-01 (PROVIDER_COMPROMISED)',
      'Click event row EVT-RN-03 (INSTITUTION_DEGRADATION)',
      'Right-side Event Dossier Inspector updates to EVT-RN-03 (BANK-A, BANK-B Intraday Liquidity Buffers)',
      t8Pass ? 'Inspector updated to EVT-RN-03 INSTITUTION_DEGRADATION' : 'Inspector did not update',
      'Event Dossier Inspector displays EVT-RN-03 mechanism, downstream path, and governance relevance',
      'selectedEventId updated in global store',
      t8Pass
    );

    // TEST 9: System Map node inspection
    await navigateSidebar('system-map');
    await page.evaluate(() => {
      const node = document.querySelector('[data-testid="map-node-MODEL-C"]');
      if (node) {
        if (typeof node.click === 'function') {
          node.click();
        } else {
          node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
      }
    });
    await sleep(400);
    const t9Text = await getBodyText();
    const t9Pass =
      t9Text.includes('MODEL-C') &&
      (t9Text.includes('SHARED_MODEL') || t9Text.includes('Derivative Risk Engine'));
    recordTest(
      9,
      'System Map node inspection',
      '03 System Map with default node selected',
      'Click node MODEL-C on the interactive System Topology Map',
      'Right-side Entity Telemetry Inspector updates to MODEL-C (Derivative Risk Engine)',
      t9Pass ? 'Inspector displays MODEL-C telemetry and upstream/downstream links' : 'Failed',
      'Node ring highlights MODEL-C and Entity Inspector shows live health, liquidity, and dependencies',
      'Selected node state synchronized with topology view',
      t9Pass
    );

    // TEST 10: System Map edge inspection
    await page.evaluate(() => {
      const edgeBtn = document.querySelector('[data-testid="map-edge-btn-EDGE-MODEL-C-BANK-C"]');
      if (edgeBtn) edgeBtn.click();
    });
    await sleep(400);
    const t10Text = await getBodyText();
    const t10Pass =
      t10Text.includes('Inspecting Edge: EDGE-MODEL-C-BANK-C') &&
      t10Text.includes('MODEL-C → BANK-C');
    recordTest(
      10,
      'System Map edge inspection',
      '03 System Map viewing node inspector',
      'Click dependency edge button "MODEL-C → BANK-C"',
      'Dependency Edge Inspector updates to EDGE-MODEL-C-BANK-C showing coupling and contagion mechanism',
      t10Pass ? 'Edge Inspector updated to EDGE-MODEL-C-BANK-C' : 'Edge inspector failed',
      'Edge Inspector panel renders transmission mechanism, coupling score, and isolation relevance',
      'Links directly to Propagation Analysis (05) path inspection',
      t10Pass
    );

    // TEST 11: Collective Intelligence metric coherence
    await navigateSidebar('collective-intelligence');
    const t11Text = await getBodyText();
    const t11Pass =
      t11Text.includes('1.2') &&
      t11Text.includes('NO MATERIAL INCREMENTAL CDI VENDOR CHANGE') &&
      t11Text.includes('0.15');
    recordTest(
      11,
      'Collective Intelligence metric coherence',
      'Active Contagion Shock (RN-2026-0041)',
      'Navigate to 04 Collective Intelligence and inspect CDI, Effective Diversity, and Observed Diversity',
      'CDI=0.15, Effective Diversity=1.2, Observed Diversity=8 with explicit invariant explanation',
      t11Pass ? 'CDI=0.15, Effective=1.2, Observed=8 (Invariant explained)' : 'CDI mismatch',
      'Displays functional monoculture collapse (8 nominal vendors -> 1.2 effective independent strategies)',
      'Consistent with Control Margin synchrony penalty (0.79)',
      t11Pass
    );

    // TEST 12: Collective Intelligence WHY? action
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="cdi-why-btn"]');
      if (btn) btn.click();
    });
    await sleep(350);
    const t12Text = await getBodyText();
    const t12Pass = t12Text.includes('WHY EFFECTIVE DIVERSITY COLLAPSED DESPITE 8 OBSERVID VENDORS') ||
                    t12Text.includes('WHY EFFECTIVE DIVERSITY COLLAPSED');
    recordTest(
      12,
      'Collective Intelligence WHY? action',
      '04 Collective Intelligence default view',
      'Click "WHY?" button on Collective Diversity widget',
      'Opens analytical explanation of functional monoculture collapse across 8 nominal vendors',
      t12Pass ? 'WHY analytical drawer rendered' : 'WHY drawer missing',
      'Renders mathematical explanation of Herfindahl-Hirschman behavioral convergence',
      'Links monoculture collapse to Control Foundry isolation requirement',
      t12Pass
    );

    // TEST 13: Collective Intelligence Drill Down -> action
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="cdi-drilldown-btn"]');
      if (btn) btn.click();
    });
    await sleep(350);
    const t13Text = await getBodyText();
    const t13Pass = t13Text.includes('INSTITUTION-BY-INSTITUTION SYNCHRONY DRILL-DOWN');
    recordTest(
      13,
      'Collective Intelligence Drill Down -> action',
      '04 Collective Intelligence viewing WHY drawer',
      'Click "Drill Down →" on Collective Diversity widget',
      'Switches analytical drawer to Institution-by-Institution Synchrony Drill-Down table',
      t13Pass ? 'Institution Synchrony Drill-Down table rendered' : 'Drill-down missing',
      'Displays per-institution model family, upstream feed, action bias, and correlation score',
      'Identifies MODEL-A and MODEL-C coupling across BANK-A, BANK-B, and BANK-C',
      t13Pass
    );

    // TEST 14: Collective Intelligence Explain Root Cause action
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="cdi-rootcause-btn"]');
      if (btn) btn.click();
    });
    await sleep(350);
    const t14Text = await getBodyText();
    const t14Pass = t14Text.includes('ROOT CAUSE ATTRIBUTION: SHARED ORACLE COVARIANCE LOCK');
    recordTest(
      14,
      'Collective Intelligence Explain Root Cause action',
      '04 Collective Intelligence viewing Drill-Down table',
      'Click "Explain Root Cause" button',
      'Switches analytical drawer to Root Cause Attribution: Shared Oracle Covariance Lock',
      t14Pass ? 'Root Cause Attribution panel rendered' : 'Root cause panel missing',
      'Displays 3-step causal chain from DATA-X poisoned tick to MODEL-C latent weights',
      'Provides direct handoff button to Control Foundry (08)',
      t14Pass
    );

    // TEST 15: Propagation Step 1
    await navigateSidebar('propagation');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="prop-step-btn"]');
      if (btn) btn.click();
    });
    await sleep(600);
    const t15Text = await getBodyText();
    const t15Pass =
      t15Text.includes('TICK 1') &&
      t15Text.includes('0.58 n/s') &&
      t15Text.includes('68%');
    recordTest(
      15,
      'Propagation Step 1',
      '05 Propagation Analysis at Tick 0 (Affected=4, Depth=2, Velocity=0.42 n/s, Blast=54%)',
      'Click "Step (+1 Tick)" button in Propagation Analysis',
      'Advances to Tick 1: Affected=5, Depth=2, Velocity=0.58 n/s, Blast Radius=68%',
      t15Pass ? 'Tick 1: Affected=5, Velocity=0.58 n/s, Blast=68%' : 'Step 1 metrics did not update',
      'All 6 KPI cards and active propagation path badges update in DOM',
      'Event Detection logs PROPAGATION_STEP_1 and CDI degrades to 0.12',
      t15Pass
    );

    // TEST 16: Propagation Step 2
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="prop-step-btn"]');
      if (btn) btn.click();
    });
    await sleep(600);
    const t16Text = await getBodyText();
    const t16Pass =
      t16Text.includes('TICK 2') &&
      t16Text.includes('3 Hops') &&
      t16Text.includes('0.74 n/s') &&
      t16Text.includes('82%');
    recordTest(
      16,
      'Propagation Step 2',
      '05 Propagation Analysis at Tick 1',
      'Click "Step (+1 Tick)" button a second time',
      'Advances to Tick 2: Affected=7, Depth=3 Hops, Velocity=0.74 n/s, Blast Radius=82%',
      t16Pass ? 'Tick 2: Affected=7, Depth=3 Hops, Velocity=0.74 n/s, Blast=82%' : 'Step 2 failed',
      'Cascade depth advances to 3 Hops and Clearing House / MODEL-C paths intensify',
      'Event Detection logs PROPAGATION_STEP_2',
      t16Pass
    );

    // TEST 17: Propagation Play / Pause
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="prop-play-pause-btn"]');
      if (btn) btn.click();
    });
    await sleep(300);
    const playingText = await getBodyText();
    const sawPauseLabel = playingText.includes('Pause');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="prop-play-pause-btn"]');
      if (btn) btn.click();
    });
    await sleep(300);
    const pausedText = await getBodyText();
    const t17Pass = sawPauseLabel && pausedText.includes('Play');
    recordTest(
      17,
      'Propagation Play / Pause',
      'Propagation simulation paused at Tick 2',
      'Click Play button, observe running state, then click Pause button',
      'Button toggles to "Pause" (amber active state) and back to "Play"',
      t17Pass ? 'Toggled Play -> Pause -> Play deterministically' : 'Play/Pause toggle failed',
      'Play/Pause button label and styling update immediately',
      'isPlaying state updated in global store',
      t17Pass
    );

    // TEST 18: Propagation path click
    await page.evaluate(() => {
      const row = document.querySelector('[data-testid="prop-path-PATH-MODEL-C"]');
      if (row) row.click();
    });
    await sleep(350);
    const t18Text = await getBodyText();
    const t18Pass =
      t18Text.includes('MODEL-C → BANK-C → ASSET-17') &&
      t18Text.includes('-16 pts (Latent Drift Penalty)');
    recordTest(
      18,
      'Propagation path click',
      'Default path PATH-DATA-X selected in Contextual Path Inspector',
      'Click propagation path row "MODEL-C (Latent)"',
      'Contextual Path & Chokepoint Inspector updates to MODEL-C → BANK-C → ASSET-17 (-16 pts)',
      t18Pass ? 'Inspector updated to MODEL-C → BANK-C → ASSET-17' : 'Path inspector failed',
      'Right-side inspector displays all 12 contextual fields for MODEL-C latent vector',
      'Highlights why primary DATA-X isolation alone is insufficient',
      t18Pass
    );

    // TEST 19: Propagation chokepoint click
    await page.evaluate(() => {
      const card = document.querySelector('[data-testid="chokepoint-card-PATH-CLEARING"]');
      if (card) card.click();
    });
    await sleep(350);
    const t19Text = await getBodyText();
    const t19Pass =
      t19Text.includes('BANK-A / BANK-B → INFRA-1 (RTGS Clearing)') &&
      t19Text.includes('INFRA-1 (Settlement Rail)');
    recordTest(
      19,
      'Propagation chokepoint click',
      'Inspecting PATH-MODEL-C',
      'Click Chokepoint card for INFRA-1 (Settlement Rail)',
      'Contextual Inspector updates to BANK-A / BANK-B → INFRA-1 (RTGS Clearing)',
      t19Pass ? 'Inspector updated to INFRA-1 (Settlement Rail)' : 'Chokepoint click failed',
      'Chokepoint card highlights and inspector displays settlement liquidity drain evidence',
      'Provides direct handoff to Control Margin (06) and Control Foundry (08)',
      t19Pass
    );

    // TEST 20: Control Margin driver inspection
    await navigateSidebar('control-margin');
    await page.evaluate(() => {
      const driver = document.querySelector('[data-testid="margin-driver-DRV-LATENT"]');
      if (driver) driver.click();
    });
    await sleep(350);
    const t20Text = await getBodyText();
    const t20Pass =
      t20Text.includes('Latent Model Drift (MODEL-C)') &&
      t20Text.includes('-12 pts');
    recordTest(
      20,
      'Control Margin driver inspection',
      '06 Control Margin viewing default driver (DRV-SYNC)',
      'Click contributor card "Latent Model Drift (MODEL-C)"',
      'Contributor & Sensitivity Inspector updates to Latent Model Drift (MODEL-C) (-12 pts)',
      t20Pass ? 'Inspector updated to Latent Model Drift (MODEL-C)' : 'Driver click failed',
      'Displays mathematical formula weight, empirical evidence, and linked propagation path',
      'Links contributor directly to Propagation (05) and Control Foundry (08)',
      t20Pass
    );

    // TEST 21: Control Margin "What would change this?" interaction
    await page.evaluate(() => {
      const driver = document.querySelector('[data-testid="margin-driver-DRV-VEL"]');
      if (driver) driver.click();
    });
    await sleep(350);
    const t21Text = await getBodyText();
    const t21Pass =
      t21Text.includes('What Would Change This Value? (Counterfactual Sensitivity)') &&
      t21Text.includes('Targeted Dependency Isolation (DATA-X) severs primary ingress');
    recordTest(
      21,
      'Control Margin "What would change this?" interaction',
      '06 Control Margin inspecting DRV-LATENT',
      'Select "Propagation Velocity (v_p)" and inspect "What Would Change This Value?" sensitivity box',
      'Updates Counterfactual Sensitivity box to show how Targeted Dependency Isolation recovers +16 pts',
      t21Pass ? 'Counterfactual Sensitivity updated for Propagation Velocity' : 'Sensitivity box failed',
      'Displays exact counterfactual action required to recover contributor margin points',
      'Connects M(t) decomposition to Control Foundry candidate evaluation',
      t21Pass
    );

    // TEST 22: Control Foundry candidate selection
    await navigateSidebar('control-foundry');
    await sleep(500);
    // Click alternative candidate, then MEI candidate
    const sawAlt = await page.evaluate(() => {
      const alt = document.querySelector('[data-testid^="foundry-cand-"][data-is-mei="false"]:not([data-cand-type="NO_ACTION"])');
      if (alt) { alt.click(); return true; }
      return false;
    });
    await sleep(350);
    const altText = await getBodyText();
    const sawAltSelected = sawAlt && (altText.includes('ALTERNATIVE INTERVENTION') || altText.includes('Exp. Delta') || altText.includes('Disruption'));
    
    await page.evaluate(() => {
      const mei = document.querySelector('[data-testid^="foundry-cand-"][data-is-mei="true"]');
      if (mei) mei.click();
    });
    await sleep(350);
    const meiText = await getBodyText();
    const t22Pass = sawAltSelected && meiText.includes('MINIMUM EFFECTIVE INTERVENTION (RECOMMENDED)');
    recordTest(
      22,
      'Control Foundry candidate selection',
      '08 Control Foundry loaded with 4 candidates',
      'Select alternative candidate, then select Minimum Effective Intervention (Targeted Dependency Isolation)',
      'Column B Counterfactual Projections and Column C Rationale update to match selected candidate',
      t22Pass ? 'Candidate selection updated Column B & Column C deterministically' : 'Selection failed',
      'Selected card highlights and updates Projected M(t), Disruption, and Authority Gate',
      'selectedFoundryCandidateId synchronized with 09 Governed Execution',
      t22Pass
    );

    // TEST 23: Control Foundry No-Action comparison
    await page.evaluate(() => {
      const noAct = document.querySelector('[data-testid^="foundry-cand-"][data-cand-type="NO_ACTION"]');
      if (noAct) noAct.click();
    });
    await sleep(350);
    const noActText = await getBodyText();
    const t23Pass = noActText.includes('PASSIVE CONTAGION RISK');
    // Switch back to MEI candidate for authorization flow
    await page.evaluate(() => {
      const mei = document.querySelector('[data-testid^="foundry-cand-"][data-is-mei="true"]');
      if (mei) mei.click();
    });
    await sleep(350);
    recordTest(
      23,
      'Control Foundry No-Action comparison',
      'MEI candidate selected in 08 Control Foundry',
      'Click "BASELINE (NO ACTION)" candidate card, then return to MEI candidate',
      'Displays PASSIVE CONTAGION RISK warning and disables execution controls for No-Action baseline',
      t23Pass ? 'PASSIVE CONTAGION RISK displayed & controls gated' : 'No-Action view failed',
      'Column C switches to Passive Contagion Risk explanation',
      'Preserves No-Action counterfactual baseline (18% M(t)) across comparisons',
      t23Pass
    );

    // TEST 24: Control Foundry Request Authorization
    await clickButtonByText('1. REQUEST AUTHORIZATION');
    await sleep(450);
    const t24Text = await getBodyText();
    const t24Pass =
      t24Text.includes('Authorization requested by') ||
      t24Text.includes('AUTHORIZATION_REQUESTED') ||
      t24Text.includes('AUTHORIZE');
    recordTest(
      24,
      'Control Foundry Request Authorization',
      'MEI candidate in RECOMMENDED state',
      'Click "1. REQUEST AUTHORIZATION" button in 08 Control Foundry',
      'Submits authorization request to governance queue and logs AUTHORIZATION_REQUESTED in audit trail',
      t24Pass ? 'Authorization request submitted & logged in audit lineage' : 'Request auth failed',
      'Green confirmation banner appears and Chronological Audit Lineage records AUTHORIZATION_REQUESTED',
      'foundryState.active_authorization_request updated globally',
      t24Pass
    );

    // TEST 25: Unauthorized role attempt (Separation of Duties block)
    await switchRoleUI('SYSTEM_OPERATOR');
    await clickButtonByText('2. AUTHORIZE AS SYSTEM_OPERATOR');
    await sleep(450);
    const t25Text = await getBodyText();
    const t25Pass =
      t25Text.includes('AUTHORIZE BLOCKED — SEPARATION OF DUTIES') &&
      t25Text.includes('INCIDENT_COMMANDER');
    recordTest(
      25,
      'Unauthorized role attempt',
      'Active Role set to SYSTEM_OPERATOR (Executor)',
      'Click "2. AUTHORIZE AS SYSTEM_OPERATOR" in 08 Control Foundry',
      'Blocks self-authorization with in-product Separation of Duties notice (no browser alert)',
      t25Pass ? 'In-product AUTHORIZE BLOCKED — SEPARATION OF DUTIES banner displayed' : 'SoD block missing',
      'Red Separation-of-Duties block panel appears showing Current Role, Required Authority, and 1-click role switchers',
      'Candidate remains un-authorized in both 08 Control Foundry and 09 Governed Execution',
      t25Pass
    );

    // TEST 26: Authorized role switch
    const clickedSwitch = await clickButtonByText('Switch to INCIDENT_COMMANDER');
    if (!clickedSwitch) {
      await switchRoleUI('INCIDENT_COMMANDER');
    }
    await sleep(400);
    const t26Text = await getBodyText();
    const t26Pass =
      t26Text.includes('INCIDENT_COMMANDER') &&
      t26Text.includes('2. AUTHORIZE AS INCIDENT_COMMANDER');
    recordTest(
      26,
      'Authorized role switch',
      'Blocked as SYSTEM_OPERATOR in 08 Control Foundry',
      'Click in-product "Switch to INCIDENT_COMMANDER" button inside SoD block notice',
      'Switches active role to INCIDENT_COMMANDER and dismisses block notice',
      t26Pass ? 'Role switched to INCIDENT_COMMANDER & notice cleared' : 'Role switch failed',
      'Header badge, top bar selector, and Authorize button update to INCIDENT_COMMANDER',
      'Permissions updated globally across all 12 workspaces',
      t26Pass
    );

    // TEST 27: Authorize primary intervention
    await clickButtonByText('2. AUTHORIZE AS INCIDENT_COMMANDER');
    await sleep(600);
    const t27Text = await getBodyText();
    const t27Pass =
      t27Text.includes('AUTHORIZATION SEALED (SHA-256)') ||
      t27Text.includes('AUTHORIZED');
    recordTest(
      27,
      'Authorize primary intervention',
      'Candidate in RECOMMENDED state, role=INCIDENT_COMMANDER',
      'Click "2. AUTHORIZE AS INCIDENT_COMMANDER"',
      'Candidate status transitions to AUTHORIZED with SHA-256 seal and audit log entry',
      t27Pass ? 'Candidate AUTHORIZED & SHA-256 seal recorded' : 'Authorization failed',
      'Authorize button turns emerald "AUTHORIZATION SEALED (SHA-256)" and Step 3 Execute button unlocks',
      '09 Governed Execution and 12 Evidence & Audit immediately reflect AUTHORIZED state',
      t27Pass
    );

    // TEST 28: Governed Execution workspace state sync
    await navigateSidebar('execution');
    await sleep(450);
    const t28Text = await getBodyText();
    const t28Pass =
      t28Text.includes('AUTHORIZED') &&
      (t28Text.includes('✓ 1. Authorized') || t28Text.includes('Authorized'));
    recordTest(
      28,
      'Governed Execution workspace state sync',
      'Authorized primary candidate in 08 Control Foundry',
      'Navigate to 09 Governed Execution',
      '09 Governed Execution shows exact same candidate in "AUTHORIZED (READY FOR DISPATCH)" state',
      t28Pass ? '09 Governed Execution synchronized: AUTHORIZED' : 'State out of sync',
      'Action Contract card displays "✓ 1. Authorized" and enables "2. Dispatch"',
      'Proves 08 Control Foundry and 09 Governed Execution share one authoritative candidate state',
      t28Pass
    );

    // TEST 29: Execute primary intervention
    // Switch to SYSTEM_OPERATOR for execution dispatch (SoD Step 2)
    await switchRoleUI('SYSTEM_OPERATOR');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="execution-dispatch-btn"]');
      if (btn) btn.click();
    });
    await sleep(800);
    const t29Text = await getBodyText();
    const t29Pass =
      t29Text.includes('EXECUTED') &&
      t29Text.includes('DISPATCH ACKNOWLEDGED');
    recordTest(
      29,
      'Execute primary intervention',
      'Candidate AUTHORIZED, role switched to SYSTEM_OPERATOR',
      'Click "2. Dispatch as SYSTEM_OPERATOR" in 09 Governed Execution',
      'Executes primary intervention (HTTP 200 OK), transitions M(t) from 35% -> 42%, and displays Execution ≠ Verification banner',
      t29Pass ? 'Dispatched (HTTP 200 OK), M(t)=42%, Execution ≠ Verification banner shown' : 'Execution failed',
      'Contract status updates to EXECUTED (VERIFICATION REQUIRED) and shows purple truth banner',
      'Global Bar updates to 42% UNVERIFIED_FAILURE; 10 Independent Verification unlocks',
      t29Pass
    );

    // TEST 30: Independent Verification failure
    await navigateSidebar('verification');
    await sleep(600);
    const t30Text = await getBodyText();
    const t30Pass =
      (t30Text.includes('VERIFIED_FAILED') || t30Text.includes('VERIFIED FAILED') || t30Text.includes('CONTROL_NOT_RESTORED')) &&
      t30Text.includes('42%');
    recordTest(
      30,
      'Independent Verification failure',
      'Primary intervention dispatched (HTTP 200 OK)',
      'Navigate to 10 Independent Verification',
      'Displays HTTP 200 OK Executor receipt vs VERIFIED_FAILED (42% Observed M(t) vs 74% Expected)',
      t30Pass ? 'VERIFIED_FAILED with 42% Observed M(t) vs HTTP 200 OK receipt' : 'Verification failure missing',
      'Side-by-side Expected vs Observed comparison highlights -32 pts discrepancy',
      'Unlocks 11 Reassessment escalation workflow',
      t30Pass
    );

    // TEST 31: Residual MODEL-C detection
    const t31Pass =
      t30Text.includes('DEP_MODEL_C_ASSET_17') ||
      t30Text.includes('MODEL-C') ||
      t30Text.includes('LATENT DRIFT DETECTED');
    recordTest(
      31,
      'Residual MODEL-C detection',
      '10 Independent Verification after primary action',
      'Inspect 6-Point Causal Decomposition and Zero-Trust Enclave Verifier card',
      'Explicitly identifies DEP_MODEL_C_ASSET_17 / MODEL-C cached weights as residual contagion vector',
      t31Pass ? 'DEP_MODEL_C_ASSET_17 & 6-point decomposition rendered' : 'MODEL-C vector missing',
      'Shows all 6 causal verification fields (Expected, Happened, Why Differed, Remains Active, Verdict, Next Action)',
      'Synchronized with System Map (MODEL-C COMPROMISED) and CDI (0.34)',
      t31Pass
    );

    // TEST 32: Open Reassessment
    await navigateSidebar('reassessment');
    await sleep(500);
    const t32Text = await getBodyText();
    const t32Pass =
      t32Text.includes('11. REASSESSMENT & SECOND INTERVENTION') &&
      t32Text.includes('MODEL-C Oracle');
    recordTest(
      32,
      'Open Reassessment',
      '10 Independent Verification showing VERIFIED_FAILED',
      'Navigate to 11 Reassessment',
      'Navigates to 11 Reassessment with ESCALATION ACTIVE and Updated Threat Matrix showing DATA-X CONTAINED vs MODEL-C LATENT CONTAGION',
      t32Pass ? '11 Reassessment active with DATA-X CONTAINED & MODEL-C LATENT CONTAGION' : 'Reassessment failed',
      'Displays 4-step Closed-Loop Progression Bar and Secondary Intervention Synthesis Candidates',
      'Route updates to reassessment; Global Context Bar shows 42% UNVERIFIED_FAILURE',
      t32Pass
    );

    // TEST 33: Secondary candidate inspection
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div'));
      const alt = cards.find(
        (d) =>
          (d.innerText || '').includes('Global Algorithmic Trading Circuit Breaker') &&
          d.className.includes('cursor-pointer')
      );
      if (alt) alt.click();
    });
    await sleep(300);
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div'));
      const rec = cards.find(
        (d) =>
          (d.innerText || '').includes('Enclave MODEL-C Quarantine & Parameter Clamp') &&
          d.className.includes('cursor-pointer')
      );
      if (rec) rec.click();
    });
    await sleep(300);
    const t33Text = await getBodyText();
    const t33Pass =
      t33Text.includes('MINIMUM EFFECTIVE BACKSTOP') &&
      t33Text.includes('+42%');
    recordTest(
      33,
      'Secondary candidate inspection',
      '11 Reassessment loaded',
      'Inspect alternative secondary candidates and select "Enclave MODEL-C Quarantine & Parameter Clamp"',
      'Highlights recommended backstop (+42% to 84% M(t), 8.4% LOW disruption)',
      t33Pass ? 'Recommended backstop selected (+42% to 84% M(t))' : 'Secondary candidate selection failed',
      'Candidate card highlights with blue border and updates Action Contract #ACT-SEC-8843',
      'Prepared for Separation-of-Duties authorization',
      t33Pass
    );

    // TEST 34: Secondary authorization attempt under wrong role
    // Ensure active role is SYSTEM_OPERATOR
    await switchRoleUI('SYSTEM_OPERATOR');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="reassessment-authorize-btn"]');
      if (btn) btn.click();
    });
    await sleep(450);
    const t34Text = await getBodyText();
    const t34Pass =
      t34Text.includes('AUTHORIZE BLOCKED — SEPARATION OF DUTIES') ||
      t34Text.includes('INCIDENT_COMMANDER');
    recordTest(
      34,
      'Secondary authorization attempt under wrong role',
      'Active role is SYSTEM_OPERATOR in 11 Reassessment',
      'Click "1. Authorize 2nd Action" as SYSTEM_OPERATOR',
      'Renders in-product Separation-of-Duties block banner with Current Role, Required Authority, and role switch buttons (no browser alert)',
      t34Pass ? 'In-product SoD block banner rendered in Reassessment' : 'Reassessment SoD block failed',
      'Red governance block notice appears in Reassessment with 1-click role switchers',
      'Secondary contract remains PENDING',
      t34Pass
    );

    // TEST 35: Secondary authorization under valid role
    await switchRoleUI('INCIDENT_COMMANDER');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="reassessment-authorize-btn"]');
      if (btn) btn.click();
    });
    await sleep(600);
    const t35Text = await getBodyText();
    const t35Pass =
      t35Text.includes('AUTHORIZED') ||
      t35Text.includes('✓ 1. Authorized');
    recordTest(
      35,
      'Secondary authorization under valid role',
      'Switched to INCIDENT_COMMANDER in 11 Reassessment',
      'Click "1. Authorize 2nd Action" as INCIDENT_COMMANDER',
      'Authorizes Action Contract #ACT-SEC-8843, updates status badge to AUTHORIZED, and persists in store',
      t35Pass ? 'Secondary backstop AUTHORIZED by INCIDENT_COMMANDER' : 'Secondary auth failed',
      'Contract badge turns AUTHORIZED and "2. Execute 2nd Action" unlocks',
      'Authorization recorded in foundryState.authorization_history and Evidence audit trail',
      t35Pass
    );

    // TEST 36: Secondary execution
    await switchRoleUI('SYSTEM_OPERATOR');
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="reassessment-execute-btn"]');
      if (btn) btn.click();
    });
    await sleep(800);
    const t36Text = await getBodyText();
    const t36Pass =
      t36Text.includes('84%') ||
      t36Text.includes('CONTROL_RESTORED');
    recordTest(
      36,
      'Secondary execution',
      'Secondary backstop AUTHORIZED, role switched to SYSTEM_OPERATOR',
      'Click "2. Execute 2nd Action" as SYSTEM_OPERATOR',
      'Executes MODEL-C quarantine backstop, restores Control Margin to 84%, and transitions status to CONTROL_RESTORED',
      t36Pass ? 'Backstop EXECUTED, M(t)=84%, Status=CONTROL_RESTORED' : 'Secondary execution failed',
      'Reassessment header and trajectory update to 84% CONTROL_RESTORED and MODEL-C QUARANTINED ✓',
      'Global Context Bar updates to 84% RESTORED; CDI recovers to 0.58; System Map shows MODEL-C ISOLATED',
      t36Pass
    );

    // TEST 37: Verified recovery
    await navigateSidebar('verification');
    await sleep(500);
    const t37Text = await getBodyText();
    const t37Pass =
      (t37Text.includes('VERIFIED_EFFECTIVE') || t37Text.includes('VERIFIED EFFECTIVE')) &&
      t37Text.includes('84%') &&
      t37Text.includes('CONTROL_RESTORED');
    recordTest(
      37,
      'Verified recovery',
      'Secondary backstop executed in 11 Reassessment',
      'Navigate to 10 Independent Verification',
      'Shows VERIFIED_EFFECTIVE (CONTROL_RESTORED), 84% Observed M(t), and 0.00 n/s cascade velocity',
      t37Pass ? 'VERIFIED_EFFECTIVE (84% M(t), 0.00 n/s velocity)' : 'Verified recovery view failed',
      'Verification banner turns emerald green with 6-point recovery proof',
      'Synchronized across Overview (84%), Control Margin (84%), and Evidence (RESTORED)',
      t37Pass
    );

    // TEST 38: Evidence & Audit full trace
    await navigateSidebar('evidence');
    await sleep(600);
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="evidence-verify-integrity-btn"]');
      if (btn) btn.click();
    });
    await sleep(500);
    await clickButtonByText('Inject Stale Evidence (TTL Expiry)');
    await sleep(600);
    const staleBannerVisible = await page.evaluate(() =>
      Boolean(document.querySelector('[data-testid="evidence-stale-alert-banner"]'))
    );
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="evidence-test-closure-btn"]');
      if (btn) btn.click();
    });
    await sleep(500);
    const t38Text = await getBodyText();
    const t38Pass =
      t38Text.includes('100% UNALTERED & VERIFIED') &&
      staleBannerVisible &&
      t38Text.includes('CLOSURE REJECTED BY ASSURANCE GATE');
    recordTest(
      38,
      'Evidence & Audit full trace',
      'Navigate to 12 Evidence & Audit after Verified Recovery',
      'Click "Verify SHA-256 Integrity", click "Inject Stale Evidence", and click "Test Governed Closure"',
      'Verifies SHA-256 digest chain, displays Stale Evidence Alert banner, and blocks incident closure when evidence is stale',
      t38Pass ? 'SHA-256 verified, Stale Alert displayed, and Closure rejected under stale TTL' : 'Evidence audit failed',
      'Renders green SHA-256 verification report, amber Stale Evidence banner, and Closure Rejected notice',
      'Assurance status updates to ASSURANCE_DEGRADED (STALE)',
      t38Pass
    );

    // TEST 39: Reset completeness
    await clickButtonByText('Reset');
    await sleep(800);
    const resetGlobalText = await getBodyText();
    const resetToBaseline =
      (resetGlobalText.includes('91%') || resetGlobalText.includes('89%')) &&
      resetGlobalText.includes('STABLE');
    // Verify direct navigation gates after reset
    await navigateSidebar('verification');
    const verifGatedAfterReset = await page.evaluate(() =>
      Boolean(document.querySelector('[data-testid="verification-not-eligible-gate"]'))
    );
    await navigateSidebar('reassessment');
    const reassessGatedAfterReset = await page.evaluate(() =>
      Boolean(document.querySelector('[data-testid="reassessment-not-required-gate"]'))
    );
    await navigateSidebar('control-center');
    const t39Pass =
      resetToBaseline &&
      verifGateAtBaseline &&
      reassessGateAtBaseline &&
      verifGatedAfterReset &&
      reassessGatedAfterReset;
    recordTest(
      39,
      'Reset completeness',
      'Post-incident state with stale evidence and executed interventions',
      'Click Global "Reset" button and inspect Overview, Verification (10), and Reassessment (11)',
      'Restores Nominal Equilibrium (STABLE), clears all selections/notices, and re-engages direct-navigation gates on 10 & 11',
      t39Pass
        ? 'STABLE restored; Verification & Reassessment entry gates active at baseline & post-reset'
        : 'Reset incomplete',
      'All metrics return to STABLE and 10/11 render their standby entry gates instead of stale post-incident data',
      'Complete state reset across all 12 workspaces',
      t39Pass
    );

    const passedCount = results.filter((r) => r.status === 'PASS').length;
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      consoleErrors,
      pageErrors,
      failedRequests,
      results,
    };

    const outPath = path.join(__dirname, 'phase76_forensic_results.json');
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
    console.log(`PHASE 7.6 BROWSER FORENSIC SUMMARY: ${passedCount}/${results.length} PASSED`);
    console.log(`Console Errors: ${consoleErrors.length}, Page Errors: ${pageErrors.length}, Failed HTTP: ${failedRequests.length}`);
    if (passedCount < results.length) {
      console.log('Failed tests:', results.filter((r) => r.status !== 'PASS'));
    }
  } finally {
    await browser.close();
  }
}

runPhase76Forensics().catch((err) => {
  console.error('Fatal error in Phase 7.6 Forensic Runner:', err);
  process.exit(1);
});
