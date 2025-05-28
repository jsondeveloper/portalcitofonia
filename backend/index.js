import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
  const user = rows[0];
  const token = jwt.sign({ id: user.id, role: user.role, context: user.context }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/api/sip_buddies', authenticateToken, async (req, res) => {
  const { role, context } = req.user;
  const [rows] = await db.query(role === 'admin' ? 'SELECT * FROM sip_buddies' : 'SELECT * FROM sip_buddies WHERE context = ?', [context]);
  res.json(rows);
});

app.post('/api/sip_buddies', authenticateToken, async (req, res) => {
  const { name, callerid, secret, context } = req.body;
  await db.query('INSERT INTO sip_buddies (name, callerid, secret, context) VALUES (?, ?, ?, ?)', [name, callerid, secret, context]);
  res.json({ message: 'Created' });
});

app.delete('/api/sip_buddies/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM sip_buddies WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

app.put('/api/sip_buddies/:id', authenticateToken, async (req, res) => {
  const { name, callerid, secret, context } = req.body;
  await db.query('UPDATE sip_buddies SET name = ?, callerid = ?, secret = ?, context = ? WHERE id = ?', [name, callerid, secret, context, req.params.id]);
  res.json({ message: 'Updated' });
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
