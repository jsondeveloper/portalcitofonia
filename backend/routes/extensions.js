const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');
const { parseConfFile, writeConfFile, backupConf } = require('../utils/confUtils');

router.get('/', auth, async (req, res) => {
  const { context, role } = req.user;
  const [rows] = await db.execute(
    role === 'admin' ? 
    'SELECT * FROM extensions' :
    'SELECT * FROM extensions WHERE context = ?', [context]
  );

  const grouped = {};
  for (let row of rows) {
    if (!grouped[row.extension_number]) {
      grouped[row.extension_number] = { extension_number: row.extension_number, numbers: [] };
    }
    grouped[row.extension_number].numbers.push({
      priority: row.priority,
      number: row.destination_number,
      options: row.options
    });
  }

  res.json(Object.values(grouped));
});

router.put('/', auth, async (req, res) => {
  const { extensions } = req.body;
  const { context, role } = req.user;

  await db.execute('DELETE FROM extensions WHERE context = ?', [context]);

  const values = [];
  for (const ext of extensions) {
    for (const number of ext.numbers) {
      values.push([ext.extension_number, number.priority, number.number, number.options, context]);
    }
  }

  if (values.length > 0) {
    await db.query(
      'INSERT INTO extensions (extension_number, priority, destination_number, options, context) VALUES ?',
      [values]
    );
  }

  res.sendStatus(200);
});

router.post('/write', auth, async (req, res) => {
  await backupConf();
  await writeConfFile();
  res.sendStatus(200);
});

module.exports = router;
