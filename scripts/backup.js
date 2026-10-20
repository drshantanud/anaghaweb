'use strict';
// Copy all data files and uploaded photos into data/backups/<date>/.
const store = require('../lib/store');
console.log('Backup written to ' + store.backup(Number(process.env.BACKUP_KEEP) || 14));
