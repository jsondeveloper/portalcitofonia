const { Client } = require('ssh2');
const sshConfig = require('../config/ssh');

/**
 * Lee un archivo remoto por SSH desde el servidor Asterisk
 * @param {string} filePath - Ruta del archivo remoto (por defecto extensions.conf)
 * @returns {Promise<string>} - Contenido del archivo
 */
function readRemoteFile(filePath = '/etc/asterisk/extensions.conf') {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(`cat "${filePath}"`, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }

        let data = '';
        let errorOutput = '';

        stream.on('data', chunk => {
          data += chunk.toString();
        });

        stream.stderr.on('data', chunk => {
          errorOutput += chunk.toString();
        });

        stream.on('close', (code, signal) => {
          conn.end();
          if (code === 0) {
            resolve(data);
          } else {
            reject(new Error(`SSH command exited with code ${code}, signal ${signal}, error: ${errorOutput}`));
          }
        });
      });
    });

    conn.on('error', reject);
    conn.connect(sshConfig);
  });
}
readRemoteFile()
  .then(data => {
    console.log('Contenido del archivo remoto:\n', data);
  })
  .catch(err => {
    console.error('Error al leer archivo remoto:', err.message);
  });

module.exports = { readRemoteFile };
