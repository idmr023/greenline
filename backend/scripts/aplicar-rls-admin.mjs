// Aplica supabase/arreglar-rls-admin.sql contra la base (conexión directa).
// Requiere DIRECT_URL (backend/.env). Re-ejecutable (idempotente).
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.resolve(__dirname, '../../supabase/arreglar-rls-admin.sql');

if (!process.env.DIRECT_URL) {
  console.error('Falta DIRECT_URL en backend/.env');
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const client = new pg.Client({ connectionString: process.env.DIRECT_URL });

await client.connect();
try {
  await client.query(sql);
  console.log('OK: migración RLS aplicada correctamente');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}