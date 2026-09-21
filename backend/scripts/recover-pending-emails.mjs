import 'dotenv/config';
import pg from 'pg';
import { sendEmail } from '../src/utils/email.js';
import { trackPedidoEmail } from '../src/services/pedidos-email-track.service.js';
import { env } from '../src/config/env.js';

// ============================================================
// Recovery: reenvía emails de pedidos que nunca llegaron.
// ------------------------------------------------------------
// Busca pedidos con email_enviado = false y email_error IS NULL
// (nunca se intentaron) o con email_error != NULL (fallaron),
// y reintenta el envío. Designed para correr como cron en Render.
//
// Uso: node backend/scripts/recover-pending-emails.mjs [--dry-run]
//
// Seguridad: solo toma pedidos de las últimas 72 horas para no
// reenviar emails de pedidos muy antiguos accidentalmente.
// ============================================================

const MAX_AGE_HOURS = 72;
const BATCH_SIZE = 20;
const DRY_RUN = process.argv.includes('--dry-run');

function getClient() {
  const opts = { ssl: { rejectUnauthorized: false } };
  return new pg.Client({
    connectionString: process.env.DIRECT_URL,
    ...opts,
  });
}

function generarEmailPedido({ codigo, cliente, items, total }) {
  const itemRows = (items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee">${it.nombre || it.modelo || 'Producto'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${it.cantidad || 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">S/ ${Number(it.precio || it.precio_unitario || 0).toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f5f5f5">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
        <div style="background:#059669;padding:30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">GreenLine — Pedido Recibido</h1>
        </div>
        <div style="padding:30px">
          <h2 style="color:#333">Hola ${cliente?.nombre || ''},</h2>
          <p style="color:#555">Hemos recibido tu pedido <strong>${codigo}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#f9fafb">
                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #eee">Producto</th>
                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #eee">Cant.</th>
                <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #eee">Precio</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <p style="font-size:18px;text-align:right;color:#059669;font-weight:bold">Total: S/ ${Number(total || 0).toFixed(2)}</p>
          <p style="color:#999;font-size:12px;margin-top:30px;text-align:center">GreenLine © ${new Date().getFullYear()} — Movilidad Eléctrica</p>
        </div>
      </div>
    </body>
    </html>`;
}

async function main() {
  console.log(`[recover-pedidos] Buscando pedidos sin email enviado (últimas ${MAX_AGE_HOURS}h)...`);

  if (DRY_RUN) {
    console.log('═══ MODO DRY-RUN: no se enviará nada ═══\n');
  }

  const client = getClient();
  await client.connect();

  try {
    const { rows } = await client.query(
      `SELECT codigo, cliente, items, total, created_at, email_enviado, email_error
       FROM pedidos
       WHERE email_enviado IS NOT TRUE
         AND created_at > NOW() - INTERVAL '${MAX_AGE_HOURS} hours'
       ORDER BY created_at DESC
       LIMIT $1`,
      [BATCH_SIZE],
    );

    if (rows.length === 0) {
      console.log('[recover-pedidos] No hay pedidos pendientes. Todo bien.');
      return;
    }

    console.log(`[recover-pedidos] Encontrados ${rows.length} pedidos pendientes:`);

    let ok = 0;
    let fail = 0;

    for (const row of rows) {
      let cliente = {};
      let items = [];
      try { cliente = JSON.parse(row.cliente); } catch { /* noop */ }
      try { items = JSON.parse(row.items || '[]'); } catch { /* noop */ }

      const subject = `Pedido ${row.codigo} — ${cliente.nombre || 'Cliente'}`;
      const html = generarEmailPedido({
        codigo: row.codigo,
        cliente,
        items,
        total: Number(row.total),
      });

      console.log(`  ▶ ${row.codigo} — ${cliente.nombre || '?'} | error previo: ${row.email_error || 'ninguno'}`);

      if (DRY_RUN) {
        console.log(`    (simulado) ${html.length} chars de HTML`);
        ok++;
        continue;
      }

      try {
        await sendEmail({ to: env.ORDERS_MAIL_TO, subject, html, priority: 'high' });
        await trackPedidoEmail(row.codigo, { ok: true });
        console.log(`    ✅ enviado → ${env.ORDERS_MAIL_TO}`);
        ok++;
      } catch (err) {
        await trackPedidoEmail(row.codigo, { ok: false, error: err.message });
        console.error(`    ❌ ${err.message}`);
        fail++;
      }

      // Pausa entre envíos para no saturar Gmail
      await new Promise((r) => setTimeout(r, 1500));
    }

    console.log(`\n[recover-pedidos] Listo. Enviados: ${ok} | Fallidos: ${fail}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[recover-pedidos] Error fatal:', err);
  process.exit(1);
});
