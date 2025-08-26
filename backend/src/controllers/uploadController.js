// backend/src/controllers/uploadController.js
// configuração do multer para salvar imagens de perfil ou de posts
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // se vier ?type=post salva em post_images, senão profile_pictures
    const type = req.query.type === 'post' ? 'post_images' : 'profile_pictures';
    cb(null, path.join('uploads', type));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
module.exports = upload;
