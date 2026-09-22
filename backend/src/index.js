import './instrument.js';
import { env } from './config/env.js';
import app from './app.js';
import logger from './utils/logger.js';
import { initEmailWorker, closeEmailQueue } from './queue/email.queue.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info({ port: PORT, env: env.NODE_ENV, frontend: env.FRONTEND_URL }, 'backend listo');
  initEmailWorker();
});

// Cierre ordenado de la cola de emails (Redis/BullMQ)
async function shutdown() {
  logger.info('Apagando servidor...');
  await closeEmailQueue();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);