const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Verifica si hay token y lo decodifica
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Verifica si el usuario tiene el rol requerido
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
