'use strict';
// Admin dashboard: authentication, appointment management and content editing.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const store = require('./store');
const auth = require('./auth');
const booking = require('./booking');
const H = require('./http');
const { fmtDate, fmtTime, t } = require('./i18n');
const { esc } = require('./views');

const STATUS_LABEL = { requested: 'Requested (not confirmed)', confirmed: 'Confirmed', rescheduled: 'Rescheduled', cancelled: 'Cancelled', completed: 'Completed' };
const REASON_LABEL = t('en', 'reasons');

// ---------- Layout ----------

function page(c, title, body, { active = '' } = {}) {
  const u = c.session && c.session.user;
  const nav = u ? [
    ['/admin', 'Dashboard', 'dash'], ['/admin/appointments', 'Appointments', 'appointments'], ['/admin/enquiries', 'Enquiries', 'enquiries'],
    ...(u.role === 'admin' ? [['/admin/schedule', 'Timings & leave', 'schedule'], ['/admin/clinics', 'Clinics', 'clinics'], ['/admin/profile', 'Doctor profile', 'profile'],
      ['/admin/services', 'Services', 'services'], ['/admin/faqs', 'FAQs', 'faqs'], ['/admin/photos', 'Photos', 'photos'], ['/admin/settings', 'Settings', 'settings'],
      ['/admin/users', 'Users', 'users'], ['/admin/audit', 'Activity log', 'audit']] : [])
  ] : [];
  return `<!doctype html><html lang="en" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${esc(title)} · Admin</title>
<link rel="stylesheet" href="/css/site.css?v=${c.assetVersion}"><link rel="stylesheet" href="/css/admin.css?v=${c.assetVersion}"></head>
<body class="admin">
<header class="admin-header"><a href="/admin" class="admin-brand">Dr. Anagha Deshpande · Admin</a>
${u ? `<span class="admin-user">${esc(u.name)} (${u.role})</span><form method="post" action="/admin/logout" class="inline">${csrf(c)}<button class="btn btn--sm btn--ghost">Log out</button></form>` : ''}
<a class="btn btn--sm btn--ghost" href="/" target="_blank">View site</a></header>
<div class="admin-wrap${u ? '' : ' admin-wrap--solo'}">
${u ? `<nav class="admin-nav" aria-label="Admin">${nav.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>` : ''}
<main class="admin-main" id="main"><h1>${esc(title)}</h1>${c.flash ? `<p class="flash" role="status">${esc(c.flash)}</p>` : ''}${body}</main></div>
<script src="/js/admin.js?v=${c.assetVersion}" defer></script></body></html>`;
}

const csrf = c => `<input type="hidden" name="_csrf" value="${esc(c.session ? c.session.csrf : '')}">`;
const field = (label, name, value, { type = 'text', hint = '', attrs = '' } = {}) =>
  `<label class="afield"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}<input type="${type}" name="${name}" value="${esc(value)}" ${attrs}></label>`;
const area = (label, name, value, rows = 4, hint = '') =>
  `<label class="afield"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}<textarea name="${name}" rows="${rows}">${esc(value)}</textarea></label>`;
const bi = (label, name, obj, rows) => rows
  ? `<div class="bi">${area(label + ' – English', name + '_en', obj && obj.en, rows)}${area(label + ' – मराठी', name + '_mr', obj && obj.mr, rows)}</div>`
  : `<div class="bi">${field(label + ' – English', name + '_en', obj && obj.en)}${field(label + ' – मराठी', name + '_mr', obj && obj.mr)}</div>`;
const checkbox = (label, name, checked) => `<label class="acheck"><input type="checkbox" name="${name}" value="1"${checked ? ' checked' : ''}> ${label}</label>`;
const biVal = (b, name) => ({ en: String(b[name + '_en'] || '').trim(), mr: String(b[name + '_mr'] || '').trim() });

function flashRedirect(c, res, to, msg) {
  H.redirect(res, to, 303, { 'Set-Cookie': H.cookie('af', msg ? H.sign(Buffer.from(msg).toString('base64url'), c.secret) : '', { maxAge: msg ? 60 : 0, secure: c.https, sameSite: 'Strict', path: '/admin' }) });
}

// ---------- Pages ----------

function loginPage(c, error) {
  return page(c, 'Staff login', `<form method="post" action="/admin/login" class="acard narrow-form">
${error ? `<p class="error error--form" role="alert">${esc(error)}</p>` : ''}
${field('Username', 'username', '', { attrs: 'autocomplete="username" required autofocus' })}
${field('Password', 'password', '', { type: 'password', attrs: 'autocomplete="current-password" required' })}
<button class="btn btn--primary">Log in</button>
<p class="muted small">Access is restricted to Dr. Deshpande and authorised clinic staff. All actions are logged.</p></form>`);
}

function checklist(content, faqData) {
  const items = [];
  const unrev = faqData.faqs.filter(f => !f.reviewed).length;
  if (unrev) items.push(`${unrev} FAQ answers are awaiting review and approval (<a href="/admin/faqs">FAQs</a>).`);
  const svc = content.services.filter(s => !s.published || s.confirm).length;
  if (svc) items.push(`${svc} services need confirmation: publish only services actually offered, and say where (<a href="/admin/services">Services</a>).`);
  content.clinics.filter(c => !c.mapVerified).forEach(c => items.push(`Verify the Google Maps link for ${esc(c.name.en)} and tick "verified" (<a href="/admin/clinics">Clinics</a>).`));
  if (!content.settings.email) items.push('Add a clinic email address, or leave blank to hide it (<a href="/admin/settings">Settings</a>).');
  if (content.doctor.career.some(x => x.confirm) || content.doctor.languagesSpoken.confirm) items.push('Confirm career history dates, the current status of the Lions/Apollo Clinic role, and languages spoken (<a href="/admin/profile">Doctor profile</a>).');
  items.push('Confirm the postal codes (400089, 400071) and both addresses (<a href="/admin/clinics">Clinics</a>).');
  items.push('Review the Privacy Policy and Medical Disclaimer wording (see README for where to edit).');
  return items;
}

function dashboard(c) {
  const content = c.getContent(), faqData = c.getFaqs();
  const list = store.read('appointments', []);
  const today = booking.nowIST().date;
  const pending = list.filter(a => a.status === 'requested').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const todays = list.filter(a => a.date === today && booking.ACTIVE.has(a.status)).sort((a, b) => a.time.localeCompare(b.time));
  const newEnq = store.read('enquiries', []).filter(e => e.status === 'new').length;
  const isAdmin = c.session.user.role === 'admin';
  return page(c, 'Dashboard', `
<div class="kpis">
<a class="kpi" href="/admin/appointments?status=requested"><strong>${pending.length}</strong><span>requests awaiting confirmation</span></a>
<a class="kpi" href="/admin/appointments?from=${today}&to=${today}"><strong>${todays.length}</strong><span>appointments today</span></a>
<a class="kpi" href="/admin/enquiries"><strong>${newEnq}</strong><span>new enquiries</span></a>
</div>
<h2>Requests awaiting confirmation</h2>
${apptTable(c, pending.slice(0, 15), content)}
${isAdmin ? `<h2>Before going live</h2>
<p>The site is currently <strong>${content.settings.siteLive ? 'LIVE (indexed by search engines)' : 'in PREVIEW mode (hidden from search engines, with a review banner)'}</strong>. Change this in <a href="/admin/settings">Settings</a>.</p>
<ul class="checklist">${checklist(content, faqData).map(i => `<li>${i}</li>`).join('')}</ul>` : ''}`, { active: 'dash' });
}

function waPatient(a, content) {
  const c = content.clinics.find(x => x.id === a.clinic);
  const mr = a.language === 'mr';
  const when = fmtDate(mr ? 'mr' : 'en', a.date) + ', ' + fmtTime(mr ? 'mr' : 'en', a.time);
  const name = c ? (mr ? c.name.mr : c.name.en) : '';
  const msg = {
    confirmed: mr ? `नमस्कार ${a.name}, डॉ. अनघा देशपांडे यांची आपली भेट ${name} येथे ${when} रोजी निश्चित झाली आहे. संदर्भ: ${a.ref}` : `Hello ${a.name}, your appointment with Dr. Anagha Deshpande at ${name} is confirmed for ${when}. Reference: ${a.ref}`,
    rescheduled: mr ? `नमस्कार ${a.name}, डॉ. अनघा देशपांडे यांची आपली भेट ${name} येथे ${when} अशी बदलली आहे. संदर्भ: ${a.ref}` : `Hello ${a.name}, your appointment with Dr. Anagha Deshpande at ${name} has been rescheduled to ${when}. Reference: ${a.ref}`,
    cancelled: mr ? `नमस्कार ${a.name}, ${when} ची आपली भेट रद्द झाली आहे. नवीन वेळेसाठी कृपया संपर्क करा. संदर्भ: ${a.ref}` : `Hello ${a.name}, your appointment on ${when} has been cancelled. Please contact us to arrange a new time. Reference: ${a.ref}`,
    requested: mr ? `नमस्कार ${a.name}, ${name} येथे ${when} साठी आपली विनंती मिळाली आहे.` : `Hello ${a.name}, we have received your appointment request at ${name} for ${when}.`
  }[a.status] || '';
  return 'https://wa.me/91' + a.mobile + '?text=' + encodeURIComponent(msg);
}

function apptTable(c, rows, content) {
  if (!rows.length) return '<p class="muted">None.</p>';
  const cn = id => { const x = content.clinics.find(k => k.id === id); return x ? x.shortName.en : id; };
  return `<div class="table-wrap"><table class="atable"><thead><tr><th>Date & time</th><th>Patient</th><th>Clinic</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>
${rows.map(a => `<tr class="st-${a.status}">
<td><strong>${esc(fmtDate('en', a.date))}</strong><br>${esc(fmtTime('en', a.time))}${a.requestedDate && (a.requestedDate !== a.date || a.requestedTime !== a.time) ? `<br><small class="muted">requested ${esc(a.requestedDate)} ${esc(a.requestedTime)}</small>` : ''}</td>
<td>${esc(a.name)}<br><a href="tel:${esc(a.mobile)}">${esc(a.mobile)}</a> · <a href="${esc(waPatient(a, content))}" target="_blank" rel="noopener">WhatsApp</a><br><small class="muted">Ref ${esc(a.ref)} · prefers ${esc(t('en', 'langs.' + a.language))}</small></td>
<td>${esc(cn(a.clinic))}</td>
<td>${esc(REASON_LABEL[a.reason] || a.reason)}${a.message ? `<br><small>“${esc(a.message)}”</small>` : ''}</td>
<td><span class="pill pill--${a.status}">${STATUS_LABEL[a.status]}</span></td>
<td class="actions">
${a.status !== 'confirmed' && a.status !== 'cancelled' && a.status !== 'completed' ? `<form method="post" action="/admin/appointments/${a.id}">${csrf(c)}<input type="hidden" name="action" value="confirm"><button class="btn btn--sm btn--primary">Confirm</button></form>` : ''}
${a.status !== 'cancelled' && a.status !== 'completed' ? `<details class="resched"><summary class="btn btn--sm btn--outline">Reschedule</summary><form method="post" action="/admin/appointments/${a.id}">${csrf(c)}<input type="hidden" name="action" value="reschedule">
<label>Date <input type="date" name="date" value="${a.date}" required></label><label>Time <input type="time" name="time" value="${a.time}" step="300" required></label>
<label class="acheck"><input type="checkbox" name="override" value="1"> Allow even if slot is full</label><button class="btn btn--sm btn--primary">Save new time</button></form></details>
<form method="post" action="/admin/appointments/${a.id}" data-confirm="Cancel this appointment?">${csrf(c)}<input type="hidden" name="action" value="cancel"><button class="btn btn--sm btn--danger">Cancel</button></form>` : ''}
${a.status === 'confirmed' || a.status === 'rescheduled' ? `<form method="post" action="/admin/appointments/${a.id}">${csrf(c)}<input type="hidden" name="action" value="complete"><button class="btn btn--sm btn--ghost">Mark visited</button></form>` : ''}
</td></tr>`).join('')}</tbody></table></div>`;
}

function appointments(c) {
  const content = c.getContent();
  const q = c.url.searchParams;
  const status = q.get('status') || '', clinic = q.get('clinic') || '', from = q.get('from') || '', to = q.get('to') || '', s = (q.get('q') || '').trim().toLowerCase();
  let rows = store.read('appointments', []).slice();
  if (status) rows = rows.filter(a => a.status === status);
  if (clinic) rows = rows.filter(a => a.clinic === clinic);
  if (from) rows = rows.filter(a => a.date >= from);
  if (to) rows = rows.filter(a => a.date <= to);
  if (!from && !to && !status && !s) rows = rows.filter(a => a.date >= booking.nowIST().date);
  if (s) rows = rows.filter(a => (a.name + ' ' + a.mobile + ' ' + a.ref).toLowerCase().includes(s));
  rows.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const qs = c.url.search;
  return page(c, 'Appointments', `
<form class="filters" method="get">
<label>Status <select name="status"><option value="">Any</option>${booking.STATUSES.map(x => `<option value="${x}"${x === status ? ' selected' : ''}>${STATUS_LABEL[x]}</option>`).join('')}</select></label>
<label>Clinic <select name="clinic"><option value="">Both</option>${content.clinics.map(x => `<option value="${x.id}"${x.id === clinic ? ' selected' : ''}>${esc(x.shortName.en)}</option>`).join('')}</select></label>
<label>From <input type="date" name="from" value="${esc(from)}"></label><label>To <input type="date" name="to" value="${esc(to)}"></label>
<label>Search <input name="q" value="${esc(q.get('q') || '')}" placeholder="Name, mobile or ref"></label>
<button class="btn btn--sm btn--primary">Filter</button>
${c.session.user.role === 'admin' ? `<a class="btn btn--sm btn--outline" href="/admin/appointments/export.csv${esc(qs)}">Export CSV</a>` : ''}
</form>
<p class="muted small">Without filters, upcoming appointments are shown. Contact patients by phone or WhatsApp before confirming; the patient sees the status when they check their reference.</p>
${apptTable(c, rows, content)}`, { active: 'appointments' });
}

function csvCell(v) {
  let s = String(v == null ? '' : v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // prevent spreadsheet formula injection
  return '"' + s.replace(/"/g, '""') + '"';
}

function enquiries(c) {
  const rows = store.read('enquiries', []).slice().sort((a, b) => b.created.localeCompare(a.created));
  return page(c, 'Website enquiries', rows.length ? `<div class="table-wrap"><table class="atable"><thead><tr><th>Received</th><th>From</th><th>Message</th><th>Status</th><th></th></tr></thead><tbody>
${rows.map(e => `<tr><td>${esc(new Date(e.created).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}</td><td>${esc(e.name)}<br><a href="tel:${esc(e.mobile)}">${esc(e.mobile)}</a></td><td>${esc(e.message)}</td><td><span class="pill pill--${e.status === 'new' ? 'requested' : 'completed'}">${e.status}</span></td>
<td class="actions">${e.status === 'new' ? `<form method="post" action="/admin/enquiries/${e.id}">${csrf(c)}<input type="hidden" name="action" value="handled"><button class="btn btn--sm btn--primary">Mark handled</button></form>` : ''}
<form method="post" action="/admin/enquiries/${e.id}" data-confirm="Delete this enquiry permanently?">${csrf(c)}<input type="hidden" name="action" value="delete"><button class="btn btn--sm btn--danger">Delete</button></form></td></tr>`).join('')}
</tbody></table></div>` : '<p class="muted">No enquiries.</p>', { active: 'enquiries' });
}

function schedule(c) {
  const content = c.getContent();
  const dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = booking.nowIST().date;
  return page(c, 'OPD timings, slots and leave', `
<form method="post" action="/admin/schedule" class="acard">${csrf(c)}
<div class="grid2">${content.clinics.map(cl => `<fieldset><legend>${esc(cl.name.en)}</legend>
<div class="days">${[1, 2, 3, 4, 5, 6].map(d => `<label class="acheck"><input type="checkbox" name="${cl.id}_days" value="${d}"${cl.days.includes(d) ? ' checked' : ''}> ${dn[d]}</label>`).join('')}</div>
<p class="muted small">Sunday is always closed.</p>
${field('OPD starts', cl.id + '_start', cl.start, { type: 'time' })}${field('OPD ends', cl.id + '_end', cl.end, { type: 'time' })}
${field('Slot length (minutes)', cl.id + '_slot', cl.slotMinutes, { type: 'number', attrs: 'min="5" max="60" step="5"' })}
${field('Online requests allowed per slot', cl.id + '_cap', cl.capacityPerSlot, { type: 'number', attrs: 'min="1" max="20"' })}
${bi('Days label shown on site', cl.id + '_daysLabel', cl.daysLabel)}
</fieldset>`).join('')}</div>
<div class="grid2">${field('How many days ahead patients can request', 'bookingWindowDays', content.settings.bookingWindowDays, { type: 'number', attrs: 'min="1" max="120"' })}
${field('Minimum notice for same-day requests (minutes)', 'minNoticeMinutes', content.settings.minNoticeMinutes, { type: 'number', attrs: 'min="0" max="1440"' })}</div>
<button class="btn btn--primary">Save timings</button></form>

<h2>Holidays and leave</h2>
<form method="post" action="/admin/closures" class="acard filters">${csrf(c)}
<label>From <input type="date" name="from" required min="${today}"></label><label>To <input type="date" name="to"></label>
<label>Clinic <select name="clinic"><option value="all">Both clinics</option>${content.clinics.map(x => `<option value="${x.id}">${esc(x.shortName.en)}</option>`).join('')}</select></label>
<label>Reason shown to patients <input name="note" placeholder="e.g. Diwali holiday / Doctor on leave" maxlength="80"></label>
<button class="btn btn--sm btn--primary">Add closure</button></form>
${(content.closures || []).length ? `<table class="atable"><thead><tr><th>Dates</th><th>Clinic</th><th>Reason</th><th></th></tr></thead><tbody>${content.closures.map((x, i) => `<tr><td>${esc(x.from)}${x.to && x.to !== x.from ? ' to ' + esc(x.to) : ''}</td><td>${x.clinic === 'all' ? 'Both' : esc((content.clinics.find(k => k.id === x.clinic) || {}).shortName?.en || x.clinic)}</td><td>${esc(x.note)}</td>
<td><form method="post" action="/admin/closures/${i}/delete">${csrf(c)}<button class="btn btn--sm btn--danger">Remove</button></form></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No closures set.</p>'}
<p class="muted small">Existing requests on a closed date are not changed automatically. Filter appointments by date to reschedule or cancel them.</p>`, { active: 'schedule' });
}

function clinicsPage(c) {
  const content = c.getContent();
  return page(c, 'Clinic details', content.clinics.map(cl => `<form method="post" action="/admin/clinics/${cl.id}" class="acard">${csrf(c)}<h2>${esc(cl.name.en)}</h2>
${bi('Clinic name', 'name', cl.name)}${bi('Short name', 'shortName', cl.shortName)}${bi('Full address', 'address', cl.address, 2)}
<div class="grid2">${field('Street (for search engines)', 'street', cl.street)}${field('Locality', 'locality', cl.locality)}${field('Postal code', 'postalCode', cl.postalCode)}
${field('Appointment phone (10 digits)', 'phone', cl.phone, { attrs: 'pattern="[0-9]{10}" required', hint: 'Used for the Call button: tel:' + esc(cl.phone) })}
<label class="afield"><span>Phone type</span><select name="phoneType"><option value="landline"${cl.phoneType === 'landline' ? ' selected' : ''}>Landline</option><option value="mobile"${cl.phoneType === 'mobile' ? ' selected' : ''}>Mobile</option></select></label>
${field('WhatsApp number with country code', 'whatsapp', cl.whatsapp, { attrs: 'pattern="91[0-9]{10}"', hint: 'Leave blank unless this number is verified on WhatsApp, e.g. 918879758831' })}</div>
${field('Google Maps link', 'mapUrl', cl.mapUrl, { type: 'url', hint: 'Open the clinic in Google Maps, press Share, copy the link, and paste it here.' })}
${checkbox('I have checked that this map link opens the correct clinic location', 'mapVerified', cl.mapVerified)}
<button class="btn btn--primary">Save ${esc(cl.shortName.en)}</button></form>`).join(''), { active: 'clinics' });
}

function profile(c) {
  const d = c.getContent().doctor;
  const j = v => JSON.stringify(v, null, 2);
  return page(c, 'Doctor profile', `<form method="post" action="/admin/profile" class="acard">${csrf(c)}
${bi('Name', 'name', d.name)}${bi('Designation', 'designation', d.designation)}
<div class="grid2">${field('Years of clinical experience', 'experienceYears', d.experienceYears, { type: 'number', attrs: 'min="1" max="60"' })}
${field('Approximate number of phaco surgeries (as displayed)', 'surgeriesApprox', d.surgeriesApprox)}</div>
${bi('Surgical experience statement', 'experienceStatement', d.experienceStatement, 2)}
${bi('Biography (blank line = new paragraph)', 'bio', d.bio, 8)}
${bi('Short biography (home page)', 'shortBio', d.shortBio, 3)}
${bi('Approach to patient care', 'approach', d.approach, 3)}
${bi('Languages spoken', 'languagesSpoken', d.languagesSpoken)}${checkbox('Languages still to be confirmed', 'languagesConfirm', d.languagesSpoken.confirm)}
${area('Qualifications (JSON list)', 'qualificationsList', j(d.qualificationsList), 6)}
${area('Clinical interests (JSON list)', 'interests', j(d.interests), 8)}
${area('Education (JSON list: degree, place, years)', 'education', j(d.education), 12)}
${area('Professional experience (JSON list: role, place, period, confirm)', 'career', j(d.career), 14, 'Set "confirm": false once a line has been checked. Do not present past positions as current.')}
<button class="btn btn--primary">Save profile</button></form>`, { active: 'profile' });
}

function servicesPage(c) {
  const content = c.getContent();
  return page(c, 'Services', `<p class="muted">Publish only services that are actually offered. Say where each is available, since not every service is offered at both clinics.</p>
${content.services.map(s => `<form method="post" action="/admin/services/${esc(s.id)}" class="acard">${csrf(c)}
<h2>${esc(s.title.en)} ${s.published ? '<span class="pill pill--confirmed">Published</span>' : '<span class="pill pill--requested">Hidden</span>'}</h2>
${bi('Title', 'title', s.title)}${bi('Description', 'text', s.text, 3)}${bi('Where available', 'where', s.where)}
${checkbox('Published on the live website', 'published', s.published)} ${checkbox('Still needs confirmation by the doctor', 'confirm', s.confirm)}
<div class="btn-row"><button class="btn btn--primary btn--sm">Save</button></div></form>`).join('')}`, { active: 'services' });
}

function faqList(c) {
  const fd = c.getFaqs();
  return page(c, 'FAQs', `<p><a class="btn btn--primary btn--sm" href="/admin/faqs/new">Add a new FAQ</a></p>
<p class="muted">${fd.faqs.filter(f => f.reviewed).length} of ${fd.faqs.length} approved by the doctor. Only published FAQs appear on the site.</p>
${fd.categories.map(cat => `<h2>${esc(cat.en)}</h2><ul class="alist">${fd.faqs.filter(f => f.category === cat.id).map(f => `<li><a href="/admin/faqs/${esc(f.id)}">${esc(f.q.en)}</a> ${f.reviewed ? '<span class="pill pill--confirmed">Approved</span>' : '<span class="pill pill--requested">Awaiting review</span>'} ${f.published ? '' : '<span class="pill pill--cancelled">Unpublished</span>'}</li>`).join('')}</ul>`).join('')}`, { active: 'faqs' });
}

function faqEdit(c, f, isNew) {
  const fd = c.getFaqs();
  f = f || { id: '', category: fd.categories[0].id, q: {}, short: {}, detail: {}, related: [], published: false, reviewed: false };
  return page(c, isNew ? 'New FAQ' : 'Edit FAQ', `<form method="post" action="/admin/faqs/${isNew ? 'new' : esc(f.id)}" class="acard">${csrf(c)}
${isNew ? field('Short web address (e.g. what-is-uveitis)', 'id', '', { attrs: 'pattern="[a-z0-9-]{3,60}" required' }) : `<p class="muted">Address: /faqs#${esc(f.id)}</p>`}
<label class="afield"><span>Category</span><select name="category">${fd.categories.map(x => `<option value="${x.id}"${x.id === f.category ? ' selected' : ''}>${esc(x.en)}</option>`).join('')}</select></label>
${bi('Question', 'q', f.q)}${bi('Direct answer (shown first)', 'short', f.short, 3)}${bi('Detailed explanation', 'detail', f.detail, 7)}
${field('Related questions (addresses, comma separated)', 'related', (f.related || []).join(', '))}
${checkbox('Show emergency advice with this answer', 'emergency', f.emergency)} ${checkbox('Show on home page', 'popular', f.popular)}
${checkbox('Published', 'published', f.published)} ${checkbox('Approved by Dr. Deshpande', 'reviewed', f.reviewed)}
<p class="muted small">Answers must not give a diagnosis, prescribe medicines, or suggest delaying urgent care.</p>
<div class="btn-row"><button class="btn btn--primary">Save FAQ</button><a class="btn btn--ghost" href="/admin/faqs">Back</a></div></form>
${isNew ? '' : `<form method="post" action="/admin/faqs/${esc(f.id)}/delete" data-confirm="Delete this FAQ permanently?">${csrf(c)}<button class="btn btn--sm btn--danger">Delete FAQ</button></form>`}`, { active: 'faqs' });
}

function photos(c) {
  const p = c.getContent().doctor.photos;
  const items = [['portrait', 'Main portrait (home page hero)'], ['consultation', 'About page photo'], ['examination', 'Examination photo']];
  return page(c, 'Website photographs', `<p class="muted">Use genuine photographs only. Obtain written permission before publishing any patient or staff images. JPEG, PNG or WebP, up to 6 MB.</p>
${items.map(([k, label]) => `<div class="acard photo-row"><img src="${p[k].startsWith('/media/') ? esc(p[k]) : esc(p[k]) + '-480.jpg'}" alt="" width="160">
<div><h2>${label}</h2><form data-photo-upload="${k}" class="photo-form"><input type="file" accept="image/jpeg,image/png,image/webp" required aria-label="Choose a photo for ${label}"><button class="btn btn--sm btn--primary">Upload</button><span class="photo-status" role="status"></span></form>
${p[k].startsWith('/media/') ? `<form method="post" action="/admin/photos/reset">${csrf(c)}<input type="hidden" name="key" value="${k}"><button class="btn btn--sm btn--ghost">Restore original photo</button></form>` : ''}</div></div>`).join('')}
<input type="hidden" id="csrf-token" value="${esc(c.session.csrf)}">`, { active: 'photos' });
}

function settingsPage(c) {
  const s = c.getContent().settings;
  return page(c, 'Settings', `<form method="post" action="/admin/settings" class="acard">${csrf(c)}
<fieldset><legend>Publication</legend>${checkbox('Website is LIVE: visible to search engines, without the review banner', 'siteLive', s.siteLive)}
<p class="muted small">Leave unticked until Dr. Deshpande has reviewed the content and the checklist on the dashboard is complete.</p></fieldset>
${field('Public email address', 'email', s.email, { type: 'email', hint: 'Leave blank to show a placeholder.' })}
${bi('Prefilled WhatsApp message (Just Care)', 'whatsappMessage', s.whatsappMessage, 7)}
${field('Delete website appointment and enquiry records after (days)', 'retentionDays', s.retentionDays, { type: 'number', attrs: 'min="30" max="3650"' })}
${field('Maximum open requests per mobile number', 'maxOpenRequestsPerMobile', s.maxOpenRequestsPerMobile, { type: 'number', attrs: 'min="1" max="10"' })}
<button class="btn btn--primary">Save settings</button></form>`, { active: 'settings' });
}

function usersPage(c) {
  const list = auth.users();
  return page(c, 'Users', `<table class="atable"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>
${list.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.username)}</td><td>${u.role}</td><td>${u.active ? 'Active' : 'Disabled'}</td><td class="actions">
${u.id !== c.session.user.id ? `<form method="post" action="/admin/users/${u.id}">${csrf(c)}<input type="hidden" name="action" value="${u.active ? 'disable' : 'enable'}"><button class="btn btn--sm btn--ghost">${u.active ? 'Disable' : 'Enable'}</button></form>` : '<span class="muted">You</span>'}
<details><summary class="btn btn--sm btn--outline">Set password</summary><form method="post" action="/admin/users/${u.id}">${csrf(c)}<input type="hidden" name="action" value="password">${field('New password', 'password', '', { type: 'password', attrs: 'autocomplete="new-password" required minlength="10"' })}<button class="btn btn--sm btn--primary">Save</button></form></details>
</td></tr>`).join('')}</tbody></table>
<h2>Add a user</h2><form method="post" action="/admin/users" class="acard">${csrf(c)}<div class="grid2">
${field('Full name', 'name', '', { attrs: 'required' })}${field('Username', 'username', '', { attrs: 'required pattern="[A-Za-z0-9._-]{3,32}"' })}
<label class="afield"><span>Role</span><select name="role"><option value="staff">Staff: appointments and enquiries only</option><option value="admin">Admin: everything</option></select></label>
${field('Initial password (min. 10 characters, letters and numbers)', 'password', '', { type: 'password', attrs: 'required minlength="10" autocomplete="new-password"' })}</div>
<button class="btn btn--primary">Add user</button></form>`, { active: 'users' });
}

function auditPage(c) {
  const rows = store.read('audit', []).slice(-300).reverse();
  return page(c, 'Activity log', `<table class="atable"><thead><tr><th>When</th><th>User</th><th>Action</th><th>Detail</th></tr></thead><tbody>
${rows.map(r => `<tr><td>${esc(new Date(r.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}</td><td>${esc(r.user)}</td><td>${esc(r.action)}</td><td><code>${esc(JSON.stringify(r.detail || ''))}</code></td></tr>`).join('')}</tbody></table>`, { active: 'audit' });
}

// ---------- Actions ----------

function parseJsonList(raw, name) {
  let v;
  try { v = JSON.parse(raw); } catch { throw new Error(name + ' is not valid JSON.'); }
  if (!Array.isArray(v)) throw new Error(name + ' must be a list [ ... ].');
  return v;
}

async function updateAppointment(c, id, b) {
  const user = c.session.user.username;
  return store.update('appointments', [], list => {
    const a = list.find(x => x.id === id);
    if (!a) throw new Error('Appointment not found.');
    const content = c.getContent();
    const now = new Date().toISOString();
    if (b.action === 'confirm') a.status = 'confirmed';
    else if (b.action === 'cancel') a.status = 'cancelled';
    else if (b.action === 'complete') a.status = 'completed';
    else if (b.action === 'reschedule') {
      const clinic = content.clinics.find(x => x.id === a.clinic);
      const date = String(b.date || ''), time = String(b.time || '').slice(0, 5);
      if (!booking.validISODate(date)) throw new Error('Choose a valid date.');
      if (booking.dayOfWeek(date) === 0 || !clinic.days.includes(booking.dayOfWeek(date))) throw new Error('The clinic has no OPD on that day.');
      const closed = booking.closureFor(content, clinic.id, date);
      if (closed) throw new Error('The clinic is closed on that date (' + (closed.note || 'closure') + ').');
      if (!/^\d{2}:\d{2}$/.test(time) || time < clinic.start || time >= clinic.end) throw new Error('Time must be within OPD hours (' + clinic.start + '–' + clinic.end + ').');
      if (!b.override && booking.countForSlot(list, clinic.id, date, time, a.id) >= clinic.capacityPerSlot) throw new Error('That slot is full. Tick "Allow even if slot is full" to override.');
      a.date = date; a.time = time; a.status = 'rescheduled';
    } else throw new Error('Unknown action.');
    a.history = (a.history || []).concat({ at: now, status: a.status, by: user, date: a.date, time: a.time });
    a.updated = now;
    return a;
  });
}

async function saveContent(fn) { return store.update('content', null, fn); }

async function handle(req, res, c) {
  const cookies = H.parseCookies(req);
  c.session = auth.getSession(cookies.sid);
  const af = H.unsign(cookies.af, c.secret);
  if (af) { c.flash = Buffer.from(af, 'base64url').toString('utf8'); res.setHeader('Set-Cookie', H.cookie('af', '', { maxAge: 0, path: '/admin' })); }
  res.setHeader('Cache-Control', 'no-store');
  const p = c.path.replace(/\/$/, '') || '/admin';
  const m = (re) => re.exec(p);
  const html = (s, st = 200) => H.send(res, st, s);

  if (p === '/admin/login') {
    if (req.method === 'GET') return c.session ? H.redirect(res, '/admin') : html(loginPage(c));
    const b = await H.readBody(req, 10 * 1024);
    const r = auth.login(b.username, b.password, c.ip);
    if (r.error) { await c.audit(String(b.username || '').slice(0, 40), 'login-failed', { ip: c.ip }); return html(loginPage(c, r.error), 401); }
    await c.audit(r.user.username, 'login', { ip: c.ip });
    return H.redirect(res, '/admin', 303, { 'Set-Cookie': H.cookie('sid', r.sid, { secure: c.https, sameSite: 'Strict', maxAge: 8 * 3600 }) });
  }
  if (!c.session) return req.method === 'GET' ? H.redirect(res, '/admin/login') : H.send(res, 401, 'Not logged in', 'text/plain');

  const user = c.session.user;
  const need = perm => { if (!auth.can(user, perm)) { html(page(c, 'Not allowed', '<p>Your account does not have access to this section.</p>'), 403); return false; } return true; };

  let b = {};
  if (req.method === 'POST') {
    try { b = await H.readBody(req, p === '/api/admin/photos' ? 9 * 1024 * 1024 : 200 * 1024); } catch (e) { return H.send(res, e.status || 400, 'Bad request', 'text/plain'); }
    const token = b._csrf || req.headers['x-csrf-token'];
    if (!auth.checkCsrf(c.session, token)) return H.send(res, 403, 'Security token expired. Please go back, reload the page and try again.', 'text/plain');
  }

  try {
    if (req.method === 'GET') {
      if (p === '/admin') return html(dashboard(c));
      if (p === '/admin/appointments') return need('appointments') && html(appointments(c));
      if (p === '/admin/appointments/export.csv') {
        if (!need('export')) return;
        const content = c.getContent();
        const rows = store.read('appointments', []).slice().sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
        const head = ['Reference', 'Status', 'Clinic', 'Date', 'Time', 'Patient name', 'Mobile', 'Reason', 'Preferred language', 'Message', 'Requested at'];
        const csv = '﻿' + [head].concat(rows.map(a => [a.ref, a.status, (content.clinics.find(x => x.id === a.clinic) || {}).shortName?.en, a.date, a.time, a.name, a.mobile, REASON_LABEL[a.reason], a.language, a.message, a.created])).map(r => r.map(csvCell).join(',')).join('\r\n');
        await c.audit(user.username, 'export-appointments', { rows: rows.length });
        return H.send(res, 200, csv, 'text/csv; charset=utf-8', { 'Content-Disposition': `attachment; filename="appointments-${booking.nowIST().date}.csv"` });
      }
      if (p === '/admin/enquiries') return need('enquiries') && html(enquiries(c));
      if (!need('content')) return;
      if (p === '/admin/schedule') return html(schedule(c));
      if (p === '/admin/clinics') return html(clinicsPage(c));
      if (p === '/admin/profile') return html(profile(c));
      if (p === '/admin/services') return html(servicesPage(c));
      if (p === '/admin/faqs') return html(faqList(c));
      if (p === '/admin/faqs/new') return html(faqEdit(c, null, true));
      let mm;
      if ((mm = m(/^\/admin\/faqs\/([a-z0-9-]+)$/))) { const f = c.getFaqs().faqs.find(x => x.id === mm[1]); return f ? html(faqEdit(c, f)) : html(page(c, 'Not found', ''), 404); }
      if (p === '/admin/photos') return html(photos(c));
      if (p === '/admin/settings') return html(settingsPage(c));
      if (p === '/admin/users') return html(usersPage(c));
      if (p === '/admin/audit') return html(auditPage(c));
      return html(page(c, 'Not found', '<p>Page not found.</p>'), 404);
    }

    // POST
    if (p === '/admin/logout') { auth.logout(c.session.sid); await c.audit(user.username, 'logout'); return H.redirect(res, '/admin/login', 303, { 'Set-Cookie': H.cookie('sid', '', { maxAge: 0 }) }); }
    let mm;
    if ((mm = m(/^\/admin\/appointments\/([0-9a-f-]{36})$/))) {
      if (!need('appointments')) return;
      try {
        const a = await updateAppointment(c, mm[1], b);
        await c.audit(user.username, 'appointment-' + b.action, { ref: a.ref, date: a.date, time: a.time });
        return flashRedirect(c, res, req.headers.referer && new URL(req.headers.referer).pathname.startsWith('/admin') ? new URL(req.headers.referer).pathname + new URL(req.headers.referer).search : '/admin/appointments', `${a.ref}: ${STATUS_LABEL[a.status]}. Remember to tell the patient (call or WhatsApp).`);
      } catch (e) { return flashRedirect(c, res, '/admin/appointments', 'Not saved: ' + e.message); }
    }
    if ((mm = m(/^\/admin\/enquiries\/([0-9a-f-]{36})$/))) {
      if (!need('enquiries')) return;
      await store.update('enquiries', [], list => {
        const i = list.findIndex(e => e.id === mm[1]);
        if (i < 0) return;
        if (b.action === 'delete') list.splice(i, 1); else list[i].status = 'handled';
      });
      await c.audit(user.username, 'enquiry-' + b.action, { id: mm[1] });
      return flashRedirect(c, res, '/admin/enquiries', 'Saved.');
    }

    if (p === '/api/admin/photos') {
      if (!need('content')) return;
      const key = String(b.key || '');
      if (!['portrait', 'consultation', 'examination'].includes(key)) return H.json(res, 400, { ok: false, error: 'Unknown photo.' });
      const buf = Buffer.from(String(b.data || '').replace(/^data:[^,]+,/, ''), 'base64');
      const ext = buf[0] === 0xff && buf[1] === 0xd8 ? 'jpg' : buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ? 'png' : buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP' ? 'webp' : null;
      if (!ext) return H.json(res, 400, { ok: false, error: 'Please upload a JPEG, PNG or WebP image.' });
      if (buf.length > 6 * 1024 * 1024) return H.json(res, 400, { ok: false, error: 'Image is larger than 6 MB.' });
      const dir = path.join(store.DATA_DIR, 'uploads');
      fs.mkdirSync(dir, { recursive: true });
      const name = key + '-' + crypto.randomBytes(6).toString('hex') + '.' + ext;
      fs.writeFileSync(path.join(dir, name), buf);
      await saveContent(ct => { ct.doctor.photos[key] = '/media/' + name; });
      await c.audit(user.username, 'photo-upload', { key, name });
      return H.json(res, 200, { ok: true, url: '/media/' + name });
    }

    if (!need('content')) return;
    if (p === '/admin/photos/reset') {
      const key = String(b.key);
      await saveContent(ct => { if (ct.doctor.photos[key]) ct.doctor.photos[key] = require('../content/site').doctor.photos[key]; });
      await c.audit(user.username, 'photo-reset', { key });
      return flashRedirect(c, res, '/admin/photos', 'Original photo restored.');
    }
    if (p === '/admin/schedule') {
      const errs = [];
      await saveContent(ct => {
        for (const cl of ct.clinics) {
          const days = [].concat(b[cl.id + '_days'] || []).map(Number).filter(d => d >= 1 && d <= 6);
          const start = String(b[cl.id + '_start'] || cl.start), end = String(b[cl.id + '_end'] || cl.end);
          if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end) || start >= end) { errs.push(cl.shortName.en + ': start must be before end.'); continue; }
          Object.assign(cl, { days, start, end, slotMinutes: Math.min(60, Math.max(5, Number(b[cl.id + '_slot']) || 15)), capacityPerSlot: Math.min(20, Math.max(1, Number(b[cl.id + '_cap']) || 1)), daysLabel: biVal(b, cl.id + '_daysLabel') });
        }
        ct.settings.bookingWindowDays = Math.min(120, Math.max(1, Number(b.bookingWindowDays) || 30));
        ct.settings.minNoticeMinutes = Math.min(1440, Math.max(0, Number(b.minNoticeMinutes) || 0));
      });
      await c.audit(user.username, 'schedule-update');
      return flashRedirect(c, res, '/admin/schedule', errs.length ? 'Partly saved. ' + errs.join(' ') : 'Timings saved. Check that the "days label" text still matches the days ticked.');
    }
    if (p === '/admin/closures') {
      const from = String(b.from || ''), to = String(b.to || '') || from;
      if (!booking.validISODate(from) || !booking.validISODate(to) || to < from) return flashRedirect(c, res, '/admin/schedule', 'Not saved: choose valid dates.');
      await saveContent(ct => { ct.closures = (ct.closures || []).concat({ from, to, clinic: ct.clinics.some(x => x.id === b.clinic) ? b.clinic : 'all', note: booking.clean(b.note, 80) }).sort((x, y) => x.from.localeCompare(y.from)); });
      await c.audit(user.username, 'closure-add', { from, to, clinic: b.clinic });
      return flashRedirect(c, res, '/admin/schedule', 'Closure added. Online requests for these dates are now blocked.');
    }
    if ((mm = m(/^\/admin\/closures\/(\d+)\/delete$/))) {
      await saveContent(ct => { ct.closures.splice(Number(mm[1]), 1); });
      await c.audit(user.username, 'closure-remove', { index: mm[1] });
      return flashRedirect(c, res, '/admin/schedule', 'Closure removed.');
    }
    if ((mm = m(/^\/admin\/clinics\/([a-z]+)$/))) {
      const phone = String(b.phone || '').replace(/\D/g, ''), wa = String(b.whatsapp || '').replace(/\D/g, '');
      if (!/^\d{10}$/.test(phone)) return flashRedirect(c, res, '/admin/clinics', 'Not saved: phone must be 10 digits.');
      if (wa && !/^91\d{10}$/.test(wa)) return flashRedirect(c, res, '/admin/clinics', 'Not saved: WhatsApp number must be 91 followed by 10 digits.');
      const mapUrl = String(b.mapUrl || '');
      if (mapUrl && !/^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(mapUrl)) return flashRedirect(c, res, '/admin/clinics', 'Not saved: map link must be a Google Maps https link.');
      await saveContent(ct => {
        const cl = ct.clinics.find(x => x.id === mm[1]);
        if (!cl) return;
        Object.assign(cl, { name: biVal(b, 'name'), shortName: biVal(b, 'shortName'), address: biVal(b, 'address'), street: booking.clean(b.street, 200), locality: booking.clean(b.locality, 80), postalCode: booking.clean(b.postalCode, 10), phone, phoneType: b.phoneType === 'mobile' ? 'mobile' : 'landline', whatsapp: wa, mapUrl: mapUrl || cl.mapUrl, mapVerified: b.mapVerified === '1' });
      });
      await c.audit(user.username, 'clinic-update', { clinic: mm[1], phone });
      return flashRedirect(c, res, '/admin/clinics', 'Clinic details saved.');
    }
    if (p === '/admin/profile') {
      try {
        const lists = { qualificationsList: parseJsonList(b.qualificationsList, 'Qualifications'), interests: parseJsonList(b.interests, 'Clinical interests'), education: parseJsonList(b.education, 'Education'), career: parseJsonList(b.career, 'Professional experience') };
        await saveContent(ct => {
          const d = ct.doctor;
          for (const k of ['name', 'designation', 'experienceStatement', 'bio', 'shortBio', 'approach']) d[k] = biVal(b, k);
          d.languagesSpoken = Object.assign(biVal(b, 'languagesSpoken'), { confirm: b.languagesConfirm === '1' });
          d.experienceYears = Math.max(1, Number(b.experienceYears) || d.experienceYears);
          d.surgeriesApprox = booking.clean(b.surgeriesApprox, 20) || d.surgeriesApprox;
          d.qualifications = lists.qualificationsList.map(q => q.en).join(', ');
          Object.assign(d, lists);
        });
        await c.audit(user.username, 'profile-update');
        return flashRedirect(c, res, '/admin/profile', 'Profile saved.');
      } catch (e) { return flashRedirect(c, res, '/admin/profile', 'Not saved: ' + e.message); }
    }
    if ((mm = m(/^\/admin\/services\/([a-z0-9-]+)$/))) {
      await saveContent(ct => {
        const s = ct.services.find(x => x.id === mm[1]);
        if (s) Object.assign(s, { title: biVal(b, 'title'), text: biVal(b, 'text'), where: biVal(b, 'where'), published: b.published === '1', confirm: b.confirm === '1' });
      });
      await c.audit(user.username, 'service-update', { id: mm[1], published: b.published === '1' });
      return flashRedirect(c, res, '/admin/services', 'Service saved.');
    }
    if ((mm = m(/^\/admin\/faqs\/([a-z0-9-]+)$/))) {
      const isNew = mm[1] === 'new';
      const id = isNew ? String(b.id || '') : mm[1];
      if (!/^[a-z0-9-]{3,60}$/.test(id)) return flashRedirect(c, res, '/admin/faqs/new', 'Not saved: address must be 3–60 lowercase letters, numbers and dashes.');
      try {
        await store.update('faqs', null, fd => {
          let f = fd.faqs.find(x => x.id === id);
          if (isNew && f) throw new Error('That address is already used.');
          if (!f) { f = { id }; fd.faqs.push(f); }
          Object.assign(f, { category: fd.categories.some(x => x.id === b.category) ? b.category : fd.categories[0].id, q: biVal(b, 'q'), short: biVal(b, 'short'), detail: biVal(b, 'detail'),
            related: String(b.related || '').split(',').map(s => s.trim()).filter(s => /^[a-z0-9-]+$/.test(s)), emergency: b.emergency === '1', popular: b.popular === '1', published: b.published === '1', reviewed: b.reviewed === '1' });
          if (!f.q.en || !f.short.en) throw new Error('English question and answer are required.');
        });
        await c.audit(user.username, isNew ? 'faq-create' : 'faq-update', { id, reviewed: b.reviewed === '1' });
        return flashRedirect(c, res, '/admin/faqs', 'FAQ saved.');
      } catch (e) { return flashRedirect(c, res, isNew ? '/admin/faqs/new' : '/admin/faqs/' + id, 'Not saved: ' + e.message); }
    }
    if ((mm = m(/^\/admin\/faqs\/([a-z0-9-]+)\/delete$/))) {
      await store.update('faqs', null, fd => { fd.faqs = fd.faqs.filter(x => x.id !== mm[1]); });
      await c.audit(user.username, 'faq-delete', { id: mm[1] });
      return flashRedirect(c, res, '/admin/faqs', 'FAQ deleted.');
    }
    if (p === '/admin/settings') {
      const email = String(b.email || '').trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return flashRedirect(c, res, '/admin/settings', 'Not saved: email address looks wrong.');
      await saveContent(ct => {
        Object.assign(ct.settings, { siteLive: b.siteLive === '1', email, whatsappMessage: biVal(b, 'whatsappMessage'),
          retentionDays: Math.min(3650, Math.max(30, Number(b.retentionDays) || 365)), maxOpenRequestsPerMobile: Math.min(10, Math.max(1, Number(b.maxOpenRequestsPerMobile) || 3)) });
      });
      await c.audit(user.username, 'settings-update', { siteLive: b.siteLive === '1' });
      return flashRedirect(c, res, '/admin/settings', 'Settings saved.');
    }
    if (p === '/admin/users') {
      try { const u = await auth.createUser({ username: String(b.username || '').trim(), name: booking.clean(b.name, 80), role: b.role, password: String(b.password || '') }); await c.audit(user.username, 'user-create', { username: u.username, role: u.role }); return flashRedirect(c, res, '/admin/users', 'User added.'); }
      catch (e) { return flashRedirect(c, res, '/admin/users', 'Not saved: ' + e.message); }
    }
    if ((mm = m(/^\/admin\/users\/([0-9a-f-]{36})$/))) {
      if (b.action === 'password') { const pr = auth.passwordProblem(b.password); if (pr) return flashRedirect(c, res, '/admin/users', 'Not saved: ' + pr); }
      if ((b.action === 'disable') && mm[1] === user.id) return flashRedirect(c, res, '/admin/users', 'You cannot disable your own account.');
      await store.update('users', [], list => {
        const u = list.find(x => x.id === mm[1]);
        if (!u) return;
        if (b.action === 'password') u.hash = auth.hashPassword(b.password);
        if (b.action === 'disable') u.active = false;
        if (b.action === 'enable') u.active = true;
      });
      if (b.action !== 'enable') auth.logoutUser(mm[1] === user.id ? '' : mm[1]);
      await c.audit(user.username, 'user-' + b.action, { id: mm[1] });
      return flashRedirect(c, res, '/admin/users', 'Saved.');
    }
    return H.send(res, 404, 'Not found', 'text/plain');
  } catch (e) {
    console.error(e);
    return html(page(c, 'Error', `<p class="error">${esc(e.message)}</p>`), 500);
  }
}

module.exports = { handle };
