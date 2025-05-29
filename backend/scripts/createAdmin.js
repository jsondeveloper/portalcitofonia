require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const username = 'admin';
  const password = 'admin123'; // cámbialo luego
  const hash = bcrypt.hashSync(password, 10);

  const [exists] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  if (exists.length > 0) {
    console.log('⚠️ El usuario admin ya existe.');
    process.exit();
  }

  await db.execute(
  'INSERT INTO users (username, password_hash, context, role) VALUES (?, ?, ?, ?)',
  [username, hash, '', 'admin']
);


  console.log('✅ Usuario admin creado con éxito.');
  process.exit();
}

createAdmin();
