const { readRemoteFile } = require('../services/sshService');
const { parseExtensionsConf } = require('../services/parserService');
const db = require('../config/db');

async function syncExtensionsConf(req, res) {
  try {
    const raw = await readRemoteFile();
    const parsed = parseExtensionsConf(raw);

    // Limpiamos tablas previas
    await db.query('DELETE FROM extension_numbers');
    await db.query('DELETE FROM extensions');

    const extMap = new Map(); // context + extension

    for (const item of parsed) {
      const key = `${item.context}_${item.extension}`;
      if (!extMap.has(key)) {
        const [extRes] = await db.query(
          'INSERT INTO extensions (context, extension_number) VALUES (?, ?)',
          [item.context, item.extension]
        );
        extMap.set(key, extRes.insertId);
      }

      await db.query(
        'INSERT INTO extension_numbers (extension_id, priority, number, options) VALUES (?, ?, ?, ?)',
        [extMap.get(key), item.priority, item.number, item.options]
      );
    }

    res.json({ message: 'Sincronización completada', count: parsed.length });
  } catch (err) {
    console.error('Error en sincronización:', err);
    res.status(500).json({ error: 'Error al sincronizar el archivo .conf' });
  }
}

module.exports = { syncExtensionsConf };
