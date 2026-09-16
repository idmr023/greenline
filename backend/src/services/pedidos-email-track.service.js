import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let adminClient = null;

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  return adminClient;
}

/**
 * Registra el resultado del envío del correo de notificación de un pedido.
 * La service role key salta las políticas RLS; el panel (cliente autenticado)
 * se apoya en estas columnas para alertar pedidos sin correo confirmado.
 */
export async function trackPedidoEmail(codigo, { ok, error } = {}) {
  if (!codigo) return;
  const sb = getSupabaseAdmin();
  if (!sb) return;

  const patch = ok
    ? { email_enviado: true, email_enviado_at: new Date().toISOString(), email_error: null }
    : { email_error: String(error || 'Error desconocido').slice(0, 500) };

  try {
    await sb.from('pedidos').update(patch).eq('codigo', codigo);
  } catch (err) {
    console.error('[pedidos-email] no se pudo registrar el estado del correo:', err.message);
  }
}