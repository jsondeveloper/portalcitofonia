const { Client } = require('ssh2');
const sshConfig = require('../config/ssh');

function readRemoteFile(filePath = '/etc/asterisk/extensions.conf') {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(`cat ${filePath}`, (err, stream) => {
        if (err) return reject(err);

        let data = '';
        stream.on('data', chunk => data += chunk.toString());
        stream.on('close', () => {
          conn.end();
          resolve(data);
        });
      });
    });

    conn.on('error', reject);
    conn.connect(sshConfig);
  });
}

module.exports = { readRemoteFile };
