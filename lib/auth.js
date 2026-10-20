'use strict';
// Staff accounts, password hashing (scrypt), sessions and CSRF tokens.
// Roles: "admin" (everything) and "staff" (appointments and enquiries only).

const crypto = require('crypto');
const store = require('./store');

const SESSION_HOURS = 8;
const sessions = new Map();     // sid -> { userId, csrf, expires }
const attempts = new Map();     // key -> { count, until }

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return 'scrypt$' + salt.toString('base64') + '$' + hash.toString('base64');
}

function verifyPassword(pw, stored) {
  const [alg, s, h] = String(stored || '').split('$');
  if (alg !== 'scrypt') return false;
  const expected = Buffer.from(h, 'base64');
  const got = crypto.scryptSync(String(pw), Buffer.from(s, 'base64'), expected.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(expected, got);
}

function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Password must be at least 10 characters.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Password must contain letters and numbers.';
  return null;
}

const users = () => store.read('users', []);

function findUser(username) {
  return users().find(u => u.username.toLowerCase() === String(username || '').toLowerCase().trim());
}

async function createUser({ username, name, role, password }) {
  if (!/^[a-z0-9._-]{3,32}$/i.test(username || '')) throw new Error('Username must be 3–32 letters, numbers, dots, dashes or underscores.');
  if (!['admin', 'staff'].includes(role)) throw new Error('Role must be admin or staff.');
  const p = passwordProblem(password);
  if (p) throw new Error(p);
  return store.update('users', [], list => {
    if (list.some(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error('That username already exists.');
    const u = { id: crypto.randomUUID(), username, name: name || username, role, hash: hashPassword(password), active: true, created: new Date().toISOString() };
    list.push(u);
    return u;
  });
}

function rateLimited(key, max = 5, windowMin = 15) {
  const a = attempts.get(key);
  if (a && a.until > Date.now() && a.count >= max) return true;
  return false;
}
function recordFailure(key, windowMin = 15) {
  const a = attempts.get(key);
  if (!a || a.until < Date.now()) attempts.set(key, { count: 1, until: Date.now() + windowMin * 60000 });
  else a.count++;
}
function clearFailures(key) { attempts.delete(key); }

function login(username, password, ip) {
  const key = 'login:' + ip;
  const ukey = 'user:' + String(username).toLowerCase();
  if (rateLimited(key, 10) || rateLimited(ukey, 5)) return { error: 'Too many attempts. Please wait 15 minutes.' };
  const u = findUser(username);
  // Always run a hash comparison so timing does not reveal valid usernames.
  const ok = u && u.active ? verifyPassword(password, u.hash) : (verifyPassword(password, hashPassword('dummy-password-1')), false);
  if (!ok) { recordFailure(key); recordFailure(ukey); return { error: 'Incorrect username or password.' }; }
  clearFailures(key); clearFailures(ukey);
  const sid = crypto.randomBytes(32).toString('base64url');
  sessions.set(sid, { userId: u.id, csrf: crypto.randomBytes(24).toString('base64url'), expires: Date.now() + SESSION_HOURS * 3600000 });
  return { sid, user: u };
}

function getSession(sid) {
  if (!sid) return null;
  const s = sessions.get(sid);
  if (!s || s.expires < Date.now()) { sessions.delete(sid); return null; }
  const u = users().find(x => x.id === s.userId && x.active);
  if (!u) { sessions.delete(sid); return null; }
  return { sid, csrf: s.csrf, user: u };
}

function logout(sid) { sessions.delete(sid); }

function logoutUser(userId) {
  for (const [sid, s] of sessions) if (s.userId === userId) sessions.delete(sid);
}

function checkCsrf(session, token) {
  if (!session || typeof token !== 'string') return false;
  const a = Buffer.from(session.csrf), b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const can = (user, perm) => user && (user.role === 'admin' || ['appointments', 'enquiries'].includes(perm));

module.exports = { hashPassword, verifyPassword, passwordProblem, createUser, findUser, users, login, getSession, logout, logoutUser, checkCsrf, can, rateLimited, recordFailure };
