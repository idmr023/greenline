// ============================================================
// Diagnóstico SMTP: valida el handshake (AUTH) de las dos cuentas que usa el
// backend — la global (pedidos/OTP/contacto) y la dedicada del Libro de
// Reclamaciones — sin enviar ningún correo.
//
//   node scripts/check-smtp.mjs
//
// Salida: OK/ERROR por cuenta con el código SMTP real (535, timeout, ...).
// ============================================================
import 'dotenv/config';
import { env } from '../src/config/env.js';
import { verifySmtp } from '../src/utils/email.js';

function mask(pass) {
  if (!pass) return '(vacía)';
  return `•••••• (${pass.length} chars)`;
}

console.log('SMTP_HOST:', env.SMTP_HOST, '| puerto:', env.SMTP_PORT);
console.log('— Cuenta global (pedidos/OTP/contacto)');
console.log('  user:', env.SMTP_USER || '(sin SMTP_USER)', '| pass:', mask(env.SMTP_PASS));

const globalRes = await verifySmtp();
console.log(globalRes.ok ? '  ✅ verify OK' : `  ❌ verify falló: ${globalRes.error}`);

const tieneDedicadas = env.RECLAMACIONES_SMTP_USER && env.RECLAMACIONES_SMTP_PASS;
console.log('— Cuenta dedicada (Libro de Reclamaciones)');
console.log('  user:', env.RECLAMACIONES_SMTP_USER || '(sin RECLAMACIONES_SMTP_USER)', '| pass:', mask(env.RECLAMACIONES_SMTP_PASS));

let dedRes = { ok: true };
if (tieneDedicadas) {
  dedRes = await verifySmtp({ user: env.RECLAMACIONES_SMTP_USER, pass: env.RECLAMACIONES_SMTP_PASS });
  console.log(dedRes.ok ? '  ✅ verify OK' : `  ❌ verify falló: ${dedRes.error}`);
} else {
  console.log('  ⚠️  No configuradas: reclamaciones usaría la cuenta global.');
}

process.exit(globalRes.ok && dedRes.ok ? 0 : 1);
