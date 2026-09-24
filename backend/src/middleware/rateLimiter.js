import {rateLimit, ipKeyGenerator} from 'express-rate-limit';
import { env } from '../config/env.js';

// En tests desactivamos limiters (NODE_ENV=test): evita que la misma
// suite consuma la ventana 5/15min y se autobloquee. Producción no cambia.
const rateLimitImpl = env.NODE_ENV === 'test'
  ? () => (_req, _res, next) => next()
  : rateLimit;

// Rate limiter global
export const globalLimiter = rateLimitImpl({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
});

// Rate limiter para login (5 intentos / 15 min)
export const loginLimiter = rateLimitImpl({
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
export const otpLimiter = rateLimitImpl({
  windowMs: 5 * 60 * 1000,
  limit: env.OTP_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de código OTP',
    message: 'Espera 5 minutos antes de solicitar otro código',
  },
});

// Rate limiter para la puerta staff (5 intentos / 15 min por IP+email)
export const gateLimiter = rateLimitImpl({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos del código de acceso', message: 'Espera 15 minutos' },
  keyGenerator: (req) => {
    const sub = (() => {
      try {
        const payload = JSON.parse(Buffer.from(req.body?.tempToken?.split('.')[1] || '', 'base64').toString());
        return payload?.sub || 'unknown';
      } catch {
        return 'unknown';
      }
    })();
    return ipKeyGenerator(req.ip) + ':' + sub;
  },
});

// Rate limiter para 2FA TOTP (5 intentos / 5 min por IP): evita fuerza bruta de códigos de 6 dígitos
export const twoFALimiter = rateLimitImpl({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de 2FA', message: 'Espera 5 minutos' },
});

// Rate limiter para refresh de tokens (10 / 15 min por IP)
export const refreshLimiter = rateLimitImpl({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas renovaciones de sesión', message: 'Espera 15 minutos' },
});

// Rate limiter para solicitudes de restablecimiento de contraseña (5 / hora por IP):
// evita enumeración por email y abuso del envío de correos (email-bombing).
export const resetRequestLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes de restablecimiento', message: 'Espera 1 hora' },
  keyGenerator: (req) => ipKeyGenerator(req.ip) + ':' + (req.body?.email || 'unknown'),
});

// Rate limiter para confirmar el restablecimiento (5 intentos / 15 min por IP+email):
// evita fuerza bruta del código OTP de 6 dígitos.
export const resetConfirmLimiter = rateLimitImpl({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de restablecimiento', message: 'Espera 15 minutos' },
  keyGenerator: (req) => ipKeyGenerator(req.ip) + ':' + (req.body?.email || 'unknown'),
});

// Rate limiter para registro
export const registerLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Demasiados registros desde esta IP' },
});

// Rate limiter para mensajes de contacto (5 / hora por defecto)
export const contactLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados mensajes desde esta IP, intenta más tarde' },
});

// Rate limiter para pedidos (10 / hora por defecto)
export const pedidosLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: env.PEDIDOS_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos desde esta IP, intenta más tarde' },
});

// Rate limiter para reclamaciones (10 / hora): formulario público sensible,
// protege además contra el abuso del envío de correos (email-bombing).
export const reclamacionesLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados reclamos desde esta IP, intenta más tarde' },
});

// Rate limiter para unsubscribe de marketing (20 / hora por IP+email)
export const unsubscribeLimiter = rateLimitImpl({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes de baja, intenta más tarde' },
  keyGenerator: (req) => ipKeyGenerator(req.ip) + ':' + (req.body?.email || 'unknown'),
});
