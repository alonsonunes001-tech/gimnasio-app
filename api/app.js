const express = require('express');
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://genuine-scone-5a21d9.netlify.app'
  ] 
}));
app.use(express.json());

// Rutas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/socios', require('./src/routes/socios'));
app.use('/api/planes', require('./src/routes/planes'));
app.use('/api/clases', require('./src/routes/clases'));
app.use('/api/membresias', require('./src/routes/membresias'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Gimnasio funcionando ✅' });
});

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;