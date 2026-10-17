const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:3000';
const OUT_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\cb35848d-3892-44b8-9dbd-8ed22f413e48\\scratch';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  async function switchRole(roleLabel) {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('header button')).find(
        b => b.getAttribute('title')?.includes('Switch Operational Role')
      );
      if (btn) btn.click();
    });
    await sleep(600);
    await page.evaluate((label) => {
      const cards = Array.from(document.querySelectorAll('.fixed .grid > div'));
      const target = cards.find(el => el.innerText?.includes(label));
      if (target) target.click();
    }, roleLabel);
    await sleep(800);
  }

  console.log('1. Opening landing page...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_01_landing.png') });

  // Click Enter Control Environment
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ENTER CONTROL ENVIRONMENT'))?.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_02_login.png') });

  // Click Initialize Enclave
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('INITIALIZE ENCLAVE'))?.click();
  });
  await sleep(1200);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip Animation'))?.click();
  });
  await sleep(1500);

  // Reset to clean baseline
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.innerText.trim() === 'Reset')?.click();
  });
  await sleep(2000);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_03_control_center_stable.png') });

  // Inject Shock
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Inject Shock'))?.click();
  });
  await sleep(2500);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_04_control_center_shock.png') });

  // Control Margin (07)
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('07Margin') || b.innerText.includes('Control Margin'))?.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_05_control_margin.png') });

  // Control Foundry (08)
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('08Foundry') || b.innerText.includes('Control Foundry'))?.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_06_control_foundry.png') });

  // Authorize & Execute with Residual Contagion
  await switchRole('Incident Commander');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('AUTHORIZE AS'))?.click();
  });
  await sleep(1500);
  await switchRole('System Operator');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const residual = labels.find(l => l.innerText.includes('Residual Contagion') || l.innerText.includes('Scenario 2'));
    if (residual) {
      const input = residual.querySelector('input');
      if (input && !input.checked) input.click();
    }
  });
  await sleep(600);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('main button')).find(b => b.innerText.includes('EXECUTE GOVERNED INTERVENTION'))?.click();
  });
  await sleep(2500);

  // Verification View (10)
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('10Verify') || b.innerText.includes('Independent Verification'))?.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_07_verification_failed.png') });

  // Reassessment View (11)
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('11Reassess') || b.innerText.includes('Reassessment'))?.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, 'judge_08_reassessment.png') });

  await browser.close();
  console.log('Screenshots captured successfully.');
}

run().catch(e => { console.error(e); process.exit(1); });
