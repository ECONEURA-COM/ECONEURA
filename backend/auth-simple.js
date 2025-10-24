const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'econeura-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Registrar nuevo usuario
 */
async function register(email, password, name) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await db.createUser(email, passwordHash, name);

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Login usuario
 */
async function login(email, password) {
  try {
    // Buscar usuario
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Verificar token JWT
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Middleware de autenticación
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = {
  register,
  login,
  verifyToken,
  authMiddleware
};
