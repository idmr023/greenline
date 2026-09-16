import 'dotenv/config';
import pg from 'pg';
import { generarEmailPedido } from '../src/routes/pedidos.routes.js';
import { sendEmail } from '../src/utils/email.js';
import { trackPedidoEmail } from '../src/services/pedidos-email-track.service.js';
import { env } from '../src/config/env.js';

const { Client } = pg;

// ============================================================
// Rescate selectivo de pedidos atorados (antes del fix de correos).
// Reenvía SOLO los códigos en esta lista a ORDERS_MAIL_TO, uno por
// uno, sin agregar fechas al asunto, y registra el estado en cada
// fila (email_enviado / email_error) igual que el worker real.
// Los códigos que ya tengan email_enviado = true se saltan (idempotente).
// Los códigos que no están en la lista NO se tocan.
// Uso: node backend/scripts/resend-pedidos.mjs [--dry-run]
// ============================================================

const CODIGOS = [
  'GL-VN6WGRTAW', // Jessica Pajuelo Soto
  'GL-VYPV5DQQG', // Walter Reyes
  'GL-VZE8F7G70', // Harold Salazar Guardia
  'GL-X1IRBMYUP', // Carlos Cavero Ruesta
  'GL-XU402A715', // Zhenrong Gao
  'GL-YJGH2YWY5', // Hdux rkfif (probable prueba)
  'GL-19Z0714K3', // Paloma Chiriboga
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getClient() {
  const opts = { ssl: { rejectUnauthorized: false } };
  for (const config of [
    { connectionString: process.env.DIRECT_URL },
    {
      host: 'db.nxcbtcexsakfenjfdarr.supabase.co',
      port: 5432,
      user: 'postgres',
      password: process.env.DB_PASSWORD || '539M*Q5Jkktn.#M',
      database: 'postgres',
    },
  ]) {
    try {
      const c = new Client({ ...opts, ...config, ssl: opts.ssl });
      await c.connect();
      return c;
    } catch (e) {
      console.warn(`Conexión falló (${config.host || 'DIRECT_URL'}): ${e.message}`);
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
}

const client = await getClient();
const { rows } = await client.query(
  'SELECT codigo, cliente::text AS c, items::text AS it, total, created_at, email_enviado FROM pedidos WHERE codigo = ANY($1) ORDER BY created_at ASC',
  [CODIGOS],
);

if (rows.length !== CODIGOS.length) {
  const encontrados = new Set(rows.map((r) => r.codigo));
  const faltantes = CODIGOS.filter((c) => !encontrados.has(c));
  console.error(`⚠ Códigos no encontrados en la BD: ${faltantes.join(', ')}`);
}

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) {
  console.log('═══ MODO DRY-RUN: no se enviará nada ═══\n');
}

const pendientes = rows.filter((o) => o.email_enviado !== true);
const yaEnviados = rows.filter((o) => o.email_enviado === true);
for (const o of yaEnviados) {
  console.log(`⏭ ${o.codigo} ya había sido enviado (email_enviado=true), se omite`);
}
console.log(`\nPendientes por enviar: ${pendientes.length}`);

let ok = 0;
let fail = 0;
for (const o of pendientes) {
  let cliente = {};
  let items = [];
  try { cliente = JSON.parse(o.c); } catch {}
  try { items = JSON.parse(o.it || '[]'); } catch {}

  const subject = `Pedido ${o.codigo} — ${cliente.nombre}`;
  const html = generarEmailPedido({
    codigo: o.codigo,
    cliente,
    items,
    total: Number(o.total),
  });

  console.log(`▶ ${o.codigo} — ${cliente.nombre} S/ ${o.total} | asunto: ${subject}`);
  if (DRY_RUN) {
    console.log(`  (simulado) ${html.length} chars de HTML`);
    continue;
  }
  try {
    await sendEmail({ to: env.ORDERS_MAIL_TO, subject, html, priority: 'high' });
    await trackPedidoEmail(o.codigo, { ok: true });
    console.log(`  ✅ enviado → ${env.ORDERS_MAIL_TO}`);
    ok += 1;
  } catch (err) {
    await trackPedidoEmail(o.codigo, { ok: false, error: err.message });
    console.error(`  ❌ ${err.message}`);
    fail += 1;
  }
  await sleep(1500);
}

await client.end();
console.log(`\n🏁 Enviados: ${ok} | Fallidos: ${fail}`);
process.exit(fail ? 1 : 0);