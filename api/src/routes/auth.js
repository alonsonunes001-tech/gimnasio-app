const express = require('express');
const router = express.Router();
const { register, login, cambiarPassword } = require('../controllers/authController');
const { validarAuth } = require('../middlewares/validar');

router.post('/register', validarAuth, register);
router.post('/login', validarAuth, login);
router.post('/cambiar-password', cambiarPassword);

module.exports = router;