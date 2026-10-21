'use strict';
// Public page templates. Every page is server-rendered in English (/...) or
// Marathi (/mr/...), so search engines and visitors without JavaScript get
// complete content.

const { t, L, mrNum, fmtTime, fmtDate } = require('./i18n');
const { icon } = require('./icons');
const { eyeDiagram, phacoSteps, iolTypes } = require('./illustrations');
const pages = require('../content/pages');
const { allSlots, nowIST, addDays, REASONS } = require('./booking');

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paras = s => String(s || '').split(/\n\s*\n/).map(p => '<p>' + esc(p) + '</p>').join('');
const url = (lang, p) => (lang === 'mr' ? (p === '/' ? '/mr/' : '/mr' + p) : p);
const tel = phone => 'tel:' + phone;
const bookUrl = (ctx, id) => (ctx.static ? url(ctx.lang, '/book-appointment/' + id) : url(ctx.lang, '/book-appointment') + '?clinic=' + id) + '#step2';
const num = (lang, s) => (lang === 'mr' ? mrNum(s) : String(s));

const ROUTES = {
  '/': 'home', '/about': 'about', '/cataract-surgery': 'cataract', '/eye-care-services': 'services',
  '/faqs': 'faqs', '/articles': 'articles', '/book-appointment': 'book', '/clinics': 'clinics',
  '/contact': 'contact', '/privacy-policy': 'privacy', '/medical-disclaimer': 'disclaimer',
  '/appointment-status': 'status'
};

function waHref(c, content, lang) {
  if (!c.whatsapp) return '';
  return 'https://wa.me/' + c.whatsapp + '?text=' + encodeURIComponent(L(lang, content.settings.whatsappMessage));
}

function picture(base, alt, { sizes = '(max-width: 800px) 100vw, 50vw', widths = [480, 800, 1200], cls = '', eager = false, w = 1200, h = 1600 } = {}) {
  if (base.startsWith('/media/')) {
    return `<img class="${cls}" src="${esc(base)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }
  const set = ext => widths.map(x => `${base}-${x}.${ext} ${x}w`).join(', ');
  return `<picture><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img class="${cls}" src="${base}-${widths[1]}.jpg" srcset="${set('jpg')}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

function confirmTag(ctx, item) {
  return ctx.preview && item && item.confirm ? ` <span class="tag tag--confirm">${t(ctx.lang, 'to_confirm')}</span>` : '';
}

// ---------- Components ----------

function hoursText(lang, c) {
  return L(lang, c.daysLabel) + ', ' + fmtTime(lang, c.start) + ' – ' + fmtTime(lang, c.end);
}

function callButtons(ctx, c, { small = false } = {}) {
  const { lang, content } = ctx;
  const cls = small ? 'btn btn--sm' : 'btn';
  let out = `<a class="${cls} btn--primary" href="${tel(c.phone)}" data-track="call-${c.id}">${icon('phone')}<span>${t(lang, c.id === 'srv' ? 'call_srv' : 'call_jc')}</span></a>`;
  if (c.whatsapp) out += `<a class="${cls} btn--wa" href="${esc(waHref(c, content, lang))}" target="_blank" rel="noopener" data-track="wa-${c.id}">${icon('whatsapp')}<span>${t(lang, 'wa_jc')}</span></a>`;
  return out;
}

function clinicCard(ctx, c, { book = true, heading = 'h3' } = {}) {
  const { lang } = ctx;
  return `<article class="card clinic-card" id="clinic-${c.id}">
<${heading} class="clinic-card__name">${icon('hospital')} ${esc(L(lang, c.name))}</${heading}>
<p class="clinic-card__addr">${icon('pin')}<span>${esc(L(lang, c.address))}</span></p>
<p class="clinic-card__hours">${icon('clock')}<span><strong>${t(lang, 'opd')}:</strong> ${esc(hoursText(lang, c))}</span></p>
<p class="clinic-card__phone">${icon('phone')}<span><strong>${t(lang, 'appointment_no')}:</strong> <a href="${tel(c.phone)}">${esc(c.phone)}</a> <span class="muted">(${t(lang, c.phoneType)})</span></span></p>
<div class="btn-row">${callButtons(ctx, c)}
${book ? `<a class="btn btn--outline" href="${bookUrl(ctx, c.id)}">${icon('calendar')}<span>${t(lang, 'online_request')}</span></a>` : ''}
<a class="btn btn--ghost" href="${esc(c.mapUrl)}" target="_blank" rel="noopener">${icon('pin')}<span>${t(lang, 'directions')}</span></a>${ctx.preview && !c.mapVerified ? ` <span class="tag tag--confirm">${lang === 'mr' ? 'नकाशावरील ठिकाण निश्चित करायचे' : 'Map pin to be verified'}</span>` : ''}
</div></article>`;
}

function emergencyBox(lang, compact) {
  return `<aside class="emergency${compact ? ' emergency--compact' : ''}" role="note" aria-label="${esc(t(lang, 'emergency_title'))}">
${icon('alert')}<div><strong>${t(lang, 'emergency_title')}</strong> <span>${t(lang, 'emergency_text')}</span></div></aside>`;
}

function faqItem(ctx, f, all, { open = false } = {}) {
  const { lang } = ctx;
  const related = (f.related || []).map(id => all.find(x => x.id === id && x.published)).filter(Boolean);
  return `<details class="faq" id="${esc(f.id)}" data-cat="${esc(f.category)}"${open ? ' open' : ''}>
<summary><span>${esc(L(lang, f.q))}</span>${icon('chevron', 'icon faq__chev')}</summary>
<div class="faq__body">
<p class="faq__short">${esc(L(lang, f.short))}</p>
${f.emergency ? emergencyBox(lang, true) : ''}
<details class="faq__more"><summary>${t(lang, 'faq_more')}</summary>${paras(L(lang, f.detail))}</details>
${related.length ? `<div class="faq__related"><strong>${t(lang, 'faq_related')}:</strong><ul>${related.map(r => `<li><a href="${url(lang, '/faqs')}#${esc(r.id)}" data-faq-link>${esc(L(lang, r.q))}</a></li>`).join('')}</ul></div>` : ''}
<p><a class="link-cta" href="${url(lang, '/book-appointment')}">${icon('calendar')} ${t(lang, 'faq_book')}</a></p>
${ctx.preview && !f.reviewed ? `<p class="tag tag--confirm">${lang === 'mr' ? 'डॉक्टरांचे पुनरावलोकन बाकी' : 'Awaiting doctor review'}</p>` : ''}
</div></details>`;
}

function pageHead(ctx, title, lead, crumbs) {
  return `<section class="page-head"><div class="wrap">
${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${url(ctx.lang, '/')}">${t(ctx.lang, 'nav_home')}</a> <span aria-hidden="true">›</span> ${crumbs}</nav>` : ''}
<h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div></section>`;
}

function richBlocks(lang, blocks, hTag = 'h2') {
  return blocks.map(b => {
    if (Array.isArray(b)) return '<ul class="ticks">' + b.map(i => `<li>${icon('check')}<span>${esc(L(lang, i))}</span></li>`).join('') + '</ul>';
    if (b.h) return `<${hTag}>${esc(L(lang, b.h))}</${hTag}>`;
    return '<p>' + esc(L(lang, b)) + '</p>';
  }).join('');
}

// ---------- Layout ----------

function structuredData(ctx) {
  const { content, siteUrl } = ctx;
  const d = content.doctor;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Physician',
      '@id': siteUrl + '/#physician',
      name: d.name.en,
      alternateName: d.name.mr,
      description: d.shortBio.en,
      url: siteUrl + '/',
      image: siteUrl + d.photos.portrait + '-800.jpg',
      medicalSpecialty: 'Ophthalmology',
      knowsLanguage: ['en', 'mr'],
      areaServed: ['Chembur', 'Tilak Nagar', 'Ghatkopar', 'Vikhroli', 'Govandi', 'Chunabhatti', 'Mumbai'].map(n => ({ '@type': 'Place', name: n })),
      hasCredential: d.qualificationsList.map(q => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: q.en })),
      location: content.clinics.map(c => ({ '@id': siteUrl + '/clinics#' + c.id }))
    }].concat(content.clinics.map(c => ({
      '@type': 'MedicalClinic',
      '@id': siteUrl + '/clinics#' + c.id,
      name: c.name.en,
      telephone: '+91' + c.phone,
      address: { '@type': 'PostalAddress', streetAddress: c.street, addressLocality: c.locality, addressRegion: 'Maharashtra', postalCode: c.postalCode, addressCountry: 'IN' },
      hasMap: c.mapUrl,
      medicalSpecialty: 'Ophthalmology',
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: c.days.map(i => days[i]), opens: c.start, closes: c.end }]
    })))
  };
}

function layout(ctx, { title, description, body, path, jsonld = [], noindex = false, bodyClass = '' }) {
  const { lang, content, siteUrl, nonce } = ctx;
  const other = lang === 'en' ? 'mr' : 'en';
  const canonical = siteUrl + url(lang, path);
  const navItems = [['/', 'nav_home'], ['/about', 'nav_about'], ['/cataract-surgery', 'nav_cataract'], ['/eye-care-services', 'nav_eyecare'], ['/faqs', 'nav_faqs'], ['/contact', 'nav_contact']];
  const [srv, jc] = [content.clinics.find(c => c.id === 'srv'), content.clinics.find(c => c.id === 'justcare')];
  const ld = [structuredData(ctx)].concat(jsonld);
  const robots = noindex || ctx.preview ? 'noindex, nofollow' : 'index, follow';
  const d = content.doctor;
  return `<!doctype html>
<html lang="${lang}" class="lang-${lang} no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${esc(canonical)}">
${path ? `<link rel="alternate" hreflang="en-IN" href="${esc(siteUrl + url('en', path))}">
<link rel="alternate" hreflang="mr-IN" href="${esc(siteUrl + url('mr', path))}">
<link rel="alternate" hreflang="x-default" href="${esc(siteUrl + url('en', path))}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(L(lang, d.name))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(siteUrl)}/img/og-image.jpg">
<meta property="og:locale" content="${lang === 'mr' ? 'mr_IN' : 'en_IN'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b5d63">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/${lang === 'mr' ? 'noto-sans-devanagari-devanagari-400-normal' : 'inter-latin-400-normal'}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v=${ctx.assetVersion}">
${ld.map(o => `<script type="application/ld+json" nonce="${nonce}">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
${ctx.analyticsDomain ? `<script defer data-domain="${esc(ctx.analyticsDomain)}" src="https://plausible.io/js/script.js"></script>` : ''}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">${t(lang, 'skip')}</a>
${ctx.preview ? `<div class="preview-banner" role="status">${t(lang, 'preview_banner')}</div>` : ''}
<header class="site-header">
<div class="wrap header-inner">
<a class="brand" href="${url(lang, '/')}" aria-label="${esc(L(lang, d.name))}, ${esc(L(lang, d.designation))}">
<span class="brand__mark" aria-hidden="true">${icon('eye')}</span>
<span class="brand__text"><span class="brand__name">${esc(L(lang, d.name))}</span><span class="brand__role">${esc(L(lang, d.designation))} · ${lang === 'mr' ? 'चेंबूर' : 'Chembur'}</span></span>
</a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icon('menu')}<span>${t(lang, 'menu')}</span></button>
<nav id="site-nav" class="site-nav" aria-label="${lang === 'mr' ? 'मुख्य' : 'Main'}">
<ul>${navItems.map(([p, k]) => `<li><a href="${url(lang, p)}"${p === path ? ' aria-current="page"' : ''}>${t(lang, k)}</a></li>`).join('')}</ul>
<a class="btn btn--primary btn--nav" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'nav_book')}</span></a>
<a class="lang-switch" href="${url(other, path || '/')}" hreflang="${other}" lang="${other}" aria-label="${esc(t(lang, 'switch_lang_label'))}">${icon('globe')}<span>${t(lang, 'switch_lang')}</span></a>
</nav>
</div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
<div class="wrap footer-grid">
<section>
<p class="footer-name">${esc(L(lang, d.name))}</p>
<p>${esc(L(lang, d.designation))}<br>${esc(d.qualificationsList.map(q => L(lang, q)).join(', '))}</p>
<p class="footer-note">${t(lang, 'footer_note')}</p>
<a class="lang-switch lang-switch--footer" href="${url(other, path || '/')}" hreflang="${other}" lang="${other}">${icon('globe')}<span>${lang === 'en' ? 'English · <strong>मराठी</strong>' : '<strong>मराठी</strong> · English'}</span></a>
</section>
<section aria-labelledby="f-clinics"><h2 id="f-clinics">${t(lang, 'footer_clinics')}</h2>
${content.clinics.map(c => `<div class="footer-clinic"><strong>${esc(L(lang, c.name))}</strong><br>${esc(L(lang, c.address))}<br>${t(lang, 'opd')}: ${esc(hoursText(lang, c))}<br>${t(lang, 'appointment_no')}: <a href="${tel(c.phone)}">${esc(c.phone)}</a>${c.whatsapp ? ` · <a href="${esc(waHref(c, content, lang))}" target="_blank" rel="noopener">${t(lang, 'whatsapp')}</a>` : ''}</div>`).join('')}
</section>
<section aria-labelledby="f-links"><h2 id="f-links">${t(lang, 'footer_quick')}</h2>
<ul class="footer-links">
${[['/about', 'nav_about'], ['/cataract-surgery', 'nav_cataract'], ['/eye-care-services', 'nav_eyecare'], ['/faqs', 'nav_faqs'], ['/articles', 'nav_articles'], ['/book-appointment', 'nav_book'], ['/appointment-status', 'status_title'], ['/clinics', 'nav_clinics'], ['/contact', 'nav_contact']].filter(([p]) => !(ctx.static && p === '/appointment-status')).map(([p, k]) => `<li><a href="${url(lang, p)}">${t(lang, k)}</a></li>`).join('')}
</ul></section>
<section aria-labelledby="f-legal"><h2 id="f-legal">${t(lang, 'footer_legal')}</h2>
<ul class="footer-links">
<li><a href="${url(lang, '/privacy-policy')}">${t(lang, 'privacy')}</a></li>
<li><a href="${url(lang, '/medical-disclaimer')}">${t(lang, 'disclaimer')}</a></li>
${ctx.static ? '' : `<li><a href="/admin/login" rel="nofollow">${t(lang, 'admin_login')}</a></li>`}
</ul>
${emergencyBox(lang, true)}
</section>
</div>
<div class="wrap footer-base">© ${new Date().getFullYear()} ${esc(L(lang, d.name))}</div>
</footer>
<nav class="mobile-bar" aria-label="${esc(t(lang, 'bar_call_label'))}">
<a href="${url(lang, '/clinics')}#call" class="mobile-bar__btn" data-call-sheet>${icon('phone')}<span>${t(lang, 'call')}</span></a>
<a href="${esc(waHref(jc, content, lang))}" class="mobile-bar__btn mobile-bar__btn--wa" target="_blank" rel="noopener" aria-label="${esc(t(lang, 'wa_jc_short'))}">${icon('whatsapp')}<span>${t(lang, 'whatsapp')}</span></a>
<a href="${url(lang, '/book-appointment')}" class="mobile-bar__btn mobile-bar__btn--book">${icon('calendar')}<span>${t(lang, 'book')}</span></a>
</nav>
<dialog class="call-sheet" id="call-sheet" aria-labelledby="call-sheet-title">
<h2 id="call-sheet-title">${t(lang, 'call_which')}</h2>
${[srv, jc].map(c => `<a class="btn btn--primary btn--block" href="${tel(c.phone)}">${icon('phone')}<span>${esc(L(lang, c.shortName))}<small>${esc(c.phone)} · ${esc(hoursText(lang, c))}</small></span></a>`).join('')}
<button type="button" class="btn btn--ghost btn--block" data-close>${t(lang, 'close')}</button>
</dialog>
<script src="/js/site.js?v=${ctx.assetVersion}" defer></script>
</body>
</html>`;
}

// ---------- Pages ----------

function home(ctx) {
  const { lang, content, faqData } = ctx;
  const d = content.doctor;
  const isMr = lang === 'mr';
  const popular = faqData.faqs.filter(f => f.popular && f.published).slice(0, 8);
  const services = content.services.filter(s => s.published || ctx.preview);
  const why = [
    ['award', num(lang, d.experienceYears) + ' ' + t(lang, 'years_exp'), isMr ? 'नेत्ररोगशास्त्रातील दोन दशकांचा प्रत्यक्ष रुग्णसेवेचा अनुभव.' : 'Two decades of hands-on clinical practice in ophthalmology.'],
    ['phaco', (isMr ? 'सुमारे ' : 'Approximately ') + num(lang, d.surgeriesApprox) + (isMr ? ' फॅको मोतीबिंदू शस्त्रक्रिया' : ' phaco cataract surgeries'), isMr ? 'हा अनुभवाचा उल्लेख आहे; परिणामांची हमी नव्हे.' : 'A statement of surgical experience, not a guarantee of outcomes.'],
    ['book', isMr ? 'नेत्ररोगशास्त्रातील विशेष पात्रता' : 'Specialist qualifications in ophthalmology', d.qualificationsList.map(q => L(lang, q)).join(' · ')],
    ['pin', isMr ? 'चेंबूरमध्ये सोयीस्कर तपासणी' : 'Convenient consultations in Chembur', isMr ? 'टिळक नगर आणि चेंबूर नाका येथे सकाळ व संध्याकाळ ओपीडी.' : 'Morning OPD in Tilak Nagar and evening OPD at Chembur Naka.']
  ];
  const body = `
<section class="hero">
<div class="wrap hero-grid">
<div class="hero__text">
<p class="eyebrow">${esc(L(lang, d.designation))} · ${isMr ? 'चेंबूर, मुंबई' : 'Chembur, Mumbai'}</p>
<h1>${isMr ? 'स्पष्ट दृष्टीसाठी अनुभवी नेत्रसेवा' : 'Experienced Eye Care. A Focus on Clearer Vision.'}</h1>
<p class="lead">${isMr ? 'डॉ. अनघा देशपांडे — नेत्ररोगतज्ज्ञ, चेंबूर, मुंबई. मोतीबिंदू तपासणी आणि फॅको शस्त्रक्रियेबाबत सल्ल्यासाठी भेट निश्चित करा.' : 'Dr. Anagha Deshpande — Consultant Ophthalmologist in Chembur, with a special interest in phacoemulsification cataract surgery.'}</p>
<ul class="stats" aria-label="${isMr ? 'अनुभव' : 'Experience'}">
<li><span class="stats__num">${num(lang, d.experienceYears)}</span><span class="stats__label">${t(lang, 'years_exp')}</span></li>
<li><span class="stats__num">~${num(lang, d.surgeriesApprox)}</span><span class="stats__label">${t(lang, 'approx_surgeries')}</span></li>
</ul>
<div class="btn-row">
<a class="btn btn--primary btn--lg" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_consult')}</span></a>
<a class="btn btn--outline btn--lg" href="${url(lang, '/cataract-surgery')}">${icon('lens')}<span>${t(lang, 'learn_cataract')}</span></a>
</div>
<p class="hero__note">${isMr ? 'शस्त्रक्रियेचा निर्णय प्रत्येक रुग्णाच्या तपासणीनंतरच घेतला जातो.' : 'Every treatment decision is made after an individual examination.'}</p>
</div>
<div class="hero__media">
${picture(d.photos.portrait, isMr ? 'डॉ. अनघा देशपांडे, नेत्ररोगतज्ज्ञ, त्यांच्या चेंबूर येथील क्लिनिकमध्ये' : 'Dr. Anagha Deshpande, consultant ophthalmologist, at her clinic in Chembur', { eager: true, cls: 'hero__img', sizes: '(max-width: 900px) 90vw, 40vw' })}
</div>
</div>
<div class="wrap">
<div class="hero-clinics">
${content.clinics.map(c => `<a class="hero-clinic" href="${url(lang, '/clinics')}#clinic-${c.id}">
<span class="hero-clinic__name">${icon('hospital')} ${esc(L(lang, c.name))}</span>
<span class="hero-clinic__hours">${icon('clock')} ${esc(hoursText(lang, c))}</span></a>`).join('')}
</div></div>
</section>

<section class="section">
<div class="wrap">
<h2 class="section-title">${isMr ? 'डॉ. अनघा देशपांडे यांचा सल्ला का घ्यावा?' : 'Why consult Dr. Anagha Deshpande?'}</h2>
<ul class="grid grid--4 why">
${why.map(([ic, h, p]) => `<li class="card why-card"><span class="icon-badge">${icon(ic)}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}
</ul></div></section>

<section class="section section--tint">
<div class="wrap split">
<div>
<h2 class="section-title">${isMr ? 'मोतीबिंदू आणि आधुनिक मोतीबिंदू शस्त्रक्रिया समजून घ्या' : 'Understanding Cataracts and Modern Cataract Surgery'}</h2>
<p>${isMr ? 'मोतीबिंदू म्हणजे डोळ्यातील नैसर्गिक भिंग धूसर होणे. त्यामुळे दृष्टी धूसर होते, प्रकाशाची चकाकी त्रास देते आणि वाचन, वाहन चालवणे यांसारखी रोजची कामे अवघड होऊ शकतात.' : 'A cataract is a clouding of the natural lens inside the eye. It can cause blurred vision, glare and difficulty with daily activities such as reading and driving.'}</p>
<p>${isMr ? 'फॅकोइमल्सिफिकेशन (फॅको) शस्त्रक्रियेत अल्ट्रासाऊंड ऊर्जेने धूसर भिंगाचे लहान तुकडे करून ते काढले जातात आणि त्याजागी कृत्रिम भिंग (इंट्राऑक्युलर लेन्स) बसवले जाते.' : 'In phacoemulsification ("phaco"), ultrasound energy is used to break up the cloudy lens before it is removed and replaced with an artificial intraocular lens.'}</p>
<ul class="link-list">
${[['symptoms', isMr ? 'मोतीबिंदूची लक्षणे' : 'Cataract symptoms'], ['when-surgery', isMr ? 'शस्त्रक्रिया केव्हा आवश्यक असू शकते' : 'When surgery may be needed'], ['lenses', isMr ? 'कृत्रिम भिंगाचे प्रकार' : 'Types of intraocular lenses'], ['before', isMr ? 'शस्त्रक्रियेपूर्वीची तपासणी' : 'Preoperative assessment'], ['after', isMr ? 'शस्त्रक्रियेनंतर बरे होणे' : 'Recovery after surgery'], ['risks', isMr ? 'धोके व संभाव्य गुंतागुंत' : 'Risks and possible complications']].map(([id, label]) => `<li><a href="${url(lang, '/cataract-surgery')}#${id}">${icon('arrow')} ${label}</a></li>`).join('')}
<li><a href="${url(lang, '/faqs')}?topic=cataract">${icon('arrow')} ${isMr ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently asked questions'}</a></li>
</ul>
<p class="note">${isMr ? 'शस्त्रक्रियेचा निर्णय आणि भिंगाची निवड वैयक्तिक तपासणीतील निष्कर्ष आणि रुग्णाच्या पसंतीवर अवलंबून असते.' : 'Surgical decisions and lens selection depend on individual examination findings and patient preferences.'}</p>
<a class="btn btn--primary" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_cataract_eval')}</span></a>
</div>
<div>${eyeDiagram(lang, true)}</div>
</div></section>

<section class="section">
<div class="wrap">
<h2 class="section-title">${isMr ? 'नेत्रसेवा' : 'Eye Care Services'}</h2>
<ul class="grid grid--3">
${services.slice(0, 6).map(s => serviceCard(ctx, s)).join('')}
</ul>
<p><a class="link-cta" href="${url(lang, '/eye-care-services')}">${isMr ? 'सर्व सेवा पहा' : 'View all services'} ${icon('arrow')}</a></p>
</div></section>

<section class="section section--tint">
<div class="wrap split split--media">
<div>${picture(d.photos.examination, isMr ? 'डॉ. अनघा देशपांडे स्लिट-लॅम्पद्वारे डोळ्यांची तपासणी करताना' : 'Dr. Anagha Deshpande at the slit lamp, the microscope used to examine the eye', { cls: 'rounded', widths: [480, 800, 1052], w: 1052, h: 1280 })}</div>
<div>
<h2 class="section-title">${isMr ? 'डॉ. अनघा देशपांडे यांच्याविषयी' : 'About Dr. Anagha Deshpande'}</h2>
<p>${esc(L(lang, d.shortBio))}</p>
<ul class="ticks">${d.qualificationsList.map(q => `<li>${icon('check')}<span>${esc(L(lang, q))}</span></li>`).join('')}
<li>${icon('check')}<span>${esc(L(lang, d.experienceStatement))}</span></li></ul>
<a class="btn btn--outline" href="${url(lang, '/about')}">${icon('user')}<span>${t(lang, 'read_profile')}</span></a>
</div></div></section>

<section class="section">
<div class="wrap narrow">
<h2 class="section-title">${isMr ? 'वारंवार विचारले जाणारे प्रश्न' : 'Popular questions'}</h2>
<div class="faq-list">${popular.map(f => `<a class="faq-link" href="${url(lang, '/faqs')}#${esc(f.id)}"><span>${esc(L(lang, f.q))}</span>${icon('arrow')}</a>`).join('')}</div>
<p><a class="btn btn--outline" href="${url(lang, '/faqs')}">${t(lang, 'see_all_faqs')}</a></p>
</div></section>

<section class="section section--tint" id="clinics">
<div class="wrap">
<h2 class="section-title">${isMr ? 'क्लिनिक आणि ओपीडी वेळा' : 'Clinic locations and timings'}</h2>
<div class="grid grid--2">${content.clinics.map(c => clinicCard(ctx, c)).join('')}</div>
</div></section>

<section class="section cta-band">
<div class="wrap">
<h2>${isMr ? 'आपल्या डोळ्यांच्या आरोग्याकडे लक्ष द्या.' : 'Your Eye Health Deserves Attention.'}</h2>
<p>${isMr ? 'दृष्टीतील बदल, मोतीबिंदूविषयी शंका किंवा डोळ्यांच्या इतर समस्यांबाबत चर्चा करण्यासाठी भेट ठरवा.' : 'Book a consultation to discuss changes in vision, cataract concerns or other eye health problems.'}</p>
${finalCtas(ctx)}
</div></section>`;
  return layout(ctx, {
    path: '/',
    title: isMr ? 'डॉ. अनघा देशपांडे | नेत्ररोगतज्ज्ञ व मोतीबिंदू शस्त्रक्रिया, चेंबूर' : 'Dr. Anagha Deshpande | Ophthalmologist & Cataract Surgeon in Chembur, Mumbai',
    description: isMr ? 'डॉ. अनघा देशपांडे, चेंबूरमधील नेत्ररोगतज्ज्ञ. २० वर्षांचा अनुभव, सुमारे १०,००० फॅको मोतीबिंदू शस्त्रक्रिया. एसआरव्ही हॉस्पिटल व जस्ट केअर क्लिनिक येथे भेट ठरवा.' : 'Dr. Anagha Deshpande, consultant ophthalmologist in Chembur, Mumbai. 20 years of experience and approx. 10,000 phaco cataract surgeries. Book at SRV Hospital or Just Care Clinic.',
    body
  });
}

function finalCtas(ctx) {
  const { lang, content } = ctx;
  const srv = content.clinics.find(c => c.id === 'srv');
  const jc = content.clinics.find(c => c.id === 'justcare');
  return `<div class="btn-row btn-row--center">
<a class="btn btn--light" href="${tel(srv.phone)}">${icon('phone')}<span>${t(lang, 'call_srv_short')}</span></a>
<a class="btn btn--light" href="${tel(jc.phone)}">${icon('phone')}<span>${t(lang, 'call_jc_short')}</span></a>
<a class="btn btn--wa" href="${esc(waHref(jc, content, lang))}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${t(lang, 'wa_jc_short')}</span></a>
<a class="btn btn--accent" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${lang === 'mr' ? 'भेटीची वेळ ठरवा' : 'Book an Appointment'}</span></a>
</div>`;
}

function serviceCard(ctx, s) {
  const { lang } = ctx;
  return `<li class="card service-card${s.published ? '' : ' service-card--draft'}"><span class="icon-badge">${icon(s.icon)}</span>
<h3>${esc(L(lang, s.title))}${!s.published ? ` <span class="tag tag--confirm">${t(lang, 'to_confirm')}</span>` : confirmTag(ctx, s)}</h3>
<p>${esc(L(lang, s.text))}</p>
${s.where ? `<p class="service-card__where">${icon('pin')} ${esc(L(lang, s.where))}</p>` : ''}</li>`;
}

function about(ctx) {
  const { lang, content } = ctx;
  const d = content.doctor;
  const isMr = lang === 'mr';
  const body = `${pageHead(ctx, esc(L(lang, d.name)), esc(L(lang, d.designation)) + ' · ' + esc(d.qualificationsList.map(q => L(lang, q)).join(', ')), esc(t(lang, 'nav_about')))}
<section class="section"><div class="wrap split split--media">
<div class="about-photo">${picture(d.photos.consultation, isMr ? 'डॉ. अनघा देशपांडे त्यांच्या सल्ला कक्षात' : 'Dr. Anagha Deshpande in her consultation room', { cls: 'rounded' })}</div>
<div>
<ul class="stats stats--light">
<li><span class="stats__num">${num(lang, d.experienceYears)}</span><span class="stats__label">${t(lang, 'years_exp')}</span></li>
<li><span class="stats__num">~${num(lang, d.surgeriesApprox)}</span><span class="stats__label">${t(lang, 'approx_surgeries')}</span></li>
</ul>
<div class="prose">${paras(L(lang, d.bio))}</div>
<p class="note">${esc(L(lang, d.experienceStatement))} ${isMr ? 'हा अनुभवाचा उल्लेख असून कोणत्याही परिणामाची हमी नाही.' : 'This describes experience and is not a guarantee of any outcome.'}</p>
<div class="btn-row"><a class="btn btn--primary" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_consult')}</span></a></div>
</div></div></section>

<section class="section section--tint"><div class="wrap grid grid--2">
<div class="card"><h2>${isMr ? 'वैद्यकीय शिक्षण' : 'Medical education'}</h2>
<ol class="timeline">${d.education.map(e => `<li><span class="timeline__when">${num(lang, e.years)}</span><strong>${esc(L(lang, e.degree))}</strong><span>${esc(L(lang, e.place))}</span></li>`).join('')}</ol></div>
<div class="card"><h2>${isMr ? 'व्यावसायिक अनुभव' : 'Professional experience'}</h2>
<ol class="timeline">${d.career.map(e => `<li><span class="timeline__when">${esc(L(lang, e.period))}${confirmTag(ctx, e)}</span><strong>${esc(L(lang, e.role))}</strong><span>${esc(L(lang, e.place))}</span></li>`).join('')}</ol>
<p class="note">${isMr ? 'डॉ. देशपांडे यांच्या सीव्हीनुसार कारकिर्दीचा इतिहास. सध्याची तपासणीची ठिकाणे खाली दिली आहेत.' : "Career history as recorded in Dr. Deshpande's CV. Her current consultation locations are listed below."}</p></div>
</div></section>

<section class="section"><div class="wrap grid grid--3">
<div class="card"><h2>${isMr ? 'वैद्यकीय विशेष रुची' : 'Clinical interests'}</h2><ul class="ticks">${d.interests.map(i => `<li>${icon('check')}<span>${esc(L(lang, i))}</span></li>`).join('')}</ul></div>
<div class="card"><h2>${isMr ? 'रुग्णसेवेचा दृष्टिकोन' : 'Approach to patient care'}</h2><p>${esc(L(lang, d.approach))}</p></div>
<div class="card"><h2>${isMr ? 'बोलल्या जाणाऱ्या भाषा' : 'Languages spoken'}</h2><p>${esc(L(lang, d.languagesSpoken))}${confirmTag(ctx, d.languagesSpoken)}</p></div>
</div></section>

<section class="section section--tint"><div class="wrap">
<h2 class="section-title">${isMr ? 'तपासणीची ठिकाणे' : 'Consultation locations'}</h2>
<div class="grid grid--2">${content.clinics.map(c => clinicCard(ctx, c)).join('')}</div>
</div></section>`;
  return layout(ctx, {
    path: '/about',
    title: isMr ? 'डॉ. अनघा देशपांडे यांच्याविषयी | नेत्ररोगतज्ज्ञ, चेंबूर' : 'About Dr. Anagha Deshpande | MS, DOMS, FCPS Ophthalmologist, Chembur',
    description: isMr ? 'डॉ. अनघा देशपांडे यांचे शिक्षण, पात्रता (एमएस, डीओएमएस, एफसीपीएस), २० वर्षांचा अनुभव आणि चेंबूरमधील तपासणीची ठिकाणे.' : 'Profile of Dr. Anagha Deshpande: MS (Ophthalmology), DOMS, FCPS, 20 years of clinical experience, approx. 10,000 phaco surgeries, and consultation locations in Chembur.',
    body
  });
}

function cataract(ctx) {
  const { lang } = ctx;
  const c = pages.cataract;
  const isMr = lang === 'mr';
  const sec = s => {
    let out = `<section class="cat-sec" id="${s.id}"><h2>${esc(L(lang, s.h))}</h2>`;
    (s.p || []).forEach(p => { out += '<p>' + esc(L(lang, p)) + '</p>'; });
    if (s.id === 'what-is-cataract') out += `<div class="grid grid--2 illus-pair">${eyeDiagram(lang, false)}${eyeDiagram(lang, true)}</div>`;
    if (s.list) out += '<ul class="ticks">' + s.list.map(i => `<li>${icon('check')}<span>${esc(L(lang, i))}</span></li>`).join('') + '</ul>';
    if (s.steps) out += phacoSteps(lang, s.steps) + `
<figure class="video-fig"><video controls preload="none" muted playsinline poster="/video/operating-theatre-poster.jpg" width="480" height="854"><source src="/video/operating-theatre.mp4" type="video/mp4"></video>
<figcaption>${isMr ? 'शस्त्रक्रिया कक्षात सूक्ष्मदर्शकाखाली शस्त्रक्रिया करताना डॉ. देशपांडे (आवाजाशिवाय, १० सेकंद). डोळ्याचे दृश्य दाखवलेले नाही.' : 'Dr. Deshpande operating at the surgical microscope (10 seconds, no sound). No view of the eye is shown.'}</figcaption></figure>`;
    if (s.id === 'lenses') {
      out += iolTypes(lang);
      out += `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(L(lang, s.h))}"><table class="compare"><thead><tr>${s.table.head.map(h => `<th scope="col">${esc(L(lang, h))}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map((cell, i) => i === 0 ? `<th scope="row">${esc(L(lang, cell))}</th>` : `<td>${esc(L(lang, cell))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    if (s.note) out += `<p class="note">${esc(L(lang, s.note))}</p>`;
    return out + '</section>';
  };
  const body = `${pageHead(ctx, esc(L(lang, c.title)), esc(L(lang, c.intro)), esc(t(lang, 'nav_cataract')))}
<div class="wrap cat-layout">
<nav class="toc" aria-label="${isMr ? 'या पृष्ठावर' : 'On this page'}"><p class="toc__title">${isMr ? 'या पृष्ठावर' : 'On this page'}</p><ol>
${c.sections.map(s => `<li><a href="#${s.id}">${esc(L(lang, s.h))}</a></li>`).join('')}<li><a href="#warning">${esc(L(lang, c.warning.h))}</a></li></ol>
<a class="btn btn--primary btn--block" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_cataract_consult')}</span></a></nav>
<div class="prose cat-body">
${c.sections.map(sec).join('')}
<section class="cat-sec warning-box" id="warning"><h2>${icon('alert')} ${esc(L(lang, c.warning.h))}</h2><p>${esc(L(lang, c.warning.p))}</p>
<ul>${c.warning.list.map(i => `<li>${esc(L(lang, i))}</li>`).join('')}</ul>
<p><strong>${isMr ? 'त्वरित जवळच्या रुग्णालयाच्या आपत्कालीन विभागात जा किंवा आपल्या शल्यचिकित्सकांशी संपर्क करा.' : 'Go to the nearest hospital emergency department or contact your surgeon immediately.'}</strong></p></section>
<p class="disclaimer-line">${esc(L(lang, c.disclaimer))}</p>
<div class="btn-row"><a class="btn btn--primary btn--lg" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_cataract_consult')}</span></a>
<a class="btn btn--outline btn--lg" href="${url(lang, '/faqs')}?topic=cataract">${t(lang, 'see_all_faqs')}</a></div>
</div></div>`;
  return layout(ctx, {
    path: '/cataract-surgery',
    title: isMr ? 'मोतीबिंदू व फॅको शस्त्रक्रिया, चेंबूर | डॉ. अनघा देशपांडे' : 'Cataract & Phaco Surgery in Chembur, Mumbai | Dr. Anagha Deshpande',
    description: isMr ? 'मोतीबिंदूची लक्षणे, फॅकोइमल्सिफिकेशन शस्त्रक्रिया, कृत्रिम भिंगाचे पर्याय, शस्त्रक्रियेपूर्वी व नंतरची काळजी आणि धोके याबद्दल सोप्या भाषेत माहिती.' : 'Patient guide to cataract and phacoemulsification surgery in Chembur: symptoms, when surgery is needed, intraocular lens options, preparation, recovery and risks.',
    body
  });
}

function services(ctx) {
  const { lang, content } = ctx;
  const isMr = lang === 'mr';
  const list = content.services.filter(s => s.published || ctx.preview);
  const body = `${pageHead(ctx, isMr ? 'नेत्रसेवा' : 'Eye Care Services', isMr ? 'डॉ. अनघा देशपांडे यांच्याकडे उपलब्ध सेवा. प्रत्येक सेवा दोन्ही क्लिनिकमध्ये उपलब्ध असेलच असे नाही; भेट ठरवताना कृपया विचारा.' : 'Services offered by Dr. Anagha Deshpande. Not every service is available at both clinics; please ask when you book.', esc(t(lang, 'nav_eyecare')))}
<section class="section"><div class="wrap">
${ctx.preview ? `<p class="note">${isMr ? 'पूर्वदर्शन: "निश्चित करायचे" असलेल्या सेवा डॉक्टरांनी निश्चित केल्याशिवाय प्रकाशित वेबसाइटवर दिसणार नाहीत.' : 'Preview: services marked "To be confirmed" will not appear on the live site until Dr. Deshpande confirms them in the admin dashboard.'}</p>` : ''}
<ul class="grid grid--3">${list.map(s => serviceCard(ctx, s)).join('')}</ul>
<div class="split split--media section">
<div>${picture(content.doctor.photos.examination, isMr ? 'स्लिट-लॅम्प तपासणी' : 'Slit-lamp eye examination by Dr. Anagha Deshpande', { cls: 'rounded', widths: [480, 800, 1052], w: 1052, h: 1280 })}</div>
<div><h2>${isMr ? 'तपासणीत काय होते?' : 'What happens at a consultation?'}</h2>
<ul class="ticks">${(isMr ? ['आपली लक्षणे, वैद्यकीय इतिहास व औषधांबाबत चर्चा', 'दृष्टी व चष्म्याच्या नंबरची तपासणी', 'स्लिट-लॅम्पद्वारे डोळ्याच्या पुढील भागाची तपासणी', 'गरजेनुसार डोळ्यांचा दाब आणि थेंबांनी बाहुली मोठी करून पडद्याची तपासणी', 'निष्कर्ष, पर्याय आणि पुढील पायऱ्यांचे स्पष्ट स्पष्टीकरण'] : ['A discussion of your symptoms, medical history and medicines', 'Vision and spectacle power testing', 'Slit-lamp examination of the front of the eye', 'Eye pressure measurement and dilated retinal examination when needed', 'A clear explanation of findings, options and next steps']).map(x => `<li>${icon('check')}<span>${x}</span></li>`).join('')}</ul>
<p class="note">${isMr ? 'बाहुली मोठी करणाऱ्या थेंबांमुळे काही तास दृष्टी धूसर राहू शकते; सोबत कोणी असणे उपयुक्त ठरते.' : 'Dilating drops can blur vision for a few hours, so it helps to bring someone with you and avoid driving afterwards.'}</p>
<a class="btn btn--primary" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_consult')}</span></a></div></div>
</div></section>`;
  return layout(ctx, {
    path: '/eye-care-services',
    title: isMr ? 'नेत्रसेवा, चेंबूर | डॉ. अनघा देशपांडे' : 'Eye Care Services in Chembur | Dr. Anagha Deshpande, Eye Specialist',
    description: isMr ? 'मोतीबिंदू तपासणी, फॅको शस्त्रक्रिया आणि डोळ्यांची सर्वांगीण तपासणी – चेंबूर व टिळक नगरमधील नेत्ररोगतज्ज्ञ.' : 'Cataract evaluation, phaco cataract surgery and comprehensive eye examinations with an experienced eye specialist in Chembur and Tilak Nagar.',
    body
  });
}

function faqs(ctx, { topic } = {}) {
  const { lang, faqData } = ctx;
  const isMr = lang === 'mr';
  const published = faqData.faqs.filter(f => f.published);
  const cats = faqData.categories.filter(c => published.some(f => f.category === c.id));
  const selected = cats.some(c => c.id === topic) ? topic : '';
  const body = `${pageHead(ctx, isMr ? 'डोळ्यांच्या आरोग्याविषयी प्रश्नोत्तरे' : 'Eye Health FAQs', esc(t(lang, 'faq_review_note')), esc(t(lang, 'nav_faqs')))}
<section class="section"><div class="wrap">
${emergencyBox(lang)}
<div class="faq-tools" data-faq-tools>
<label for="faq-search" class="label">${t(lang, 'faq_search')}</label>
<div class="search-box">${icon('search')}<input id="faq-search" type="search" placeholder="${esc(t(lang, 'faq_search_ph'))}" autocomplete="off" aria-describedby="faq-count"></div>
<div class="chips" role="group" aria-label="${isMr ? 'विषय' : 'Topics'}">
<a class="chip" href="${url(lang, '/faqs')}" data-cat=""${!selected ? ' aria-current="true"' : ''}>${t(lang, 'faq_all')}</a>
${cats.map(c => `<a class="chip" href="${url(lang, '/faqs')}?topic=${c.id}" data-cat="${c.id}" aria-current="${selected === c.id}">${esc(L(lang, c))}</a>`).join('')}
</div>
<p id="faq-count" class="muted" aria-live="polite" data-template="${esc(t(lang, 'faq_count'))}">${t(lang, 'faq_count', { n: selected ? published.filter(f => f.category === selected).length : published.length })}</p>
</div>
${cats.map(c => {
    const items = published.filter(f => f.category === c.id);
    return `<section class="faq-cat" data-cat-section="${c.id}"${selected && selected !== c.id ? ' hidden' : ''}><h2>${esc(L(lang, c))}</h2>${items.map(f => faqItem(ctx, f, published)).join('')}</section>`;
  }).join('')}
<p class="faq-empty" hidden>${t(lang, 'faq_none')}</p>
<div class="cta-inline"><p>${isMr ? 'आपला प्रश्न येथे नाही? तपासणीच्या वेळी डॉक्टरांना विचारा.' : 'Question not listed? Ask Dr. Deshpande at your consultation.'}</p><a class="btn btn--primary" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'nav_book')}</span></a></div>
</div></section>`;
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang === 'mr' ? 'mr-IN' : 'en-IN',
    mainEntity: published.map(f => ({ '@type': 'Question', name: L(lang, f.q), acceptedAnswer: { '@type': 'Answer', text: L(lang, f.short) + ' ' + L(lang, f.detail) } }))
  };
  return layout(ctx, {
    path: '/faqs',
    title: isMr ? 'डोळ्यांविषयी प्रश्नोत्तरे | मोतीबिंदू, मधुमेह, काचबिंदू | डॉ. अनघा देशपांडे' : 'Eye Health FAQs: Cataract, Diabetes, Glaucoma & More | Dr. Anagha Deshpande',
    description: isMr ? 'मोतीबिंदू, फॅको शस्त्रक्रिया, मधुमेह, काचबिंदू, कोरडे व लाल डोळे, मुलांचे डोळे आणि आपत्कालीन स्थितीबाबत सोप्या भाषेत उत्तरे.' : 'Clear answers to common questions about cataract and phaco surgery, diabetes, glaucoma, dry and red eyes, children\'s eyes and eye emergencies.',
    body, jsonld: ctx.faqSchema ? [faqLd] : []
  });
}

function articlesIndex(ctx) {
  const { lang } = ctx;
  const isMr = lang === 'mr';
  const body = `${pageHead(ctx, isMr ? 'रुग्णांसाठी माहितीपर लेख' : 'Patient Education Articles', isMr ? 'डोळ्यांच्या आरोग्याविषयी सोप्या भाषेतील मार्गदर्शक.' : 'Plain-language guides to common eye conditions and treatments.', esc(t(lang, 'nav_articles')))}
<section class="section"><div class="wrap"><ul class="grid grid--2">
${pages.articles.map(a => `<li class="card article-card"><h2><a href="${url(lang, '/articles/' + a.slug)}">${esc(L(lang, a.title))}</a></h2><p>${esc(L(lang, a.summary))}</p><a class="link-cta" href="${url(lang, '/articles/' + a.slug)}" aria-hidden="true" tabindex="-1">${t(lang, 'read_more')} ${icon('arrow')}</a></li>`).join('')}
<li class="card article-card"><h2><a href="${url(lang, '/cataract-surgery')}">${esc(L(lang, pages.cataract.title))}</a></h2><p>${esc(L(lang, pages.cataract.intro))}</p></li>
</ul></div></section>`;
  return layout(ctx, {
    path: '/articles',
    title: isMr ? 'डोळ्यांच्या आरोग्याविषयी लेख | डॉ. अनघा देशपांडे, चेंबूर' : 'Patient Education Articles on Eye Health | Dr. Anagha Deshpande',
    description: isMr ? 'मोतीबिंदू शस्त्रक्रिया, मधुमेह व डोळे, काचबिंदू आणि स्क्रीनमुळे डोळ्यांवरील ताण याबद्दल रुग्णांसाठी लेख.' : 'Guides for patients on cataract surgery, diabetes and the eyes, glaucoma, and screen-related eye strain.',
    body
  });
}

function article(ctx, a) {
  const { lang } = ctx;
  const isMr = lang === 'mr';
  const body = `${pageHead(ctx, esc(L(lang, a.title)), esc(L(lang, a.summary)), `<a href="${url(lang, '/articles')}">${t(lang, 'nav_articles')}</a>`)}
<section class="section"><div class="wrap narrow prose">${richBlocks(lang, a.body)}
<p class="disclaimer-line">${t(lang, 'footer_note')}</p>
<div class="btn-row"><a class="btn btn--primary" href="${url(lang, '/book-appointment')}">${icon('calendar')}<span>${t(lang, 'book_consult')}</span></a><a class="btn btn--outline" href="${url(lang, '/articles')}">${isMr ? 'इतर लेख' : 'More articles'}</a></div>
</div></section>`;
  return layout(ctx, { path: '/articles/' + a.slug, title: L(lang, a.title) + (isMr ? ' | डॉ. अनघा देशपांडे' : ' | Dr. Anagha Deshpande'), description: L(lang, a.summary), body });
}

function clinics(ctx) {
  const { lang, content } = ctx;
  const isMr = lang === 'mr';
  const body = `${pageHead(ctx, isMr ? 'क्लिनिकचे पत्ते व वेळा' : 'Clinic Locations and Timings', isMr ? 'डॉ. अनघा देशपांडे चेंबूरमधील दोन ठिकाणी तपासणी करतात. प्रत्येक क्लिनिकचा भेटीसाठी क्रमांक वेगळा आहे.' : 'Dr. Anagha Deshpande consults at two locations in Chembur. Each clinic has its own appointment number.', esc(t(lang, 'nav_clinics')))}
<section class="section"><div class="wrap">
<div class="grid grid--2">${content.clinics.map(c => clinicCard(ctx, c, { heading: 'h2' })).join('')}</div>
<div class="card hours-table" id="call">
<h2>${isMr ? 'साप्ताहिक ओपीडी वेळापत्रक' : 'Weekly OPD schedule'}</h2>
<div class="table-wrap" tabindex="0" role="region" aria-label="${isMr ? 'साप्ताहिक वेळापत्रक' : 'Weekly schedule'}"><table><thead><tr><th scope="col">${isMr ? 'दिवस' : 'Day'}</th>${content.clinics.map(c => `<th scope="col">${esc(L(lang, c.shortName))}</th>`).join('')}</tr></thead>
<tbody>${[1, 2, 3, 4, 5, 6, 0].map(dw => `<tr><th scope="row">${t(lang, 'days')[dw]}</th>${content.clinics.map(c => `<td>${c.days.includes(dw) ? esc(fmtTime(lang, c.start) + ' – ' + fmtTime(lang, c.end)) : `<span class="muted">${isMr ? 'बंद' : 'Closed'}</span>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
<p class="note">${isMr ? 'रविवारी ओपीडी नसते. सुट्ट्यांच्या दिवशी वेळा बदलू शकतात; कृपया आधी कॉल करा.' : 'There is no OPD on Sundays. Timings may change on holidays; please call before visiting.'}</p>
</div>
${emergencyBox(lang)}
</div></section>`;
  return layout(ctx, {
    path: '/clinics',
    title: isMr ? 'क्लिनिक व ओपीडी वेळा – एसआरव्ही हॉस्पिटल व जस्ट केअर, चेंबूर' : 'Clinic Locations & OPD Timings – SRV Hospital & Just Care, Chembur',
    description: isMr ? 'एसआरव्ही हॉस्पिटल, टिळक नगर (सोम–शनि, सकाळी १०–दुपारी १, 8451800800) आणि जस्ट केअर हार्ट अँड आय क्लिनिक, चेंबूर नाका (सोम–शुक्र, सायं. ६–८, 8879758831).' : 'SRV Hospital, Tilak Nagar (Mon–Sat, 10 AM–1 PM, 8451800800) and Just Care Heart & Eye Clinic, Chembur Naka (Mon–Fri, 6–8 PM, 8879758831).',
    body
  });
}

function formField(lang, { id, label, required, error, hint, input }) {
  const describedBy = [hint ? id + '-hint' : '', error ? id + '-err' : ''].filter(Boolean).join(' ');
  return `<div class="field${error ? ' field--error' : ''}">
<label for="${id}">${label}${required ? ` <span class="req">(${t(lang, 'f_required')})</span>` : ''}</label>
${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ''}
${input(describedBy ? ` aria-describedby="${describedBy}"` : '', error ? ' aria-invalid="true"' : '')}
<p class="error" id="${id}-err" ${error ? '' : 'hidden'}>${error ? icon('alert') + ' ' + esc(error) : ''}</p>
</div>`;
}

function errorText(lang, code, vars) { return code ? t(lang, 'err.' + code, vars) : ''; }

function book(ctx, { clinicId, values = {}, errors = {}, vars = {} } = {}) {
  const { lang, content } = ctx;
  const isMr = lang === 'mr';
  const clinic = content.clinics.find(c => c.id === clinicId);
  const today = nowIST().date;
  const maxDate = addDays(today, content.settings.bookingWindowDays || 30);
  const errList = Object.entries(errors).map(([field, code]) => ({ field, msg: errorText(lang, code, vars) }));
  const v = Object.assign({ language: lang }, values);
  const step = (n, label, active) => `<li${active ? ' aria-current="step"' : ''}><span class="stepper__n">${num(lang, n)}</span>${label}</li>`;

  const clinicChoice = content.clinics.map(c => `<article class="card choice${clinic && clinic.id === c.id ? ' choice--selected' : ''}">
<h3>${icon('hospital')} ${esc(L(lang, c.name))}</h3>
<p>${icon('clock')} <span><strong>${t(lang, 'opd')}:</strong> ${esc(hoursText(lang, c))}</span></p>
<p>${icon('phone')} <span><strong>${t(lang, 'appointment_no')}:</strong> ${esc(c.phone)}</span></p>
<p class="muted">${icon('pin')} <span>${esc(L(lang, c.address))}</span></p>
${clinic && clinic.id === c.id
    ? `<p class="selected-flag">${icon('check')} ${t(lang, 'selected_clinic')}</p>`
    : `<a class="btn btn--primary btn--block" href="${bookUrl(ctx, c.id)}">${t(lang, 'choose_clinic')}</a>`}
</article>`).join('');

  let stepsHtml = '';
  if (clinic) {
    const slots = allSlots(clinic);
    stepsHtml = `
<section class="book-step" id="step2" aria-labelledby="step2-h">
<h2 id="step2-h"><span class="step-label">${t(lang, 'step')} ${num(lang, 2)}</span> ${t(lang, 'step2')}</h2>
<div class="methods">
<a class="method" href="${tel(clinic.phone)}">${icon('phone')}<span><strong>${isMr ? 'कॉल करा' : 'Call'} ${esc(clinic.phone)}</strong><small>${t(lang, clinic.id === 'srv' ? 'call_srv' : 'call_jc')}</small></span></a>
${clinic.whatsapp ? `<a class="method method--wa" href="${esc(waHref(clinic, content, lang))}" target="_blank" rel="noopener">${icon('whatsapp')}<span><strong>${isMr ? 'व्हॉट्सॲप' : 'WhatsApp'} ${esc(clinic.phone)}</strong><small>${t(lang, 'wa_jc')} – ${isMr ? 'पाठवण्यापूर्वी संदेश बदलता येतो' : 'you can edit the message before sending'}</small></span></a>` : ''}
<a class="method method--form" href="#step3">${icon('calendar')}<span><strong>${t(lang, 'online_request')}</strong><small>${isMr ? 'क्लिनिक फोनवर वेळ निश्चित करेल' : 'The clinic will call to confirm the time'}</small></span></a>
</div>
<p><a href="${url(lang, '/book-appointment')}#step1">${t(lang, 'change_clinic')}</a></p>
</section>

<section class="book-step" id="step3" aria-labelledby="step3-h">
<h2 id="step3-h"><span class="step-label">${t(lang, 'step')} ${num(lang, 3)}</span> ${t(lang, 'step3')}</h2>
<p class="note">${t(lang, 'urgent_note')}</p>
${errList.length ? `<div class="error-summary" role="alert" tabindex="-1" id="error-summary"><h3>${t(lang, 'f_errors_title')}</h3><ul>${errList.map(e => `<li><a href="#f-${e.field === 'form' ? 'name' : e.field}">${esc(e.msg)}</a></li>`).join('')}</ul></div>` : ''}
${ctx.static
    ? `<form class="form card" method="post" action="${url(lang, '/book-appointment/received')}" novalidate data-booking-form data-static name="appointment-request" data-netlify="true" netlify-honeypot="website" data-lang="${lang}" data-clinic="${clinic.id}" data-clinic-name="${esc(L(lang, clinic.name))}" data-days="${clinic.days.join(',')}" data-closures="${esc(JSON.stringify((content.closures || []).filter(x => x.clinic === 'all' || x.clinic === clinic.id)))}" data-max="${maxDate}" data-errors="${esc(JSON.stringify(t(lang, 'err')))}">
<input type="hidden" name="form-name" value="appointment-request"><input type="hidden" name="clinic-name" value="${esc(clinic.name.en)}"><input type="hidden" name="site-language" value="${lang}">`
    : `<form class="form card" method="post" action="${url(lang, '/book-appointment')}" novalidate data-booking-form data-lang="${lang}" data-clinic="${clinic.id}">`}
<input type="hidden" name="clinic" value="${clinic.id}">
<div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" tabindex="-1" autocomplete="off"></div>
<p class="form-clinic">${icon('hospital')} <strong>${t(lang, 'f_clinic')}:</strong> ${esc(L(lang, clinic.name))}</p>
${formField(lang, { id: 'f-name', label: t(lang, 'f_name'), required: true, error: errorText(lang, errors.name), input: (d, inv) => `<input id="f-name" name="name" type="text" autocomplete="name" required maxlength="100" value="${esc(v.name)}"${d}${inv}>` })}
${formField(lang, { id: 'f-mobile', label: t(lang, 'f_mobile'), required: true, hint: t(lang, 'f_mobile_hint'), error: errorText(lang, errors.mobile), input: (d, inv) => `<input id="f-mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel-national" required maxlength="14" value="${esc(v.mobile)}"${d}${inv}>` })}
<div class="field-row">
${formField(lang, { id: 'f-date', label: t(lang, 'f_date'), required: true, hint: t(lang, 'f_date_hint') + ' ' + L(lang, clinic.daysLabel) + '.', error: errorText(lang, errors.date, vars), input: (d, inv) => `<input id="f-date" name="date" type="date" required min="${today}" max="${maxDate}" value="${esc(v.date)}"${d}${inv}>` })}
${formField(lang, { id: 'f-time', label: t(lang, 'f_time'), required: true, hint: hoursText(lang, clinic), error: errorText(lang, errors.time), input: (d, inv) => `<select id="f-time" name="time" required${d}${inv}><option value="">${t(lang, 'f_time_choose')}</option>${slots.map(s => `<option value="${s}"${v.time === s ? ' selected' : ''}>${esc(fmtTime(lang, s))}</option>`).join('')}</select><p class="slot-status muted" aria-live="polite"></p>` })}
</div>
${formField(lang, { id: 'f-reason', label: t(lang, 'f_reason'), required: true, error: errorText(lang, errors.reason), input: (d, inv) => `<select id="f-reason" name="reason" required${d}${inv}><option value="">${t(lang, 'f_reason_choose')}</option>${REASONS.map(r => `<option value="${r}"${v.reason === r ? ' selected' : ''}>${esc(t(lang, 'reasons.' + r))}</option>`).join('')}</select>` })}
<fieldset class="field${errors.language ? ' field--error' : ''}"><legend>${t(lang, 'f_lang')} <span class="req">(${t(lang, 'f_required')})</span></legend>
<div class="radios">${['mr', 'en', 'hi'].map(l => `<label class="radio"><input type="radio" name="language" value="${l}"${v.language === l ? ' checked' : ''}> ${t(lang, 'langs.' + l)}</label>`).join('')}</div>
${errors.language ? `<p class="error">${icon('alert')} ${esc(errorText(lang, errors.language))}</p>` : ''}</fieldset>
${formField(lang, { id: 'f-message', label: t(lang, 'f_msg'), hint: t(lang, 'f_msg_hint'), error: errorText(lang, errors.message), input: (d, inv) => `<textarea id="f-message" name="message" rows="3" maxlength="500"${d}${inv}>${esc(v.message)}</textarea>` })}
<div class="field field--check${errors.consent ? ' field--error' : ''}">
<label class="check"><input id="f-consent" type="checkbox" name="consent" value="yes"${v.consent ? ' checked' : ''}${errors.consent ? ' aria-invalid="true" aria-describedby="f-consent-err"' : ''}> <span>${t(lang, 'f_consent')} <a href="${url(lang, '/privacy-policy')}" target="_blank">${t(lang, 'privacy')}</a></span></label>
<p class="error" id="f-consent-err" ${errors.consent ? '' : 'hidden'}>${errors.consent ? icon('alert') + ' ' + esc(errorText(lang, errors.consent)) : ''}</p>
</div>
${errors.form ? `<p class="error error--form" role="alert">${icon('alert')} ${esc(errorText(lang, errors.form))}</p>` : ''}
<button class="btn btn--primary btn--lg btn--block" type="submit" data-sending="${esc(t(lang, 'f_sending'))}">${icon('calendar')}<span>${t(lang, 'f_submit')}</span></button>
<p class="muted small">${isMr ? 'ही विनंती आहे; क्लिनिकने निश्चित केल्यानंतरच भेट निश्चित होते.' : 'This is a request. Your appointment is confirmed only when the clinic confirms it with you.'}</p>
</form>
</section>`;
  }

  const body = `${pageHead(ctx, t(lang, 'book_title'), t(lang, 'book_intro'), esc(t(lang, 'nav_book')))}
<section class="section"><div class="wrap narrow-wide">
<ol class="stepper" aria-label="${isMr ? 'पायऱ्या' : 'Steps'}">${step(1, t(lang, 'step1'), !clinic)}${step(2, t(lang, 'step2'), !!clinic && !errList.length)}${step(3, t(lang, 'step3'), !!errList.length)}${step(4, t(lang, 'step4'), false)}</ol>
<section class="book-step" id="step1" aria-labelledby="step1-h">
<h2 id="step1-h"><span class="step-label">${t(lang, 'step')} ${num(lang, 1)}</span> ${t(lang, 'step1')}</h2>
<div class="grid grid--2">${clinicChoice}</div>
</section>
${stepsHtml}
${ctx.static ? '' : `<p class="muted">${isMr ? 'आधीच विनंती केली आहे?' : 'Already sent a request?'} <a href="${url(lang, '/appointment-status')}">${t(lang, 'status_title')}</a></p>`}
${emergencyBox(lang, true)}
</div></section>`;
  return layout(ctx, {
    path: '/book-appointment',
    title: isMr ? 'भेटीची वेळ ठरवा | डॉ. अनघा देशपांडे, नेत्ररोगतज्ज्ञ, चेंबूर' : 'Book an Eye Appointment in Chembur | Dr. Anagha Deshpande',
    description: isMr ? 'एसआरव्ही हॉस्पिटल (8451800800) किंवा जस्ट केअर क्लिनिक (8879758831, व्हॉट्सॲप) येथे डॉ. अनघा देशपांडे यांची भेट ठरवा किंवा ऑनलाइन विनंती पाठवा.' : 'Book a consultation with Dr. Anagha Deshpande at SRV Hospital (8451800800) or Just Care Clinic (8879758831, WhatsApp), or send an online appointment request.',
    body, noindex: Object.keys(errors).length > 0
  });
}

function statusCard(ctx, a) {
  const { lang, content } = ctx;
  const c = content.clinics.find(x => x.id === a.clinic);
  const confirmedish = a.status === 'confirmed' || a.status === 'rescheduled';
  return `<div class="status-card status--${a.status}" role="status">
<p class="status-card__label">${t(lang, 'status_label')}</p>
<p class="status-card__value">${icon(a.status === 'cancelled' ? 'x' : confirmedish ? 'check' : 'clock')} ${t(lang, 'status.' + a.status)}</p>
<p>${t(lang, 'status_help.' + a.status)}</p>
<dl class="dl">
<dt>${t(lang, 'req_ref')}</dt><dd><strong class="ref">${esc(a.ref)}</strong></dd>
<dt>${t(lang, 'clinic')}</dt><dd>${esc(c ? L(lang, c.name) : a.clinic)}</dd>
<dt>${confirmedish ? t(lang, 'confirmed_for') : t(lang, 'requested_for')}</dt><dd>${esc(fmtDate(lang, a.date))}, ${esc(fmtTime(lang, a.time))}</dd>
</dl>
${c ? `<div class="btn-row">${callButtons(ctx, c, { small: true })}</div>` : ''}
</div>`;
}

function bookReceived(ctx, a) {
  const { lang } = ctx;
  const body = `${pageHead(ctx, t(lang, 'req_received'), '', esc(t(lang, 'nav_book')))}
<section class="section"><div class="wrap narrow">
<ol class="stepper" aria-label="Steps"><li><span class="stepper__n">${num(lang, 1)}</span>${t(lang, 'step1')}</li><li><span class="stepper__n">${num(lang, 2)}</span>${t(lang, 'step2')}</li><li><span class="stepper__n">${num(lang, 3)}</span>${t(lang, 'step3')}</li><li aria-current="step"><span class="stepper__n">${num(lang, 4)}</span>${t(lang, 'step4')}</li></ol>
<p class="lead">${t(lang, 'req_received_text')}</p>
${statusCard(ctx, a)}
<p>${t(lang, 'req_keep')} <a href="${url(lang, '/appointment-status')}">${t(lang, 'status_title')}</a></p>
<p class="note">${t(lang, 'urgent_note')}</p>
</div></section>`;
  return layout(ctx, { path: '/book-appointment', title: t(lang, 'req_received'), description: t(lang, 'req_received_text'), body, noindex: true });
}

function staticReceived(ctx) {
  const { lang } = ctx;
  const body = `${pageHead(ctx, t(lang, 'req_received'), '', esc(t(lang, 'nav_book')))}
<section class="section"><div class="wrap narrow">
<p class="lead">${t(lang, 'req_received_text')}</p>
<div class="status-card status--requested" role="status">
<p class="status-card__label">${t(lang, 'status_label')}</p>
<p class="status-card__value">${icon('clock')} ${t(lang, 'status.requested')}</p>
<p>${t(lang, 'status_help.requested')}</p>
<dl class="dl" data-received hidden><dt>${t(lang, 'clinic')}</dt><dd data-k="clinic"></dd><dt>${t(lang, 'requested_for')}</dt><dd data-k="when"></dd></dl>
</div>
<p class="note">${t(lang, 'urgent_note')}</p>
<div class="btn-row">${ctx.content.clinics.map(c => callButtons(ctx, c, { small: true })).join('')}</div>
</div></section>`;
  return layout(ctx, { path: '/book-appointment', title: t(lang, 'req_received'), description: t(lang, 'req_received_text'), body, noindex: true });
}

function status(ctx, { result, error, values = {} } = {}) {
  const { lang } = ctx;
  const body = `${pageHead(ctx, t(lang, 'status_title'), t(lang, 'status_intro'), esc(t(lang, 'status_title')))}
<section class="section"><div class="wrap narrow">
${result ? statusCard(ctx, result) : ''}
<form class="form card" method="post" action="${url(lang, '/appointment-status')}" novalidate>
${error ? `<p class="error error--form" role="alert">${icon('alert')} ${esc(errorText(lang, error))}</p>` : ''}
${formField(lang, { id: 's-ref', label: t(lang, 'req_ref'), required: true, input: (d) => `<input id="s-ref" name="ref" required autocapitalize="characters" placeholder="AD-XXXX-XXXX" value="${esc(values.ref)}"${d}>` })}
${formField(lang, { id: 's-mobile', label: t(lang, 'f_mobile'), required: true, input: (d) => `<input id="s-mobile" name="mobile" type="tel" inputmode="numeric" required value="${esc(values.mobile)}"${d}>` })}
<button class="btn btn--primary btn--lg" type="submit">${t(lang, 'status_check')}</button>
</form></div></section>`;
  return layout(ctx, { path: '/appointment-status', title: t(lang, 'status_title') + (lang === 'mr' ? ' | डॉ. अनघा देशपांडे' : ' | Dr. Anagha Deshpande'), description: t(lang, 'status_intro'), body, noindex: true });
}

function contact(ctx, { sent, errors = {}, values = {} } = {}) {
  const { lang, content } = ctx;
  const isMr = lang === 'mr';
  const email = content.settings.email;
  const body = `${pageHead(ctx, t(lang, 'contact_title'), isMr ? 'भेटीसाठी कृपया संबंधित क्लिनिकला थेट कॉल करा. इतर प्रश्नांसाठी खालील फॉर्म वापरा.' : 'For appointments, please call the relevant clinic directly. For other questions, use the form below.', esc(t(lang, 'nav_contact')))}
<section class="section"><div class="wrap grid grid--2 contact-grid">
<div>${content.clinics.map(c => clinicCard(ctx, c)).join('')}
${email || ctx.preview ? `<div class="card"><h3>${icon('mail')} ${t(lang, 'email')}</h3><p>${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : `<span class="muted">${t(lang, 'email_placeholder')}</span> <span class="tag tag--confirm">${t(lang, 'to_confirm')}</span>`}</p></div>` : ''}
</div>
<div>
${sent ? `<div class="status-card status--confirmed" role="status"><p class="status-card__value">${icon('check')} ${t(lang, 'enquiry_thanks')}</p></div>` : `
${ctx.static ? `<form class="form card" method="post" action="${url(lang, '/contact/thanks')}" novalidate name="enquiry" data-netlify="true" netlify-honeypot="website" data-static-contact data-errors="${esc(JSON.stringify(t(lang, 'err')))}"><input type="hidden" name="form-name" value="enquiry">` : `<form class="form card" method="post" action="${url(lang, '/contact')}" novalidate>`}
<h2>${isMr ? 'संदेश पाठवा' : 'Send a message'}</h2>
<div class="hp" aria-hidden="true"><label for="c-website">Website</label><input id="c-website" name="website" tabindex="-1" autocomplete="off"></div>
${formField(lang, { id: 'c-name', label: isMr ? 'आपले नाव' : 'Your name', required: true, error: errorText(lang, errors.name), input: (d, inv) => `<input id="c-name" name="name" autocomplete="name" required maxlength="100" value="${esc(values.name)}"${d}${inv}>` })}
${formField(lang, { id: 'c-mobile', label: t(lang, 'f_mobile'), required: true, error: errorText(lang, errors.mobile), input: (d, inv) => `<input id="c-mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel-national" required value="${esc(values.mobile)}"${d}${inv}>` })}
${formField(lang, { id: 'c-message', label: isMr ? 'संदेश' : 'Message', required: true, hint: t(lang, 'f_msg_hint'), error: errors.message ? (isMr ? 'कृपया संदेश लिहा (जास्तीत जास्त १००० अक्षरे).' : 'Please enter a message (up to 1000 characters).') : '', input: (d, inv) => `<textarea id="c-message" name="message" rows="5" required maxlength="1000"${d}${inv}>${esc(values.message)}</textarea>` })}
<div class="field field--check${errors.consent ? ' field--error' : ''}"><label class="check"><input type="checkbox" name="consent" value="yes"${values.consent ? ' checked' : ''}> <span>${t(lang, 'f_consent')}</span></label>
${errors.consent ? `<p class="error">${icon('alert')} ${esc(errorText(lang, 'consent'))}</p>` : ''}</div>
${errors.form ? `<p class="error error--form" role="alert">${icon('alert')} ${esc(errorText(lang, errors.form))}</p>` : ''}
<button class="btn btn--primary btn--lg" type="submit">${t(lang, 'contact_send')}</button>
</form>`}
${emergencyBox(lang)}
</div></div></section>`;
  return layout(ctx, {
    path: '/contact',
    title: isMr ? 'संपर्क | डॉ. अनघा देशपांडे, नेत्ररोगतज्ज्ञ, चेंबूर' : 'Contact Dr. Anagha Deshpande | Eye Specialist in Chembur, Mumbai',
    description: isMr ? 'एसआरव्ही हॉस्पिटल (8451800800) आणि जस्ट केअर हार्ट अँड आय क्लिनिक (8879758831) येथे संपर्क साधा.' : 'Contact Dr. Anagha Deshpande at SRV Hospital (8451800800) or Just Care Heart & Eye Clinic (8879758831), Chembur.',
    body, noindex: !!sent
  });
}

function legal(ctx, key) {
  const { lang } = ctx;
  const p = pages[key];
  const path = key === 'privacy' ? '/privacy-policy' : '/medical-disclaimer';
  const body = `${pageHead(ctx, esc(L(lang, p.title)), p.updated ? (lang === 'mr' ? 'शेवटचा बदल: ' : 'Last updated: ') + esc(fmtDate(lang, p.updated)) : '', esc(L(lang, p.title)))}
<section class="section"><div class="wrap narrow prose">${richBlocks(lang, p.body)}</div></section>`;
  return layout(ctx, { path, title: L(lang, p.title) + (lang === 'mr' ? ' | डॉ. अनघा देशपांडे' : ' | Dr. Anagha Deshpande'), description: L(lang, p.description), body });
}

function notFound(ctx) {
  const { lang } = ctx;
  const body = `${pageHead(ctx, t(lang, 'not_found_title'), t(lang, 'not_found_text'))}<section class="section"><div class="wrap narrow"><a class="btn btn--primary" href="${url(lang, '/')}">${t(lang, 'back_home')}</a></div></section>`;
  return layout(ctx, { path: null, title: t(lang, 'not_found_title'), description: t(lang, 'not_found_text'), body, noindex: true });
}

module.exports = { ROUTES, staticReceived, home, about, cataract, services, faqs, articlesIndex, article, clinics, book, bookReceived, status, contact, legal, notFound, esc, url, waHref };
