const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// Rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/socios', require('./src/routes/socios'));
app.use('/api/planes', require('./src/routes/planes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Gimnasio funcionando ✅' });
});

module.exports = app;