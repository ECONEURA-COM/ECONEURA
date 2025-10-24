const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL error:', err);
});

// Users
async function createUser(email, passwordHash, name) {
  const result = await pool.query(
    'INSERT INTO users (email, password, name) VALUES (\$1, \$2, \$3) RETURNING *',
    [email, passwordHash, name]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = \$1', [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = \$1', [id]);
  return result.rows[0];
}

// Chats
async function createChat(userId, title, messages) {
  const result = await pool.query(
    'INSERT INTO chats (user_id, title, messages) VALUES (\$1, \$2, \$3) RETURNING *',
    [userId, title, JSON.stringify(messages)]
  );
  return result.rows[0];
}

async function getChats(userId, limit = 50) {
  const result = await pool.query(
    'SELECT * FROM chats WHERE user_id = \$1 ORDER BY created_at DESC LIMIT \$2',
    [userId, limit]
  );
  return result.rows;
}

async function getChat(chatId, userId) {
  const result = await pool.query(
    'SELECT * FROM chats WHERE id = \$1 AND user_id = \$2',
    [chatId, userId]
  );
  return result.rows[0];
}

async function updateChat(chatId, userId, messages) {
  const result = await pool.query(
    'UPDATE chats SET messages = \$1 WHERE id = \$2 AND user_id = \$3 RETURNING *',
    [JSON.stringify(messages), chatId, userId]
  );
  return result.rows[0];
}

async function deleteChat(chatId, userId) {
  await pool.query('DELETE FROM chats WHERE id = \$1 AND user_id = \$2', [chatId, userId]);
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  createUser,
  getUserByEmail,
  getUserById,
  createChat,
  getChats,
  getChat,
  updateChat,
  deleteChat
};
