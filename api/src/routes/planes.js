const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middlewares/auth');

router.get('/', auth, planController.getAll);
router.post('/', auth, planController.create);
router.put('/:id', auth, planController.update);
router.delete('/:id', auth, planController.remove);

module.exports = router;