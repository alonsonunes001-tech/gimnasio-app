const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const auth = require('../middlewares/auth');
const { validarClase } = require('../middlewares/validar');

router.get('/', auth, claseController.getAll);
router.post('/', auth, validarClase, claseController.create);
router.put('/:id', auth, validarClase, claseController.update);
router.delete('/:id', auth, claseController.remove);
router.post('/:id/inscribir', auth, claseController.inscribir);

module.exports = router;