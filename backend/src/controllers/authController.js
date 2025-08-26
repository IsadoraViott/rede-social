// registro e login, retornando token JWT e dados básicos do usuário
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'Dados obrigatórios' });
  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE email=? OR username=?', [email, username]);
    if (exists.length) return res.status(409).json({ message: 'Usuário já existe' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
    return res.status(201).json({ message: 'Registrado com sucesso' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao registrar' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT id, password, username, profile_picture_url FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Credenciais inválidas' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, username: user.username, profile_picture_url: user.profile_picture_url } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao logar' });
  }
};
