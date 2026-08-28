import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ACCESS_SECRET = env.JWT_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = env.JWT_EXPIRY;
const REFRESH_EXPIRY = env.JWT_REFRESH_EXPIRY;

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

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export function decodeToken(token) {
  return jwt.decode(token);
}
