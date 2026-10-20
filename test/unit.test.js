'use strict';
// Booking rules, link correctness and content checks.
const test = require('node:test');
const assert = require('node:assert');
const booking = require('../lib/booking');
const site = require('../content/site');
const { faqs, categories } = require('../content/faqs');
const views = require('../lib/views');
const { ui } = require('../lib/i18n');

const content = JSON.parse(JSON.stringify(site));
const srv = content.clinics.find(c => c.id === 'srv');
const jc = content.clinics.find(c => c.id === 'justcare');
// Fixed "now": Monday 19 Oct 2026, 09:00 IST
const NOW = Date.UTC(2026, 9, 19, 3, 30);

test('clinic numbers, hours and days are exactly as specified', () => {
  assert.strictEqual(srv.phone, '8451800800');
  assert.strictEqual(srv.whatsapp, '', 'SRV landline must not be linked to WhatsApp');
  assert.deepStrictEqual([srv.days, srv.start, srv.end], [[1, 2, 3, 4, 5, 6], '10:00', '13:00']);
  assert.strictEqual(jc.phone, '8879758831');
  assert.strictEqual(jc.whatsapp, '918879758831');
  assert.deepStrictEqual([jc.days, jc.start, jc.end], [[1, 2, 3, 4, 5], '18:00', '20:00']);
});

test('WhatsApp link opens the Just Care number with the editable prefilled message', () => {
  const href = views.waHref(jc, content, 'en');
  assert.ok(href.startsWith('https://wa.me/918879758831?text='));
  const msg = decodeURIComponent(href.split('text=')[1]);
  assert.ok(msg.startsWith('Hello, I would like to book an appointment with Dr. Anagha Deshpande at Just Care Heart & Eye Clinic, Chembur.'));
  for (const line of ['Patient name:', 'Preferred date:', 'Preferred time:', 'Reason for consultation:', 'Please let me know the available appointment slots.']) assert.ok(msg.includes(line), line);
  assert.strictEqual(views.waHref(srv, content, 'en'), '');
});

test('slots are generated only within OPD hours', () => {
  assert.deepStrictEqual(booking.allSlots(srv).slice(0, 2), ['10:00', '10:15']);
  assert.strictEqual(booking.allSlots(srv).at(-1), '12:45');
  assert.strictEqual(booking.allSlots(jc).length, 8);
  assert.strictEqual(booking.allSlots(jc).at(-1), '19:45');
});

test('no Sunday appointments; Saturday only at SRV', () => {
  assert.strictEqual(booking.checkDate(content, srv, '2026-10-25', NOW).code, 'date_closed'); // Sunday
  assert.strictEqual(booking.checkDate(content, jc, '2026-10-25', NOW).code, 'date_closed');
  assert.strictEqual(booking.checkDate(content, srv, '2026-10-24', NOW), null); // Saturday
  assert.strictEqual(booking.checkDate(content, jc, '2026-10-24', NOW).code, 'date_closed');
});

test('past, far-future and invalid dates are rejected', () => {
  assert.strictEqual(booking.checkDate(content, srv, '2026-10-17', NOW).code, 'date_past');
  assert.strictEqual(booking.checkDate(content, srv, '2026-12-30', NOW).code, 'date_far');
  assert.strictEqual(booking.checkDate(content, srv, '2026-02-30', NOW).code, 'date');
});

test('holidays and leave block dates per clinic', () => {
  const c2 = JSON.parse(JSON.stringify(content));
  c2.closures = [{ from: '2026-10-20', to: '2026-10-21', clinic: 'justcare', note: 'Leave' }];
  assert.strictEqual(booking.checkDate(c2, jc, '2026-10-21', NOW).code, 'date_holiday');
  assert.strictEqual(booking.checkDate(c2, srv, '2026-10-21', NOW), null);
});

test('same-day slots respect minimum notice', () => {
  const at = Date.UTC(2026, 9, 19, 5, 0); // 10:30 IST
  const av = booking.availability(content, [], 'srv', '2026-10-19', at);
  assert.strictEqual(av.slots.find(s => s.time === '11:15').available, false);
  assert.strictEqual(av.slots.find(s => s.time === '11:30').available, true);
});

const good = { name: 'Asha Patil', mobile: '+91 98765 43210', clinic: 'justcare', date: '2026-10-20', time: '18:30', reason: 'cataract', language: 'mr', consent: 'yes' };

test('valid request passes and normalises the mobile number', () => {
  const r = booking.validateRequest(content, [], good, NOW);
  assert.deepStrictEqual(r.errors, {});
  assert.strictEqual(r.value.mobile, '9876543210');
});

test('every invalid field gets an error code', () => {
  const r = booking.validateRequest(content, [], { name: 'A', mobile: '12345', clinic: 'srv', date: '2026-10-20', time: '18:30', reason: 'x', language: 'fr' }, NOW);
  assert.deepStrictEqual(Object.keys(r.errors).sort(), ['consent', 'language', 'mobile', 'name', 'reason', 'time']);
});

test('Just Care evening time cannot be requested at SRV', () => {
  const r = booking.validateRequest(content, [], Object.assign({}, good, { clinic: 'srv' }), NOW);
  assert.strictEqual(r.errors.time, 'time');
});

test('slot capacity and duplicate prevention', () => {
  const existing = [
    { id: '1', status: 'requested', clinic: 'justcare', date: '2026-10-20', time: '18:30', mobile: '9000000001' },
    { id: '2', status: 'confirmed', clinic: 'justcare', date: '2026-10-20', time: '18:30', mobile: '9000000002' }
  ];
  assert.strictEqual(booking.validateRequest(content, existing, good, NOW).errors.time, 'slot_full');
  existing[1].status = 'cancelled';
  assert.deepStrictEqual(booking.validateRequest(content, existing, good, NOW).errors, {});
  const dup = [{ id: '3', status: 'requested', clinic: 'justcare', date: '2026-10-20', time: '19:00', mobile: '9876543210' }];
  assert.strictEqual(booking.validateRequest(content, dup, good, NOW).errors.form, 'duplicate');
});

test('at least 32 FAQs, each complete in English and Marathi, with valid links', () => {
  assert.ok(faqs.length >= 32, faqs.length);
  const ids = new Set(faqs.map(f => f.id));
  assert.strictEqual(ids.size, faqs.length);
  for (const f of faqs) {
    for (const k of ['q', 'short', 'detail']) for (const l of ['en', 'mr']) assert.ok(f[k][l] && f[k][l].length > 10, `${f.id}.${k}.${l}`);
    assert.ok(categories.some(c => c.id === f.category), f.id);
    for (const r of f.related) assert.ok(ids.has(r), `${f.id} -> ${r}`);
  }
  for (const c of categories) assert.ok(faqs.some(f => f.category === c.id), 'category ' + c.id + ' has questions');
  for (const id of ['sudden-vision-loss-emergency', 'chemical-in-eye', 'flashes-and-floaters-urgent']) assert.ok(faqs.find(f => f.id === id).emergency);
});

test('every English interface string has a Marathi translation', () => {
  const walk = (en, mr, p) => { for (const k of Object.keys(en)) { assert.ok(mr[k] !== undefined, 'missing mr ' + p + k); if (typeof en[k] === 'object' && !Array.isArray(en[k])) walk(en[k], mr[k], p + k + '.'); } };
  walk(ui.en, ui.mr, '');
});
