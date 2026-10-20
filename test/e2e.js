'use strict';
// Browser test of the patient journey and accessibility.
// Requires: npm i -D playwright-core axe-core, and a Chromium (set CHROME_PATH).
// Usage: npm run test:e2e
const { chromium } = require('playwright-core');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'ad-e2e-'));
Object.assign(process.env, { DATA_DIR: DATA, SESSION_SECRET: 's', DATA_ENCRYPTION_KEY: 'k', BACKUPS: '0' });
const { server } = require('../server');
const booking = require('../lib/booking');
let axeSource = null;
try { axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'); } catch {}

const results = [];
const check = (name, ok, info = '') => { results.push([ok, name]); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? ' – ' + info : '')); };

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await mobile.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Home -> language switch
  await page.goto(base + '/');
  check('mobile bar shows Call, WhatsApp, Book', await page.locator('.mobile-bar__btn').count() === 3 && await page.locator('.mobile-bar').isVisible());
  await page.click('.mobile-bar [data-call-sheet]');
  const sheetLinks = await page.locator('#call-sheet a').evaluateAll(a => a.map(x => x.getAttribute('href')));
  check('Call chooser offers both clinic numbers', JSON.stringify(sheetLinks) === JSON.stringify(['tel:8451800800', 'tel:8879758831']), sheetLinks.join(','));
  await page.click('#call-sheet [data-close]');
  await page.click('.nav-toggle');
  await page.click('#site-nav .lang-switch');
  await page.waitForURL(base + '/mr/');
  check('language switch goes to Marathi home', (await page.textContent('h1')).includes('स्पष्ट दृष्टीसाठी'));
  const fontOk = await page.evaluate(() => document.fonts.check('16px "Noto Sans Devanagari"', 'मोतीबिंदू'));
  check('Marathi font loaded', fontOk);

  // FAQ search
  await page.goto(base + '/faqs');
  await page.fill('#faq-search', 'glaucoma');
  const visible = await page.locator('.faq:not([hidden])').count();
  check('FAQ search filters results', visible > 0 && visible < 20, visible + ' shown');
  await page.goto(base + '/faqs#chemical-in-eye');
  check('FAQ deep link opens the answer', await page.locator('#chemical-in-eye').evaluate(d => d.open));

  // Booking journey (Just Care, next weekday)
  let date = booking.addDays(booking.nowIST().date, 1);
  while (![1, 2, 3, 4, 5].includes(booking.dayOfWeek(date))) date = booking.addDays(date, 1);
  await page.goto(base + '/book-appointment');
  await page.click('#clinic-justcare >> text=Choose this clinic').catch(() => page.click('a[href*="clinic=justcare"]'));
  await page.waitForURL(/clinic=justcare/);
  const wa = await page.getAttribute('.method--wa', 'href');
  check('Step 2 WhatsApp link uses Just Care number', wa.startsWith('https://wa.me/918879758831?text='));
  await page.click('button[type=submit]');
  check('empty form shows error summary', await page.locator('#error-summary').isVisible());
  await page.fill('#f-name', 'Ramesh Kulkarni');
  await page.fill('#f-mobile', '9123456789');
  await page.fill('#f-date', date);
  await page.dispatchEvent('#f-date', 'change');
  await page.waitForFunction(() => !document.querySelector('.slot-status').textContent.includes('…'));
  await page.selectOption('#f-time', '18:15');
  await page.selectOption('#f-reason', 'checkup');
  await page.check('#f-consent');
  await page.click('button[type=submit]');
  await page.waitForURL(/received/);
  check('request received page says not yet confirmed', (await page.textContent('.status-card')).includes('awaiting confirmation'));

  // Desktop accessibility scan
  const desk = await (await browser.newContext({ viewport: { width: 1366, height: 900 }, bypassCSP: true })).newPage();
  if (axeSource) {
    for (const p of ['/', '/mr/', '/cataract-surgery', '/faqs', '/book-appointment?clinic=srv', '/about', '/clinics', '/contact']) {
      await desk.goto(base + p);
      await desk.addScriptTag({ content: axeSource });
      const r = await desk.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map(v => v.id + ' (' + v.nodes.length + ')'));
      check('axe WCAG A/AA ' + p, r.length === 0, r.join(', '));
    }
  }
  // Keyboard: first Tab focuses skip link
  await desk.goto(base + '/');
  await desk.keyboard.press('Tab');
  check('first Tab reaches skip link', await desk.evaluate(() => document.activeElement.className === 'skip'));
  // Horizontal overflow on mobile
  for (const p of ['/', '/mr/', '/cataract-surgery', '/mr/faqs', '/book-appointment?clinic=justcare', '/clinics']) {
    await page.goto(base + p);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    check('no horizontal scroll at 390px ' + p, sw <= 390, String(sw));
  }
  check('no JavaScript errors', errors.length === 0, errors.join('; '));

  await browser.close(); server.close(); fs.rmSync(DATA, { recursive: true, force: true });
  const failed = results.filter(r => !r[0]).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
