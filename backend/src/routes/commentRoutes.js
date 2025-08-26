// backend/src/routes/commentRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/commentController');

router.get('/post/:postId', ctrl.listByPost);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.del);

module.exports = router;
