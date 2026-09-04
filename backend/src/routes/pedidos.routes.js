import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { pedidosLimiter } from '../middleware/rateLimiter.js';
import { enqueueEmail } from '../queue/email.queue.js';
import { env } from '../config/env.js';

const router = Router();

// ============================================================
// POST /api/pedidos — Notificación de pedido (público)
// Envía un correo HTML con el detalle de la compra a ORDERS_MAIL_TO
// ============================================================

const itemSchema = z.object({
  slug: z.string().trim().optional(),
  nombre: z.string().trim().min(1).max(300),
  color: z.string().trim().optional().nullable(),
  cantidad: z.number().int().positive(),
  precio_actual: z.number().nonnegative(),
  imagen: z.string().url().optional().nullable(),
});

const pedidoSchema = z.object({
  body: z.object({
    codigo: z.string().trim().min(3).max(40),
    cliente: z.object({
      nombre: z.string().trim().min(2).max(150),
      telefono: z.string().trim().min(6).max(30),
      email: z.string().email().optional().nullable(),
      direccion: z.string().trim().min(5).max(500),
      dni: z.string().trim().min(7).max(12),
    }),
    items: z.array(itemSchema).min(1),
    total: z.number().nonnegative(),
  }),
});

router.post('/', pedidosLimiter, validate(pedidoSchema), async (req, res) => {
  try {
    const { codigo, cliente, items, total } = req.validated.body;

    const html = generarEmailPedido({ codigo, cliente, items, total });

    // Encolar el email y responder al instante (no bloquear con SMTP).
    // Prioridad alta para que el equipo distinga pedidos de notificaciones.
    await enqueueEmail({
      to: env.ORDERS_MAIL_TO,
      subject: `Pedido ${codigo} — ${cliente.nombre}`,
      html,
      priority: 'high',
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error enviando notificación de pedido:', error);
    res.status(500).json({ error: 'No se pudo registrar el pedido. Intenta más tarde.' });
  }
});

function formatPrice(value) {
  return 'S/ ' + Number(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function generarEmailPedido({ codigo, cliente, items, total }) {
  const filas = items
    .map(
      (it) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">
            ${it.imagen ? `<img src="${escapeHtml(it.imagen)}" alt="${escapeHtml(it.nombre)}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;display:block;" />` : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;">
            ${escapeHtml(it.nombre)}${it.color ? ` <span style="color:#999;font-size:12px;">(${escapeHtml(it.color)})</span>` : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;text-align:center;">${it.cantidad}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;text-align:right;">${formatPrice(it.precio_actual)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;text-align:right;">${formatPrice(it.precio_actual * it.cantidad)}</td>
        </tr>
      `,
    )
    .join('');

  const camposCliente = [
    { etiqueta: 'Nombre del cliente', valor: cliente.nombre },
    { etiqueta: 'Dirección de facturación', valor: cliente.direccion },
    ...(cliente.email && String(cliente.email).trim()
      ? [{ etiqueta: 'Correo', valor: cliente.email }]
      : []),
    { etiqueta: 'Teléfono', valor: cliente.telefono },
    { etiqueta: 'DNI', valor: cliente.dni },
  ]
    .filter((campo) => campo.valor !== undefined && campo.valor !== null && String(campo.valor).trim() !== '')
    .map(
      (campo) => `
        <div class="campo"><div class="etiqueta">${escapeHtml(campo.etiqueta)}</div><div class="valor">${escapeHtml(campo.valor)}</div></div>
      `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 640px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #009000; padding: 28px 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; }
        .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 28px 30px; }
        h2 { margin: 0 0 16px; font-size: 16px; color: #111; }
        .section-title { margin-top: 26px; margin-bottom: 10px; font-size: 14px; font-weight: 700; color: #009000; text-transform: uppercase; letter-spacing: 0.5px; }
        .campo { margin-bottom: 12px; }
        .campo .etiqueta { font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .campo .valor { margin-top: 4px; font-size: 14px; color: #111; background: #f9f9f9; padding: 9px 12px; border-radius: 8px; white-space: pre-wrap; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th { text-align: left; padding: 10px 12px; background: #f3f3f3; font-size: 12px; text-transform: uppercase; color: #666; }
        td { font-size: 14px; }
        .total-row td { font-weight: 700; color: #009000; font-size: 16px; padding-top: 12px; }
        .total-label { text-align: right; }
        .total-value { text-align: right; }
        .footer { padding: 18px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nuevo pedido — GreenLine</h1>
          <p>Código de pedido: ${escapeHtml(codigo)}</p>
        </div>
        <div class="body">
          <div class="section-title">Datos del cliente</div>
          ${camposCliente}

          <div class="section-title">Detalle del pedido</div>
          <table>
            <thead>
              <tr>
                <th style="width:80px;"></th>
                <th>Producto</th>
                <th style="text-align:center;">Cant.</th>
                <th style="text-align:right;">P. unitario</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${filas}
              <tr class="total-row">
                <td colspan="4" class="total-label">Total</td>
                <td class="total-value">${formatPrice(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="footer">GreenLine © ${new Date().getFullYear()} — Movilidad Eléctrica</div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default router;
