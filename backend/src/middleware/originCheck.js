import { env } from '../config/env.js';

const normalizeOrigin = (o) => (o ? o.replace(/\/+$/, '') : o);

const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:4173',
];

function buildAllowlist() {
  return [env.FRONTEND_URL, env.FRONTEND_URL_PROD]
    .filter(Boolean)
    .map(normalizeOrigin)
    .concat(DEFAULT_ALLOWED);
}

function normalizeHost(origin) {
  try {
    return new URL(origin).host;
  } catch {
    return '';
  }
}

// ============================================================
// CSRF / Cross-Site Request Forgery (OWASP A1)
// ============================================================
// Defensa adicional sobre CORS: para métodos que cambian estado (POST/PUT/
// PATCH/DELETE), si el navegador envía cabecera Origin, debe coincidir con el
// allowlist. Sin Origin (curl, apps móviles, server-to-server) se permite:
// esos clientes no ejecutan ataques CSRF desde un navegador ajeno.
export function originCheck(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

  const origin = req.headers.origin;
  if (!origin) return next();

  const host = normalizeHost(origin);
  const allowedHosts = buildAllowlist().map((o) => {
    try {
      return new URL(o).host;
    } catch {
      return '';
    }
  });

  if (host && allowedHosts.includes(host)) return next();

  console.warn(`CSRF bloqueado: origen no permitido "${origin}" en ${req.method} ${req.originalUrl}`);
  return res.status(403).json({ error: 'Origen no autorizado' });
}