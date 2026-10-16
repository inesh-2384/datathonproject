const puppeteer = require('puppeteer-core');

async function inspectButtons() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map((b, idx) => ({
      index: idx,
      text: b.innerText.trim().replace(/\s+/g, ' '),
      ariaLabel: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      disabled: b.disabled
    }));
  });
  
  console.log(`Found ${buttons.length} buttons on initial page:`);
  buttons.forEach(b => {
    if (b.text || b.ariaLabel || b.title) {
      console.log(`[${b.index}] "${b.text}" (aria: "${b.ariaLabel}", title: "${b.title}", disabled: ${b.disabled})`);
    }
  });

  console.log('\n--- CLICKING "ENTER CONTROL ENVIRONMENT" ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ENTER CONTROL ENVIRONMENT'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const mainButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map((b, idx) => ({
      index: idx,
      text: b.innerText.trim().replace(/\s+/g, ' '),
      ariaLabel: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      disabled: b.disabled
    }));
  });

  console.log(`\nFound ${mainButtons.length} buttons in main control environment:`);
  mainButtons.forEach(b => {
    if (b.text || b.ariaLabel || b.title) {
      console.log(`[${b.index}] "${b.text}" (aria: "${b.ariaLabel}", title: "${b.title}", disabled: ${b.disabled})`);
    }
  });

  console.log('\n--- CLICKING "INITIALIZE ENCLAVE AS SYSTEM_OPERATOR" ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('INITIALIZE ENCLAVE'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const workspaceButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map((b, idx) => ({
      index: idx,
      text: b.innerText.trim().replace(/\s+/g, ' '),
      ariaLabel: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      disabled: b.disabled
    }));
  });

  console.log(`\nFound ${workspaceButtons.length} buttons in full operational environment:`);
  workspaceButtons.forEach(b => {
    if (b.text || b.ariaLabel || b.title) {
      console.log(`[${b.index}] "${b.text}" (aria: "${b.ariaLabel}", title: "${b.title}", disabled: ${b.disabled})`);
    }
  });

  console.log('\n--- CLICKING "Skip Animation →" ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip Animation'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const bootedButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map((b, idx) => ({
      index: idx,
      text: b.innerText.trim().replace(/\s+/g, ' '),
      ariaLabel: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      disabled: b.disabled
    }));
  });

  console.log(`\nFound ${bootedButtons.length} buttons in fully booted operational environment:`);
  bootedButtons.forEach(b => {
    if (b.text || b.ariaLabel || b.title) {
      console.log(`[${b.index}] "${b.text}" (aria: "${b.ariaLabel}", title: "${b.title}", disabled: ${b.disabled})`);
    }
  });

  const sidebarItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('nav button, aside button, nav a')).map(el => el.innerText.trim().replace(/\s+/g, ' '));
  });
  console.log(`\nNavigation / Sidebar Items:`, sidebarItems);

  await browser.close();
}

inspectButtons().catch(console.error);
