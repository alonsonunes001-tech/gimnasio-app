const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');
const auth = require('../middlewares/auth');

router.get('/socio/:socioId', auth, membresiaController.getBySocio);
router.get('/verificar/:socioId', auth, membresiaController.verificarVigencia);
router.post('/', auth, membresiaController.create);

module.exports = router;