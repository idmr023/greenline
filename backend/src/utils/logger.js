import pino from 'pino';

// Logger estructurado (JSON en producción, legible en desarrollo).
// Uso: logger.info({ reqId, numeroReclamo }, 'reclamo validado')
// Patrón: nunca console.log/error en src/ — siempre este logger.
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: { service: 'greenline-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
