const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');
const auth = require('../middlewares/auth');

router.get('/', auth, socioController.getAll);
router.post('/', auth, socioController.create);
router.put('/:id', auth, socioController.update);
router.delete('/:id', auth, socioController.remove);

module.exports = router;