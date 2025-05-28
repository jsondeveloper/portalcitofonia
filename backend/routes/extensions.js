const express = require('express');
const router = express.Router();
const { extensions } = require('../data/extensions');

router.get('/', (req, res) => {
  const role = req.user.role;
  const context = req.user.context;
  const filtered = role === 'admin' ? extensions : extensions.filter(e => e.context === context);
  res.json(filtered);
});

router.post('/', (req, res) => {
  const ext = req.body;
  extensions.push(ext);
  res.json({ message: 'Extension created', ext });
});

router.put('/:name', (req, res) => {
  const name = req.params.name;
  const index = extensions.findIndex(e => e.name === name);
  if (index === -1) return res.status(404).json({ message: 'Extension not found' });
  extensions[index] = req.body;
  res.json({ message: 'Extension updated' });
});

router.delete('/:name', (req, res) => {
  const name = req.params.name;
  const index = extensions.findIndex(e => e.name === name);
  if (index === -1) return res.status(404).json({ message: 'Extension not found' });
  extensions.splice(index, 1);
  res.json({ message: 'Extension deleted' });
});

module.exports = router;