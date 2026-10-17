const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('=== PHASE A: REAL BROWSER FORENSIC INSPECTION (PRE-REPAIR) ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  const clickByText = async (selector, text) => {
    return await page.evaluate(({ selector, text }) => {
      const els = Array.from(document.querySelectorAll(selector));
      const target = els.find(el => (el.innerText || el.textContent || '').includes(text));
      if (target) { target.click(); return true; }
      return false;
    }, { selector, text });
  };

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await clickByText('button', 'ENTER CONTROL ENVIRONMENT');
  await new Promise(r => setTimeout(r, 400));
  await clickByText('button', 'INITIALIZE ENCLAVE');
  await new Promise(r => setTimeout(r, 400));
  await clickByText('button', 'Skip Animation');
  await new Promise(r => setTimeout(r, 500));

  // 1. Reset and check Direct Navigation before incident
  await clickByText('button', 'Reset');
  await new Promise(r => setTimeout(r, 700));

  await clickByText('button', '10Verify');
  await new Promise(r => setTimeout(r, 400));
  const verifyAtBaseline = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 350));
  console.log('[HYPOTHESIS 11 - Direct Nav to Verification at Baseline]:\n', verifyAtBaseline?.replace(/\n+/g, ' | '));

  await clickByText('button', '09Execute');
  await new Promise(r => setTimeout(r, 400));
  const execAtBaseline = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 350));
  console.log('[HYPOTHESIS 14/26 - Direct Nav to Execution at Baseline]:\n', execAtBaseline?.replace(/\n+/g, ' | '));

  await clickByText('button', '11Reassess');
  await new Promise(r => setTimeout(r, 400));
  const reassessAtBaseline = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 350));
  console.log('[HYPOTHESIS 12/26 - Direct Nav to Reassess at Baseline]:\n', reassessAtBaseline?.replace(/\n+/g, ' | '));

  // 2. Inject Shock & test Global Inspect Event
  await clickByText('button', 'Inject Shock');
  await new Promise(r => setTimeout(r, 800));
  await clickByText('button', 'Inspect Event');
  await new Promise(r => setTimeout(r, 400));
  const eventDom1 = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 350));
  await clickByText('button', 'INCIDENT: RN-2026-0041');
  await new Promise(r => setTimeout(r, 300));
  const eventDom2 = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 350));
  console.log('[HYPOTHESIS 1 - Global Inspect Event when already on Event Detection changed DOM?]:', eventDom1 !== eventDom2);

  // 3. Test Propagation Step
  await clickByText('button', '06Propagate');
  await new Promise(r => setTimeout(r, 400));
  const propBefore = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 400));
  await clickByText('button', 'Step');
  await new Promise(r => setTimeout(r, 600));
  const propAfter = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 400));
  console.log('[HYPOTHESIS 5 - Propagation Step changed main DOM?]:', propBefore !== propAfter);

  console.log('[CONSOLE ERRORS]:', consoleErrors.length);
  await browser.close();
})();
