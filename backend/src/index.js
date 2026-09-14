import { env } from './config/env.js';
import app from './app.js';
import { initEmailWorker, closeEmailQueue } from './queue/email.queue.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🟢 GreenLine Backend corriendo en puerto ${PORT}`);
  console.log(`   Entorno: ${env.NODE_ENV}`);
  console.log(`   Frontend: ${env.FRONTEND_URL}`);
  initEmailWorker();
});

// Cierre ordenado de la cola de emails (Redis/BullMQ)
async function shutdown() {
  console.log('Apagando servidor...');
  await closeEmailQueue();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);