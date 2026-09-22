import * as Sentry from '@sentry/node';

// Inicializar ANTES de importar app.js (ver src/index.js).
// Sin SENTRY_DSN es no-op: cero costo y cero riesgo en local/CI.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
  });
}

export default Sentry;
