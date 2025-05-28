require('dotenv').config();
module.exports = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  privateKey: require('fs').readFileSync(process.env.SSH_KEY_PATH)
};
