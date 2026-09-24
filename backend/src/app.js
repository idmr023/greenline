import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import Sentry from './instrument.js';
import logger from './utils/logger.js';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { metricsMiddleware, getMetrics, getPrometheusMetrics } from './middleware/metrics.js';
import { requestLogger } from './middleware/requestLogger.js';
import { originCheck } from './middleware/originCheck.js';
import { authMiddleware } from './middleware/auth.js';
import { requirePermission } from './middleware/rbac.js';
import { apiReference } from '@scalar/express-api-reference';
import { getOpenApiDocument } from './docs/openapi.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import stockRoutes from './routes/stock.routes.js';
import auditRoutes from './routes/audit.routes.js';
import contactRoutes from './routes/contact.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import blogRoutes from './routes/blog.routes.js';
import tiktokRoutes from './routes/tiktok.routes.js';
import reclamacionesRoutes from './routes/reclamaciones.routes.js';
import imagenesRoutes from './routes/imagenes.routes.js';
import marketingRoutes from './routes/marketing.routes.js';

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
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

// Request ID + access log (trazabilidad NIST 800-53 AU-2)
app.use(requestLogger);

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

// Anti-CSRF: valida el origen de peticiones que cambian estado
app.use(originCheck);

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

// Métricas en formato Prometheus text/plain (scraping por Grafana/ops)
app.get('/api/metrics/prometheus', authMiddleware, requirePermission('config:read'), (_req, res) => {
  res.type('text/plain; version=0.0.4').send(getPrometheusMetrics());
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
app.use('/api/reclamaciones', reclamacionesRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/marketing', marketingRoutes);

// Documentación API (solo superficie pública). Scalar UI necesita inline
// scripts, por eso se retira el CSP global solo en esta ruta.
app.get('/api/docs.json', (_req, res) => res.json(getOpenApiDocument()));
app.use('/api/docs', (_req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
}, apiReference({ spec: { url: '/api/docs.json' } }));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler global
app.use((err, req, res, _next) => {
  logger.error({ err, reqId: req.id, url: req.originalUrl }, 'error no capturado');
  if (process.env.SENTRY_DSN) Sentry.captureException(err);

  if (env.NODE_ENV === 'development') {
    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;