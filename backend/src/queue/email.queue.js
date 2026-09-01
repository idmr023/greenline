import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';
import { sendEmail } from '../utils/email.js';

// ============================================================
// Cola de envío de emails
// ------------------------------------------------------------
// Objetivo: no bloquear el event loop ni los sockets HTTP con el
// SMTP (Gmail tarda ~300ms-2s por envío). Los endpoints de login
// (OTP), contacto y pedidos encolan el correo y responden al
// cliente de inmediato; un worker lo envía en segundo plano.
//
// - Si hay REDIS_URL -> BullMQ (cola durable + retries).
// - Si no (local/dev sin Redis) -> cola en memoria con procesador
//   en background, para no romper el flujo en desarrollo.
//
// Persistencia: en el plan free de Redis de Render la persistencia
// está desactivada (persistenceMode: 'off'). BullMQ sigue siendo
// útil porque desacopla el envío del request (el objetivo real de
// esta optimización) aunque en un reinicio puedan perderse los jobs
// pendientes; para el volumen de "pocos pedidos/día" es aceptable.
// ============================================================

// Fallback: cola en memoria con procesador en background.
let memoryQueue = [];
let memoryProcessing = false;

async function flushMemoryQueue() {
  if (memoryProcessing) return;
  memoryProcessing = true;
  while (memoryQueue.length > 0) {
    const job = memoryQueue.shift();
    try {
      await sendEmail(job);
    } catch (err) {
      console.error('[email-queue] error enviando email (memoria):', err);
    }
  }
  memoryProcessing = false;
}

function enqueueMemory(job) {
  memoryQueue.push(job);
  // Procesar sin bloquear: el envío ocurre en un microtask/macrotask
  // posterior, no dentro del handler del request actual.
  setImmediate(() => {
    flushMemoryQueue().catch(() => {});
  });
}

// Backend real: BullMQ.
let connection;
let queue;
let worker;

// Mientras Redis esté disponible, los emails van por BullMQ. Si la conexión
// falla (caída, hostname interno inaccesible, error de red...), conmutamos a
// la cola en memoria para no perder envíos y no spamear errores.
let redisAvailable = true;

function markRedisUnavailable(reason) {
  if (!redisAvailable) return;
  redisAvailable = false;
  console.error(
    `[email-queue] Redis no disponible (${reason}). Cambiando a cola en memoria: los emails se enviarán igual, pero sin persistencia entre reinicios.`,
  );
  // Cortar el ciclo de reintentos: cerrar worker y conexión (best-effort).
  // NOTA: no quitar el listener 'error' de la conexión; un error de DNS tardío
  // sin handler es "unhandled error event" y tumba el proceso. Mantenerlo
  // (ya es no-op aquí) absorbe cualquier error residual tras desconectar.
  try {
    if (worker) worker.close();
  } catch {
    /* noop */
  }
  try {
    if (connection) connection.disconnect();
  } catch {
    /* noop */
  }
}

function getConnection() {
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      // No reintentar indefinidamente: si el host no resuelve o cae, ioredis
      // emitiría 'error' cada segundo. Un único intento basta para conmutar.
      retryStrategy: () => null,
    });
    connection.on('error', (err) => {
      markRedisUnavailable(err.message);
    });
  }
  return connection;
}

function getQueue() {
  if (!queue) {
    queue = new Queue('greenline-emails', {
      connection: getConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    });
  }
  return queue;
}

export function initEmailWorker() {
  if (!env.REDIS_URL || worker) return;

  worker = new Worker(
    'greenline-emails',
    async (job) => {
      const { to, subject, html } = job.data;
      await sendEmail({ to, subject, html });
    },
    {
      connection: getConnection(),
      concurrency: 2,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(`[email-queue] job ${job?.id} falló tras intentos:`, err.message);
  });

  worker.on('error', (err) => {
    markRedisUnavailable(err.message);
  });
}

/**
 * Encola un email para envío en segundo plano.
 * @param {{to: string, subject: string, html: string}} payload
 */
export async function enqueueEmail(payload) {
  if (!env.REDIS_URL || !redisAvailable) {
    enqueueMemory(payload);
    return;
  }
  try {
    await getQueue().add('send', payload);
  } catch (err) {
    markRedisUnavailable(err.message);
    enqueueMemory(payload);
  }
}

/**
 * Cierre ordenado (para procesos/dev). Detiene worker y conexión.
 */
export async function closeEmailQueue() {
  try {
    if (worker) await worker.close();
  } catch {
    /* noop */
  }
  try {
    if (queue) await queue.close();
  } catch {
    /* noop */
  }
  try {
    if (connection && connection.status === 'ready') {
      await connection.quit();
    } else if (connection) {
      connection.disconnect();
    }
  } catch {
    /* noop */
  }
}
