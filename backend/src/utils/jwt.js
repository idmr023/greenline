import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ACCESS_SECRET = env.JWT_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const TEMP_SECRET = env.JWT_TEMP_SECRET;
const ACCESS_EXPIRY = env.JWT_EXPIRY;
const REFRESH_EXPIRY = env.JWT_REFRESH_EXPIRY;
/** Los tokens temporales expiran en pocos minutos (challenge de puerta/2FA). */
const TEMP_EXPIRY = '10m';

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      rol: user.rol,
      nivel: user.nivelAcceso,
      tienda: user.tiendaId || null,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
}

/**
 * Token temporal de challenge: NO concede acceso a la API. Solo sirve para
 * avanzar en el flujo multifactor (puerta staff → 2FA). Firmado con un
 * secreto separado (JWT_TEMP_SECRET) para que nunca sea válido como access.
 */
export function signTempToken(user, extra = {}) {
  return jwt.sign(
    { sub: user.id, type: 'temp', rol: user.rol, ...extra },
    TEMP_SECRET,
    { expiresIn: TEMP_EXPIRY }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export function verifyTempToken(token) {
  return jwt.verify(token, TEMP_SECRET);
}

export function decodeToken(token) {
  return jwt.decode(token);
}
