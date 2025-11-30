import { logger } from '../utils/logger.js';

export const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  const originalSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers, 
    body: JSON.stringify(req.body),
    bodyLength: req.body ? JSON.stringify(req.body).length : 0
  });

  res.on('finish', () => {
    const duration = Date.now() - start;

    let safeResponse = responseBody;
    try {
        if (typeof responseBody === 'string') {
            safeResponse = JSON.parse(responseBody);
        }
    } catch (e) {
        
    }

    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      responseHeaders: res.getHeaders(), 
      response: safeResponse 
    });
  });

  next();
};