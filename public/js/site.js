// Progressive enhancement only: every page and form works without this file.
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var lang = root.lang === 'mr' ? 'mr' : 'en';

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  // "Call" in the bottom bar: choose which clinic to call (numbers are never mixed)
  var sheet = document.getElementById('call-sheet');
  document.querySelectorAll('[data-call-sheet]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!sheet || typeof sheet.showModal !== 'function') return;
      e.preventDefault();
      sheet.showModal();
    });
  });
  if (sheet) {
    sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.hasAttribute('data-close')) sheet.close(); });
  }

  // FAQ: search, topic filter, open linked question
  var tools = document.querySelector('[data-faq-tools]');
  if (tools) {
    var input = document.getElementById('faq-search');
    var chips = tools.querySelectorAll('.chip');
    var sections = document.querySelectorAll('[data-cat-section]');
    var count = document.getElementById('faq-count');
    var empty = document.querySelector('.faq-empty');
    var current = (new URLSearchParams(location.search)).get('topic') || '';
    var norm = function (s) { return s.toLowerCase().normalize('NFC'); };
    var apply = function () {
      var q = norm(input.value.trim());
      var shown = 0;
      sections.forEach(function (sec) {
        var catOk = !current || sec.getAttribute('data-cat-section') === current;
        var any = false;
        sec.querySelectorAll('.faq').forEach(function (f) {
          var ok = catOk && (!q || norm(f.textContent).indexOf(q) !== -1);
          f.hidden = !ok;
          if (ok) { any = true; shown++; }
        });
        sec.hidden = !any;
      });
      count.textContent = count.getAttribute('data-template').replace('{n}', lang === 'mr' ? String(shown).replace(/[0-9]/g, function (d) { return '०१२३४५६७८९'[d]; }) : shown);
      empty.hidden = shown !== 0;
    };
    input.addEventListener('input', apply);
    chips.forEach(function (c) {
      c.addEventListener('click', function (e) {
        e.preventDefault();
        current = c.getAttribute('data-cat');
        chips.forEach(function (x) { x.setAttribute('aria-current', String(x === c)); });
        var u = new URL(location.href);
        if (current) u.searchParams.set('topic', current); else u.searchParams.delete('topic');
        history.replaceState(null, '', u);
        apply();
      });
    });
    var openHash = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      var el = id && document.getElementById(id);
      if (el && el.classList.contains('faq')) {
        if (el.hidden) { current = ''; input.value = ''; chips.forEach(function (x) { x.setAttribute('aria-current', String(x.getAttribute('data-cat') === '')); }); apply(); }
        el.open = true;
        el.scrollIntoView({ block: 'start' });
        el.querySelector('summary').focus({ preventScroll: true });
      }
    };
    window.addEventListener('hashchange', openHash);
    openHash();
  }

  // Booking form: live slot availability and friendly client-side checks.
  var form = document.querySelector('[data-booking-form]');
  if (form) {
    var dateEl = form.querySelector('#f-date');
    var timeEl = form.querySelector('#f-time');
    var status = form.querySelector('.slot-status');
    var clinic = form.getAttribute('data-clinic');
    var msgs = {
      en: { loading: 'Checking available times…', none: 'No times are available on this date. Please choose another date.', full: 'full', past: 'not available' },
      mr: { loading: 'उपलब्ध वेळा तपासत आहे…', none: 'या तारखेला वेळ उपलब्ध नाही. कृपया दुसरी तारीख निवडा.', full: 'पूर्ण', past: 'उपलब्ध नाही' }
    }[lang];
    var errText = {
      en: { date: 'This clinic does not hold OPD on this date. Please choose another date.', date_closed: 'This clinic does not hold OPD on this day. Please choose another date.', date_past: 'This date has passed. Please choose a future date.', date_far: 'Please choose an earlier date.', date_holiday: 'The clinic is closed on this date. Please choose another date.' },
      mr: { date: 'या तारखेला ओपीडी नाही. कृपया दुसरी तारीख निवडा.', date_closed: 'या दिवशी या क्लिनिकमध्ये ओपीडी नसते. कृपया दुसरी तारीख निवडा.', date_past: 'ही तारीख उलटून गेली आहे. कृपया पुढची तारीख निवडा.', date_far: 'कृपया जवळची तारीख निवडा.', date_holiday: 'या तारखेला क्लिनिक बंद आहे. कृपया दुसरी तारीख निवडा.' }
    }[lang];
    var labels = {};
    Array.prototype.forEach.call(timeEl.options, function (o) { labels[o.value] = o.textContent; });
    var showDateError = function (text) {
      var p = document.getElementById('f-date-err');
      p.hidden = !text;
      p.textContent = text || '';
      dateEl.setAttribute('aria-invalid', text ? 'true' : 'false');
    };
    var load = function () {
      if (!dateEl.value) return;
      status.textContent = msgs.loading;
      fetch('/api/availability?clinic=' + encodeURIComponent(clinic) + '&date=' + encodeURIComponent(dateEl.value), { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d.ok) {
            showDateError(errText[d.code] || errText.date);
            status.textContent = '';
            Array.prototype.forEach.call(timeEl.options, function (o) { if (o.value) o.disabled = true; });
            return;
          }
          showDateError('');
          var avail = 0;
          d.slots.forEach(function (s) {
            var o = timeEl.querySelector('option[value="' + s.time + '"]');
            if (!o) return;
            o.disabled = !s.available;
            o.textContent = labels[s.time] + (s.available ? '' : ' (' + (s.reason === 'full' ? msgs.full : msgs.past) + ')');
            if (s.available) avail++;
          });
          if (timeEl.selectedOptions[0] && timeEl.selectedOptions[0].disabled) timeEl.value = '';
          status.textContent = avail ? '' : msgs.none;
        })
        .catch(function () { status.textContent = ''; });
    };
    if (!form.hasAttribute('data-static')) {
      dateEl.addEventListener('change', load);
      if (dateEl.value) load();
    }

    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.querySelector('span').textContent = btn.getAttribute('data-sending');
      setTimeout(function () { btn.disabled = false; }, 8000);
    });
  }

  var summary = document.getElementById('error-summary');
  if (summary) { summary.scrollIntoView({ block: 'start' }); summary.focus({ preventScroll: true }); }
})();

// Static hosting (Netlify): no server, so check clinic rules in the browser
// and let Netlify Forms receive the request.
(function () {
  'use strict';
  var lang = document.documentElement.lang === 'mr' ? 'mr' : 'en';
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var todayIST = function () { var d = new Date(Date.now() + 330 * 60000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
  var setErr = function (form, id, msg) {
    var el = form.querySelector('#' + id), p = form.querySelector('#' + id + '-err');
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (p) { p.hidden = !msg; p.textContent = msg || ''; }
    return !msg;
  };
  var mobileOk = function (v) { v = v.replace(/[\s\-().]/g, '').replace(/^\+?91(?=\d{10}$)/, '').replace(/^0(?=\d{10}$)/, ''); return /^[6-9]\d{9}$/.test(v); };
  var nameOk = function (v) { return v.replace(/[^\p{L}]/gu, '').length >= 2; };

  var form = document.querySelector('form[data-static]');
  if (form) {
    var E = JSON.parse(form.getAttribute('data-errors'));
    var days = form.getAttribute('data-days').split(',').map(Number);
    var closures = JSON.parse(form.getAttribute('data-closures') || '[]');
    var max = form.getAttribute('data-max');
    var checkDate = function (v) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return E.date;
      if (v < todayIST()) return E.date_past;
      if (v > max) return E.date_far.replace('{days}', '');
      var dow = new Date(v + 'T00:00:00Z').getUTCDay();
      if (dow === 0 || days.indexOf(dow) === -1) return E.date_closed;
      for (var i = 0; i < closures.length; i++) if (v >= closures[i].from && v <= (closures[i].to || closures[i].from)) return E.date_holiday.replace('{note}', closures[i].note || '');
      return '';
    };
    var dateEl = form.querySelector('#f-date');
    dateEl.addEventListener('change', function () { setErr(form, 'f-date', checkDate(dateEl.value)); });
    form.addEventListener('submit', function (e) {
      var ok = true, first = null;
      var mark = function (id, msg) { if (!setErr(form, id, msg)) { ok = false; first = first || id; } };
      mark('f-name', nameOk(form.elements['name'].value) ? '' : E.name);
      mark('f-mobile', mobileOk(form.elements['mobile'].value) ? '' : E.mobile);
      mark('f-date', checkDate(dateEl.value));
      mark('f-time', form.elements['time'].value ? '' : E.time);
      mark('f-reason', form.elements['reason'].value ? '' : E.reason);
      mark('f-message', form.elements['message'].value.length > 500 ? E.message : '');
      mark('f-consent', form.elements['consent'].checked ? '' : E.consent);
      if (!ok) {
        e.preventDefault(); e.stopImmediatePropagation();
        var btn = form.querySelector('button[type=submit]'); btn.disabled = false;
        form.querySelector('#' + first).focus();
        return;
      }
      try {
        var opt = form.elements['time'].selectedOptions[0];
        sessionStorage.setItem('ad-request', JSON.stringify({ clinic: form.getAttribute('data-clinic-name'), date: dateEl.value, time: opt ? opt.textContent : '' }));
      } catch (err) {}
    }, true);
  }

  var contact = document.querySelector('form[data-static-contact]');
  if (contact) {
    var CE = JSON.parse(contact.getAttribute('data-errors'));
    contact.addEventListener('submit', function (e) {
      var ok = setErr(contact, 'c-name', nameOk(contact.elements['name'].value) ? '' : CE.name);
      ok = setErr(contact, 'c-mobile', mobileOk(contact.elements['mobile'].value) ? '' : CE.mobile) && ok;
      ok = setErr(contact, 'c-message', contact.elements['message'].value.trim() ? '' : CE.message) && ok;
      if (!contact.elements['consent'].checked) { ok = false; alert(CE.consent); }
      if (!ok) e.preventDefault();
    });
  }

  var rec = document.querySelector('[data-received]');
  if (rec) {
    try {
      var d = JSON.parse(sessionStorage.getItem('ad-request') || 'null');
      if (d) {
        var dt = new Date(d.date + 'T00:00:00Z');
        rec.querySelector('[data-k=clinic]').textContent = d.clinic;
        rec.querySelector('[data-k=when]').textContent = dt.toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) + ', ' + d.time;
        rec.hidden = false;
      }
    } catch (err) {}
  }
})();
