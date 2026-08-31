import { env } from './env.js';

const normalizeOrigin = (o) => (o ? o.replace(/\/+$/, '') : o);

export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      env.FRONTEND_URL,
      env.FRONTEND_URL_PROD,
      'http://localhost:5173',
      'http://localhost:3001',
    ]
      .filter(Boolean)
      .map(normalizeOrigin);

    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400,
};
