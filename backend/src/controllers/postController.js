// CRUD de posts, paginação, like/unlike, favorite/unfavorite
const pool = require('../../db');

exports.create = async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = req.body.image_url || null;
  try {
    if (req.file && req.file.path) imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)',
      [req.user.id, title, content, imageUrl]
    );
    res.status(201).json({ id: result.insertId, title, content, image_url: imageUrl });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.list = async (req, res) => {
  // paginação simples: ?page=1&limit=10
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const offset = (page - 1) * limit;
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.username FROM posts p JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM posts');
    res.json({ data: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.update = async (req, res) => {
  // só o dono do post pode editar
  const { id } = req.params;
  const { title, content } = req.body;
  let imageUrl = req.body.image_url || undefined;
  try {
    const [[owner]] = await pool.query('SELECT user_id FROM posts WHERE id=?', [id]);
    if (!owner) return res.status(404).json({ message: 'Não encontrado' });
    if (owner.user_id !== req.user.id) return res.status(403).json({ message: 'Proibido' });

    if (req.file && req.file.path) imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    if (req.body.remove_image === 'true') imageUrl = null;

    await pool.query('UPDATE posts SET title=?, content=?, image_url=? WHERE id=?',
      [title, content, imageUrl, id]);
    res.json({ message: 'Atualizado' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.del = async (req, res) => {
  // só o dono do post pode remover
  const { id } = req.params;
  try {
    const [[owner]] = await pool.query('SELECT user_id FROM posts WHERE id=?', [id]);
    if (!owner) return res.status(404).json({ message: 'Não encontrado' });
    if (owner.user_id !== req.user.id) return res.status(403).json({ message: 'Proibido' });
    await pool.query('DELETE FROM posts WHERE id=?', [id]);
    res.json({ message: 'Excluído' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.like = async (req, res) => {
  const { id } = req.params;
  try { await pool.query('INSERT IGNORE INTO likes (post_id, user_id) VALUES (?, ?)', [id, req.user.id]); res.json({ message: 'Curtido' }); }
  catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.unlike = async (req, res) => {
  const { id } = req.params;
  try { await pool.query('DELETE FROM likes WHERE post_id=? AND user_id=?', [id, req.user.id]); res.json({ message: 'Descurtido' }); }
  catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.favorite = async (req, res) => {
  const { id } = req.params;
  try { await pool.query('INSERT IGNORE INTO favorites (post_id, user_id) VALUES (?, ?)', [id, req.user.id]); res.json({ message: 'Favoritado' }); }
  catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.unfavorite = async (req, res) => {
  const { id } = req.params;
  try { await pool.query('DELETE FROM favorites WHERE post_id=? AND user_id=?', [id, req.user.id]); res.json({ message: 'Desfavoritado' }); }
  catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};
