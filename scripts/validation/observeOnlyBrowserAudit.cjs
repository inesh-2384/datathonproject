/**
 * PHASE 7.6 RECOVERY AUDIT — READ/OBSERVE-ONLY BROWSER FORENSIC RUNNER
 * Evaluates frontend runtime health without modifying application state.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runObserveOnlyAudit() {
  const consoleErrors = [];
  const consoleWarnings = [];
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
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText}`);
  });

  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(1000);

    // Initial render check
    const initialHtml = await page.content();
    const isBlankInitial = !initialHtml || initialHtml.trim() === '';
    const hasViteOverlayInitial = await page.evaluate(() => Boolean(document.querySelector('vite-error-overlay')));

    // Check if on LoginPortal
    const hasDemoButton = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => (b.innerText || '').includes('DEMONSTRATION MODE'));
    });

    let enteredShell = false;
    if (hasDemoButton) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const demoBtn = btns.find(b => (b.innerText || '').includes('DEMONSTRATION MODE'));
        if (demoBtn) demoBtn.click();
      });
      await sleep(3500); // Wait for CPACF boot sequence
      enteredShell = true;
    }

    const postEnterHtml = await page.content();
    const hasViteOverlay = await page.evaluate(() => Boolean(document.querySelector('vite-error-overlay')));
    const bodyText = await page.evaluate(() => document.body.innerText || '');
    const isBlank = bodyText.trim().length === 0;

    // Navigation and Shell verification
    const navItems = await page.evaluate(() => {
      const asideButtons = Array.from(document.querySelectorAll('aside button'));
      return asideButtons.map(b => (b.innerText || '').trim().replace(/\s+/g, ' ')).filter(t => t.length > 0);
    });

    const hasControlCenterNav = navItems.some(item => item.includes('Control Center'));
    const hasHeader = await page.evaluate(() => Boolean(document.querySelector('header')));
    const hasSidebar = await page.evaluate(() => Boolean(document.querySelector('aside')));
    const hasContextBar = bodyText.includes('WORKSPACE:');

    // Read displayed metrics without modifying anything
    const displayedMargin = await page.evaluate(() => {
      const match = document.body.innerText.match(/(\d+)%/);
      return match ? match[1] : null;
    });

    const auditResults = {
      timestamp: new Date().toISOString(),
      url: APP_URL,
      renderStatus: {
        initialRenderSuccess: !isBlankInitial,
        postEnterRenderSuccess: !isBlank,
        hasViteOverlayInitial,
        hasViteOverlay,
        hasHeader,
        hasSidebar,
        hasContextBar,
        hasControlCenterNav,
        navItemCount: navItems.length,
        navItemsSample: navItems.slice(0, 10),
      },
      systemTelemetryRead: {
        displayedMargin,
        bodySnippet: bodyText.slice(0, 500).replace(/\n+/g, ' | '),
      },
      errors: {
        consoleErrors,
        pageErrors,
        failedRequests,
      }
    };

    const outPath = path.join(__dirname, 'observe_audit_results.json');
    fs.writeFileSync(outPath, JSON.stringify(auditResults, null, 2));
    console.log('OBSERVE-ONLY BROWSER AUDIT COMPLETE:');
    console.log(JSON.stringify(auditResults, null, 2));
  } finally {
    await browser.close();
  }
}

runObserveOnlyAudit().catch(err => {
  console.error('Fatal in Observe-Only Browser Audit:', err);
  process.exit(1);
});
