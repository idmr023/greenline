import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { metricsMiddleware, getMetrics } from './middleware/metrics.js';
import { authMiddleware } from './middleware/auth.js';
import { requirePermission } from './middleware/rbac.js';
import { initEmailWorker, closeEmailQueue } from './queue/email.queue.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import stockRoutes from './routes/stock.routes.js';
import auditRoutes from './routes/audit.routes.js';
import contactRoutes from './routes/contact.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import blogRoutes from './routes/blog.routes.js';
import tiktokRoutes from './routes/tiktok.routes.js';

const app = express();

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet - Headers de seguridad (OWASP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://*.supabase.co', 'https://*.googleapis.com'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://*.supabase.co'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

// GZIP Compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// Keep-Alive
app.use((_req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=100');
  next();
});

// CORS
app.use(cors(corsOptions));

// Trust proxy (para rate limiting detrás de Render/load balancer)
app.set('trust proxy', 1);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
app.use(globalLimiter);

// Contadores de métricas (RAM/heap/latencia) para monitoreo de carga
app.use(metricsMiddleware);

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Métricas en vivo (protegido por rol ADMIN/DESARROLLADOR_WEB)
app.get('/api/metrics', authMiddleware, requirePermission('config:read'), (_req, res) => {
  res.json(getMetrics());
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/tiktok-live', tiktokRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler global
app.use((err, req, res, _next) => {
  console.error('Error no capturado:', err);

  if (env.NODE_ENV === 'development') {
    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================================================
// START
// ============================================================

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

export default app;
