'use strict';
// Clinic schedule rules, slot generation and appointment-request validation.
// All dates/times are Indian Standard Time regardless of server time zone.

const crypto = require('crypto');

const IST_OFFSET_MIN = 330;
const STATUSES = ['requested', 'confirmed', 'rescheduled', 'cancelled', 'completed'];
const ACTIVE = new Set(['requested', 'confirmed', 'rescheduled']);
const REASONS = ['cataract', 'checkup', 'blurred', 'diabetes', 'glaucoma', 'dry', 'red', 'followup', 'other'];
const LANGS = ['en', 'mr', 'hi'];

function nowIST(now = Date.now()) {
  const d = new Date(now + IST_OFFSET_MIN * 60000);
  return {
    date: d.toISOString().slice(0, 10),
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes()
  };
}

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dayOfWeek(iso) { return new Date(iso + 'T00:00:00Z').getUTCDay(); }

function toMin(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; }
function toHHMM(min) { return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0'); }

function validISODate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
}

function allSlots(clinic) {
  const out = [];
  const step = Math.max(5, Number(clinic.slotMinutes) || 15);
  for (let m = toMin(clinic.start); m + step <= toMin(clinic.end); m += step) out.push(toHHMM(m));
  return out;
}

function closureFor(content, clinicId, date) {
  return (content.closures || []).find(c =>
    (c.clinic === 'all' || c.clinic === clinicId) && date >= c.from && date <= (c.to || c.from));
}

// Returns null if the date is bookable, otherwise an error code (+ vars).
function checkDate(content, clinic, date, now = Date.now()) {
  if (!validISODate(date)) return { code: 'date' };
  const today = nowIST(now).date;
  if (date < today) return { code: 'date_past' };
  const windowDays = content.settings.bookingWindowDays || 30;
  if (date > addDays(today, windowDays)) return { code: 'date_far', vars: { days: windowDays } };
  if (dayOfWeek(date) === 0 || !clinic.days.includes(dayOfWeek(date))) return { code: 'date_closed' };
  const closed = closureFor(content, clinic.id, date);
  if (closed) return { code: 'date_holiday', vars: { note: closed.note || '' } };
  return null;
}

function countForSlot(appointments, clinicId, date, time, excludeId) {
  return appointments.filter(a => a.id !== excludeId && ACTIVE.has(a.status) &&
    a.clinic === clinicId && a.date === date && a.time === time).length;
}

// Public availability for one clinic/date. No patient data is exposed.
function availability(content, appointments, clinicId, date, now = Date.now()) {
  const clinic = content.clinics.find(c => c.id === clinicId);
  if (!clinic) return { ok: false, code: 'clinic' };
  const dateErr = checkDate(content, clinic, date, now);
  if (dateErr) return { ok: false, code: dateErr.code, vars: dateErr.vars, slots: [] };
  const n = nowIST(now);
  const minNotice = content.settings.minNoticeMinutes || 0;
  const cap = Math.max(1, Number(clinic.capacityPerSlot) || 1);
  const slots = allSlots(clinic).map(time => {
    const tooSoon = date === n.date && toMin(time) < n.minutes + minNotice;
    const full = countForSlot(appointments, clinic.id, date, time) >= cap;
    return { time, available: !tooSoon && !full, reason: tooSoon ? 'past' : full ? 'full' : null };
  });
  return { ok: true, slots };
}

function normaliseMobile(raw) {
  let s = String(raw || '').replace(/[\s\-().]/g, '');
  if (s.startsWith('+91')) s = s.slice(3);
  else if (s.length === 12 && s.startsWith('91')) s = s.slice(2);
  else if (s.length === 11 && s.startsWith('0')) s = s.slice(1);
  return /^[6-9]\d{9}$/.test(s) ? s : null;
}

function clean(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// Validate a public appointment request. Returns { errors: {field: code}, value }.
function validateRequest(content, appointments, input, now = Date.now()) {
  const errors = {};
  const vars = {};
  const v = {
    name: clean(input.name, 100),
    mobile: normaliseMobile(input.mobile),
    clinic: clean(input.clinic, 20),
    date: clean(input.date, 10),
    time: clean(input.time, 5),
    reason: clean(input.reason, 20),
    language: clean(input.language, 2),
    message: clean(input.message, 2000),
    consent: input.consent === true || input.consent === 'on' || input.consent === 'yes' || input.consent === 'true'
  };
  if (v.name.replace(/[^\p{L}]/gu, '').length < 2) errors.name = 'name';
  if (!v.mobile) errors.mobile = 'mobile';
  const clinic = content.clinics.find(c => c.id === v.clinic);
  if (!clinic) errors.clinic = 'clinic';
  if (!REASONS.includes(v.reason)) errors.reason = 'reason';
  if (!LANGS.includes(v.language)) errors.language = 'lang';
  if (v.message.length > 500) errors.message = 'message';
  if (!v.consent) errors.consent = 'consent';

  if (clinic) {
    const dErr = checkDate(content, clinic, v.date, now);
    if (dErr) { errors.date = dErr.code; Object.assign(vars, dErr.vars || {}); }
    else if (!allSlots(clinic).includes(v.time)) errors.time = 'time';
    else {
      const av = availability(content, appointments, clinic.id, v.date, now);
      const slot = av.slots.find(s => s.time === v.time);
      if (!slot.available) errors.time = slot.reason === 'past' ? 'time_past' : 'slot_full';
    }
  }
  if (!Object.keys(errors).length) {
    const mine = appointments.filter(a => a.mobile === v.mobile && ACTIVE.has(a.status) && a.date >= nowIST(now).date);
    if (mine.some(a => a.clinic === v.clinic && a.date === v.date)) errors.form = 'duplicate';
    else if (mine.length >= (content.settings.maxOpenRequestsPerMobile || 3)) errors.form = 'too_many';
  }
  return { errors, vars, value: v };
}

// Reference without ambiguous characters, e.g. "AD-7K4P-Q9MX".
function makeRef() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const b = crypto.randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) s += A[b[i] % A.length];
  return 'AD-' + s.slice(0, 4) + '-' + s.slice(4);
}

module.exports = {
  STATUSES, ACTIVE, REASONS, LANGS, nowIST, addDays, dayOfWeek, allSlots, checkDate,
  availability, validateRequest, normaliseMobile, makeRef, clean, countForSlot, validISODate, closureFor
};
