// backend/src/routes/postRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../controllers/uploadController');
const ctrl = require('../controllers/postController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', auth, upload.single('image'), ctrl.create);
router.put('/:id', auth, upload.single('image'), ctrl.update);
router.delete('/:id', auth, ctrl.del);

router.post('/:id/like', auth, ctrl.like);
router.delete('/:id/like', auth, ctrl.unlike);
router.post('/:id/favorite', auth, ctrl.favorite);
router.delete('/:id/favorite', auth, ctrl.unfavorite);

module.exports = router;
