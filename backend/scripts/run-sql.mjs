// ============================================================
// Ejecuta un archivo .sql contra la BD usando pg + DIRECT_URL.
// Existe porque `prisma db push/migrate diff/db pull` cuelgan contra el
// pooler de Supabase (Prisma 7 + pooler en modo transacción).
//
// Uso:  node scripts/run-sql.mjs supabase/migrations/<archivo>.sql
// ============================================================
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import 'dotenv/config';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node scripts/run-sql.mjs <archivo.sql>');
  process.exit(1);
}

const url = process.env.DIRECT_URL;
if (!url) {
  console.error('Falta DIRECT_URL en backend/.env');
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), file), 'utf8');
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log(`✅ SQL aplicado: ${file}`);
} catch (err) {
  console.error(`❌ Error aplicando ${file}:`, err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
