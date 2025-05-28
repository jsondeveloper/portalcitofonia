const express = require('express');
const router = express.Router();

const { syncExtensionsConf } = require('../controllers/syncController');
router.post('/sync', syncExtensionsConf);


const { writeExtensionsConf } = require('../controllers/writeController');
router.post('/write', writeExtensionsConf);

module.exports = router;