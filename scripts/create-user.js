'use strict';
// Create a staff account from the command line.
// Usage: npm run create-admin            (interactive)
//        node scripts/create-user.js <username> <admin|staff> "<Full name>"   (password read from ADMIN_PASSWORD or prompt)
const readline = require('readline');
const auth = require('../lib/auth');

function ask(q, hidden) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = s => { if (s.includes(q)) rl.output.write(s); else rl.output.write('*'); };
    }
    rl.question(q, a => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
  });
}

(async () => {
  const [, , u, r, n] = process.argv;
  const username = u || await ask('Username: ');
  const role = r || (await ask('Role (admin/staff) [admin]: ')) || 'admin';
  const name = n || (await ask('Full name: ')) || username;
  const password = process.env.ADMIN_PASSWORD || await ask('Password (min 10 chars, letters and numbers): ', true);
  try {
    const user = await auth.createUser({ username, role, name, password });
    console.log(`Created ${user.role} account "${user.username}".`);
  } catch (e) { console.error('Error: ' + e.message); process.exit(1); }
})();
