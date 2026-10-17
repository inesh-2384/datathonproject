/**
 * REAL BROWSER HERO FLOW VALIDATION
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('>>> Launching Real Chrome Browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const networkLog = [];
  page.on('request', req => {
    const u = req.url();
    if (u.includes('/api/')) {
      networkLog.push({ method: req.method(), url: u, time: Date.now() });
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('BROWSER ERROR:', msg.text());
  });

  console.log('>>> 1. Loading http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // Boot
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ENTER CONTROL ENVIRONMENT'))?.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('INITIALIZE ENCLAVE'))?.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip Animation'))?.click();
  });
  await sleep(2000);

  console.log('>>> Shell loaded. Initial state:');
  let headerText = await page.evaluate(() => document.querySelector('header')?.innerText?.replace(/\s+/g, ' '));
  console.log('Header:', headerText);

  // STEP 1: RESET
  console.log('\n--- STEP 1: CLICK RESET ---');
  let nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Reset'))?.click();
  });
  await sleep(2000);
  let resetReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/simulation/reset'));
  let headerAfterReset = await page.evaluate(() => document.querySelector('header .rounded-full')?.innerText?.trim());
  let marginAfterReset = await page.evaluate(() => document.body.innerText.match(/(\d+)%\s*SYSTEMIC/i)?.[1] || document.body.innerText.match(/CONTROL MARGIN\s*(\d+)%/i)?.[1]);
  console.log('Reset Req:', resetReq ? resetReq.url : 'NONE');
  console.log('Status Pill:', headerAfterReset);
  console.log('Margin:', marginAfterReset);

  // STEP 2: INJECT ATTACK
  console.log('\n--- STEP 2: CLICK INJECT SHOCK ---');
  nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Inject Shock') || b.innerText.includes('Attack Active'))?.click();
  });
  await sleep(2500);
  let attackReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/simulation/scenario') || r.url.includes('/api/simulation/attack'));
  let headerAfterAttack = await page.evaluate(() => document.querySelector('header .rounded-full')?.innerText?.trim());
  let marginAfterAttack = await page.evaluate(() => document.body.innerText.match(/(\d+)%\s*SYSTEMIC/i)?.[1] || document.body.innerText.match(/CONTROL MARGIN\s*(\d+)%/i)?.[1]);
  console.log('Attack Req:', attackReq ? attackReq.url : 'NONE');
  console.log('Status Pill:', headerAfterAttack);
  console.log('Margin:', marginAfterAttack);

  // STEP 3: NAVIGATE TO CONTROL FOUNDRY
  console.log('\n--- STEP 3: NAVIGATE TO CONTROL FOUNDRY ---');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('aside button, header button, button')).find(b => b.innerText.includes('08Foundry') || b.innerText.includes('Control Foundry'))?.click();
  });
  await sleep(2000);
  let foundryHeading = await page.evaluate(() => document.querySelector('main')?.innerText?.slice(0, 200).replace(/\s+/g, ' '));
  console.log('Foundry Main Heading:', foundryHeading);

  // STEP 4: SWITCH ROLE TO INCIDENT_COMMANDER
  console.log('\n--- STEP 4: SWITCH ROLE TO INCIDENT_COMMANDER ---');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Switch Operational Role'))?.click();
  });
  await sleep(1000);
  let roleSwitched = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
    const cmdCard = cards.find(el => el.innerText?.includes('Incident Commander'));
    if (cmdCard) {
      cmdCard.click();
      return true;
    }
    return false;
  });
  console.log('Role switched to INCIDENT_COMMANDER:', roleSwitched);
  await sleep(1500);

  // Verify authorize button in Foundry
  let authButtonText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('AUTHORIZE AS') || b.innerText.includes('AUTHORIZATION SEALED'))?.innerText?.trim();
  });
  console.log('Authorize Button in Foundry:', authButtonText);

  // STEP 5: AUTHORIZE INTERVENTION
  console.log('\n--- STEP 5: AUTHORIZE INTERVENTION ---');
  nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('AUTHORIZE AS'))?.click();
  });
  await sleep(2500);
  let authReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/foundry/authorize'));
  let authButtonAfter = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('AUTHORIZATION SEALED') || b.innerText.includes('AUTHORIZE AS'))?.innerText?.trim();
  });
  console.log('Auth Req:', authReq ? authReq.url : 'NONE');
  console.log('Authorize Button After:', authButtonAfter);

  // STEP 6: TOGGLE RESIDUAL CONTAGION & SWITCH TO SYSTEM_OPERATOR TO EXECUTE
  console.log('\n--- STEP 6: TOGGLE RESIDUAL CONTAGION CHECKBOX ---');
  let checkboxResult = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const residual = labels.find(l => l.innerText.includes('Residual Contagion') || l.innerText.includes('Scenario 2'));
    if (residual) {
      const input = residual.querySelector('input');
      if (input && !input.checked) {
        input.click();
        return { success: true, checked: input.checked };
      }
    }
    return { success: false };
  });
  console.log('Residual contagion checkbox:', checkboxResult);
  await sleep(1000);

  // Switch role to SYSTEM_OPERATOR for execution (Separation of Duties!)
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Switch Operational Role'))?.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
    const opCard = cards.find(el => el.innerText?.includes('System Operator'));
    if (opCard) opCard.click();
  });
  await sleep(1500);

  // Click Execute
  console.log('\n--- STEP 7: EXECUTE GOVERNED INTERVENTION ---');
  nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('EXECUTE GOVERNED INTERVENTION'))?.click();
  });
  await sleep(3500);
  let execReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/foundry/execute'));
  let execButtonAfter = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('DISPATCHED & TELEMETRY SEALED') || b.innerText.includes('EXECUTE'))?.innerText?.trim();
  });
  console.log('Exec Req:', execReq ? execReq.url : 'NONE');
  console.log('Exec Button After:', execButtonAfter);

  // STEP 8: NAVIGATE TO INDEPENDENT VERIFICATION
  console.log('\n--- STEP 8: NAVIGATE TO INDEPENDENT VERIFICATION (10Verify) ---');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('aside button, header button, button')).find(b => b.innerText.includes('10Verify') || b.innerText.includes('Independent Verification'))?.click();
  });
  await sleep(2500);
    let verifyDOM = await page.evaluate(() => {
    const text = document.querySelector('main')?.innerText || '';
    const crpBadge = document.querySelector('[data-testid="crp-restoration-state-badge"]')?.innerText?.trim() || 'NONE';
    const crpResidual = document.querySelector('[data-testid="crp-residual-paths"]')?.innerText?.trim() || 'NONE';
    return {
      statusBadge: text.match(/CONTROL_UNVERIFIED|CONTROL_RESTORED/)?.[0] || 'NONE',
      verdict: text.match(/VERIFIED_FAILED|VERIFIED_EFFECTIVE/)?.[0] || 'NONE',
      hasResidualThreat: text.includes('DEP_MODEL_C_ASSET_17') || text.includes('MODEL-C'),
      hasGatewayReceipt: text.includes('COMMAND DISPATCHED TO RAILS') || text.includes('HTTP 200 OK'),
      crpBadge,
      crpResidualText: crpResidual.slice(0, 150)
    };
  });
  console.log('Independent Verification State:', verifyDOM);

  // STEP 9: NAVIGATE TO REASSESSMENT (11Reassess)
  console.log('\n--- STEP 9: NAVIGATE TO REASSESSMENT (11Reassess) ---');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('aside button, header button, button')).find(b => b.innerText.includes('11Reassess') || b.innerText.includes('Reassessment') || b.innerText.includes('Escalate'))?.click();
  });
  await sleep(2500);
  let reassessDOM = await page.evaluate(() => {
    const text = document.querySelector('main')?.innerText || '';
    const crpContext = document.querySelector('[data-testid="reassessment-crp-context"]')?.innerText?.trim() || 'NONE';
    return {
      hasSecondaryCandidates: text.includes('MODEL-C Quarantine') || text.includes('CAND-SEC-01') || text.includes('Enclave MODEL-C'),
      step: text.match(/Step \d|STEP \d/i)?.[0] || 'NONE',
      crpContext: crpContext.replace(/\s+/g, ' '),
      buttons: Array.from(document.querySelectorAll('main button')).map(b => b.innerText.trim().replace(/\s+/g, ' '))
    };
  });
  console.log('Reassessment Workspace State:', reassessDOM);

  // STEP 10: AUTHORIZE BACKSTOP IN REASSESSMENT
  console.log('\n--- STEP 10: AUTHORIZE BACKSTOP (AS INCIDENT_COMMANDER) ---');
  // Switch to INCIDENT_COMMANDER
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Switch Operational Role'))?.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
    const cmdCard = cards.find(el => el.innerText?.includes('Incident Commander'));
    if (cmdCard) cmdCard.click();
  });
  await sleep(1500);

  nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('Authorize'))?.click();
  });
  await sleep(2500);
  let reassessAuthReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/foundry/authorize'));
  let reassessStatusAfterAuth = await page.evaluate(() => document.querySelector('main')?.innerText?.match(/Authorized by [^\n•]+|Ready for Execution/)?.[0] || 'NONE');
  console.log('Reassessment Auth Req:', reassessAuthReq ? reassessAuthReq.url : 'NONE');
  console.log('Reassessment Status After Auth:', reassessStatusAfterAuth);

  // STEP 11: EXECUTE BACKSTOP IN REASSESSMENT
  console.log('\n--- STEP 11: EXECUTE BACKSTOP (AS SYSTEM_OPERATOR) ---');
  // Switch to SYSTEM_OPERATOR
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('title')?.includes('Switch Operational Role'))?.click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
    const opCard = cards.find(el => el.innerText?.includes('System Operator'));
    if (opCard) opCard.click();
  });
  await sleep(1500);

  nBefore = networkLog.length;
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('Execute'))?.click();
  });
  await sleep(3500);
  let reassessExecReq = networkLog.slice(nBefore).find(r => r.url.includes('/api/foundry/execute'));
  let reassessStatusAfterExec = await page.evaluate(() => document.querySelector('main')?.innerText?.match(/Secondary Action Executed[^\n]+|Neutralized[^\n]+/)?.[0] || 'NONE');
  console.log('Reassessment Exec Req:', reassessExecReq ? reassessExecReq.url : 'NONE');
  console.log('Reassessment Status After Exec:', reassessStatusAfterExec);

  // STEP 12: OBSERVE VERIFIED RECOVERY IN VERIFICATION & CONTROL CENTER
  console.log('\n--- STEP 12: OBSERVE RECOVERY IN VERIFICATION & CONTROL CENTER ---');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('aside button, header button, button')).find(b => b.innerText.includes('10Verify') || b.innerText.includes('Independent Verification'))?.click();
  });
  await sleep(2000);
  let verifyAfterRecovery = await page.evaluate(() => {
    const text = document.querySelector('main')?.innerText || '';
    const crpBadge = document.querySelector('[data-testid="crp-restoration-state-badge"]')?.innerText?.trim() || 'NONE';
    const hasResidualCard = document.querySelector('[data-testid="crp-residual-paths"]') !== null;
    return {
      statusBadge: text.match(/CONTROL_RESTORED|CONTROL_UNVERIFIED/)?.[0] || 'NONE',
      verdict: text.match(/VERIFIED_EFFECTIVE|VERIFIED_FAILED/)?.[0] || 'NONE',
      crpBadge,
      hasResidualCard
    };
  });
  console.log('Verification After Backstop Recovery:', verifyAfterRecovery);

  await page.evaluate(() => {
    Array.from(document.querySelectorAll('aside button, header button, button')).find(b => b.innerText.includes('Control Center') || b.innerText.includes('02'))?.click();
  });
  await sleep(2000);
  let finalControlCenter = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      margin: text.match(/(\d+)%\s*SYSTEMIC/i)?.[1] || text.match(/CONTROL MARGIN\s*(\d+)%/i)?.[1] || text.match(/(\d+)%/)?.[1],
      headerStatus: document.querySelector('header .rounded-full')?.innerText?.trim()
    };
  });
  console.log('Final Control Center State:', finalControlCenter);

  await browser.close();
  console.log('\n>>> REAL BROWSER HERO FLOW VALIDATION COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
