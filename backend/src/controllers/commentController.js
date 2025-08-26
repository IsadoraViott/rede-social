// CRUD de comentários com checagem de dono para editar/excluir
const pool = require('../../db');

exports.create = async (req, res) => {
  const { post_id, content } = req.body;
  try {
    await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [post_id, req.user.id, content]);
    res.status(201).json({ message: 'Comentado' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.listByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id=?
      ORDER BY c.created_at ASC
    `, [postId]);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const [[owner]] = await pool.query('SELECT user_id FROM comments WHERE id=?', [id]);
    if (!owner) return res.status(404).json({ message: 'Não encontrado' });
    if (owner.user_id !== req.user.id) return res.status(403).json({ message: 'Proibido' });
    await pool.query('UPDATE comments SET content=? WHERE id=?', [content, id]);
    res.json({ message: 'Atualizado' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.del = async (req, res) => {
  const { id } = req.params;
  try {
    const [[owner]] = await pool.query('SELECT user_id FROM comments WHERE id=?', [id]);
    if (!owner) return res.status(404).json({ message: 'Não encontrado' });
    if (owner.user_id !== req.user.id) return res.status(403).json({ message: 'Proibido' });
    await pool.query('DELETE FROM comments WHERE id=?', [id]);
    res.json({ message: 'Excluído' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};
