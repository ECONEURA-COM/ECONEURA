// backend/services/cache.service.js
const redis = require('redis');

let redisClient = null;

async function initRedis() {
  if (!process.env.REDIS_HOST) {
    console.log('⚠️  Redis no configurado (REDIS_HOST no definido)');
    return null;
  }

  try {
    redisClient = redis.createClient({
      url: 'redis://' + process.env.REDIS_HOST + ':6380',
      password: process.env.REDIS_KEY,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    });

    redisClient.on('error', (err) => console.error('Redis error:', err));
    redisClient.on('connect', () => console.log('✅ Redis connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return null;
  }
}

async function getCached(key, ttl = 300) {
  if (!redisClient) return null;
  
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function setCached(key, value, ttl = 300) {
  if (!redisClient) return false;
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

async function invalidateCache(pattern) {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Redis invalidate error:', error);
    return false;
  }
}

module.exports = {
  initRedis,
  getCached,
  setCached,
  invalidateCache
};
