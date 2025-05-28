const { generateConfFileContent } = require('../services/generatorService');
const { Client } = require('ssh2');
const sshConfig = require('../config/ssh');
const fs = require('fs');
const tmp = require('tmp');

async function writeExtensionsConf(req, res) {
  const content = await generateConfFileContent();
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
  const remotePath = '/etc/asterisk/extensions.conf';
  const backupPath = `/etc/asterisk/extensions-backups/extensions-${timestamp}.conf`;

  // Guardar temporalmente el nuevo archivo local
  const tempFile = tmp.fileSync();
  fs.writeFileSync(tempFile.name, content);

  const conn = new Client();
  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) return res.status(500).json({ error: 'SFTP error' });

      // 1. Hacer backup
      sftp.rename(remotePath, backupPath, (err) => {
        if (err) return res.status(500).json({ error: 'No se pudo hacer el backup' });

        // 2. Subir nuevo archivo
        const writeStream = sftp.createWriteStream(remotePath, { mode: 0o644 });
        const readStream = fs.createReadStream(tempFile.name);

        readStream.pipe(writeStream);
        writeStream.on('close', () => {
          conn.end();
          res.json({ message: 'Archivo actualizado con éxito', backup: backupPath });
        });
      });
    });
  });

  conn.on('error', (err) => {
    res.status(500).json({ error: 'Conexión SSH fallida', detail: err.message });
  });

  conn.connect(sshConfig);
}

module.exports = { writeExtensionsConf };
