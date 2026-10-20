'use strict';
// Minimal HTTP helpers: body parsing, cookies, static files, security headers.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json'
};

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function cookie(name, value, { maxAge, secure, httpOnly = true, sameSite = 'Lax', path: p = '/' } = {}) {
  let c = `${name}=${encodeURIComponent(value)}; Path=${p}; SameSite=${sameSite}`;
  if (maxAge !== undefined) c += `; Max-Age=${maxAge}`;
  if (httpOnly) c += '; HttpOnly';
  if (secure) c += '; Secure';
  return c;
}

function readBody(req, limit = 100 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('Body too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      const type = String(req.headers['content-type'] || '');
      try {
        if (type.includes('application/json')) resolve(raw ? JSON.parse(raw) : {});
        else {
          const out = {};
          for (const [k, v] of new URLSearchParams(raw)) {
            if (k in out) out[k] = [].concat(out[k], v); else out[k] = v;
          }
          resolve(out);
        }
      } catch (e) { reject(Object.assign(new Error('Bad request body'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function securityHeaders(res, { nonce, https, analytics }) {
  const extra = analytics ? ' https://plausible.io' : '';
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'", `script-src 'self' 'nonce-${nonce}'${extra}`, "style-src 'self'", "img-src 'self' data:",
    "font-src 'self'", "media-src 'self'", `connect-src 'self'${extra}`, "frame-ancestors 'none'", "base-uri 'self'",
    "form-action 'self'", "object-src 'none'"
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  if (https) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

function send(res, status, body, type = 'text/html; charset=utf-8', headers = {}) {
  res.writeHead(status, Object.assign({ 'Content-Type': type, 'Content-Length': Buffer.byteLength(body) }, headers));
  res.end(body);
}

function json(res, status, obj, headers = {}) {
  send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8', Object.assign({ 'Cache-Control': 'no-store' }, headers));
}

function redirect(res, location, status = 303, headers = {}) {
  res.writeHead(status, Object.assign({ Location: location, 'Content-Length': 0 }, headers));
  res.end();
}

// Serve a file under root, with Range support (needed for video on Safari).
function serveStatic(req, res, root, rel, { maxAge = 3600 } = {}) {
  const full = path.normalize(path.join(root, rel));
  if (!full.startsWith(path.resolve(root) + path.sep)) return false;
  let st;
  try { st = fs.statSync(full); } catch { return false; }
  if (!st.isFile()) return false;
  const type = MIME[path.extname(full).toLowerCase()] || 'application/octet-stream';
  const etag = '"' + st.size.toString(16) + '-' + Math.floor(st.mtimeMs).toString(16) + '"';
  const headers = { 'Content-Type': type, 'Cache-Control': `public, max-age=${maxAge}`, ETag: etag, 'Accept-Ranges': 'bytes' };
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); res.end(); return true; }
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    let start = range[1] ? parseInt(range[1], 10) : st.size - parseInt(range[2], 10);
    let end = range[1] && range[2] ? parseInt(range[2], 10) : st.size - 1;
    if (isNaN(start) || start < 0 || start >= st.size || end >= st.size || end < start) {
      res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); res.end(); return true;
    }
    res.writeHead(206, Object.assign(headers, { 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 }));
    if (req.method === 'HEAD') { res.end(); return true; }
    fs.createReadStream(full, { start, end }).pipe(res);
    return true;
  }
  res.writeHead(200, Object.assign(headers, { 'Content-Length': st.size }));
  if (req.method === 'HEAD') { res.end(); return true; }
  fs.createReadStream(full).pipe(res);
  return true;
}

function sign(value, secret) {
  return value + '.' + crypto.createHmac('sha256', secret).update(value).digest('base64url');
}
function unsign(signed, secret) {
  const i = String(signed || '').lastIndexOf('.');
  if (i < 0) return null;
  const value = signed.slice(0, i);
  const expected = sign(value, secret);
  const a = Buffer.from(expected), b = Buffer.from(signed);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? value : null;
}

// Simple fixed-window limiter, per key.
const buckets = new Map();
function limit(key, max, windowMs) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { n: 1, reset: now + windowMs }); return false; }
  b.n++;
  return b.n > max;
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k); }, 600000).unref();

module.exports = { parseCookies, cookie, readBody, securityHeaders, send, json, redirect, serveStatic, sign, unsign, limit, MIME };
