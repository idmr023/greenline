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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Faltan las variables VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Modo descarga: trae imágenes de Supabase → local (inverso del sync).
// El script se convierte en descargar-imagenes cuando está presente.
const DESCARGAR = ARGS.includes('--descargar') || ARGS.includes('--download') || ARGS.includes('-d');

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
  --dry-run    Vista previa: procesa imágenes y muestra before/without subir
  --force      Re-subir todo sin preguntar (override interactivo)
  --original   No redimensiona ni recorta: sube cada imagen en su tamaño
               original, solo convertida a WebP (conserva la calidad).
               Además re-subirá también las imágenes ya existentes en
               Supabase (con confirmación), reemplazándolas.
  --help, -h   Mostrar esta ayuda

Opciones (descarga Supabase → local, modo inverso):
  --descargar, -d, --download   Trae imágenes del bucket a public/assets.
  --force      Sobrescribir archivos locales existentes (en modo descarga)
  --original   Descarga sin redimensionar (solo conversión a WebP)
  --dry-run    Muestra qué se descargaría sin escribir

Ejemplos:
  node scripts/sincronizar-imagenes-greenline.mjs --dry-run
  node scripts/sincronizar-imagenes-greenline.mjs --force
  node scripts/sincronizar-imagenes-greenline.mjs --original
  node scripts/sincronizar-imagenes-greenline.mjs
  node scripts/sincronizar-imagenes-greenline.mjs --descargar
  node scripts/sincronizar-imagenes-greenline.mjs --descargar --force
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

const confirmar = async (pregunta) =>
  ['s', 'si'].includes(
    (
      await preguntar(`${pregunta} (s/n): `)
    )
      .trim()
      .toLowerCase()
  );


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
  pregunta = '👉 ¿Cuáles quieres sobrescribir? '
) {
  if (!existentes.length) {
    return [];
  }

  existentes.forEach((archivo, index) => {
    console.log(
      `${String(index + 1).padStart(4)}. ${archivo.rutaRelativa}`
    );
  });

  console.log(
    '\nEscribe números separados por coma o "all" para seleccionar todas.\n'
  );

  const respuesta = (await preguntar(pregunta)).trim().toLowerCase();

  if (respuesta === 'all') {
    return existentes;
  }

  const indices = [
    ...new Set(
      respuesta
        .split(',')
        .map((valor) => Number.parseInt(valor.trim(), 10))
        .filter(
          (numero) =>
            Number.isInteger(numero) && numero >= 1 && numero <= existentes.length
        )
    ),
  ];

  return indices.map((numero) => existentes[numero - 1]);
}


// ============================================================
// GESTIONAR SOBRANTES
// ============================================================

async function gestionarSobrantes(sobrantes) {
  if (!sobrantes.length) {
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
      `¿Confirmas eliminar las ${sobrantes.length} imágenes`
    );
    return confirmarEliminacion ? sobrantes : [];
  }

  if (opcion === '3') {
    const seleccionadas = await seleccionarExistentes(
      sobrantes.map((rutaRelativa) => ({ rutaRelativa })),
      '👉 ¿Cuáles quieres eliminar? '
    );
    const rutas = seleccionadas.map((archivo) => archivo.rutaRelativa);
    const confirmarEliminacion = await confirmar(
      `¿Confirmas eliminar las ${rutas.length} imágenes seleccionadas`
    );
    return confirmarEliminacion ? rutas : [];
  }

  console.log('❌ Opción inválida. Se conservarán.');
  return [];
}


// ============================================================
// ELEGIR QUÉ SUBIR
// ============================================================

async function elegirSubida(nuevos, existentes) {
  console.log('\n¿Qué quieres subir?\n');
  console.log('1. 🔄 Todo nuevamente');
  console.log('2. 🆕 Solo lo nuevo');
  console.log('3. 🆕♻️ Lo nuevo + elegir existentes para sobrescribir');
  console.log('4. ❌ No subir imágenes\n');

  const opcion = (await preguntar('👉 Opción [1-4]: ')).trim();

  if (opcion === '4') return [];

  if (opcion === '1') {
    const total = nuevos.length + existentes.length;
    const confirmarTodo = await confirmar(
      `¿Confirmas volver a procesar y subir ${total} imágenes`
    );
    return confirmarTodo ? [...nuevos, ...existentes] : [];
  }

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
    const seleccionadas = await seleccionarExistentes(existentes);
    const total = [...nuevos, ...seleccionadas];
    if (!total.length) return [];
    const confirmarSeleccion = await confirmar(
      `¿Confirmas subir ${total.length} imágenes`
    );
    return confirmarSeleccion ? total : [];
  }

  console.log('❌ Opción inválida.');
  return [];
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
// NUEVO: FILTRAR LOCALES (CARPETAS E IMÁGENES)
// ============================================================
// ============================================================
// NUEVO: FILTRAR LOCALES (SOPORTA RANGOS EJ: 1-5, 8, 10-12)
// ============================================================
async function filtrarLocales(locales) {
  console.log('\n¿Deseas procesar todo o filtrar tu subida?');
  console.log('1. 🌐 Procesar todo (Predeterminado)');
  console.log('2. 📁 Elegir carpetas (Soporta rangos como 1-5)');
  console.log('3. 🖼️ Elegir imágenes específicas');

  const opcion = (await preguntar('\n👉 Opción [1-3]: ')).trim(); //[cite: 1]

  if (opcion === '2') {
    // Agrupa todas las rutas únicas (mostrará imagenes/articulos, imagenes/tienda, etc.)
    const carpetas = [...new Set(locales.map(a => path.dirname(a.rutaRelativa)))].sort();
    
    console.log('\nCarpetas disponibles:');
    carpetas.forEach((c, index) => console.log(`${String(index + 1).padStart(3)}. ${c || '(Raíz)'}`));
    
    const respuesta = (await preguntar('\n👉 Escribe los números (Ej: 1-8, 10, 12-15): ')).trim(); //[cite: 1]
    
    // Lógica inteligente para procesar rangos y comas
    const indices = new Set();
    respuesta.split(',').forEach(parte => {
      const rango = parte.trim().split('-');
      
      if (rango.length === 2) {
        // Es un rango (ej: 1-8)
        const inicio = parseInt(rango[0], 10);
        const fin = parseInt(rango[1], 10);
        
        if (!isNaN(inicio) && !isNaN(fin) && inicio <= fin) {
          for (let i = inicio; i <= fin; i++) {
            if (i >= 1 && i <= carpetas.length) indices.add(i - 1);
          }
        }
      } else {
        // Es un número individual (ej: 9)
        const num = parseInt(parte, 10);
        if (!isNaN(num) && num >= 1 && num <= carpetas.length) indices.add(num - 1);
      }
    });
    
    if (indices.size === 0) return locales; // Si no hay selección válida, procesa todo
    
    const elegidas = Array.from(indices).map(i => carpetas[i]);
    console.log(`\nFiltro aplicado: Seleccionaste ${elegidas.length} carpetas.`);
    
    return locales.filter(a => elegidas.includes(path.dirname(a.rutaRelativa)));
  }

  if (opcion === '3') {
    // Aquí reutilizamos tu función existente para listar imágenes individuales
    return await seleccionarExistentes(locales, '👉 Escribe los números de las imágenes: '); //[cite: 1]
  }

  return locales; // Opción 1 o cualquier entrada vacía
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

  // --- NUEVO BLOQUE DE FILTRADO ---
  if (!FORCE && locales.length > 0) {
    locales = await filtrarLocales(locales);
    console.log(`\n✅ Continuamos con ${locales.length} imágenes tras el filtrado.`);
  }
  // --------------------------------

  // ESCANEAR SUPABASE
  console.log('☁️ Consultando Supabase...');
  const remotasRaw = await inventarioBucket(supabase, RUTA_SUPABASE);
  const remotas = new Set(
    remotasRaw.map((ruta) => rutaRelativaStorage(ruta))
  );
  console.log(`☁️ ${remotas.size} imágenes existentes en Supabase.`);

  // COMPARAR
  const mapaLocal = new Map(
    locales.map((archivo) => [
      rutaRelativaStorage(archivo.rutaDestino),
      archivo,
    ])
  );

  const nuevos = locales.filter(
    (archivo) =>
      !remotas.has(rutaRelativaStorage(archivo.rutaDestino))
  );

  const existentes = locales.filter(
    (archivo) =>
      remotas.has(rutaRelativaStorage(archivo.rutaDestino))
  );

  const sobrantes = [...remotas]
    .filter((ruta) => !mapaLocal.has(ruta))
    .sort();

  // RESUMEN
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📁 Locales      : ${locales.length}`);
  console.log(`🆕 Nuevas       : ${nuevos.length}`);
  console.log(`♻️ Existentes   : ${existentes.length}`);
  console.log(`⚠️ Sobrantes    : ${sobrantes.length}`);

  // GESTIONAR SOBRANTES + ELEGIR SUBIDA
  let paraEliminar = [];
  let paraSubir = [];

  if (DRY_RUN) {
    paraSubir = [...nuevos, ...existentes];
    console.log(`\n🧪 DRY RUN: se procesarán ${paraSubir.length} imágenes para vista previa.\n`);
  } else if (FORCE) {
    paraSubir = [...nuevos, ...existentes];
    paraEliminar = await gestionarSobrantes(sobrantes);
    console.log(`\n⚡ FORCE: re-procesando ${paraSubir.length} imágenes.\n`);
  } else if (PRESERVAR_ORIGINAL) {
    // --original: re-subir también las existentes (upsert reemplaza el archivo)
    const totalReemplazo = [...nuevos, ...existentes];
    const confirmarReemplazo = await confirmar(
      `¿Confirmas re-subir las ${totalReemplazo.length} imágenes (--original reemplaza las existentes`
    );
    if (confirmarReemplazo) {
      paraSubir = totalReemplazo;
      paraEliminar = await gestionarSobrantes(sobrantes);
    } else {
      console.log('❌ Proceso cancelado. No se subió ni eliminó nada.');
    }
  } else {
    paraEliminar = await gestionarSobrantes(sobrantes);
    paraSubir = await elegirSubida(nuevos, existentes);
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
// INICIAR
// ============================================================

const ejecutar = DESCARGAR ? ejecutarDescarga : ejecutarSubida;

ejecutar()
  .catch((error) =>
    console.error(`\n💥 ERROR FATAL: ${error.message}`)
  )
  .finally(() => rl.close());
