'use strict';
// Build a static copy of the site into dist/ for static hosts such as Netlify.
// Online appointment requests and contact messages are received by Netlify
// Forms (Netlify dashboard → Forms, with email notifications). The admin
// dashboard, slot limits and status lookup need the Node server (npm start).
//
// Usage: node scripts/build-static.js
// Env:   SITE_URL (defaults to Netlify's URL), SITE_LIVE=1 to leave preview mode

const fs = require('fs');
const path = require('path');
const views = require('../lib/views');
const pages = require('../content/pages');
const content = JSON.parse(JSON.stringify(require('../content/site')));
const faqData = JSON.parse(JSON.stringify(require('../content/faqs')));

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || process.env.URL || 'http://localhost:8888').replace(/\/$/, '');
content.settings.siteLive = process.env.SITE_LIVE === '1';

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });

const assetVersion = Date.now().toString(36);
const ctx = lang => ({ lang, content, faqData, nonce: '', siteUrl: SITE_URL, preview: !content.settings.siteLive, assetVersion, analyticsDomain: content.settings.siteLive ? (process.env.PLAUSIBLE_DOMAIN || '') : '', faqSchema: process.env.FAQ_SCHEMA !== '0', static: true });

let count = 0;
function write(lang, p, html) {
  const rel = (lang === 'mr' ? 'mr' : '') + (p === '/' ? (lang === 'mr' ? '/index.html' : 'index.html') : p + '.html');
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  count++;
}

for (const lang of ['en', 'mr']) {
  const c = ctx(lang);
  write(lang, '/', views.home(c));
  write(lang, '/about', views.about(c));
  write(lang, '/cataract-surgery', views.cataract(c));
  write(lang, '/eye-care-services', views.services(c));
  write(lang, '/faqs', views.faqs(c));
  write(lang, '/articles', views.articlesIndex(c));
  for (const a of pages.articles) write(lang, '/articles/' + a.slug, views.article(c, a));
  write(lang, '/clinics', views.clinics(c));
  write(lang, '/contact', views.contact(c));
  write(lang, '/contact/thanks', views.contact(c, { sent: true }));
  write(lang, '/privacy-policy', views.legal(c, 'privacy'));
  write(lang, '/medical-disclaimer', views.legal(c, 'disclaimer'));
  write(lang, '/book-appointment', views.book(c));
  for (const cl of content.clinics) write(lang, '/book-appointment/' + cl.id, views.book(c, { clinicId: cl.id }));
  write(lang, '/book-appointment/received', views.staticReceived(c));
}
fs.writeFileSync(path.join(OUT, '404.html'), views.notFound(ctx('en')));

// Sitemap and robots
const paths = ['/', '/about', '/cataract-surgery', '/eye-care-services', '/faqs', '/articles', '/book-appointment', '/clinics', '/contact', '/privacy-policy', '/medical-disclaimer'].concat(pages.articles.map(a => '/articles/' + a.slug));
const today = new Date().toISOString().slice(0, 10);
const entry = (lang, p) => `<url><loc>${SITE_URL}${views.url(lang, p)}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="en-IN" href="${SITE_URL}${views.url('en', p)}"/><xhtml:link rel="alternate" hreflang="mr-IN" href="${SITE_URL}${views.url('mr', p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${views.url('en', p)}"/></url>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths.map(p => entry('en', p) + '\n' + entry('mr', p)).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), content.settings.siteLive ? `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');

console.log(`Built ${count} pages into dist/ for ${SITE_URL}${content.settings.siteLive ? '' : ' (preview mode)'}`);
