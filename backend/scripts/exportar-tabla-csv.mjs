import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

// ============================================================
// Exporta una tabla (o una query opcional) de Supabase/Postgres
// a un archivo CSV local. Los datos NO salen de tu máquina.
//
// Uso:
//   node backend/scripts/exportar-tabla-csv.mjs <tabla>
//     [--columnas=id,email,nombre]   (por defecto: todas)
//     [--limite=1000]                (sin límite por defecto)
//     [--donde="estado = 'NUEVO'"]   (WHERE opcional, sin SELECT)
//     [--salida=ruta/salida.csv]     (por defecto: <tabla>.csv en cwd)
//
// Ejemplos:
//   node backend/scripts/exportar-tabla-csv.mjs tiendas
//   node backend/scripts/exportar-tabla-csv.mjs pedidos --columnas=codigo,created_at --limite=100
// ============================================================

const { Client } = pg;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

dotenv.config({ path: path.join(HERE, '..', '.env') });
dotenv.config({ path: path.join(ROOT, '.env') });

const IDENT_RE = /^[a-z_][a-z0-9_]*$/i;

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = v instanceof Date ? v.toISOString() : String(v);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function argValue(flag) {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : null;
}

function parseArgs() {
  const posicionales = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const tabla = posicionales[0] || null;
  const columnas = argValue('--columnas');
  const salida = argValue('--salida');
  const donde = argValue('--donde');
  const limiteRaw = argValue('--limite');
  const limite = limiteRaw !== null && limiteRaw !== '' ? Number(limiteRaw) : null;
  return { tabla, columnas, salida, donde, limite };
}

function mostrarUso() {
  console.log('Uso: node backend/scripts/exportar-tabla-csv.mjs <tabla> [--columnas=a,b] [--limite=N] [--donde="..."] [--salida=ruta.csv]');
  process.exit(1);
}

async function getClient() {
  const opts = { ssl: { rejectUnauthorized: false } };
  const candidatos = [];
  if (process.env.DIRECT_URL) candidatos.push({ connectionString: process.env.DIRECT_URL });
  if (process.env.DATABASE_URL) candidatos.push({ connectionString: process.env.DATABASE_URL });
  candidatos.push({
    host: 'db.nxcbtcexsakfenjfdarr.supabase.co',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  let ultimoError;
  for (const config of candidatos) {
    try {
      const c = new Client({ ...opts, ...config });
      await c.connect();
      return c;
    } catch (e) {
      ultimoError = e;
    }
  }
  throw new Error(`No se pudo conectar a la base de datos: ${ultimoError?.message || 'sin credenciales'}`);
}

async function main() {
  const { tabla, columnas, salida, donde, limite } = parseArgs();
  if (!tabla || !IDENT_RE.test(tabla)) mostrarUso();

  const client = await getClient();
  try {
    const { rows: colsRows } = await client.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`,
      [tabla],
    );
    if (!colsRows.length) {
      console.error(`La tabla "${tabla}" no existe en el esquema public.`);
      process.exit(1);
    }
    const disponibles = colsRows.map((r) => r.column_name);

    let elegidas = disponibles;
    if (columnas) {
      elegidas = columnas.split(',').map((c) => c.trim()).filter(Boolean);
      for (const c of elegidas) {
        if (!IDENT_RE.test(c) || !disponibles.includes(c)) {
          console.error(`Columna inválida o inexistente: "${c}". Disponibles: ${disponibles.join(', ')}`);
          process.exit(1);
        }
      }
    }

    const selectList = elegidas.map((c) => `"${c}"`).join(', ');
    let sql = `SELECT ${selectList} FROM "${tabla}"`;
    const params = [];
    if (donde) {
      sql += ` WHERE ${donde}`;
    }
    if (limite !== null && Number.isFinite(limite) && limite > 0) {
      params.push(limite);
      sql += ` LIMIT $${params.length}`;
    }

    const { rows } = await client.query(sql, params);

    const archivo = path.resolve(salida || path.join(process.cwd(), `${tabla}.csv`));
    const lines = [elegidas.join(',')];
    for (const row of rows) {
      lines.push(elegidas.map((c) => csvEscape(row[c])).join(','));
    }
    fs.writeFileSync(archivo, lines.join('\n') + '\n', 'utf8');

    console.log(`Tabla:   ${tabla}`);
    console.log(`Filas:    ${rows.length}`);
    console.log(`Columnas: ${elegidas.length}`);
    console.log(`CSV:      ${archivo}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
