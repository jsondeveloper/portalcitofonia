// testSSH.js
const { Client } = require('ssh2');
const sshConfig = require('../config/ssh');

const conn = new Client();
conn.on('ready', () => {
  console.log('✅ Conexión SSH exitosa');
  conn.end();
});
conn.on('error', (err) => {
  console.error('❌ Error en la conexión SSH:', err.message);
});
conn.connect(sshConfig);
