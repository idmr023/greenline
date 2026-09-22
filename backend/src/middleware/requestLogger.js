import crypto from 'node:crypto';
import logger from '../utils/logger.js';

// Asigna un request-id único y registra cada petición con su duración.
// El correlator de logs (auditoría para NIST/ISO 27001: lograr trazabilidad).
export function requestLogger(req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = process.hrtime();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const [s, ns] = process.hrtime(start);
    const ms = s * 1000 + ns / 1e6;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger[level](
      { reqId: requestId, method, url: originalUrl, status: res.statusCode, ms: +ms.toFixed(1) },
      'request',
    );
  });

  next();
}