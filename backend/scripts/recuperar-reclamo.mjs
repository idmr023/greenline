// ============================================================
// Recupera un reclamo desde el Google Sheet (origen de verdad) hacia la
// tabla libro_reclamaciones. Uso: fallas de persistencia (tabla ausente,
// errores de Prisma, etc.) donde la fila SÍ quedó en el Sheet pero no en BD.
//
//   node scripts/recuperar-reclamo.mjs 12556
//
// Idempotente: si el número ya existe en BD, no hace nada.
// ============================================================
import crypto from 'node:crypto';
import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import { getNextClaimNumber } from '../src/services/sheets.service.js';
import { google } from 'googleapis';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPREADSHEET_ID = '1BUpIZXG_l9xEUeHXP9JEnwPbZiNJtoEM74UbTAj3VPQ';

const numero = parseInt(process.argv[2], 10);
if (!Number.isInteger(numero)) {
  console.error('Uso: node scripts/recuperar-reclamo.mjs <numero_reclamo>');
  process.exit(1);
}

function loadCredentials() {
  if (process.env.SERVICE_ACCOUNT_JSON) return JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
  return JSON.parse(readFileSync(join(__dirname, '../service-account.json'), 'utf-8'));
}

async function findRow(numeroReclamo) {
  const auth = new google.auth.GoogleAuth({
    credentials: loadCredentials(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetName = String(new Date().getFullYear());
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:N`,
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex((r) => parseInt(r[1], 10) === numeroReclamo);
  if (idx === -1) return null;
  return { row: rows[idx], fila: idx + 1 };
}

const yaExiste = await prisma.libroReclamacion.findFirst({
  where: { correlativoNumero: numero },
  select: { id: true, correlativo: true },
});
if (yaExiste) {
  console.log(`Ya existe en BD: ${yaExiste.correlativo} (${yaExiste.id}) — nada que hacer.`);
  await prisma.$disconnect();
  process.exit(0);
}

const found = await findRow(numero);
if (!found) {
  console.error(`No se encontró el reclamo #${numero} en el Sheet.`);
  await prisma.$disconnect();
  process.exit(1);
}

const [, , cliente, producto, area, motivo, , sede, telefono, email] = found.row;
console.log(`Fila ${found.fila} del Sheet: ${cliente} | ${producto} | ${sede}`);

// Mismo mapeo que buildReclamoRow() en reclamaciones.routes.js (a la inversa).
const [servicio, distrito, ciudad, departamento] = (area || '')
  .split(' / ')
  .map((s) => s.trim());
const [nombre, ...resto] = (cliente || '').trim().split(/\s+/);
const apellidos = resto.join(' ') || '-';
const anio = new Date().getFullYear();

const creado = await prisma.libroReclamacion.create({
  data: {
    token: crypto.randomUUID(),
    correlativoAnio: anio,
    correlativoNumero: numero,
    correlativo: `REC-${anio}-${String(numero).padStart(4, '0')}`,
    estado: 'PENDIENTE',
    nombre: nombre || '',
    apellidos,
    email: email || '',
    telefono: telefono || '',
    tipoDoc: 'DNI',
    numDoc: '',
    direccion: '',
    distrito: distrito || '',
    ciudad: ciudad || '',
    departamento: departamento || '',
    producto: producto || '',
    descripcionServicio: '',
    monto: '',
    lugarCompra: '',
    fechaCompra: '',
    modelo: '',
    color: '',
    vin: '',
    numeroMotor: '',
    placa: '',
    tipo: 'QUEJA',
    detalle: motivo || '',
    pedido: '',
    observaciones: '',
    area: servicio || 'Atención al Cliente',
    areaDepartamento: departamento || '',
    areaDistrito: distrito || '',
    areaEntidadNombre: sede || 'GreenLine',
  },
});

console.log(`✅ Recuperado: ${creado.correlativo} (${creado.id}) — ${creado.nombre} ${creado.apellidos}`);

// Sanity: la lectura siguiente no debe romper y el correlativo del Sheet cuadra.
const siguiente = await getNextClaimNumber();
console.log(`Próximo número en Sheet: ${siguiente} (esperado > ${numero})`);

await prisma.$disconnect();
