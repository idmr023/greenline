import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { reclamacionesLimiter } from '../middleware/rateLimiter.js';
import { getNextClaimNumber, appendReclamo } from '../services/sheets.service.js';
import { enqueueEmail } from '../queue/email.queue.js';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';
import crypto from 'node:crypto';

const router = Router();

// ============================================================
// POST /api/reclamaciones — Libro de Reclamaciones (público)
// Escribe la fila en el Google Sheet del año actual y notifica por
// email al equipo interno (RRHH) y al consumidor.
// El número de reclamo se asigna SIEMPRE en el servidor.
// ============================================================

const reclamoSchema = z.object({
  body: z.object({
    fecha: z.string().trim().min(1),
    nombre: z.string().trim().min(1).max(120),
    apellidos: z.string().trim().min(1).max(120),
    email: z.string().email(),
    telefono: z.string().trim().max(30).optional().default(''),
    tipoDoc: z.string().trim().max(30).optional().default(''),
    numDoc: z.string().trim().max(20).optional().default(''),
    direccion: z.string().trim().max(200).optional().default(''),
    distrito: z.string().trim().max(100).optional().default(''),
    ciudad: z.string().trim().max(100).optional().default(''),
    departamento: z.string().trim().max(100).optional().default(''),
    servicio: z.string().trim().max(100).optional().default(''),
    producto: z.string().trim().max(200).optional().default(''),
    descripcionServicio: z.string().trim().max(7000).optional().default(''),
    tienda: z.string().trim().max(200).optional().default(''),
    distribuidor: z.string().trim().max(200).optional().default(''),
    monto: z.string().max(20).optional().default(''),
    lugarCompra: z.string().trim().max(200).optional().default(''),
    fechaCompra: z.string().max(20).optional().default(''),
    modelo: z.string().trim().max(100).optional().default(''),
    color: z.string().trim().max(50).optional().default(''),
    numeroMotor: z.string().trim().max(50).optional().default(''),
    placa: z.string().trim().max(20).optional().default(''),
    tipoQueja: z.string().trim().max(50).optional().default(''),
    detalle: z.string().trim().max(7000).optional().default(''),
    pedido: z.string().trim().max(500).optional().default(''),
    observaciones: z.string().trim().max(7000).optional().default(''),
    /** Honeypot: los bots llenan este campo oculto */
    empresa: z.string().optional(),
  }),
});

// ============================================================
// POST /api/reclamaciones/validate — Modo prueba (permanente, QA)
// Reutiliza el mismo schema/validación que el endpoint real, pero NUNCA
// escribe en el Sheet, en DB ni encola emails. Solo lee el siguiente número
// (getNextClaimNumber es lectura) y devuelve un preview. No quema número.
// ============================================================
router.post('/validate', reclamacionesLimiter, validate(reclamoSchema), async (req, res) => {
  try {
    const d = req.validated.body;

    // Honeypot: misma respuesta que el endpoint real para no delatar el modo prueba.
    if (d.empresa) {
      return res.status(200).json({ ok: true, valid: true, dryRun: true });
    }

    const numeroReclamoPreview = await getNextClaimNumber();
    const anio = new Date().getFullYear();

    res.status(200).json({
      ok: true,
      valid: true,
      dryRun: true,
      numeroReclamoPreview,
      correlativoPreview: `REC-${anio}-${String(numeroReclamoPreview).padStart(4, '0')}`,
    });
  } catch (error) {
    console.error('Error validando reclamo (dry-run):', error);
    res.status(500).json({ error: 'No se pudo validar el reclamo. Intenta más tarde.' });
  }
});

router.post('/', reclamacionesLimiter, validate(reclamoSchema), async (req, res) => {
  try {
    const d = req.validated.body;

    // Honeypot: responder 200 sin guardar ni enviar nada, para no alertar al bot.
    if (d.empresa) {
      return res.status(200).json({ ok: true });
    }

    // El número lo calcula el servidor leyendo el Sheet (ignora cualquier valor del cliente).
    const numeroReclamo = await getNextClaimNumber();

    // Escribir primero; si falla no se consume número ni se envían emails.
    await appendReclamo(buildReclamoRow(d, numeroReclamo));

    const anio = new Date().getFullYear();
    await prisma.libroReclamacion.create({
      data: {
        token: crypto.randomUUID(),
        correlativoAnio: anio,
        correlativoNumero: numeroReclamo,
        correlativo: `REC-${anio}-${String(numeroReclamo).padStart(4, '0')}`,
        estado: 'PENDIENTE',
        nombre: d.nombre,
        apellidos: d.apellidos,
        email: d.email,
        telefono: d.telefono || '',
        tipoDoc: d.tipoDoc || 'DNI',
        numDoc: d.numDoc || '',
        direccion: d.direccion || '',
        distrito: d.distrito || '',
        ciudad: d.ciudad || '',
        departamento: d.departamento || '',
        producto: d.producto || '',
        descripcionServicio: d.descripcionServicio || '',
        monto: d.monto || '',
        lugarCompra: d.lugarCompra || '',
        fechaCompra: d.fechaCompra || '',
        modelo: d.modelo || '',
        color: d.color || '',
        vin: '',
        numeroMotor: d.numeroMotor || '',
        placa: d.placa || '',
        tipo: d.tipoQueja || 'QUEJA',
        detalle: d.detalle || '',
        pedido: d.pedido || '',
        observaciones: d.observaciones || '',
        area: d.servicio || 'Atención al Cliente',
        areaDepartamento: d.departamento || '',
        areaDistrito: d.distrito || '',
        areaEntidadNombre: d.tienda || d.distribuidor || 'GreenLine',
      },
    }).catch((err) => console.error('Error guardando reclamo en DB:', err));

    // Credenciales/remitente dedicados del Libro de Reclamaciones (opcional).
    // Si no están configurados en .env, se usa el envío global (SMTP_USER/EMAIL_FROM).
    const reclamacionesAuth =
      env.RECLAMACIONES_SMTP_USER && env.RECLAMACIONES_SMTP_PASS
        ? { user: env.RECLAMACIONES_SMTP_USER, pass: env.RECLAMACIONES_SMTP_PASS }
        : undefined;
    const reclamacionesFrom = env.RECLAMACIONES_EMAIL_FROM || undefined;

    // Límite anti-spam: máximo 3 notificaciones por reclamo (RRHH + sede y/o
    // confirmación al consumidor), para no saturar la cuenta SMTP ni caer en spam.
    const MAX_EMAILS_POR_RECLAMO = 3;
    const emails = [
      // 1) Notificación interna (equipo RRHH) con todos los datos.
      {
        to: env.RRHH_MAIL_TO,
        subject: `Nuevo Reclamo #${numeroReclamo} — ${d.nombre} ${d.apellidos}`,
        html: buildInternalEmailHTML(numeroReclamo, d),
        priority: 'high',
        auth: reclamacionesAuth,
        from: reclamacionesFrom,
      },
      // 2) Confirmación al consumidor.
      {
        to: d.email,
        subject: `GreenLine — Reclamo registrado #${numeroReclamo}`,
        html: buildClaimantEmailHTML(numeroReclamo),
        auth: reclamacionesAuth,
        from: reclamacionesFrom,
      },
    ];

    for (const job of emails.slice(0, MAX_EMAILS_POR_RECLAMO)) {
      await enqueueEmail(job);
    }

    res.status(200).json({ ok: true, numeroReclamo });
  } catch (error) {
    console.error('Error guardando reclamo en Sheet:', error);
    res.status(500).json({ error: 'No se pudo guardar el reclamo. Intenta más tarde.' });
  }
});

// Mapeo del formulario a las columnas reales del Sheet (2026/2025: 14 columnas A–N).
// Combina campos: nombre+apellidos, producto+modelo+color y detalle+pedido+observaciones.
// Las columnas 10–13 (SEGUIMIENTO, ¿SE SOLUCIONÓ?, TIPO DE RECLAMO, RESPUESTA AL
// CLIENTE) las llena el equipo interno manualmente, se dejan vacías.
export function buildReclamoRow(d, numeroReclamo) {
  const cliente = [d.nombre, d.apellidos].filter(Boolean).join(' ').trim() || '';
  const producto = [d.producto, d.modelo, d.color].filter(Boolean).join(' ').trim() || '-';
  const area = [d.servicio, d.distrito, d.ciudad, d.departamento].filter(Boolean).join(' / ').trim() || '-';
  const motivo = [
    d.detalle,
    d.pedido ? `Pedido: ${d.pedido}` : '',
    d.observaciones ? `Observaciones: ${d.observaciones}` : '',
  ].filter(Boolean).join('\n');

  return [
    d.fecha,             // FECHA
    numeroReclamo,       // NÚMERO DE CASO
    cliente,             // NOMBRE DEL CLIENTE
    producto,            // PRODUCTO
    area,                // ÁREA
    motivo,              // MOTIVO DE RECLAMO
    'Web',               // POR DONDE SE CONTACTÓ
    d.tienda || d.distribuidor || '', // SEDE
    d.telefono,          // CO (teléfono de contacto)
    d.email,             // CORREO
    '',                  // SEGUIMIENTO
    '',                  // ¿SE SOLUCIONÓ?
    '',                  // TIPO DE RECLAMO
    '',                  // RESPUESTA AL CLIENTE
  ];
}

const CAMPO_LABELS = [
  ['Fecha', 'fecha'],
  ['N° de Reclamo', null],
  ['Nombre', 'nombre'],
  ['Apellidos', 'apellidos'],
  ['Correo electrónico', 'email'],
  ['Teléfono', 'telefono'],
  ['Tipo de documento', 'tipoDoc'],
  ['N° de documento', 'numDoc'],
  ['Dirección', 'direccion'],
  ['Distrito', 'distrito'],
  ['Ciudad', 'ciudad'],
  ['Departamento', 'departamento'],
  ['Tipo de servicio', 'servicio'],
  ['Producto', 'producto'],
  ['Descripción del bien/servicio', 'descripcionServicio'],
  ['Tienda', 'tienda'],
  ['Distribuidor', 'distribuidor'],
  ['Monto', 'monto'],
  ['Lugar de compra', 'lugarCompra'],
  ['Fecha de compra', 'fechaCompra'],
  ['Modelo', 'modelo'],
  ['Color', 'color'],
  ['N° de motor', 'numeroMotor'],
  ['Placa', 'placa'],
  ['Queja / Reclamo', 'tipoQueja'],
  ['Detalle', 'detalle'],
  ['Pedido', 'pedido'],
  ['Observaciones', 'observaciones'],
];

function buildInternalEmailHTML(numeroReclamo, d) {
  const campos = CAMPO_LABELS.map(([label, key]) => {
    const valor = key ? d[key] : numeroReclamo;
    if (valor === '' || valor == null) return '';
    return `
      <div class="campo">
        <div class="etiqueta">${label}</div>
        <div class="valor">${escapeHtml(valor)}</div>
      </div>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #009000; padding: 24px 30px; }
        .header h1 { color: white; margin: 0; font-size: 20px; }
        .body { padding: 30px; }
        .campo { margin-bottom: 16px; }
        .campo .etiqueta { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .campo .valor { margin-top: 4px; font-size: 14px; color: #111; background: #f9f9f9; padding: 10px 12px; border-radius: 8px; white-space: pre-wrap; }
        .footer { padding: 16px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Reclamación N° ${numeroReclamo}</h1></div>
        <div class="body">${campos}</div>
        <div class="footer">GreenLine © ${new Date().getFullYear()} — Movilidad Eléctrica</div>
      </div>
    </body>
    </html>
  `;
}

function saludoPeru() {
  const hora = parseInt(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: false, timeZone: 'America/Lima' }),
    10,
  );
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function buildClaimantEmailHTML(numeroReclamo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #009000; padding: 24px 30px; }
        .header h1 { color: white; margin: 0; font-size: 20px; }
        .body { padding: 30px; }
        .numero { text-align: center; font-size: 22px; font-weight: bold; color: #009000; margin-bottom: 24px; }
        .mensaje { font-size: 15px; color: #111; line-height: 1.7; }
        .footer { padding: 16px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>GreenLine — Libro de Reclamaciones</h1></div>
        <div class="body">
          <div class="numero">Número de reclamo: #${numeroReclamo}</div>
          <div class="mensaje">
            ${saludoPeru()},
            <br><br>
            Su reclamo ha sido registrado con éxito y en máximo 15 días hábiles nos
            estaremos comunicando con usted para resolver su caso.
            <br><br>
            ¡Muchas gracias por su tiempo!
          </div>
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