import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });

const ARCHIVOS = process.argv.slice(2).map((f) => path.resolve(__dirname, '../../', f));

if (!ARCHIVOS.length) {
  console.error('Uso: node backend/scripts/_apply-migracion.mjs supabase/migracion-*.sql');
  process.exit(1);
}

await client.connect();
for (const archivo of ARCHIVOS) {
  const sql = fs.readFileSync(archivo, 'utf8');
  console.log(`▶ ${path.basename(archivo)}`);
  try {
    const res = await client.query(sql);
    console.log(`  ✅ filas afectadas: ${res.rowCount ?? 'n/a'}`);
  } catch (e) {
    console.error(`  ❌ ${e.message}`);
    await client.end();
    process.exit(1);
  }
}
await client.end();
console.log('\n🏁 Migraciones aplicadas.');