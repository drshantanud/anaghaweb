'use strict';
// Small JSON file store. Each collection is one file in DATA_DIR.
// Writes are atomic (write to temp file, then rename) and serialised per file.
// Files holding patient data are encrypted with AES-256-GCM when
// DATA_ENCRYPTION_KEY is set (required in production, see server.js).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, '..', 'data'));
const SENSITIVE = new Set(['appointments', 'enquiries', 'audit']);

function key() {
  const raw = process.env.DATA_ENCRYPTION_KEY;
  if (!raw) return null;
  // Accept any string; derive a 32-byte key from it.
  return crypto.createHash('sha256').update(raw).digest();
}

function encrypt(obj) {
  const k = key();
  const json = JSON.stringify(obj, null, 2);
  if (!k) return json;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', k, iv);
  const data = Buffer.concat([c.update(json, 'utf8'), c.final()]);
  return JSON.stringify({ enc: 'aes-256-gcm', iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') });
}

function decrypt(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.enc !== 'aes-256-gcm') return parsed;
  const k = key();
  if (!k) throw new Error('Data file is encrypted but DATA_ENCRYPTION_KEY is not set');
  const d = crypto.createDecipheriv('aes-256-gcm', k, Buffer.from(parsed.iv, 'base64'));
  d.setAuthTag(Buffer.from(parsed.tag, 'base64'));
  const out = Buffer.concat([d.update(Buffer.from(parsed.data, 'base64')), d.final()]);
  return JSON.parse(out.toString('utf8'));
}

const cache = new Map();
const queues = new Map();

function file(name) { return path.join(DATA_DIR, name + '.json'); }

function ensureDir() { fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 }); }

const mtimes = new Map();
function mtime(name) { try { return fs.statSync(file(name)).mtimeMs; } catch { return 0; } }

function read(name, fallback) {
  // Re-read if another process (e.g. the create-user script) changed the file.
  if (cache.has(name) && mtimes.get(name) === mtime(name)) return cache.get(name);
  ensureDir();
  let value;
  try {
    value = decrypt(fs.readFileSync(file(name), 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    value = typeof fallback === 'function' ? fallback() : fallback;
  }
  cache.set(name, value);
  mtimes.set(name, mtime(name));
  return value;
}

function writeNow(name, value) {
  ensureDir();
  const text = SENSITIVE.has(name) ? encrypt(value) : JSON.stringify(value, null, 2);
  const tmp = file(name) + '.' + process.pid + '.' + Date.now() + '.tmp';
  fs.writeFileSync(tmp, text, { mode: 0o600 });
  fs.renameSync(tmp, file(name));
  mtimes.set(name, mtime(name));
}

// Run fn(currentValue) -> newValue under a per-collection lock, then persist.
// Everything inside fn is synchronous, so check-then-write (e.g. capacity
// checks for bookings) cannot interleave with another request.
function update(name, fallback, fn) {
  const prev = queues.get(name) || Promise.resolve();
  const next = prev.then(() => {
    const current = read(name, fallback);
    const result = fn(current);
    cache.set(name, current);
    writeNow(name, current);
    return result;
  });
  queues.set(name, next.catch(() => {}));
  return next;
}

function backup(keep = 14) {
  ensureDir();
  const dir = path.join(DATA_DIR, 'backups', new Date().toISOString().slice(0, 10));
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (f.endsWith('.json')) fs.copyFileSync(path.join(DATA_DIR, f), path.join(dir, f));
  }
  const uploads = path.join(DATA_DIR, 'uploads');
  if (fs.existsSync(uploads)) fs.cpSync(uploads, path.join(dir, 'uploads'), { recursive: true });
  const all = fs.readdirSync(path.join(DATA_DIR, 'backups')).sort();
  for (const old of all.slice(0, Math.max(0, all.length - keep))) {
    fs.rmSync(path.join(DATA_DIR, 'backups', old), { recursive: true, force: true });
  }
  return dir;
}

function resetCache() { cache.clear(); mtimes.clear(); }

module.exports = { read, update, backup, resetCache, DATA_DIR };
