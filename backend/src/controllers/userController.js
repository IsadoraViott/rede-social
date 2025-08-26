// dados do usuário logado, atualizar perfil e listar favoritos
const pool = require('../../db');

exports.me = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id=?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.updateProfile = async (req, res) => {
  // aceita username + upload de foto ou remoção
  const { username } = req.body;
  let profileUrl = req.body.profile_picture_url || null;
  try {
    if (req.file && req.file.path) profileUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    if (req.body.remove_profile_picture === 'true') profileUrl = null;
    await pool.query('UPDATE users SET username=?, profile_picture_url=? WHERE id=?', [username, profileUrl, req.user.id]);
    res.json({ message: 'Perfil atualizado', profile_picture_url: profileUrl });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};

exports.favoritesByUser = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, u.username
      FROM favorites f
      JOIN posts p ON p.id = f.post_id
      JOIN users u ON u.id = p.user_id
      WHERE f.user_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro' }); }
};
