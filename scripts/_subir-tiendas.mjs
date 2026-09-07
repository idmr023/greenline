import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  EXTENSIONES_VALIDAS,
  subirStorage,
  procesarImagen,
} from '../backend/scripts/image-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DIR_LOCAL = path.resolve(__dirname, '../public/assets/imagenes/tiendas');
const DEST_BASE = 'assets/imagenes/imagenes/tiendas';

const archivos = fs
  .readdirSync(DIR_LOCAL)
  .filter((f) => EXTENSIONES_VALIDAS.includes(path.extname(f).toLowerCase()));

const grupos = new Map();
for (const f of archivos) {
  const base = path.basename(f, path.extname(f));
  const ruta = path.join(DIR_LOCAL, f);
  const size = fs.statSync(ruta).size;
  if (!grupos.has(base) || size > grupos.get(base).size) {
    grupos.set(base, { nombre: f, ruta, size });
  }
}

const destinoDe = (base) => `${DEST_BASE}/${base}.webp`;

let subidos = 0;
let errores = 0;

for (const [base, archivo] of grupos) {
  const destino = destinoDe(base);
  console.log(`⚙️  ${archivo.nombre} (${(archivo.size / 1024).toFixed(0)}KB) → ${destino}`);

  try {
    const buffer = await procesarImagen(archivo.ruta, { original: true });
    await subirStorage(supabase, destino, buffer);
    subidos++;
    console.log(`   ✅ ${(buffer.length / 1024).toFixed(0)}KB webp`);
  } catch (e) {
    errores++;
    console.error(`   ❌ ${e.message}`);
  }
}

console.log(`\n🎉 Subidas: ${subidos} · Errores: ${errores}`);