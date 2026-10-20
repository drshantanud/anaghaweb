'use strict';
// Dr. Anagha Deshpande – website and appointment-request server.
// Zero runtime dependencies: Node.js >= 20 only.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const store = require('./lib/store');
const views = require('./lib/views');
const booking = require('./lib/booking');
const auth = require('./lib/auth');
const admin = require('./lib/admin');
const H = require('./lib/http');
const pages = require('./content/pages');
const defaults = require('./content/site');
const faqDefaults = require('./content/faqs');

const PROD = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const SECRET = process.env.SESSION_SECRET || (PROD ? null : 'dev-only-secret');
const ANALYTICS = process.env.PLAUSIBLE_DOMAIN || '';
const FAQ_SCHEMA = process.env.FAQ_SCHEMA !== '0';
const PUBLIC = path.join(__dirname, 'public');

if (PROD) {
  const missing = ['SESSION_SECRET', 'DATA_ENCRYPTION_KEY', 'SITE_URL'].filter(k => !process.env[k]);
  if (missing.length) { console.error('Missing required environment variables in production: ' + missing.join(', ')); process.exit(1); }
}

const clone = o => JSON.parse(JSON.stringify(o));
const getContent = () => store.read('content', () => clone(defaults));
const getFaqs = () => store.read('faqs', () => clone(faqDefaults));
// Persist defaults on first start so the admin edits a real copy.
store.update('content', () => clone(defaults), () => {});
store.update('faqs', () => clone(faqDefaults), () => {});

const assetVersion = crypto.createHash('md5').update(['css/site.css', 'js/site.js', 'js/admin.js', 'css/admin.css'].map(f => {
  try { return String(fs.statSync(path.join(PUBLIC, f)).mtimeMs); } catch { return ''; }
}).join()).digest('hex').slice(0, 8);

function clientIp(req) {
  if (TRUST_PROXY && req.headers['x-forwarded-for']) return String(req.headers['x-forwarded-for']).split(',')[0].trim();
  return req.socket.remoteAddress || '';
}
function isHttps(req) { return TRUST_PROXY ? req.headers['x-forwarded-proto'] === 'https' : !!req.socket.encrypted; }

function sameOrigin(req) {
  const src = req.headers.origin || req.headers.referer;
  if (!src) return true;
  try { return new URL(src).host === req.headers.host; } catch { return false; }
}

function ctxFor(req, lang, nonce) {
  const content = getContent();
  return { lang, content, faqData: getFaqs(), nonce, siteUrl: SITE_URL, preview: !content.settings.siteLive, assetVersion, analyticsDomain: content.settings.siteLive ? ANALYTICS : '', faqSchema: FAQ_SCHEMA };
}

async function audit(user, action, detail) {
  await store.update('audit', [], list => { list.push({ at: new Date().toISOString(), user, action, detail }); if (list.length > 5000) list.splice(0, list.length - 5000); });
}

// ---------- Booking handlers ----------

async function createAppointment(input, lang) {
  return store.update('appointments', [], list => {
    const content = getContent();
    const { errors, vars, value } = booking.validateRequest(content, list, input);
    if (Object.keys(errors).length) return { errors, vars, value };
    let ref;
    do { ref = booking.makeRef(); } while (list.some(a => a.ref === ref));
    const a = {
      id: crypto.randomUUID(), ref, status: 'requested',
      name: value.name, mobile: value.mobile, clinic: value.clinic, date: value.date, time: value.time,
      requestedDate: value.date, requestedTime: value.time,
      reason: value.reason, language: value.language, message: value.message, siteLang: lang,
      consentAt: new Date().toISOString(), created: new Date().toISOString(), history: [{ at: new Date().toISOString(), status: 'requested', by: 'patient' }]
    };
    list.push(a);
    return { appointment: a };
  });
}

function sitemap() {
  const paths = Object.keys(views.ROUTES).filter(p => p !== '/appointment-status').concat(pages.articles.map(a => '/articles/' + a.slug));
  const today = new Date().toISOString().slice(0, 10);
  const entry = (lang, p) => `<url><loc>${SITE_URL}${views.url(lang, p)}</loc><lastmod>${today}</lastmod>
<xhtml:link rel="alternate" hreflang="en-IN" href="${SITE_URL}${views.url('en', p)}"/><xhtml:link rel="alternate" hreflang="mr-IN" href="${SITE_URL}${views.url('mr', p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${views.url('en', p)}"/></url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths.map(p => entry('en', p) + '\n' + entry('mr', p)).join('\n')}\n</urlset>`;
}

// ---------- Router ----------

async function handle(req, res) {
  const u = new URL(req.url, 'http://x');
  let p = decodeURIComponent(u.pathname);
  const nonce = crypto.randomBytes(16).toString('base64');
  const https = isHttps(req);
  H.securityHeaders(res, { nonce, https, analytics: !!ANALYTICS });

  if (p === '/healthz') return H.json(res, 200, { ok: true });
  if (PROD && TRUST_PROXY && !https && process.env.FORCE_HTTPS !== '0') return H.redirect(res, SITE_URL + req.url, 301);

  // Static assets
  for (const prefix of ['/css/', '/js/', '/img/', '/fonts/', '/video/']) {
    if (p.startsWith(prefix) && (req.method === 'GET' || req.method === 'HEAD')) {
      const long = u.searchParams.has('v') || prefix === '/fonts/' || prefix === '/img/' || prefix === '/video/';
      if (H.serveStatic(req, res, PUBLIC, p.slice(1), { maxAge: long ? 2592000 : 3600 })) return;
    }
  }
  if (p.startsWith('/media/') && H.serveStatic(req, res, path.join(store.DATA_DIR, 'uploads'), p.slice(7), { maxAge: 86400 })) return;

  if (p === '/robots.txt') {
    const live = getContent().settings.siteLive;
    return H.send(res, 200, live ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /appointment-status\nSitemap: ${SITE_URL}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n', 'text/plain; charset=utf-8');
  }
  if (p === '/sitemap.xml') return H.send(res, 200, sitemap(), 'application/xml; charset=utf-8');

  if (req.method === 'POST' && !sameOrigin(req)) return H.send(res, 403, 'Forbidden', 'text/plain');

  if (p === '/admin' || p.startsWith('/admin/') || p.startsWith('/api/admin/')) {
    return admin.handle(req, res, { url: u, path: p, nonce, https, ip: clientIp(req), getContent, getFaqs, audit, assetVersion, siteUrl: SITE_URL, secret: SECRET });
  }

  // Public API: availability for one clinic and date (no patient data)
  if (p === '/api/availability' && req.method === 'GET') {
    if (H.limit('avail:' + clientIp(req), 120, 60000)) return H.json(res, 429, { ok: false, code: 'rate' });
    const result = booking.availability(getContent(), store.read('appointments', []), u.searchParams.get('clinic'), u.searchParams.get('date'));
    return H.json(res, 200, result);
  }

  // Language
  let lang = 'en';
  if (p === '/mr') return H.redirect(res, '/mr/', 301);
  if (p.startsWith('/mr/')) { lang = 'mr'; p = p.slice(3) || '/'; }
  if (p.length > 1 && p.endsWith('/')) return H.redirect(res, views.url(lang, p.slice(0, -1)), 301);
  const ctx = ctxFor(req, lang, nonce);
  const html = (body, status = 200, headers = {}) => H.send(res, status, body, 'text/html; charset=utf-8', Object.assign({ 'Cache-Control': 'no-cache' }, headers));
  const route = views.ROUTES[p];
  const ip = clientIp(req);

  if (req.method === 'GET' || req.method === 'HEAD') {
    if (route === 'home') return html(views.home(ctx));
    if (route === 'about') return html(views.about(ctx));
    if (route === 'cataract') return html(views.cataract(ctx));
    if (route === 'services') return html(views.services(ctx));
    if (route === 'faqs') return html(views.faqs(ctx, { topic: u.searchParams.get('topic') }));
    if (route === 'articles') return html(views.articlesIndex(ctx));
    if (route === 'clinics') return html(views.clinics(ctx));
    if (route === 'contact') return html(views.contact(ctx));
    if (route === 'privacy') return html(views.legal(ctx, 'privacy'));
    if (route === 'disclaimer') return html(views.legal(ctx, 'disclaimer'));
    if (route === 'status') return html(views.status(ctx));
    if (route === 'book') {
      const clinicId = ctx.content.clinics.some(c => c.id === u.searchParams.get('clinic')) ? u.searchParams.get('clinic') : null;
      return html(views.book(ctx, { clinicId }));
    }
    if (p === '/book-appointment/received') {
      const id = H.unsign(H.parseCookies(req).bk, SECRET);
      const a = id && store.read('appointments', []).find(x => x.id === id);
      if (!a) return H.redirect(res, views.url(lang, '/book-appointment'));
      return html(views.bookReceived(ctx, a), 200, { 'Cache-Control': 'no-store' });
    }
    if (p.startsWith('/articles/')) {
      const a = pages.articles.find(x => '/articles/' + x.slug === p);
      if (a) return html(views.article(ctx, a));
    }
    return html(views.notFound(ctx), 404);
  }

  if (req.method === 'POST') {
    let body;
    try { body = await H.readBody(req, 20 * 1024); } catch (e) { return H.send(res, e.status || 400, 'Bad request', 'text/plain'); }

    if (route === 'book') {
      const clinicId = ctx.content.clinics.some(c => c.id === body.clinic) ? body.clinic : null;
      if (body.website) return H.redirect(res, views.url(lang, '/book-appointment')); // honeypot
      if (H.limit('book:' + ip, 10, 600000)) return html(views.book(ctx, { clinicId, values: body, errors: { form: 'rate' } }), 429);
      try {
        const r = await createAppointment(body, lang);
        if (r.errors) return html(views.book(ctx, { clinicId, values: r.value ? Object.assign({}, body, { consent: r.value.consent }) : body, errors: r.errors, vars: r.vars }), 422);
        const flash = H.cookie('bk', H.sign(r.appointment.id, SECRET), { maxAge: 1800, secure: https, sameSite: 'Strict' });
        return H.redirect(res, views.url(lang, '/book-appointment/received'), 303, { 'Set-Cookie': flash });
      } catch (e) {
        console.error('Booking error', e);
        return html(views.book(ctx, { clinicId, values: body, errors: { form: 'server' } }), 500);
      }
    }

    if (route === 'status') {
      if (H.limit('status:' + ip, 15, 900000)) return html(views.status(ctx, { error: 'rate', values: body }), 429);
      const ref = String(body.ref || '').trim().toUpperCase();
      const mobile = booking.normaliseMobile(body.mobile);
      if (!ref) return html(views.status(ctx, { error: 'ref', values: body }), 422);
      const a = mobile && store.read('appointments', []).find(x => x.ref === ref && x.mobile === mobile);
      if (!a) return html(views.status(ctx, { error: 'not_found', values: body }), 404);
      return html(views.status(ctx, { result: a }), 200, { 'Cache-Control': 'no-store' });
    }

    if (route === 'contact') {
      if (body.website) return html(views.contact(ctx, { sent: true }));
      if (H.limit('contact:' + ip, 5, 600000)) return html(views.contact(ctx, { errors: { form: 'rate' }, values: body }), 429);
      const errors = {};
      const name = booking.clean(body.name, 100), mobile = booking.normaliseMobile(body.mobile), message = booking.clean(body.message, 2000);
      if (name.replace(/[^\p{L}]/gu, '').length < 2) errors.name = 'name';
      if (!mobile) errors.mobile = 'mobile';
      if (!message || message.length > 1000) errors.message = 'message';
      if (body.consent !== 'yes') errors.consent = 'consent';
      if (Object.keys(errors).length) return html(views.contact(ctx, { errors, values: body }), 422);
      await store.update('enquiries', [], list => { list.push({ id: crypto.randomUUID(), name, mobile, message, lang, status: 'new', created: new Date().toISOString() }); });
      return html(views.contact(ctx, { sent: true }));
    }
  }

  return H.send(res, 405, 'Method not allowed', 'text/plain');
}

// ---------- Retention & backups ----------

async function maintenance() {
  const days = getContent().settings.retentionDays || 365;
  const cutoffDate = booking.addDays(booking.nowIST().date, -days);
  const cutoffIso = new Date(Date.now() - days * 86400000).toISOString();
  const removed = { appointments: 0, enquiries: 0 };
  await store.update('appointments', [], list => { const n = list.length; const keep = list.filter(a => a.date >= cutoffDate); list.splice(0, list.length, ...keep); removed.appointments = n - keep.length; });
  await store.update('enquiries', [], list => { const n = list.length; const keep = list.filter(e => e.created >= cutoffIso); list.splice(0, list.length, ...keep); removed.enquiries = n - keep.length; });
  if (removed.appointments || removed.enquiries) await audit('system', 'retention-purge', removed);
  if (process.env.BACKUPS !== '0') { try { store.backup(Number(process.env.BACKUP_KEEP) || 14); } catch (e) { console.error('Backup failed', e.message); } }
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(err => {
    console.error(err);
    if (!res.headersSent) H.send(res, 500, 'Server error', 'text/plain');
  });
});
server.requestTimeout = 30000;
server.headersTimeout = 20000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Site running at ${SITE_URL} (port ${PORT})${getContent().settings.siteLive ? '' : ' [PREVIEW MODE]'}`);
    if (!auth.users().length) console.log('No staff accounts yet. Create one with: npm run create-admin');
    if (!process.env.DATA_ENCRYPTION_KEY) console.warn('Warning: DATA_ENCRYPTION_KEY not set; patient data is stored unencrypted.');
  });
  maintenance();
  setInterval(maintenance, 24 * 3600000).unref();
}

module.exports = { server, handle, maintenance };
