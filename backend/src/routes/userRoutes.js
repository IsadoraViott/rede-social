// backend/src/routes/userRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../controllers/uploadController');
const ctrl = require('../controllers/userController');

router.get('/me', auth, ctrl.me);
router.put('/me', auth, upload.single('profile_picture'), ctrl.updateProfile);
router.get('/me/favorites', auth, ctrl.favoritesByUser);

module.exports = router;
