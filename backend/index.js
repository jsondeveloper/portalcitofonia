const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const extensionRoutes = require('./routes/extensions');
const { verifyToken } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/extensions', verifyToken, extensionRoutes);

app.listen(4000, () => {
  console.log('Servidor backend escuchando en http://localhost:4000');
});