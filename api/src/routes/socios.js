const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');
const auth = require('../middlewares/auth');
const { validarSocio } = require('../middlewares/validar');

router.get('/', auth, socioController.getAll);
router.post('/', auth, validarSocio, socioController.create);
router.put('/:id', auth, validarSocio, socioController.update);
router.delete('/:id', auth, socioController.remove);

module.exports = router;