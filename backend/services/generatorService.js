const db = require('../config/db');

async function generateConfFileContent() {
  const [rows] = await db.query(`
    SELECT e.context, e.extension_number, n.priority, n.number, n.options
    FROM extensions e
    JOIN extension_numbers n ON e.id = n.extension_id
    ORDER BY e.context, e.extension_number, n.priority
  `);

  let content = '';
  let currentContext = '';

  for (const row of rows) {
    if (row.context !== currentContext) {
      currentContext = row.context;
      content += `\n[${currentContext}]\n`;
    }
    content += `exten => ${row.extension_number},${row.priority},dial(${row.number},${row.options})\n`;
  }

  return content.trim();
}

module.exports = { generateConfFileContent };
