const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const confPath = path.join(__dirname, '../routes/extensions.js');
const backupDir = path.join(__dirname, '../../conf/backups');

function parseConfFile() {
  const lines = fs.readFileSync(confPath, 'utf-8').split('\n');
  let context = '';
  const data = [];

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('[')) {
      context = line.replace(/\[|\]/g, '');
    } else if (line.startsWith('exten')) {
      const match = /exten\s*=>\s*(\d+),(\w+),dial\(sip\/comunitel\/(\d+),\d+,(A\([^)]+\))\)/i.exec(line);
      if (match) {
        const [, ext, prio, number, opt] = match;
        data.push([ext, prio, number, opt, context]);
      }
    }
  }
  return data;
}

async function writeConfFile() {
  const [rows] = await db.query('SELECT * FROM extensions ORDER BY context, extension_number, priority');
  const grouped = {};

  for (let row of rows) {
    const ctx = row.context;
    if (!grouped[ctx]) grouped[ctx] = [];
    grouped[ctx].push(`exten => ${row.extension_number},${row.priority},dial(sip/comunitel/${row.destination_number},25,${row.options})`);
  }

  const content = Object.entries(grouped).map(
    ([ctx, lines]) => `[${ctx}]\n${lines.join('\n')}`
  ).join('\n\n');

  fs.writeFileSync(confPath, content, 'utf-8');
}

async function backupConf() {
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
  const backupPath = path.join(backupDir, `extensions-${date}.conf`);
  fs.copyFileSync(confPath, backupPath);
}

async function syncFromFile() {
  const parsed = parseConfFile();
  await db.execute('DELETE FROM extensions');
  if (parsed.length > 0) {
    await db.query(
      'INSERT INTO extensions (extension_number, priority, destination_number, options, context) VALUES ?',
      [parsed]
    );
  }
}

module.exports = { parseConfFile, writeConfFile, backupConf, syncFromFile };
