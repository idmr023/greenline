/**
 * Migra imágenes de blog de Supabase Storage a rutas locales.
 *
 * 1. Descarga archivos que no existen en disco
 * 2. Actualiza greenline_posts.image_url y greenline_post_images.image_url
 *
 * Uso:
 *   node scripts/migrate-blog-images.mjs --dry-run   (vista previa)
 *   node scripts/migrate-blog-images.mjs             (ejecutar)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ARTICULOS_DIR = path.join(PUBLIC_DIR, 'assets/imagenes/articulos');

const BUCKET = 'Greenline_database';
const STORAGE_PREFIX_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\/assets\/imagenes\/imagenes\//;
const STORAGE_PREFIX_RE2 = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\/assets\/imagenes\//;

/**
 * Transforma una URL de Supabase Storage a ruta local absoluta (/assets/...).
 *
 * Storage: assets/imagenes/imagenes/articulos/... → /assets/imagenes/articulos/...
 * Storage: assets/imagenes/articulos/... → /assets/imagenes/articulos/...
 */
function aRutaLocal(url) {
  if (!url) return url;
  if (url.startsWith('/assets/')) return url;
  if (url.startsWith('./assets/')) return url.slice(1);

  // assets/imagenes/imagenes/articulos/... → articulos/...
  const match2 = url.match(STORAGE_PREFIX_RE);
  if (match2) {
    return '/assets/imagenes/' + url.slice(match2[0].length);
  }

  // assets/imagenes/articulos/... → articulos/...
  const match1 = url.match(STORAGE_PREFIX_RE2);
  if (match1) {
    return '/assets/imagenes/' + url.slice(match1[0].length);
  }

  return url;
}

function existeLocal(rutaLocal) {
  if (!rutaLocal) return false;
  const relative = rutaLocal.replace(/^\//, '');
  return fs.existsSync(path.join(PUBLIC_DIR, relative));
}

/**
 * Extrae el storage path de una URL de Supabase.
 */
function extraerStoragePath(url) {
  const m = url.match(/\/Greenline_database\/(.+)/);
  return m ? m[1] : null;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const preguntar = (p) => new Promise((r) => rl.question(p, r));

async function main() {
  console.log('\n📝 MIGRAR IMÁGENES DE BLOG — Supabase → Local');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (DRY_RUN) console.log('🧪 MODO DRY RUN (sin cambios)\n');

  // 1. Recopilar todas las URLs de ambas tablas
  const { data: posts } = await supabase.from('greenline_posts').select('id, image_url');
  const { data: postImages } = await supabase.from('greenline_post_images').select('id, post_id, image_url');

  console.log(`   ${posts?.length || 0} posts, ${postImages?.length || 0} post_images\n`);

  // 2. Clasificar
  const updates = []; // { table, id, field, oldUrl, newUrl, storagePath }
  const needDownload = new Map(); // storagePath → localPath

  for (const post of (posts || [])) {
    if (!post.image_url) continue;
    const local = aRutaLocal(post.image_url);
    if (local === post.image_url && !local.startsWith('/assets/')) continue;

    const storagePath = extraerStoragePath(post.image_url);
    if (storagePath && !existeLocal(local)) {
      needDownload.set(storagePath, local);
    }
    if (local !== post.image_url) {
      updates.push({ table: 'greenline_posts', id: post.id, field: 'image_url', oldUrl: post.image_url, newUrl: local });
    }
  }

  for (const img of (postImages || [])) {
    if (!img.image_url) continue;
    const local = aRutaLocal(img.image_url);
    if (local === img.image_url && !local.startsWith('/assets/')) continue;

    const storagePath = extraerStoragePath(img.image_url);
    if (storagePath && !existeLocal(local)) {
      needDownload.set(storagePath, local);
    }
    if (local !== img.image_url) {
      updates.push({ table: 'greenline_post_images', id: img.id, field: 'image_url', oldUrl: img.image_url, newUrl: local });
    }
  }

  // 3. Resumen
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔄 A actualizar en DB   : ${updates.length}`);
  console.log(`📥 A descargar          : ${needDownload.size}`);
  console.log('');

  if (needDownload.size > 0) {
    console.log('📥 Archivos a descargar:\n');
    for (const [storage, local] of needDownload) {
      console.log(`  ${storage}`);
      console.log(`    → ${local}`);
    }
    console.log('');
  }

  if (updates.length > 0 && updates.length <= 30) {
    console.log('🔄 Actualizaciones:\n');
    for (const u of updates) {
      console.log(`  ${u.table} ${u.id}: ${u.newUrl}`);
    }
    console.log('');
  }

  if (DRY_RUN) {
    console.log('💡 Para ejecutar: node scripts/migrate-blog-images.mjs');
    rl.close();
    return;
  }

  // 4. Descargar archivos faltantes
  if (needDownload.size > 0) {
    console.log('📥 Descargando archivos...\n');
    let dlOk = 0, dlErr = 0;
    for (const [storagePath, localPath] of needDownload) {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).download(storagePath);
        if (error) throw error;

        const absLocal = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
        const dir = path.dirname(absLocal);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(absLocal, Buffer.from(await data.arrayBuffer()));

        console.log(`  ✅ ${storagePath}`);
        dlOk++;
      } catch (err) {
        console.error(`  ❌ ${storagePath}: ${err.message}`);
        dlErr++;
      }
    }
    console.log(`\n  Descargados: ${dlOk}, Errores: ${dlErr}\n`);
  }

  // 5. Actualizar DB
  if (updates.length === 0) {
    console.log('✅ No hay nada que actualizar en la DB.');
    rl.close();
    return;
  }

  if (process.stdin.isTTY) {
    const rta = (await preguntar(`\n¿Actualizar ${updates.length} registros en la DB? (s/n): `)).trim().toLowerCase();
    if (!['s', 'si', 'sí', 'y', 'yes'].includes(rta)) {
      console.log('❌ Cancelado.');
      rl.close();
      return;
    }
  }

  console.log('\n🔄 Actualizando DB...');
  let ok = 0, err = 0;
  for (const u of updates) {
    const { error: updateErr } = await supabase
      .from(u.table)
      .update({ [u.field]: u.newUrl })
      .eq('id', u.id);
    if (updateErr) {
      err++;
      console.error(`  ❌ ${u.table} ${u.id}: ${updateErr.message}`);
    } else {
      ok++;
    }
  }
  console.log(`\n🎉 ${ok} registros actualizados, ${err} errores.`);
  rl.close();
}

main().catch((err) => {
  console.error(`\n💥 ERROR: ${err.message}`);
  rl.close();
  process.exit(1);
});
