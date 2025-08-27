const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'; //Para uso con .env
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'; //Para uso con .env o 7 dias por default

//Registro de usuarios
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role: role === 'admin' ? 'admin' : 'client' 
    });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }, 
      token 
    });
  } catch (err) { next(err); }
};

//Login de usuarios
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) { next(err); }
};

//Listar todos los usuarios
exports.list = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id','name','email','role','createdAt'] });
    res.json(users);
  } catch (err) { next(err); }
};

//Actualizar un usuario
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ name, email, role });
    res.json({ message: 'User updated', user });
  } catch (err) { next(err); }
};

//Eliminar un usuario
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};
