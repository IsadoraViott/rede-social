// backend/src/routes/uploadRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../controllers/uploadController');

// endpoint genérico para upload avulso
router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Arquivo ausente' });
  return res.json({ url: `/${req.file.path.replace(/\\/g, '/')}` });
});

module.exports = router;
