// servidor express com CORS, JSON, rotas e arquivos estáticos para imagens
const express = require('express');
const cors = require('cors');
const path = require('path');

// importa as rotas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();

// libera acesso cross-origin (frontend em outra porta/ip)
app.use(cors());

// body parser para JSON
app.use(express.json());

// serve arquivos de upload (fotos de perfil e imagens de posts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// registra as rotas com prefixo /api
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

// rota de saúde/sanity check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
