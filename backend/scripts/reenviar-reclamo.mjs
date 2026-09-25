// ============================================================
// Reenvía los correos de un reclamo (interno RRHH + confirmación al cliente)
// leyendo el registro desde libro_reclamaciones. Usa el envío DIRECTO
// (sendEmail) con las credenciales dedicadas, para no depender de la cola
// del servidor.
//
//   node scripts/reenviar-reclamo.mjs 12556
// ============================================================
import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import { sendEmail } from '../src/utils/email.js';
import { env } from '../src/config/env.js';
import { buildInternalEmailHTML, buildClaimantEmailHTML } from '../src/routes/reclamaciones.routes.js';

const numero = parseInt(process.argv[2], 10);
if (!Number.isInteger(numero)) {
  console.error('Uso: node scripts/reenviar-reclamo.mjs <numero_reclamo>');
  process.exit(1);
}

const r = await prisma.libroReclamacion.findFirst({ where: { correlativoNumero: numero } });
if (!r) {
  console.error(`No existe el reclamo #${numero} en libro_reclamaciones.`);
  await prisma.$disconnect();
  process.exit(1);
}

// Fila del modelo → objeto `d` que esperan los builders del endpoint.
const fecha = r.createdAt.toLocaleDateString('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const d = {
  fecha,
  nombre: r.nombre,
  apellidos: r.apellidos,
  email: r.email,
  telefono: r.telefono || '',
  tipoDoc: r.tipoDoc || '',
  numDoc: r.numDoc || '',
  direccion: r.direccion || '',
  distrito: r.distrito || '',
  ciudad: r.ciudad || '',
  departamento: r.departamento || '',
  servicio: r.area || '',
  producto: r.producto || '',
  descripcionServicio: r.descripcionServicio || '',
  tienda: r.areaEntidadNombre || '',
  distribuidor: '',
  monto: r.monto || '',
  lugarCompra: r.lugarCompra || '',
  fechaCompra: r.fechaCompra || '',
  modelo: r.modelo || '',
  color: r.color || '',
  numeroMotor: r.numeroMotor || '',
  placa: r.placa || '',
  tipoQueja: r.tipo || '',
  detalle: r.detalle || '',
  pedido: r.pedido || '',
  observaciones: r.observaciones || '',
};

const reclamacionesAuth =
  env.RECLAMACIONES_SMTP_USER && env.RECLAMACIONES_SMTP_PASS
    ? { user: env.RECLAMACIONES_SMTP_USER, pass: env.RECLAMACIONES_SMTP_PASS }
    : undefined;

const pendientes = [
  {
    etiqueta: 'interno (RRHH)',
    to: env.RRHH_MAIL_TO,
    subject: `Nuevo Reclamo #${numero} — ${d.nombre} ${d.apellidos}`,
    html: buildInternalEmailHTML(numero, d),
  },
  {
    etiqueta: 'cliente',
    to: d.email,
    subject: `GreenLine — Reclamo registrado #${numero}`,
    html: buildClaimantEmailHTML(numero),
  },
];

let fallos = 0;
for (const p of pendientes) {
  try {
    await sendEmail({
      to: p.to,
      subject: p.subject,
      html: p.html,
      priority: 'high',
      auth: reclamacionesAuth,
      from: env.RECLAMACIONES_EMAIL_FROM || undefined,
      meta: { reclamo: `REC-${r.correlativoAnio}-${String(numero).padStart(4, '0')}`, reenvio: true },
    });
    console.log(`✅ ${p.etiqueta} → ${p.to}`);
    await prisma.emailLog.create({
      data: {
        destinatario: p.to,
        asunto: p.subject,
        estado: 'ENVIADO',
        meta: { reclamo: `REC-${r.correlativoAnio}-${String(numero).padStart(4, '0')}`, reenvio: true },
      },
    }).catch(() => {});
  } catch (err) {
    fallos++;
    console.error(`❌ ${p.etiqueta} → ${p.to}: ${err.message}`);
    await prisma.emailLog.create({
      data: {
        destinatario: p.to,
        asunto: p.subject,
        estado: 'ERROR',
        error: String(err.message).slice(0, 500),
        meta: { reclamo: `REC-${r.correlativoAnio}-${String(numero).padStart(4, '0')}`, reenvio: true },
      },
    }).catch(() => {});
  }
}

await prisma.$disconnect();
process.exit(fallos ? 1 : 0);
