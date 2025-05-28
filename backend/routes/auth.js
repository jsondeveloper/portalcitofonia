const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [
  { username: 'admin', password: 'admin123', role: 'admin', context: 'default' },
  { username: 'user1', password: 'user123', role: 'user', context: 'sales' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({
    username: user.username,
    role: user.role,
    context: user.context
  }, 'secret_key');

  res.json({ token });
});

module.exports = router;