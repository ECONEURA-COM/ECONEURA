const express = require('express');
const router = express.Router();

let startTime = Date.now();

// GET /api/health - Health check completo
router.get('/', async (req, res) => {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    service: 'econeura-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  };

  // Check Database
  if (process.env.DATABASE_URL) {
    try {
      const db = require('../db');
      await db.query('SELECT 1');
      checks.checks.database = { status: 'healthy', type: 'postgresql' };
    } catch (error) {
      checks.checks.database = { status: 'unhealthy', error: error.message };
      checks.status = 'degraded';
    }
  } else {
    checks.checks.database = { status: 'not_configured' };
  }

  // Check Redis
  if (process.env.REDIS_HOST) {
    try {
      // Redis check would go here if initialized
      checks.checks.redis = { status: 'configured', host: process.env.REDIS_HOST };
    } catch (error) {
      checks.checks.redis = { status: 'unhealthy', error: error.message };
    }
  } else {
    checks.checks.redis = { status: 'not_configured' };
  }

  // Check OpenAI
  checks.checks.openai = {
    status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
  };

  // Memory usage
  const memUsage = process.memoryUsage();
  checks.memory = {
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
  };

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(checks);
});

module.exports = router;
