import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import readline from 'readline';
import {
  BUCKET,
  EXTENSIONES_VALIDAS,
  TARGET_SIZE,
  procesarImagen,
  inventarioBucket,
  subirStorage,
  eliminarStorage,
  formatearTamano,
  normalizarRuta,
} from '../backend/scripts/image-utils.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// Supabase se inicializa lazy — solo se necesita para modos remotos.
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      '❌ Faltan las variables VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env'
    );
    process.exit(1);
  }
  _supabase = createClient(url, key);
  return _supabase;
}
const supabase = new Proxy({}, { get: (_, prop) => getSupabase()[prop] });

// ============================================================
// CONFIGURACIÓN
// ============================================================

const RUTA_SUPABASE = 'assets/imagenes/';

const CARPETA_LOCAL = 'C:\\Users\\Marketing\\greenline\\public\\assets';

// ============================================================
// CLI FLAGS
// ============================================================

const ARGS = process.argv.slice(2);
const FORCE = ARGS.includes('--force');
const DRY_RUN = ARGS.includes('--dry-run');

// Sube SOLO las imágenes que aún no existen en Supabase.
// No sobrescribe existentes y nunca elimina sobrantes.
const SOLO_NUEVO = ARGS.includes('--solo-nuevo') || ARGS.includes('--solo-nuevas');

// Modo descarga: trae imágenes de Supabase → local (inverso del sync).
// El script se convierte en descargar-imagenes cuando está presente.
const DESCARGAR = ARGS.includes('--descargar') || ARGS.includes('--download') || ARGS.includes('-d');

// Modo local: re-procesa imágenes PNG/JPG a WebP in-place sin tocar Supabase.
const LOCAL = ARGS.includes('--local') || ARGS.includes('--local-only');

// Limpia originales PNG/JPG que ya fueron procesados a WebP.
const CLEANUP = ARGS.includes('--cleanup');

// Carpetas del bucket a descargar (solo en modo --descargar). Se mapean a public/assets.
const RUTAS_ORIGEN_DESCARGAR = ['assets/imagenes', 'productos', 'articulos'];

// Sube las imágenes en su tamaño original: NO redimensiona ni recorta.
// Solo convierte el archivo a WebP para reducir el peso. Útil cuando el
// escalado/cuadrado degrada la calidad (banners, fotos de alta resolución).
const PRESERVAR_ORIGINAL =
  ARGS.includes('--original') ||
  ARGS.includes('--no-resize');

if (ARGS.includes('--help') || ARGS.includes('-h')) {
  console.log(`
GREENLINE IMAGE SYNC

Uso:
  node scripts/sincronizar-imagenes-greenline.mjs [opciones]

Opciones (subida local → Supabase):
  --dry-run    Vista previa: procesa imágenes y muestra el resultado sin subir
  --force      Re-subir todo sin preguntar (salta el modo interactivo)
  --solo-nuevo Sube SOLO las imágenes nuevas: no sobrescribe existentes
               ni elimina sobrantes
  --original   No redimensiona ni recorta: sube cada imagen en su tamaño
               original, solo convertida a WebP (conserva la calidad)
  --help, -h   Mostrar esta ayuda

En el modo interactivo las imágenes existentes se REEMPLAZAN por defecto
(el archivo del bucket se sobrescribe con la misma ruta). Para no tocarlas,
usa --solo-nuevo o elige la opción correspondiente al ejecutar.

Opciones (descarga Supabase → local, modo inverso):
  --descargar, -d, --download   Trae imágenes del bucket a public/assets.
  --force      Sobrescribir archivos locales existentes (en modo descarga)
  --original   Descarga sin redimensionar (solo conversión a WebP)
  --dry-run    Muestra qué se descargaría sin escribir

Opciones (modo local — sin Supabase):
  --local      Re-procesa PNG/JPG → WebP in-place en public/assets.
               No toca Supabase Storage.
  --cleanup    Elimina los originales PNG/JPG que ya tienen su par WebP.
               Te permite elegir qué carpetas borrar (articulos, productos,
               caroussel, etc.); Enter = tomar todas.
               Requiere que se haya ejecutado --local primero.
  --dry-run    Combinado con --local: muestra qué se procesaría sin escribir.
  --force      Con --local: sobrescribe WebP existentes.

Ejemplos:
  node scripts/sincronizar-imagenes-greenline.mjs --dry-run
  node scripts/sincronizar-imagenes-greenline.mjs
  node scripts/sincronizar-imagenes-greenline.mjs --solo-nuevo
  node scripts/sincronizar-imagenes-greenline.mjs --force
  node scripts/sincronizar-imagenes-greenline.mjs --original
  node scripts/sincronizar-imagenes-greenline.mjs --descargar
  node scripts/sincronizar-imagenes-greenline.mjs --descargar --force
  node scripts/sincronizar-imagenes-greenline.mjs --local --dry-run
  node scripts/sincronizar-imagenes-greenline.mjs --local
  node scripts/sincronizar-imagenes-greenline.mjs --cleanup
`);
  process.exit(0);
}


// ============================================================
// READLINE
// ============================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const preguntar = (pregunta) =>
  new Promise((resolve) =>
    rl.question(pregunta, resolve)
  );

const SI = ['s', 'si', 'sí', 'y', 'yes'];

const confirmar = async (pregunta, porDefecto = true) => {
  const rta = (
    await preguntar(
      `${pregunta}? (s/n, Enter = ${porDefecto ? 's' : 'n'}): `
    )
  )
    .trim()
    .toLowerCase();

  if (!rta) return porDefecto;
  return SI.includes(rta);
};

// Convierte una respuesta del usuario en una lista de índices (0-based) sobre
// una lista de `max` elementos. Acepta números sueltos, rangos y comas:
//   "1-5, 8, 10-12"   →  [0,1,2,3,4,7,9,10,11]
//   "all"             →  todos los índices
// Entrada vacía o sin valores válidos → [].
function parseSeleccion(respuesta, max) {
  const rta = (respuesta || '').trim().toLowerCase();
  if (!rta) return [];
  if (rta === 'all') return Array.from({ length: max }, (_, i) => i);

  const indices = new Set();
  for (const parte of rta.split(',')) {
    const trozo = parte.trim();
    if (!trozo) continue;

    const rango = trozo.split('-');
    if (rango.length === 2) {
      const ini = Number.parseInt(rango[0], 10);
      const fin = Number.parseInt(rango[1], 10);
      if (
        !Number.isNaN(ini) &&
        !Number.isNaN(fin) &&
        ini >= 1 &&
        fin <= max &&
        ini <= fin
      ) {
        for (let i = ini; i <= fin; i++) indices.add(i - 1);
      }
      continue;
    }

    const num = Number.parseInt(trozo, 10);
    if (!Number.isNaN(num) && num >= 1 && num <= max) {
      indices.add(num - 1);
    }
  }

  return [...indices].sort((a, b) => a - b);
}


// ============================================================
// RUTAS LOCALES
// ============================================================

function rutaRelativaStorage(ruta) {
  const prefijo = RUTA_SUPABASE.replace(/\/$/, '');
  const rutaNormalizada = normalizarRuta(ruta);

  if (rutaNormalizada.startsWith(`${prefijo}/`)) {
    return rutaNormalizada.slice(prefijo.length + 1);
  }

  return rutaNormalizada.replace(/^\/+/, '');
}

function obtenerRutaDestino(rutaCompleta) {
  const relativa = normalizarRuta(
    path.relative(CARPETA_LOCAL, rutaCompleta)
  );

  const extension = path.extname(relativa).toLowerCase();

  if (!EXTENSIONES_VALIDAS.includes(extension)) {
    return null;
  }

  return `${RUTA_SUPABASE}` + relativa.replace(/\.[^/.]+$/, '.webp');
}


// ============================================================
// EXPLORAR ARCHIVOS
// ============================================================

function explorarArchivos(dir, lista = []) {
  for (const nombre of fs.readdirSync(dir)) {
    const absoluta = path.join(dir, nombre);

    if (fs.statSync(absoluta).isDirectory()) {
      explorarArchivos(absoluta, lista);
    } else {
      lista.push(absoluta);
    }
  }

  return lista;
}


// ============================================================
// INVENTARIO LOCAL
// ============================================================

function inventarioLocal() {
  return explorarArchivos(CARPETA_LOCAL)
    .filter((file) =>
      EXTENSIONES_VALIDAS.includes(
        path.extname(file).toLowerCase()
      )
    )
    .map((rutaCompleta) => ({
      rutaCompleta,
      rutaRelativa: normalizarRuta(
        path.relative(CARPETA_LOCAL, rutaCompleta)
      ),
      rutaDestino: obtenerRutaDestino(rutaCompleta),
    }))
    .filter((archivo) => archivo.rutaDestino);
}


// ============================================================
// SELECCIONAR EXISTENTES
// ============================================================

async function seleccionarExistentes(
  existentes,
  pregunta = '¿Cuáles quieres seleccionar?'
) {
  if (!existentes.length) {
    return [];
  }

  console.log('');
  existentes.forEach((archivo, index) => {
    console.log(
      `${String(index + 1).padStart(4)}. ${archivo.rutaRelativa}`
    );
  });

  console.log(
    '\nSoporta rangos y comas: "1-5, 8, 10-12" o "all" para todas. Enter = ninguna.\n'
  );

  const respuesta = await preguntar(`👉 ${pregunta} `);

  return parseSeleccion(respuesta, existentes.length).map(
    (numero) => existentes[numero]
  );
}


// ============================================================
// GESTIONAR SOBRANTES
// ============================================================

async function gestionarSobrantes(sobrantes) {
  if (!sobrantes.length) {
    return [];
  }

  if (!process.stdin.isTTY) {
    console.log(
      `\n⚠️ ${sobrantes.length} sobrantes detectadas. Sin terminal interactiva: se conservan TODAS (nada se elimina).\n`
    );
    return [];
  }

  console.log(
    '\n⚠️ IMÁGENES QUE ESTÁN EN SUPABASE PERO NO EN LOCAL:\n'
  );

  sobrantes.forEach((ruta, index) => {
    console.log(
      `${String(index + 1).padStart(4)}. ${ruta}`
    );
  });

  console.log(`
1. Mantener todas
2. Eliminar todas
3. Elegir cuáles eliminar
4. Cancelar
`);

  const opcion = (await preguntar('👉 Opción [1-4]: ')).trim();

  if (opcion === '1') return [];
  if (opcion === '4') throw new Error('Proceso cancelado por el usuario.');

  if (opcion === '2') {
    const confirmarEliminacion = await confirmar(
      `¿Confirmas eliminar las ${sobrantes.length} imágenes`,
      false
    );
    return confirmarEliminacion ? sobrantes : [];
  }

  if (opcion === '3') {
    const seleccionadas = await seleccionarExistentes(
      sobrantes.map((rutaRelativa) => ({ rutaRelativa })),
      '¿Cuáles quieres eliminar? '
    );
    const rutas = seleccionadas.map((archivo) => archivo.rutaRelativa);
    const confirmarEliminacion = await confirmar(
      `¿Confirmas eliminar las ${rutas.length} imágenes seleccionadas`,
      false
    );
    return confirmarEliminacion ? rutas : [];
  }

  console.log('❌ Opción inválida. Se conservarán.');
  return [];
}


// ============================================================
// ELEGIR QUÉ SUBIR
// ============================================================

async function decidirSubida(nuevos, existentes) {
  console.log('\n¿Qué quieres subir?\n');
  console.log('1. 🔄 Reemplazar todo (predeterminado): subir nuevas y sobrescribir existentes');
  console.log('2. 🆕 Solo lo nuevo (no tocar existentes)');
  console.log('3. 🖼️ Nuevas + elegir existentes a sobrescribir');
  console.log('4. ❌ No subir imágenes\n');

  let opcion = (await preguntar('👉 Opción [1-4, Enter = 1]: ')).trim();
  if (!opcion) opcion = '1';

  if (opcion === '4') return [];

  if (opcion === '2') {
    if (!nuevos.length) {
      console.log('✅ No hay imágenes nuevas.');
      return [];
    }
    const confirmarNuevas = await confirmar(
      `¿Confirmas subir ${nuevos.length} imágenes nuevas`
    );
    return confirmarNuevas ? nuevos : [];
  }

  if (opcion === '3') {
    const seleccionadas = await seleccionarExistentes(
      existentes,
      '¿Cuáles existentes quieres sobrescribir (además de las nuevas)?'
    );
    const total = [...nuevos, ...seleccionadas];
    if (!total.length) return [];
    const confirmarSeleccion = await confirmar(
      `¿Confirmas subir ${total.length} imágenes`
    );
    return confirmarSeleccion ? total : [];
  }

  const total = nuevos.length + existentes.length;
  if (!total) {
    console.log('✅ No hay nada que subir.');
    return [];
  }
  const confirmarTodo = await confirmar(
    `¿Confirmas subir ${nuevos.length} nuevas y sobrescribir ${existentes.length} existentes`
  );
  return confirmarTodo ? [...nuevos, ...existentes] : [];
}


// ============================================================
// EJECUCIÓN PRINCIPAL
// ============================================================

// ------------------------------------------------------------
// Descarga: Supabase → local (modo inverso del sync)
// ------------------------------------------------------------
function rutaLocalParaDescargar(objeto) {
  const ruta = normalizarRuta(objeto);
  for (const origen of RUTAS_ORIGEN_DESCARGAR) {
    const prefijo = origen.replace(/\/$/, '');
    if (ruta === prefijo || ruta.startsWith(`${prefijo}/`)) {
      return ruta.slice(prefijo.length + (ruta.startsWith(`${prefijo}/`) ? 1 : 0));
    }
  }
  return ruta;
}

async function descargarDeBucket(objeto) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(objeto);
  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}

async function ejecutarDescarga() {
  const modeLabel = DRY_RUN
    ? '🧪 DRY RUN (solo vista previa, sin escribir)'
    : FORCE
      ? '⚡ FORCE (sobrescribir archivos locales existentes)'
      : '💾 Descarga normal';

  console.log(`\n${modeLabel}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!fs.existsSync(CARPETA_LOCAL)) {
    fs.mkdirSync(CARPETA_LOCAL, { recursive: true });
    console.log(`📁 Creada carpeta local: ${CARPETA_LOCAL}\n`);
  }

  console.log('☁️ Consultando Supabase...');
  const objetosRaw = [];
  for (const origen of RUTAS_ORIGEN_DESCARGAR) {
    try {
      const items = await inventarioBucket(supabase, origen, { soloImagenes: true });
      objetosRaw.push(...items);
    } catch {
      // Carpeta de origen vacía o inexistente: se omite.
    }
  }
  const objetos = [...new Set(objetosRaw)].sort();
  console.log(`☁️ ${objetos.length} imágenes encontradas en el bucket.\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📥 DESCARGANDO Y PROCESANDO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (PRESERVAR_ORIGINAL) {
    console.log('📐 Tamaño original conservado (solo conversión a WebP)');
  } else {
    console.log(`📐 Todas quedarán en ${TARGET_SIZE}x${TARGET_SIZE}px WebP`);
    console.log('✂️ Márgenes blancos exteriores recortados');
  }
  console.log('🎨 Fondo blanco');
  console.log('');

  let descargadas = 0;
  let escritas = 0;
  let saltadas = 0;
  let errores = 0;

  for (let i = 0; i < objetos.length; i++) {
    const objeto = objetos[i];
    const relativa = rutaLocalParaDescargar(objeto);
    const destino = path.join(CARPETA_LOCAL, relativa.split('/').join(path.sep));

    console.log(`[${i + 1}/${objetos.length}] 📥 ${objeto}`);

    try {
      const buffer = await descargarDeBucket(objeto);
      const procesado = await procesarImagen(buffer, {
        original: PRESERVAR_ORIGINAL,
      });

      const originalKB = (buffer.length / 1024).toFixed(1);
      const finalKB = (procesado.length / 1024).toFixed(1);
      descargadas++;

      if (DRY_RUN) {
        console.log(`    🧪 ${originalKB}KB → ${finalKB}KB → ${relativa}`);
        continue;
      }

      const existe = fs.existsSync(destino);
      if (existe && !FORCE) {
        saltadas++;
        console.log(`    ⏭️ Ya existe en local (usa --force para sobrescribir): ${relativa}`);
        continue;
      }

      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.writeFileSync(destino, procesado);
      escritas++;
      console.log(`    ✅ ${originalKB}KB → ${finalKB}KB → ${relativa}`);
    } catch (error) {
      errores++;
      console.error(`    ❌ ${error.message}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(DRY_RUN ? '🧪 VISTA PREVIA FINALIZADA' : '🎉 DESCARGA FINALIZADA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📥 Descargadas : ${descargadas}`);
  if (!DRY_RUN) {
    console.log(`💾 Escritas    : ${escritas}`);
    console.log(`⏭️ Saltadas    : ${saltadas}`);
  }
  console.log(`❌ Errores     : ${errores}`);
  console.log(
    `📐 Resultado   : ${
      PRESERVAR_ORIGINAL ? 'WebP a tamaño original' : `${TARGET_SIZE}x${TARGET_SIZE}px WebP`
    }`
  );
  if (DRY_RUN) {
    console.log('\n💡 Para escribir ejecuta: node scripts/sincronizar-imagenes-greenline.mjs --descargar');
  }
}

// ============================================================
// FILTRAR LOCALES (CARPETAS E IMÁGENES) — opcional
// ============================================================
async function filtrarLocales(locales) {
  console.log('\n¿Quieres procesar todo o filtrar tu subida?');
  console.log('1. 🌐 Procesar todo (Predeterminado)');
  console.log('2. 📁 Elegir carpetas (Soporta rangos como 1-5)');
  console.log('3. 🖼️ Elegir imágenes específicas');

  const opcion = (await preguntar('\n👉 Opción [1-3, Enter = 1]: ')).trim();

  if (opcion === '2') {
    const carpetas = [
      ...new Set(locales.map((a) => path.dirname(a.rutaRelativa))),
    ].sort();

    console.log('\nCarpetas disponibles:');
    carpetas.forEach((c, index) =>
      console.log(`${String(index + 1).padStart(3)}. ${c || '(Raíz)'}`)
    );

    const respuesta = await preguntar(
      '\n👉 Escribe los números (Ej: 1-8, 10, 12-15): '
    );

    const indices = parseSeleccion(respuesta, carpetas.length);
    if (!indices.length) return locales;

    const elegidas = indices.map((i) => carpetas[i]);
    console.log(
      `\nFiltro aplicado: ${elegidas.length} carpeta(s) seleccionada(s).`
    );

    return locales.filter((a) =>
      elegidas.includes(path.dirname(a.rutaRelativa))
    );
  }

  if (opcion === '3') {
    return await seleccionarExistentes(
      locales,
      'Escribe los números de las imágenes: '
    );
  }

  return locales; // Opción 1 o entrada vacía
}

// ------------------------------------------------------------
// Subida: local → Supabase (sync original)
// ------------------------------------------------------------
async function ejecutarSubida() {
  const modeLabel = DRY_RUN
    ? '🧪 DRY RUN (solo vista previa, sin subir)'
    : FORCE
      ? '⚡ FORCE (re-subir todo sin preguntar)'
      : '🚀 Modo interactivo';

  console.log(`\n${modeLabel}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!fs.existsSync(CARPETA_LOCAL)) {
    throw new Error(`No existe la carpeta local:\n${CARPETA_LOCAL}`);
  }

  // ESCANEAR LOCAL
  console.log('🔍 Escaneando local...');
  let locales = inventarioLocal();
  console.log(`📁 ${locales.length} imágenes locales válidas.`);

  // ESCANEAR SUPABASE
  console.log('☁️ Consultando Supabase...');
  const remotasRaw = await inventarioBucket(supabase, RUTA_SUPABASE);
  const remotas = new Set(
    remotasRaw.map((ruta) => rutaRelativaStorage(ruta))
  );
  console.log(`☁️ ${remotas.size} imágenes existentes en Supabase.`);

  const calcular = (completos) => {
    const mapaLocal = new Map(
      completos.map((archivo) => [
        rutaRelativaStorage(archivo.rutaDestino),
        archivo,
      ])
    );

    const nuevos = completos.filter(
      (archivo) =>
        !remotas.has(rutaRelativaStorage(archivo.rutaDestino))
    );

    const existentes = completos.filter(
      (archivo) =>
        remotas.has(rutaRelativaStorage(archivo.rutaDestino))
    );

    const sobrantes = [...remotas]
      .filter((ruta) => !mapaLocal.has(ruta))
      .sort();

    return { nuevos, existentes, sobrantes };
  };

  let { nuevos, existentes, sobrantes } = calcular(locales);

  // FILTRAR (solo interactivo, respecto a todo el set local)
  if (!FORCE && !DRY_RUN && !SOLO_NUEVO && locales.length > 0) {
    const filtrados = await filtrarLocales(locales);
    if (filtrados.length > 0 && filtrados.length !== locales.length) {
      locales = filtrados;
      ({ nuevos, existentes, sobrantes } = calcular(locales));
    }
  }

  // RESUMEN
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📁 Locales      : ${locales.length}`);
  console.log(`🆕 Nuevas       : ${nuevos.length}`);
  console.log(`♻️ A reemplazar  : ${existentes.length}`);
  console.log(`⚠️ Sobrantes    : ${sobrantes.length}`);

  // GESTIONAR SOBRANTES + ELEGIR SUBIDA
  let paraEliminar = [];
  let paraSubir = [];

  if (DRY_RUN) {
    paraSubir = SOLO_NUEVO ? [...nuevos] : [...nuevos, ...existentes];
    console.log(`\n🧪 DRY RUN: se procesarán ${paraSubir.length} imágenes para vista previa.\n`);
  } else if (FORCE) {
    paraSubir = SOLO_NUEVO ? [...nuevos] : [...nuevos, ...existentes];
    paraEliminar = await gestionarSobrantes(sobrantes);
    console.log(`\n⚡ FORCE: re-procesando ${paraSubir.length} imágenes.\n`);
  } else if (SOLO_NUEVO) {
    paraSubir = [...nuevos];
    console.log(`\n🔒 --solo-nuevo: solo se subirán ${nuevos.length} imagen(es) nueva(s). No se sobrescribe ni elimina nada.\n`);
  } else {
    paraEliminar = await gestionarSobrantes(sobrantes);
    paraSubir = await decidirSubida(nuevos, existentes);
  }

  // ELIMINAR
  let eliminados = 0;
  let erroresEliminacion = 0;

  if (!DRY_RUN) {
    for (const ruta of paraEliminar) {
      try {
        console.log(`🗑️ Eliminando ${ruta}...`);
        await eliminarStorage(supabase, `${RUTA_SUPABASE}${ruta}`);
        eliminados++;
      } catch (error) {
        erroresEliminacion++;
        console.error(`❌ Error eliminando ${ruta}: ${error.message}`);
      }
    }
  } else if (paraEliminar.length) {
    console.log(`\n🧪 DRY RUN: se eliminarían ${paraEliminar.length} imágenes sobrantes.`);
  }

  // PROCESAR Y SUBIR
  let subidos = 0;
  let erroresSubida = 0;

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(
    DRY_RUN
      ? '🧪 VISTA PREVIA DE PROCESAMIENTO'
      : '☁️ PROCESANDO Y SUBIENDO'
  );
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (PRESERVAR_ORIGINAL) {
    console.log('📐 Tamaño original conservado (solo conversión a WebP)');
  } else {
    console.log(`📐 Todas quedarán en ${TARGET_SIZE}x${TARGET_SIZE}px`);
    console.log('✂️ Márgenes blancos exteriores recortados');
    console.log('📏 Proporción original conservada');
  }

  console.log('🎨 Fondo blanco');
  console.log('');

  for (let i = 0; i < paraSubir.length; i++) {
    const archivo = paraSubir[i];
    const tamanoOriginal = fs.statSync(archivo.rutaCompleta).size;

    console.log(
      `[${i + 1}/${paraSubir.length}] ⚙️ ${archivo.rutaRelativa}`
    );

    try {
      const buffer = await procesarImagen(archivo.rutaCompleta, {
        rutaRelativa: archivo.rutaRelativa,
        original: PRESERVAR_ORIGINAL,
      });

      const tamanoProcesado = buffer.length;
      const ratio = (
        (1 - tamanoProcesado / tamanoOriginal) * 100
      ).toFixed(1);

      if (DRY_RUN) {
        console.log(
          `    📐 Original: ${formatearTamano(tamanoOriginal)} → Procesado: ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%)`
        );
      } else {
        await subirStorage(supabase, archivo.rutaDestino, buffer);
        subidos++;
        console.log(
          `    ✅ ${formatearTamano(tamanoOriginal)} → ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%) → ${archivo.rutaDestino}`
        );
      }
    } catch (error) {
      erroresSubida++;
      console.error(`    ❌ ${error.message}`);
    }
  }

  // RESULTADO
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(
    DRY_RUN
      ? '🧪 VISTA PREVIA FINALIZADA'
      : '🎉 PROCESO FINALIZADO'
  );
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (DRY_RUN) {
    console.log(`📐 Procesadas   : ${paraSubir.length} imágenes`);
    console.log(
      `📐 Resultado    : ${
        PRESERVAR_ORIGINAL ? 'WebP a tamaño original' : `${TARGET_SIZE}x${TARGET_SIZE}px WebP`
      }`
    );
    console.log(
      '\n💡 Para subir ejecuta: node scripts/sincronizar-imagenes-greenline.mjs --force'
    );
  } else {
    console.log(`☁️ Subidas        : ${subidos}`);
    console.log(`❌ Errores subida : ${erroresSubida}`);
    console.log(`🗑️ Eliminadas     : ${eliminados}`);
    console.log(`❌ Errores borrado: ${erroresEliminacion}`);
    console.log(
      `📐 Resultado      : ${
        PRESERVAR_ORIGINAL ? 'WebP a tamaño original' : `${TARGET_SIZE}x${TARGET_SIZE}px WebP`
      }`
    );
  }
}


// ============================================================
// MODO LOCAL: re-procesar PNG/JPG → WebP in-place
// ============================================================

const MANIFEST_PATH = path.resolve(__dirname, '../tmp/processed-manifest.json');

/** Extensiones que necesitan conversión (todo lo que NO es webp). */
const EXTENSIONES_A_CONVERTIR = ['.jpg', '.jpeg', '.png'];

function escaneaLocalNoWebP() {
  const archivos = explorarArchivos(CARPETA_LOCAL);
  return archivos
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return EXTENSIONES_A_CONVERTIR.includes(ext);
    })
    .map((rutaCompleta) => {
      const relativa = normalizarRuta(path.relative(CARPETA_LOCAL, rutaCompleta));
      const rutaWebp = relativa.replace(/\.[^/.]+$/, '.webp');
      const destinoAbs = path.join(CARPETA_LOCAL, rutaWebp.split('/').join(path.sep));
      return {
        rutaCompleta,
        rutaRelativa: relativa,
        rutaWebp,
        destinoAbs,
        yaExisteWebp: fs.existsSync(destinoAbs),
      };
    });
}

async function ejecutarLocal() {
  const modeLabel = DRY_RUN
    ? '🧪 DRY RUN (solo vista previa, sin escribir)'
    : FORCE
      ? '⚡ FORCE (sobrescribir WebP existentes)'
      : '🔧 Modo local';

  console.log(`\n${modeLabel}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!fs.existsSync(CARPETA_LOCAL)) {
    throw new Error(`No existe la carpeta local:\n${CARPETA_LOCAL}`);
  }

  console.log('🔍 Escaneando imágenes no-WebP...');
  const candidatos = escaneaLocalNoWebP();
  console.log(`📁 ${candidatos.length} imágenes PNG/JPG encontradas.\n`);

  // Separar: Ya tienen WebP vs No tienen WebP
  const conWebpExistente = candidatos.filter((c) => c.yaExisteWebp);
  const sinWebp = candidatos.filter((c) => !c.yaExisteWebp);

  console.log(`  ✅ Ya tienen WebP  : ${conWebpExistente.length}`);
  console.log(`  🔄 Para procesar  : ${sinWebp.length}`);
  console.log('');

  if (!sinWebp.length && !FORCE) {
    console.log('✅ No hay nada que procesar.');
    if (conWebpExistente.length) {
      console.log(`\n💡 Hay ${conWebpExistente.length} originales PNG/JPG cuyo WebP ya existe.`);
      console.log('   Usa --cleanup para eliminarlos.');
    }
    return;
  }

  // En modo FORCE, también re-procesar las que ya tienen WebP
  const paraProcesar = FORCE ? candidatos : sinWebp;

  // RESUMEN
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 RESUMEN: ${paraProcesar.length} imágenes a procesar`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (PRESERVAR_ORIGINAL) {
    console.log('📐 Tamaño original conservado (solo conversión a WebP)');
  } else {
    console.log(`📐 Productos: ${TARGET_SIZE}x${TARGET_SIZE}px WebP`);
    console.log('📐 Banners: 1920px ancho WebP');
  }
  console.log('✂️ Márgenes blancos recortados');
  console.log('🎨 Fondo blanco\n');

  // PROCESAR
  let procesadas = 0;
  let errores = 0;
  const manifest = [];

  for (let i = 0; i < paraProcesar.length; i++) {
    const archivo = paraProcesar[i];
    const tamanoOriginal = fs.statSync(archivo.rutaCompleta).size;

    console.log(`[${i + 1}/${paraProcesar.length}] ⚙️  ${archivo.rutaRelativa}`);

    try {
      const buffer = await procesarImagen(archivo.rutaCompleta, {
        rutaRelativa: archivo.rutaRelativa,
        original: PRESERVAR_ORIGINAL,
      });

      const tamanoProcesado = buffer.length;
      const ratio = ((1 - tamanoProcesado / tamanoOriginal) * 100).toFixed(1);

      if (DRY_RUN) {
        console.log(
          `    📐 ${formatearTamano(tamanoOriginal)} → ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%) → ${archivo.rutaWebp}`
        );
      } else {
        fs.mkdirSync(path.dirname(archivo.destinoAbs), { recursive: true });
        fs.writeFileSync(archivo.destinoAbs, buffer);
        procesadas++;
        manifest.push({
          original: archivo.rutaRelativa,
          webp: archivo.rutaWebp,
          originalSize: tamanoOriginal,
          webpSize: tamanoProcesado,
        });
        console.log(
          `    ✅ ${formatearTamano(tamanoOriginal)} → ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%) → ${archivo.rutaWebp}`
        );
      }
    } catch (error) {
      errores++;
      console.error(`    ❌ ${error.message}`);
    }
  }

  // GUARDAR MANIFEST
  if (!DRY_RUN && manifest.length) {
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\n📝 Manifiesto guardado: ${MANIFEST_PATH}`);
  }

  // RESUMEN FINAL
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(DRY_RUN ? '🧪 VISTA PREVIA FINALIZADA' : '🎉 PROCESAMIENTO LOCAL FINALIZADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⚙️  Procesadas  : ${DRY_RUN ? paraProcesar.length : procesadas}`);
  console.log(`❌ Errores     : ${errores}`);
  console.log(`📐 Resultado   : ${
    PRESERVAR_ORIGINAL ? 'WebP a tamaño original' : `${TARGET_SIZE}x${TARGET_SIZE}px WebP`
  }`);

  if (!DRY_RUN && manifest.length) {
    console.log(`\n📝 Manifiesto: ${MANIFEST_PATH}`);
    console.log('\n👉 Siguiente paso: verifica que todo se vea bien en el navegador.');
    console.log('   Cuando confirmes, ejecuta: node scripts/sincronizar-imagenes-greenline.mjs --cleanup');
  }

  if (DRY_RUN) {
    console.log(
      '\n💡 Para procesar ejecuta: node scripts/sincronizar-imagenes-greenline.mjs --local'
    );
  }
}


// ============================================================
// CLEANUP: eliminar originales que ya tienen WebP
// ============================================================

function categoriaDeCandidato(rutaRelativa) {
  const normalizada = normalizarRuta(rutaRelativa);
  if (normalizada.startsWith('imagenes/')) {
    const partes = normalizada.split('/');
    return partes.length > 1 ? partes[1] : 'imagenes';
  }
  return normalizada.split('/')[0] || '(raíz)';
}

// En modo interactivo permite acotar el borrado a ciertas carpetas
// (articulos, productos, caroussel, etc.). Enter = tomar todas.
async function seleccionarCarpetas(candidatos) {
  const carpetas = [
    ...new Set(candidatos.map((c) => categoriaDeCandidato(c.rutaRelativa))),
  ].sort();

  if (carpetas.length <= 1) return candidatos;

  const conteos = new Map();
  for (const c of candidatos) {
    const cat = categoriaDeCandidato(c.rutaRelativa);
    conteos.set(cat, (conteos.get(cat) || 0) + 1);
  }

  console.log('\n📁 Candidatos por carpeta:\n');
  carpetas.forEach((cat, i) =>
    console.log(`  ${String(i + 1).padStart(3)}. ${cat}  (${conteos.get(cat)})`)
  );

  console.log(
    '\n👉 Elige qué carpetas eliminar (rangos/comas/"all"). Enter = tomar todas.'
  );
  const respuesta = await preguntar('👉 Opción: ');

  const indices = parseSeleccion(respuesta, carpetas.length);
  if (!indices.length) {
    console.log('\n🗑️ Se tomarán TODAS las carpetas.');
    return candidatos;
  }

  const elegidas = new Set(indices.map((i) => carpetas[i]));
  const filtrados = candidatos.filter((c) =>
    elegidas.has(categoriaDeCandidato(c.rutaRelativa))
  );

  console.log(
    `\n📁 Filtro aplicado: ${filtrados.length} de ${candidatos.length} candidato(s) en ${elegidas.size} carpeta(s).`
  );
  return filtrados;
}

async function ejecutarCleanup() {
  console.log('\n🧹 CLEANUP — Eliminar originales PNG/JPG procesados');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Intentar leer manifest; si no existe, buscar por duplicados en disco
  let candidatos = [];

  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    candidatos = manifest
      .map((entry) => {
        const originalAbs = path.join(CARPETA_LOCAL, entry.original.split('/').join(path.sep));
        const webpAbs = path.join(CARPETA_LOCAL, entry.webp.split('/').join(path.sep));
        if (fs.existsSync(originalAbs) && fs.existsSync(webpAbs)) {
          return {
            rutaRelativa: entry.original,
            originalAbs,
            webpAbs,
            originalSize: entry.originalSize,
          };
        }
        return null;
      })
      .filter(Boolean);
    console.log(`📋 Manifiesto encontrado: ${candidatos.length} candidatos.\n`);
  } else {
    console.log('⚠️ No se encontró manifiesto. Buscando en disco...\n');
    const todosNoWebP = escaneaLocalNoWebP();
    candidatos = todosNoWebP
      .filter((c) => c.yaExisteWebp)
      .map((c) => ({
        rutaRelativa: c.rutaRelativa,
        originalAbs: c.rutaCompleta,
        webpAbs: c.destinoAbs,
        originalSize: fs.statSync(c.rutaCompleta).size,
      }));
    console.log(`🔍 ${candidatos.length} originales con WebP existente encontrados en disco.\n`);
  }

  if (!candidatos.length) {
    console.log('✅ No hay originales para eliminar.');
    return;
  }

  // Filtrar por carpeta (solo interactivo; también aplica en --dry-run)
  if (process.stdin.isTTY && candidatos.length > 0) {
    candidatos = await seleccionarCarpetas(candidatos);
    if (!candidatos.length) {
      console.log('✅ Ningún candidato tras el filtro. No se eliminará nada.');
      return;
    }
  }

  // Mostrar lista
  console.log('Archivos que se eliminarían:\n');
  let totalBytes = 0;
  candidatos.forEach((c, i) => {
    const kb = (c.originalSize / 1024).toFixed(1);
    totalBytes += c.originalSize;
    console.log(`  ${String(i + 1).padStart(4)}. ${c.rutaRelativa} (${kb} KB)`);
  });
  console.log(`\n  Total: ${candidatos.length} archivos, ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);

  if (DRY_RUN) {
    console.log('\n🧪 DRY RUN: nada se elimina.');
    console.log('\n💡 Para ejecutar: node scripts/sincronizar-imagenes-greenline.mjs --cleanup');
    return;
  }

  // Confirmar
  if (process.stdin.isTTY) {
    const rta = (
      await preguntar(
        `\n¿Eliminar ${candidatos.length} archivos? (s/n): `
      )
    )
      .trim()
      .toLowerCase();

    if (!SI.includes(rta)) {
      console.log('❌ Cancelado. No se eliminó nada.');
      return;
    }
  }

  // Eliminar
  let eliminados = 0;
  let errores = 0;

  for (const c of candidatos) {
    try {
      fs.unlinkSync(c.originalAbs);
      eliminados++;
      console.log(`  🗑️ ${c.rutaRelativa}`);
    } catch (error) {
      errores++;
      console.error(`  ❌ ${c.rutaRelativa}: ${error.message}`);
    }
  }

  // Limpiar manifiesto
  if (fs.existsSync(MANIFEST_PATH)) {
    fs.unlinkSync(MANIFEST_PATH);
    console.log('\n📝 Manifiesto eliminado.');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧹 CLEANUP FINALIZADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🗑️ Eliminados  : ${eliminados}`);
  console.log(`❌ Errores     : ${errores}`);
}


// ============================================================
// INICIAR
// ============================================================

const ejecutar = CLEANUP
  ? ejecutarCleanup
  : LOCAL
    ? ejecutarLocal
    : DESCARGAR
      ? ejecutarDescarga
      : ejecutarSubida;

ejecutar()
  .catch((error) =>
    console.error(`\n💥 ERROR FATAL: ${error.message}`)
  )
  .finally(() => rl.close());
