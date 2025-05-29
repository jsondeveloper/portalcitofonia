const fs = require('fs');
const os = require('os');
const path = require('path');

require('dotenv').config();
module.exports = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  privateKey: fs.readFileSync(path.join(os.homedir(), '.ssh', 'id_rsa'), 'utf8')
};
