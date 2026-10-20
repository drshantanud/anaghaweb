'use strict';
// End-to-end HTTP tests: patient journey, admin workflow, security controls.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'ad-test-'));
process.env.DATA_DIR = DATA;
process.env.DATA_ENCRYPTION_KEY = 'test-key';
process.env.SESSION_SECRET = 'test-secret';
process.env.SITE_URL = 'https://example.test';
process.env.BACKUPS = '0';

const { server } = require('../server');
const auth = require('../lib/auth');
const booking = require('../lib/booking');
let base;

test.before(async () => { await new Promise(r => server.listen(0, r)); base = 'http://127.0.0.1:' + server.address().port; });
test.after(() => { server.close(); fs.rmSync(DATA, { recursive: true, force: true }); });

const get = (p, headers = {}) => fetch(base + p, { headers, redirect: 'manual' });
const post = (p, body, headers = {}) => fetch(base + p, { method: 'POST', redirect: 'manual', headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded', Origin: base }, headers), body: new URLSearchParams(body).toString() });
const cookieOf = r => (r.headers.get('set-cookie') || '').split(';')[0];

function nextDay(dows) {
  let d = booking.addDays(booking.nowIST().date, 1);
  while (!dows.includes(booking.dayOfWeek(d))) d = booking.addDays(d, 1);
  return d;
}

const PAGES = ['/', '/about', '/cataract-surgery', '/eye-care-services', '/faqs', '/articles', '/book-appointment', '/clinics', '/contact', '/privacy-policy', '/medical-disclaimer', '/appointment-status'];

test('all pages render in English and Marathi, and every internal link resolves', async () => {
  const seen = new Set();
  for (const lang of ['', '/mr']) {
    for (const p of PAGES) {
      const r = await get(lang + (p === '/' && lang ? '/' : p));
      assert.strictEqual(r.status, 200, lang + p);
      const html = await r.text();
      assert.match(html, lang ? /<html lang="mr"/ : /<html lang="en"/);
      for (const m of html.matchAll(/href="(\/[^"#]*)/g)) seen.add(m[1].replace(/&amp;/g, '&'));
    }
  }
  for (const href of seen) {
    const r = await get(href);
    assert.ok([200, 303].includes(r.status), href + ' -> ' + r.status);
  }
});

test('call and WhatsApp links are correct and never interchanged', async () => {
  const html = await (await get('/')).text();
  assert.ok(html.includes('href="tel:8451800800"'));
  assert.ok(html.includes('href="tel:8879758831"'));
  assert.ok(html.includes('Call SRV Hospital for Appointment'));
  assert.ok(html.includes('Call Just Care for Appointment'));
  const wa = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(wa.length > 0);
  for (const w of wa) assert.ok(w.startsWith('https://wa.me/918879758831?text='), w);
  assert.ok(!/wa\.me\/91?8451800800/.test(html), 'SRV landline must not be on WhatsApp');
  const srvCard = html.split('id="clinic-srv"')[1].split('</article>')[0];
  assert.ok(srvCard.includes('8451800800') && !srvCard.includes('8879758831') && !srvCard.includes('wa.me'));
  const jcCard = html.split('id="clinic-justcare"')[1].split('</article>')[0];
  assert.ok(jcCard.includes('8879758831') && !jcCard.includes('8451800800'));
});

test('Marathi pages show Marathi headline and booking button', async () => {
  const html = await (await get('/mr/')).text();
  assert.ok(html.includes('स्पष्ट दृष्टीसाठी अनुभवी नेत्रसेवा'));
  assert.ok(html.includes('भेटीची वेळ ठरवा'));
  const faq = await (await get('/mr/faqs')).text();
  assert.ok(faq.includes('मोतीबिंदू म्हणजे काय?'));
});

test('FAQ page lists all 32+ questions', async () => {
  const html = await (await get('/faqs')).text();
  assert.ok((html.match(/<details class="faq" id=/g) || []).length >= 32);
  assert.ok(html.includes('"@type":"FAQPage"'));
});

test('SEO: titles, descriptions, canonical, hreflang, structured data, sitemap, robots', async () => {
  const titles = new Set();
  for (const p of PAGES.slice(0, 11)) {
    const html = await (await get(p)).text();
    const title = /<title>([^<]+)<\/title>/.exec(html)[1];
    assert.ok(!titles.has(title), 'duplicate title ' + title); titles.add(title);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/);
    assert.ok(html.includes(`<link rel="canonical" href="https://example.test${p}"`), p);
    assert.ok(html.includes('hreflang="mr-IN"'));
    assert.ok(html.includes('"@type":"Physician"') && html.includes('"@type":"MedicalClinic"'));
    assert.ok(!/ratingValue|aggregateRating|"review"/.test(html), 'no fabricated reviews');
  }
  const sm = await (await get('/sitemap.xml')).text();
  assert.ok(sm.includes('<loc>https://example.test/mr/cataract-surgery</loc>'));
  assert.match(await (await get('/robots.txt')).text(), /Disallow: \//, 'preview mode blocks indexing');
});

test('security headers are set', async () => {
  const r = await get('/');
  assert.match(r.headers.get('content-security-policy'), /default-src 'self'/);
  assert.strictEqual(r.headers.get('x-frame-options'), 'DENY');
  assert.strictEqual(r.headers.get('x-content-type-options'), 'nosniff');
});

test('booking validation shows clear errors in the page language', async () => {
  const r = await post('/mr/book-appointment', { clinic: 'srv', name: '', mobile: '123', date: '', time: '', reason: '', language: 'mr' });
  assert.strictEqual(r.status, 422);
  const html = await r.text();
  assert.ok(html.includes('कृपया योग्य १० अंकी भारतीय मोबाइल क्रमांक लिहा.'));
  assert.ok(html.includes('aria-invalid="true"'));
  const sun = await post('/book-appointment', { clinic: 'justcare', name: 'Test Patient', mobile: '9876500000', date: nextDay([0]), time: '18:00', reason: 'checkup', language: 'en', consent: 'yes' });
  assert.ok((await sun.text()).includes('This clinic does not hold OPD on this day'));
});

test('cross-origin form posts are refused', async () => {
  const r = await post('/book-appointment', { clinic: 'srv' }, { Origin: 'https://evil.example' });
  assert.strictEqual(r.status, 403);
});

let appt = {};
test('patient journey: request -> received (not confirmed) -> status lookup', async () => {
  const date = nextDay([1, 2, 3, 4, 5]);
  const r = await post('/book-appointment', { clinic: 'justcare', name: 'Asha Patil', mobile: '98765 43210', date, time: '18:30', reason: 'cataract', language: 'mr', message: 'Evening preferred', consent: 'yes' });
  assert.strictEqual(r.status, 303);
  assert.strictEqual(r.headers.get('location'), '/book-appointment/received');
  assert.ok(!r.headers.get('location').includes('Asha'), 'no personal data in URL');
  const page = await (await get('/book-appointment/received', { Cookie: cookieOf(r) })).text();
  assert.ok(page.includes('Appointment request received'));
  assert.ok(page.includes('Request received – awaiting confirmation'));
  assert.ok(!page.includes('Appointment confirmed'));
  const ref = /class="ref">([A-Z0-9-]+)</.exec(page)[1];
  appt = { ref, date };
  // duplicate prevention
  const dup = await post('/book-appointment', { clinic: 'justcare', name: 'Asha Patil', mobile: '9876543210', date, time: '19:00', reason: 'cataract', language: 'mr', consent: 'yes' });
  assert.ok((await dup.text()).includes('A request for this mobile number already exists'));
  // availability API shows no patient data
  const av = await (await get(`/api/availability?clinic=justcare&date=${date}`)).json();
  assert.ok(av.ok && !JSON.stringify(av).includes('Asha'));
  // status lookup requires matching mobile
  assert.strictEqual((await post('/appointment-status', { ref, mobile: '9000000000' })).status, 404);
  const st = await (await post('/appointment-status', { ref, mobile: '9876543210' })).text();
  assert.ok(st.includes('awaiting confirmation'));
});

test('patient data is encrypted at rest', () => {
  const raw = fs.readFileSync(path.join(DATA, 'appointments.json'), 'utf8');
  assert.ok(raw.includes('aes-256-gcm') && !raw.includes('Asha'));
});

test('admin: login, CSRF, confirm, reschedule, cancel, export, staff permissions', async () => {
  await auth.createUser({ username: 'doctor', name: 'Dr. Deshpande', role: 'admin', password: 'Secure-pass-123' });
  await auth.createUser({ username: 'reception', name: 'Reception', role: 'staff', password: 'Secure-pass-456' });
  assert.strictEqual((await get('/admin')).status, 303);
  assert.strictEqual((await post('/admin/login', { username: 'doctor', password: 'wrong' })).status, 401);
  const login = await post('/admin/login', { username: 'doctor', password: 'Secure-pass-123' });
  assert.strictEqual(login.status, 303);
  const C = { Cookie: cookieOf(login) };
  const list = await (await get('/admin/appointments', C)).text();
  assert.ok(list.includes('Asha Patil'));
  const id = /action="\/admin\/appointments\/([0-9a-f-]{36})"/.exec(list)[1];
  const csrf = /name="_csrf" value="([^"]+)"/.exec(list)[1];
  assert.strictEqual((await post('/admin/appointments/' + id, { action: 'confirm' }, C)).status, 403, 'missing CSRF rejected');
  assert.strictEqual((await post('/admin/appointments/' + id, { action: 'confirm', _csrf: csrf }, C)).status, 303);
  let st = await (await post('/appointment-status', { ref: appt.ref, mobile: '9876543210' })).text();
  assert.ok(st.includes('Appointment confirmed'));
  // reschedule to a Saturday at Just Care is refused; to next weekday 19:00 succeeds
  await post('/admin/appointments/' + id, { action: 'reschedule', date: nextDay([6]), time: '19:00', _csrf: csrf }, C);
  st = await (await post('/appointment-status', { ref: appt.ref, mobile: '9876543210' })).text();
  assert.ok(st.includes('Appointment confirmed'), 'invalid reschedule not applied');
  await post('/admin/appointments/' + id, { action: 'reschedule', date: appt.date, time: '19:00', _csrf: csrf }, C);
  st = await (await post('/appointment-status', { ref: appt.ref, mobile: '9876543210' })).text();
  assert.ok(st.includes('Appointment rescheduled') && st.includes('7:00 PM'));
  await post('/admin/appointments/' + id, { action: 'cancel', _csrf: csrf }, C);
  st = await (await post('/appointment-status', { ref: appt.ref, mobile: '9876543210' })).text();
  assert.ok(st.includes('Appointment cancelled'));
  const csv = await (await get('/admin/appointments/export.csv', C)).text();
  assert.ok(csv.includes('Asha Patil') && csv.includes('cancelled'));
  // staff cannot edit content or export
  const sl = await post('/admin/login', { username: 'reception', password: 'Secure-pass-456' });
  const S = { Cookie: cookieOf(sl) };
  assert.strictEqual((await get('/admin/appointments', S)).status, 200);
  assert.strictEqual((await get('/admin/profile', S)).status, 403);
  assert.strictEqual((await get('/admin/appointments/export.csv', S)).status, 403);
});

test('admin closures block online requests for those dates', async () => {
  const login = await post('/admin/login', { username: 'doctor', password: 'Secure-pass-123' });
  const C = { Cookie: cookieOf(login) };
  const csrf = /name="_csrf" value="([^"]+)"/.exec(await (await get('/admin/schedule', C)).text())[1];
  const d = nextDay([1, 2, 3, 4, 5, 6]);
  await post('/admin/closures', { from: d, to: d, clinic: 'srv', note: 'Doctor on leave', _csrf: csrf }, C);
  const av = await (await get(`/api/availability?clinic=srv&date=${d}`)).json();
  assert.strictEqual(av.code, 'date_holiday');
});
