// Logger Estructurado con Winston
// Niveles: error, warn, info, debug
// Formato: timestamp + nivel + mensaje + metadata

const winston = require('winston');

// Detectar si estamos en Vercel (serverless - no filesystem)
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION;

// Transports base (siempre Console)
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
        let msg = `${timestamp} [${level}] ${message}`;

        if (metadata && Object.keys(metadata).length > 0) {
          msg += ` ${JSON.stringify(metadata)}`;
        }

        if (stack) {
          msg += `\n${stack}`;
        }

        return msg;
      })
    )
  })
];

// Solo añadir File transports si NO estamos en Vercel
if (!isVercel) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json()
  ),
  defaultMeta: { service: 'econeura-backend' },
  transports
});

// Wrapper para logs con contexto
const log = {
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, error = null, meta = {}) => {
    if (error instanceof Error) {
      logger.error(message, { ...meta, error: error.message, stack: error.stack });
    } else {
      logger.error(message, meta);
    }
  },
  debug: (message, meta = {}) => logger.debug(message, meta),

  // Logs específicos de negocio
  chat: (agentId, input, output, duration) => {
    logger.info('Chat request', {
      agentId,
      inputLength: input?.length || 0,
      outputLength: output?.length || 0,
      duration,
      timestamp: new Date().toISOString()
    });
  },

  finops: (cost, tokens, model) => {
    logger.info('FinOps', {
      cost,
      tokens,
      model,
      timestamp: new Date().toISOString()
    });
  },

  security: (event, ip, metadata = {}) => {
    logger.warn('Security event', {
      event,
      ip,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = log;
