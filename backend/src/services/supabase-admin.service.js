import prisma from '../config/prisma.js';

// ============================================================
// Supabase Admin (GoTrue) — sincronización de cuentas del panel
// La SERVICE ROLE KEY solo vive en el servidor.
// ============================================================

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function goTrue(path, init = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

export async function isSupabaseAdminConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/**
 * Crea la cuenta de Supabase Auth del staff (si no existe) o la actualiza
 * con la misma contraseña que usa en el backend, manteniendo la cuota
 * unificada "una credencial para todo".
 */
export async function syncSupabaseAuthUser({ email, password }) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return { ok: false, error: 'Supabase Admin no configurado en el backend' };
  }

  const normalized = email.toLowerCase();

  const [existing] = await prisma.$queryRawUnsafe(
    'select id from auth.users where email = $1 limit 1',
    normalized,
  );

  if (existing) {
    const res = await goTrue(`/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify({ password, email_confirm: true }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.msg || body.error_description || `Error ${res.status}` };
    }
    return { ok: true };
  }

  const res = await goTrue('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: normalized, password, email_confirm: true }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.msg || body.error_description || `Error ${res.status}` };
  }
  return { ok: true };
}