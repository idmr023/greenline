import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';
import { sendEmail } from '../utils/email.js';
import { trackPedidoEmail } from '../services/pedidos-email-track.service.js';
import prisma from '../config/prisma.js';

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

// Fallback: cola en memoria con reintentos.
let memoryQueue = [];
let memoryProcessing = false;
const MEMORY_MAX_RETRIES = 2;

async function flushMemoryQueue() {
  if (memoryProcessing) return;
  memoryProcessing = true;
  while (memoryQueue.length > 0) {
    const entry = memoryQueue.shift();
    try {
      await sendEmail(entry.job);
      await trackPedidoEmail(entry.job.meta?.codigo, { ok: true });
      await prisma.emailLog.create({
        data: {
          destinatario: entry.job.to,
          asunto: entry.job.subject,
          estado: 'ENVIADO',
          meta: entry.job.meta || {},
        },
      }).catch(() => {});
    } catch (err) {
      console.error(`[email-queue] error enviando email (memoria, intento ${entry.retries + 1}/${MEMORY_MAX_RETRIES + 1}):`, err.message);
      if (entry.retries < MEMORY_MAX_RETRIES) {
        memoryQueue.push({ job: entry.job, retries: entry.retries + 1 });
      } else {
        console.error('[email-queue] agotados reintentos en memoria, email perdido');
        await trackPedidoEmail(entry.job.meta?.codigo, { ok: false, error: err.message });
        await prisma.emailLog.create({
          data: {
            destinatario: entry.job.to,
            asunto: entry.job.subject,
            estado: 'ERROR',
            error: err.message,
            meta: entry.job.meta || {},
          },
        }).catch(() => {});
      }
    }
  }
  memoryProcessing = false;
}

function enqueueMemory(job) {
  memoryQueue.push({ job, retries: 0 });
  setImmediate(() => {
    flushMemoryQueue().catch(() => {});
  });
}

// Backend real: BullMQ.
let connection;
let queue;
let worker;

// Estado de Redis: 'available' | 'unavailable' | 'reconnecting'
let redisState = 'available';
let redisReconnectTimer = null;

const REDIS_RECONNECT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

function tryReconnectRedis() {
  if (redisState === 'available') return; // ya reconectó
  console.log('[email-queue] Intentando reconectar a Redis...');
  try {
    if (connection) connection.disconnect();
  } catch { /* noop */ }
  connection = null;
  worker = null;
  redisState = 'available';
  // La próxima llamada a getQueue()/initEmailWorker() creará conexión nueva
  console.log('[email-queue] Redis reconectado (o se reintentará en el próximo job)');
}

function markRedisUnavailable(reason) {
  if (redisState === 'unavailable') return;
  redisState = 'unavailable';
  console.error(
    `[email-queue] Redis no disponible (${reason}). Cola en memoria activa. Reconexión automática en ${REDIS_RECONNECT_INTERVAL_MS / 1000}s.`,
  );
  try {
    if (worker) worker.close();
  } catch { /* noop */ }
  try {
    if (connection) connection.disconnect();
  } catch { /* noop */ }

  // Programar reconexión automática
  if (redisReconnectTimer) clearTimeout(redisReconnectTimer);
  redisReconnectTimer = setTimeout(() => {
    redisReconnectTimer = null;
    tryReconnectRedis();
  }, REDIS_RECONNECT_INTERVAL_MS);
}

function getConnection() {
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 5) return null; // máx 5 reintentos, luego markRedisUnavailable
        return Math.min(times * 200, 2000);
      },
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
      const { to, subject, html, priority, auth, from, meta } = job.data;
      try {
        await sendEmail({ to, subject, html, priority, auth, from });
        await trackPedidoEmail(meta?.codigo, { ok: true });
        await prisma.emailLog.create({
          data: {
            destinatario: to,
            asunto: subject,
            estado: 'ENVIADO',
            meta: meta || {},
          },
        }).catch(() => {});
      } catch (err) {
        console.error(`[email-queue] job ${job?.id} falló entregando:`, err.message);
        await trackPedidoEmail(meta?.codigo, { ok: false, error: err.message });
        await prisma.emailLog.create({
          data: {
            destinatario: to,
            asunto: subject,
            estado: 'ERROR',
            error: err.message,
            meta: meta || {},
          },
        }).catch(() => {});
        throw err;
      }
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
 * @param {{to: string, subject: string, html: string, priority?: string, meta?: object}} payload
 *   `meta.codigo` (opcional) vincula el resultado del envío a la fila del pedido.
 */
export async function enqueueEmail(payload) {
  // Si Redis estuvo disponible pero falló, intentar reconectar antes de usar memoria
  if (redisState === 'unavailable') {
    tryReconnectRedis();
  }

  if (!env.REDIS_URL || redisState !== 'available') {
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
  if (redisReconnectTimer) {
    clearTimeout(redisReconnectTimer);
    redisReconnectTimer = null;
  }
  try {
    if (worker) await worker.close();
  } catch { /* noop */ }
  try {
    if (queue) await queue.close();
  } catch { /* noop */ }
  try {
    if (connection && connection.status === 'ready') {
      await connection.quit();
    } else if (connection) {
      connection.disconnect();
    }
  } catch { /* noop */ }
}
