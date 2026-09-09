/**
 * Migra las URLs de imágenes de productos en la tabla `imagenes`
 * de Supabase Storage URLs a rutas locales.
 *
 * ANTES:
 *   https://xxx.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/productos/vmp/T4/t4_negro.webp
 *
 * DESPUÉS:
 *   ./assets/imagenes/productos/vmp/T4/t4_negro.webp
 *
 * Uso:
 *   node scripts/migrate-product-images.mjs --dry-run   (vista previa)
 *   node scripts/migrate-product-images.mjs             (ejecutar)
 *   node scripts/migrate-product-images.mjs --verify    (verificar que las rutas locales existen)
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
const VERIFY = ARGS.includes('--verify');
const FORCE = ARGS.includes('--force');
const FIX_PATHS = ARGS.includes('--fix-paths');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Prefijo de Supabase Storage que hay que eliminar
// Nota: en Supabase las rutas son assets/imagenes/imagenes/productos/...
// pero en local es assets/imagenes/productos/... (un solo imagenes)
const STORAGE_PREFIX_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\/assets\/imagenes\/imagenes\//;

/**
 * Transforma una URL de Supabase Storage a ruta local absoluta (/assets/...).
 * Si ya es ruta local, la normaliza a /assets/...
 */
function aRutaLocal(url) {
  if (!url) return url;

  // Normalizar rutas relativas ./assets/... a /assets/...
  if (url.startsWith('./assets/')) {
    return url.slice(1); // ./assets/... → /assets/...
  }
  if (url.startsWith('/assets/')) {
    return url;
  }

  // Transformar URL de Supabase Storage
  const match = url.match(STORAGE_PREFIX_RE);
  if (match) {
    return '/assets/imagenes/' + url.slice(match[0].length);
  }

  // No se pudo transformar — devolver tal cual
  return url;
}

/**
 * Verifica si una ruta local apunta a un archivo que existe en disco.
 */
function existeLocal(rutaLocal) {
  if (!rutaLocal) return false;
  const relative = rutaLocal.replace(/^\//, '');
  return fs.existsSync(path.join(PUBLIC_DIR, relative));
}

// ── Fuzzy matching ──────────────────────────────────────────

const VISTAS_DB = ['frontal', 'frente', 'posterior', 'costado', 'perfil', 'lateral'];
const VISTAS_DISK = ['frontal', 'frente', 'posterior', 'costado', 'perfil', 'lateral', 'izq', 'der'];

function normalizar(str) {
  return str.toLowerCase().replace(/[-_\s]+/g, '');
}

/**
 * Busca en disco un archivo que coincida con el patrón del modelo/color/vista.
 * Devuelve la ruta local relativa o null.
 */
function buscarEnDisco(modeloDir, color, vista) {
  const dirAbs = path.join(PUBLIC_DIR, 'assets/imagenes/productos', modeloDir);
  if (!fs.existsSync(dirAbs) || !fs.statSync(dirAbs).isDirectory()) return null;

  const archivos = fs.readdirSync(dirAbs).filter((f) => f.endsWith('.webp'));
  const colorN = normalizar(color);

  // Buscar archivos que contengan el color
  const candidatos = archivos.filter((f) => normalizar(f).includes(colorN));
  if (candidatos.length === 0) return null;

  // Si hay vista, buscar match exacto de vista
  if (vista) {
    const vistaN = normalizar(vista);
    const match = candidatos.find((f) => {
      const fn = normalizar(f);
      // Buscar la vista como palabra completa (no substring de otro word)
      return VISTAS_DISK.some(
        (v) => normalizar(v) === vistaN && fn.includes(normalizar(v))
      );
    });
    if (match) return `/assets/imagenes/productos/${modeloDir}/${match}`;
  }

  // Sin vista o sin match: devolver el primer candidato
  return `/assets/imagenes/productos/${modeloDir}/${candidatos[0]}`;
}

/**
 * Extrae modelo_dir, color y vista de una ruta tipo ./assets/imagenes/productos/...
 */
function parsearRutaLocal(rutaLocal) {
  // /assets/imagenes/productos/{modelo_dir}/{filename}
  const m = rutaLocal.match(/\/assets\/imagenes\/productos\/(.+)\/([^/]+)$/);
  if (!m) return null;
  const modeloDir = m[1];
  const filename = m[2].replace(/\?.*$/, ''); // quitar ?v=...

  // Separar filename en partes: modelo_color_vista.webp o modelo-color-vista.webp
  const base = filename.replace(/\.\w+$/, ''); // quitar extensión
  // Filtrar partes que no aportan info (scaled, v1, etc.)
  const partes = base.split(/[-_]/).filter((p) => !/^(scaled|v\d+)$/i.test(p));

  // Buscar color conocido (última parte que no sea una vista conocida)
  let color = null;
  let vista = null;
  for (let i = partes.length - 1; i >= 0; i--) {
    const p = partes[i].toLowerCase();
    if (VISTAS_DB.includes(p) || VISTAS_DISK.includes(p)) {
      vista = p;
    } else if (!color) {
      color = partes[i];
    }
  }

  return { modeloDir, color, vista };
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const preguntar = (p) => new Promise((r) => rl.question(p, r));

async function main() {
  console.log('\n📦 MIGRAR URLs DE IMÁGENES — Supabase → Local');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (DRY_RUN) {
    console.log('🧪 MODO DRY RUN (sin cambios)\n');
  }

  // 1. Leer todos los registros de la tabla imagenes
  console.log('📖 Leyendo tabla imagenes...');
  const { data: imagenes, error } = await supabase
    .from('imagenes')
    .select('id, url, producto_id');

  if (error) {
    console.error(`❌ Error leyendo tabla: ${error.message}`);
    process.exit(1);
  }

  console.log(`   ${imagenes.length} registros encontrados.\n`);

  // ── Modo --fix-paths: convertir ./assets/... → /assets/... ──
  if (FIX_PATHS) {
    console.log('🔧 MODO FIX PATHS — convirtiendo ./assets/... → /assets/...\n');
    const aCorregir = imagenes.filter((img) => img.url && img.url.startsWith('./assets/'));
    console.log(`   ${aCorregir.length} registros con ruta relativa ./assets/...\n`);

    if (aCorregir.length === 0) {
      console.log('✅ Todas las rutas ya son absolutas (/assets/...).');
      rl.close();
      return;
    }

    if (DRY_RUN) {
      console.log('📝 Registros a corregir:\n');
      for (const img of aCorregir) {
        console.log(`  ID ${img.id}: ${img.url} → ${img.url.slice(1)}`);
      }
      console.log(`\n💡 Para ejecutar: node scripts/migrate-product-images.mjs --fix-paths`);
      rl.close();
      return;
    }

    // Confirmar
    if (process.stdin.isTTY) {
      const rta = (await preguntar(`\n¿Corregir ${aCorregir.length} rutas? (s/n): `)).trim().toLowerCase();
      if (!['s', 'si', 'sí', 'y', 'yes'].includes(rta)) {
        console.log('❌ Cancelado.');
        rl.close();
        return;
      }
    }

    console.log('\n🔄 Corrigiendo rutas...');
    let ok = 0, err = 0;
    for (const img of aCorregir) {
      const nuevaUrl = img.url.slice(1); // ./assets/... → /assets/...
      const { error: updateErr } = await supabase
        .from('imagenes')
        .update({ url: nuevaUrl })
        .eq('id', img.id);
      if (updateErr) {
        err++;
        console.error(`  ❌ ID ${img.id}: ${updateErr.message}`);
      } else {
        ok++;
        console.log(`  ✅ ID ${img.id}: ${nuevaUrl}`);
      }
    }
    console.log(`\n🎉 ${ok} rutas corregidas, ${err} errores.`);
    rl.close();
    return;
  }

  // 2. Clasificar
  const aMigrar = [];
  const yaLocal = [];
  const sinUrl = [];
  const noTransformable = [];
  const noExisteEnDisco = [];

  for (const img of imagenes) {
    if (!img.url) {
      sinUrl.push(img);
      continue;
    }

    const nuevaRuta = aRutaLocal(img.url);

    if (nuevaRuta === img.url) {
      // Ya es ruta local
      yaLocal.push({ ...img, localPath: nuevaRuta });
    } else if (nuevaRuta.startsWith('./')) {
      const existe = existeLocal(nuevaRuta);
      if (existe || FORCE) {
        aMigrar.push({ ...img, localPath: nuevaRuta });
      } else {
        // Intentar fuzzy matching
        const parsed = parsearRutaLocal(nuevaRuta);
        if (parsed) {
          const fuzzyPath = buscarEnDisco(parsed.modeloDir, parsed.color, parsed.vista);
          if (fuzzyPath && existeLocal(fuzzyPath)) {
            aMigrar.push({ ...img, localPath: fuzzyPath, fuzzy: true });
          } else {
            noExisteEnDisco.push({ ...img, localPath: nuevaRuta });
          }
        } else {
          noExisteEnDisco.push({ ...img, localPath: nuevaRuta });
        }
      }
    } else {
      noTransformable.push({ ...img, urlOriginal: img.url });
    }
  }

  // 3. Resumen
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📝 Total registros   : ${imagenes.length}`);
  console.log(`🔄 A migrar          : ${aMigrar.length}`);
  console.log(`✅ Ya son locales    : ${yaLocal.length}`);
  console.log(`⚠️ Sin URL           : ${sinUrl.length}`);
  console.log(`❌ No transformable  : ${noTransformable.length}`);
  console.log(`📁 No existe en disco: ${noExisteEnDisco.length}`);
  console.log('');

  // 4. Mostrar detalles
  const fuzzyCount = aMigrar.filter((i) => i.fuzzy).length;
  if (fuzzyCount > 0) {
    console.log(`🔍 ${fuzzyCount} imágenes matcheadas por fuzzy matching:\n`);
    for (const img of aMigrar.filter((i) => i.fuzzy)) {
      console.log(`  ID ${img.id}: ${img.localPath}`);
    }
    console.log('');
  }

  if (aMigrar.length > 0 && aMigrar.length <= 50) {
    console.log('🔄 Registros a migrar:\n');
    for (const img of aMigrar) {
      const tag = img.fuzzy ? ' 🔍' : '';
      console.log(`  ID ${img.id}: ${img.localPath}${tag}`);
    }
    console.log('');
  }

  if (noExisteEnDisco.length > 0) {
    console.log('⚠️ Imágenes que NO existen en disco local:\n');
    for (const img of noExisteEnDisco) {
      console.log(`  ID ${img.id}: ${img.localPath}`);
      console.log(`         URL original: ${img.url}`);
    }
    console.log('');
    console.log('💡 Estas imágenes no se migrarán hasta que existan en disco.');
    console.log('   Ejecuta --local en sincronizar-imagenes-greenline.mjs primero.\n');
  }

  if (noTransformable.length > 0) {
    console.log('❌ URLs que no se pudieron transformar:\n');
    for (const img of noTransformable) {
      console.log(`  ID ${img.id}: ${img.urlOriginal}`);
    }
    console.log('');
  }

  // 5. Verify mode
  if (VERIFY) {
    console.log('🔍 MODO VERIFICACIÓN — comprobando que todas las rutas locales existen...\n');
    let existen = 0;
    let faltan = 0;
    for (const img of yaLocal) {
      if (existeLocal(img.localPath)) {
        existen++;
      } else {
        faltan++;
        console.log(`  ❌ ID ${img.id}: ${img.localPath} — NO EXISTE`);
      }
    }
    console.log(`\n  ✅ Existen: ${existen}`);
    console.log(`  ❌ Faltan : ${faltan}`);
    rl.close();
    return;
  }

  // 6. Ejecutar migración
  if (aMigrar.length === 0) {
    console.log('✅ No hay nada que migrar.');
    rl.close();
    return;
  }

  if (DRY_RUN) {
    console.log(`💡 Para ejecutar: node scripts/migrate-product-images.mjs`);
    rl.close();
    return;
  }

  // Confirmar
  if (process.stdin.isTTY) {
    const rta = (await preguntar(`\n¿Migrar ${aMigrar.length} registros? (s/n): `)).trim().toLowerCase();
    if (!['s', 'si', 'sí', 'y', 'yes'].includes(rta)) {
      console.log('❌ Cancelado.');
      rl.close();
      return;
    }
  }

  // Ejecutar UPDATEs
  console.log('\n🔄 Migrando...');
  let migrados = 0;
  let errores = 0;

  for (const img of aMigrar) {
    const { error: updateErr } = await supabase
      .from('imagenes')
      .update({ url: img.localPath })
      .eq('id', img.id);

    if (updateErr) {
      errores++;
      console.error(`  ❌ ID ${img.id}: ${updateErr.message}`);
    } else {
      migrados++;
      console.log(`  ✅ ID ${img.id}: ${img.localPath}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 MIGRACIÓN FINALIZADA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Migrados : ${migrados}`);
  console.log(`❌ Errores  : ${errores}`);

  rl.close();
}

main().catch((err) => {
  console.error(`\n💥 ERROR: ${err.message}`);
  rl.close();
  process.exit(1);
});
