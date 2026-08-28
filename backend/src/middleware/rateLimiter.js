import {rateLimit, ipKeyGenerator} from 'express-rate-limit';
import { env } from '../config/env.js';

// Rate limiter global
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
});

// Rate limiter para login (5 intentos / 15 min)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de login',
    message: 'Tu cuenta ha sido bloqueada temporalmente por 15 minutos',
  },
  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip) + ':' + (req.body?.email || 'unknown');
  },
});

// Rate limiter para OTP (3 intentos / 5 min)
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: env.OTP_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de código OTP',
    message: 'Espera 5 minutos antes de solicitar otro código',
  },
});

// Rate limiter para registro
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Demasiados registros desde esta IP' },
});

// Rate limiter para mensajes de contacto (5 / hora)
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados mensajes desde esta IP, intenta más tarde' },
});
