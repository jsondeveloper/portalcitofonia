require('dotenv').config();
const { syncFromFile } = require('../utils/confUtils');

async function init() {
  await syncFromFile();
  console.log('✅ Base de datos sincronizada desde extensions.conf');
  process.exit();
}

init();
