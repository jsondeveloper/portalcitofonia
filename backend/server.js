const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas API
app.use('/api/extensions', require('./routes/extensions'));
app.use('/api/users', require('./routes/users'));

app.listen(process.env.PORT || 4000, () => {
  console.log('Backend corriendo en puerto 4000');
});
