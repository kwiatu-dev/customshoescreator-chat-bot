import { logger } from '../utils/logger.js';

export const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    bodyLength: req.body ? JSON.stringify(req.body).length : 0
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
    });
  });

  next();
};
