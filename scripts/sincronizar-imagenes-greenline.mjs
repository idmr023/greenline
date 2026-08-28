import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import dotenv from 'dotenv';
import readline from 'readline';

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

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// ============================================================
// CONFIGURACIÓN
// ============================================================

const BUCKET = 'Greenline_database';

const RUTA_SUPABASE = 'assets/imagenes/';

const CARPETA_LOCAL =
  'C:\\Users\\Marketing\\greenline\\public\\assets';

const EXTENSIONES_VALIDAS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
];

const WEBP_QUALITY = 80;

// Todas las imágenes terminarán en 320x320
const TARGET_SIZE = 320;

// Tolerancia para detectar bordes blancos.
// Un valor mayor permite eliminar blancos ligeramente grisáceos.
const TRIM_THRESHOLD = 12;

const STORAGE_PAGE_SIZE = 1000;

// ============================================================
// CLI FLAGS
// ============================================================

const ARGS = process.argv.slice(2);
const FORCE = ARGS.includes('--force');
const DRY_RUN = ARGS.includes('--dry-run');

if (ARGS.includes('--help') || ARGS.includes('-h')) {
  console.log(`
GREENLINE IMAGE SYNC

Uso:
  node scripts/sincronizar-imagenes-greenline.mjs [opciones]

Opciones:
  --dry-run    Vista previa: procesa imágenes y muestra before/without subir
  --force      Re-subir todo sin preguntar (override interactivo)
  --help, -h   Mostrar esta ayuda

Ejemplos:
  node scripts/sincronizar-imagenes-greenline.mjs --dry-run
  node scripts/sincronizar-imagenes-greenline.mjs --force
  node scripts/sincronizar-imagenes-greenline.mjs
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
// NORMALIZACIÓN DE RUTAS
// ============================================================

function normalizarRuta(ruta) {
  return ruta
    .split(path.sep)
    .join('/')
    .replace(/^\/+/, '');
}

function rutaRelativaStorage(ruta) {
  const prefijo =
    RUTA_SUPABASE.replace(/\/$/, '');

  const rutaNormalizada =
    normalizarRuta(ruta);

  if (
    rutaNormalizada.startsWith(
      `${prefijo}/`
    )
  ) {
    return rutaNormalizada.slice(
      prefijo.length + 1
    );
  }

  return rutaNormalizada.replace(
    /^\/+/,
    ''
  );
}


// ============================================================
// OBTENER RUTA DE DESTINO
// ============================================================

function obtenerRutaDestino(
  rutaCompleta
) {
  const relativa = normalizarRuta(
    path.relative(
      CARPETA_LOCAL,
      rutaCompleta
    )
  );

  const extension =
    path.extname(relativa).toLowerCase();

  if (
    !EXTENSIONES_VALIDAS.includes(
      extension
    )
  ) {
    return null;
  }

  return (
    `${RUTA_SUPABASE}` +
    relativa.replace(
      /\.[^/.]+$/,
      '.webp'
    )
  );
}


// ============================================================
// EXPLORAR ARCHIVOS
// ============================================================

function explorarArchivos(
  dir,
  lista = []
) {
  for (
    const nombre of fs.readdirSync(dir)
  ) {
    const absoluta = path.join(
      dir,
      nombre
    );

    if (
      fs.statSync(absoluta).isDirectory()
    ) {
      explorarArchivos(
        absoluta,
        lista
      );
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
  return explorarArchivos(
    CARPETA_LOCAL
  )
    .filter((file) =>
      EXTENSIONES_VALIDAS.includes(
        path.extname(file).toLowerCase()
      )
    )
    .map((rutaCompleta) => ({
      rutaCompleta,

      rutaRelativa: normalizarRuta(
        path.relative(
          CARPETA_LOCAL,
          rutaCompleta
        )
      ),

      rutaDestino:
        obtenerRutaDestino(
          rutaCompleta
        ),
    }))
    .filter(
      (archivo) =>
        archivo.rutaDestino
    );
}


// ============================================================
// INVENTARIO DE SUPABASE
// ============================================================

async function inventarioSupabase() {
  const archivos = new Set();

  async function recorrer(carpeta) {
    let offset = 0;

    while (true) {
      const {
        data,
        error,
      } = await supabase.storage
        .from(BUCKET)
        .list(carpeta, {
          limit:
            STORAGE_PAGE_SIZE,

          offset,

          sortBy: {
            column: 'name',
            order: 'asc',
          },
        });

      if (error) {
        throw new Error(
          `Error listando ${carpeta}: ${error.message}`
        );
      }

      if (!data?.length) {
        break;
      }

      for (const item of data) {
        const ruta = carpeta
          ? `${carpeta}/${item.name}`
          : item.name;

        const esCarpeta =
          item.id === null ||
          item.metadata === null;

        if (esCarpeta) {
          await recorrer(ruta);
        } else {
          archivos.add(
            rutaRelativaStorage(ruta)
          );
        }
      }

      if (
        data.length <
        STORAGE_PAGE_SIZE
      ) {
        break;
      }

      offset +=
        STORAGE_PAGE_SIZE;
    }
  }

  await recorrer(
    RUTA_SUPABASE.replace(/\/$/, '')
  );

  return archivos;
}


// ============================================================
// PROCESAR IMAGEN
// ============================================================
//
// Flujo:
//
// Imagen original
//      ↓
// Transparencia → blanco
//      ↓
// Recortar márgenes blancos
//      ↓
// Mantener proporción
//      ↓
// Ampliar o reducir
//      ↓
// Centrar
//      ↓
// Lienzo 320x320
//      ↓
// WebP
//
// ============================================================

async function procesarImagen(
  rutaCompleta
) {
  return sharp(
    rutaCompleta,
    {
      failOn: 'none',
    }
  )
    // Convertir transparencia en blanco
    .flatten({
      background: '#ffffff',
    })

    // Eliminar únicamente el margen
    // blanco exterior
    .trim({
      background: '#ffffff',
      threshold:
        TRIM_THRESHOLD,
    })

    // Ajustar al lienzo 320x320
    // sin deformar
    .resize({
      width: TARGET_SIZE,
      height: TARGET_SIZE,

      fit: 'contain',

      position: 'center',

      background: '#ffffff',

      // Permite ampliar imágenes pequeñas
      withoutEnlargement: false,
    })

    // Convertir a WebP
    .webp({
      quality: WEBP_QUALITY,
    })

    .toBuffer();
}


// ============================================================
// SUBIR IMAGEN
// ============================================================

async function subirImagen(
  archivo
) {
  const buffer =
    await procesarImagen(
      archivo.rutaCompleta
    );

  const {
    error,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      archivo.rutaDestino,
      buffer,
      {
        upsert: true,

        contentType:
          'image/webp',

        cacheControl:
          '31536000',
      }
    );

  if (error) {
    throw error;
  }
}


// ============================================================
// ELIMINAR IMAGEN
// ============================================================

async function eliminarImagen(
  rutaRelativa
) {
  const {
    error,
  } = await supabase.storage
    .from(BUCKET)
    .remove([
      `${RUTA_SUPABASE}${rutaRelativa}`,
    ]);

  if (error) {
    throw error;
  }
}


// ============================================================
// SELECCIONAR EXISTENTES
// ============================================================

async function seleccionarExistentes(
  existentes,
  pregunta =
    '👉 ¿Cuáles quieres sobrescribir? '
) {
  if (!existentes.length) {
    return [];
  }

  existentes.forEach(
    (archivo, index) => {
      console.log(
        `${String(index + 1).padStart(
          4
        )}. ${archivo.rutaRelativa}`
      );
    }
  );

  console.log(
    '\nEscribe números separados por coma o "all" para seleccionar todas.\n'
  );

  const respuesta = (
    await preguntar(pregunta)
  )
    .trim()
    .toLowerCase();

  if (respuesta === 'all') {
    return existentes;
  }

  const indices = [
    ...new Set(
      respuesta
        .split(',')
        .map((valor) =>
          Number.parseInt(
            valor.trim(),
            10
          )
        )
        .filter(
          (numero) =>
            Number.isInteger(
              numero
            ) &&
            numero >= 1 &&
            numero <=
              existentes.length
        )
    ),
  ];

  return indices.map(
    (numero) =>
      existentes[numero - 1]
  );
}


// ============================================================
// GESTIONAR SOBRANTES
// ============================================================
//
// Sobrantes = archivos que existen en
// Supabase pero NO existen actualmente
// en la carpeta local.
//
// ============================================================

async function gestionarSobrantes(
  sobrantes
) {
  if (!sobrantes.length) {
    return [];
  }

  console.log(
    '\n⚠️ IMÁGENES QUE ESTÁN EN SUPABASE PERO NO EN LOCAL:\n'
  );

  sobrantes.forEach(
    (ruta, index) => {
      console.log(
        `${String(index + 1).padStart(
          4
        )}. ${ruta}`
      );
    }
  );

  console.log(`
1. Mantener todas
2. Eliminar todas
3. Elegir cuáles eliminar
4. Cancelar
`);

  const opcion = (
    await preguntar(
      '👉 Opción [1-4]: '
    )
  ).trim();

  // Mantener
  if (opcion === '1') {
    return [];
  }

  // Cancelar
  if (opcion === '4') {
    throw new Error(
      'Proceso cancelado por el usuario.'
    );
  }

  // Eliminar todas
  if (opcion === '2') {
    const confirmarEliminacion =
      await confirmar(
        `¿Confirmas eliminar las ${sobrantes.length} imágenes`
      );

    return confirmarEliminacion
      ? sobrantes
      : [];
  }

  // Elegir cuáles
  if (opcion === '3') {
    const seleccionadas =
      await seleccionarExistentes(
        sobrantes.map(
          (rutaRelativa) => ({
            rutaRelativa,
          })
        ),
        '👉 ¿Cuáles quieres eliminar? '
      );

    const rutas =
      seleccionadas.map(
        (archivo) =>
          archivo.rutaRelativa
      );

    const confirmarEliminacion =
      await confirmar(
        `¿Confirmas eliminar las ${rutas.length} imágenes seleccionadas`
      );

    return confirmarEliminacion
      ? rutas
      : [];
  }

  console.log(
    '❌ Opción inválida. Se conservarán.'
  );

  return [];
}


// ============================================================
// ELEGIR QUÉ SUBIR
// ============================================================

async function elegirSubida(
  nuevos,
  existentes
) {
  console.log(
    '\n¿Qué quieres subir?\n'
  );

  console.log(
    '1. 🔄 Todo nuevamente'
  );

  console.log(
    '2. 🆕 Solo lo nuevo'
  );

  console.log(
    '3. 🆕♻️ Lo nuevo + elegir existentes para sobrescribir'
  );

  console.log(
    '4. ❌ No subir imágenes\n'
  );

  const opcion = (
    await preguntar(
      '👉 Opción [1-4]: '
    )
  ).trim();

  // No subir
  if (opcion === '4') {
    return [];
  }

  // Todo
  if (opcion === '1') {
    const total =
      nuevos.length +
      existentes.length;

    const confirmarTodo =
      await confirmar(
        `¿Confirmas volver a procesar y subir ${total} imágenes`
      );

    return confirmarTodo
      ? [
          ...nuevos,
          ...existentes,
        ]
      : [];
  }

  // Solo nuevas
  if (opcion === '2') {
    if (!nuevos.length) {
      console.log(
        '✅ No hay imágenes nuevas.'
      );

      return [];
    }

    const confirmarNuevas =
      await confirmar(
        `¿Confirmas subir ${nuevos.length} imágenes nuevas`
      );

    return confirmarNuevas
      ? nuevos
      : [];
  }

  // Nuevas + seleccionadas
  if (opcion === '3') {
    const seleccionadas =
      await seleccionarExistentes(
        existentes
      );

    const total = [
      ...nuevos,
      ...seleccionadas,
    ];

    if (!total.length) {
      return [];
    }

    const confirmarSeleccion =
      await confirmar(
        `¿Confirmas subir ${total.length} imágenes`
      );

    return confirmarSeleccion
      ? total
      : [];
  }

  console.log(
    '❌ Opción inválida.'
  );

  return [];
}


// ============================================================
// EJECUCIÓN PRINCIPAL
// ============================================================

async function ejecutar() {
  const modeLabel = DRY_RUN
    ? '🧪 DRY RUN (solo vista previa, sin subir)'
    : FORCE
      ? '⚡ FORCE (re-subir todo sin preguntar)'
      : '🚀 Modo interactivo';

  console.log(`\n${modeLabel}`);
  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  );

  // Verificar carpeta local
  if (
    !fs.existsSync(
      CARPETA_LOCAL
    )
  ) {
    throw new Error(
      `No existe la carpeta local:\n${CARPETA_LOCAL}`
    );
  }

  // ----------------------------------------------------------
  // ESCANEAR LOCAL
  // ----------------------------------------------------------

  console.log(
    '🔍 Escaneando local...'
  );

  const locales =
    inventarioLocal();

  console.log(
    `📁 ${locales.length} imágenes locales válidas.`
  );

  // ----------------------------------------------------------
  // ESCANEAR SUPABASE
  // ----------------------------------------------------------

  console.log(
    '☁️ Consultando Supabase...'
  );

  const remotas =
    await inventarioSupabase();

  console.log(
    `☁️ ${remotas.size} imágenes existentes en Supabase.`
  );

  // ----------------------------------------------------------
  // COMPARAR
  // ----------------------------------------------------------

  const mapaLocal =
    new Map(
      locales.map(
        (archivo) => [
          rutaRelativaStorage(
            archivo.rutaDestino
          ),
          archivo,
        ]
      )
    );

  const nuevos =
    locales.filter(
      (archivo) =>
        !remotas.has(
          rutaRelativaStorage(
            archivo.rutaDestino
          )
        )
    );

  const existentes =
    locales.filter(
      (archivo) =>
        remotas.has(
          rutaRelativaStorage(
            archivo.rutaDestino
          )
        )
    );

  // Supabase pero no local
  const sobrantes =
    [...remotas]
      .filter(
        (ruta) =>
          !mapaLocal.has(ruta)
      )
      .sort();

  // ----------------------------------------------------------
  // RESUMEN
  // ----------------------------------------------------------

  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    '📊 RESUMEN'
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    `📁 Locales      : ${locales.length}`
  );

  console.log(
    `🆕 Nuevas       : ${nuevos.length}`
  );

  console.log(
    `♻️ Existentes   : ${existentes.length}`
  );

  console.log(
    `⚠️ Sobrantes    : ${sobrantes.length}`
  );

  // ----------------------------------------------------------
  // GESTIONAR SOBRANTES + ELEGIR SUBIDA
  // ----------------------------------------------------------

  let paraEliminar = [];
  let paraSubir = [];

  if (DRY_RUN) {
    // Dry-run: procesar TODO para mostrar before/after
    paraSubir = [...nuevos, ...existentes];
    console.log(`\n🧪 DRY RUN: se procesarán ${paraSubir.length} imágenes para vista previa.\n`);
  } else if (FORCE) {
    // Force: re-subir todo sin preguntar
    paraSubir = [...nuevos, ...existentes];
    paraEliminar = await gestionarSobrantes(sobrantes);
    console.log(`\n⚡ FORCE: re-procesando ${paraSubir.length} imágenes.\n`);
  } else {
    // Modo interactivo
    paraEliminar = await gestionarSobrantes(sobrantes);
    paraSubir = await elegirSubida(nuevos, existentes);
  }

  // ----------------------------------------------------------
  // ELIMINAR (skip en dry-run)
  // ----------------------------------------------------------

  let eliminados = 0;
  let erroresEliminacion = 0;

  if (!DRY_RUN) {
    for (
      const ruta of paraEliminar
    ) {
      try {
        console.log(
          `🗑️ Eliminando ${ruta}...`
        );

        await eliminarImagen(
          ruta
        );

        eliminados++;
      } catch (error) {
        erroresEliminacion++;

        console.error(
          `❌ Error eliminando ${ruta}: ${error.message}`
        );
      }
    }
  } else if (paraEliminar.length) {
    console.log(
      `\n🧪 DRY RUN: se eliminarían ${paraEliminar.length} imágenes sobrantes.`
    );
  }

  // ----------------------------------------------------------
  // PROCESAR Y SUBIR (o solo mostrar en dry-run)
  // ----------------------------------------------------------

  let subidos = 0;
  let erroresSubida = 0;

  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    DRY_RUN
      ? '🧪 VISTA PREVIA DE PROCESAMIENTO'
      : '☁️ PROCESANDO Y SUBIENDO'
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    `📐 Todas quedarán en ${TARGET_SIZE}x${TARGET_SIZE}px`
  );

  console.log(
    '🎨 Fondo blanco'
  );

  console.log(
    '✂️ Márgenes blancos exteriores recortados'
  );

  console.log(
    '📏 Proporción original conservada'
  );

  console.log(
    '🔎 Imágenes pequeñas ampliadas; grandes reducidas'
  );

  console.log('');

  for (
    let i = 0;
    i < paraSubir.length;
    i++
  ) {
    const archivo =
      paraSubir[i];

    const tamanoOriginal = fs.statSync(
      archivo.rutaCompleta
    ).size;

    console.log(
      `[${i + 1}/${paraSubir.length}] ⚙️ ${archivo.rutaRelativa}`
    );

    try {
      const buffer =
        await procesarImagen(
          archivo.rutaCompleta
        );

      const tamanoProcesado = buffer.length;
      const ratio = (
        (1 - tamanoProcesado / tamanoOriginal) *
        100
      ).toFixed(1);

      if (DRY_RUN) {
        // Solo mostrar comparación, no subir
        console.log(
          `    📐 Original: ${formatearTamano(tamanoOriginal)} → Procesado: ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%)`
        );
      } else {
        // Subir a Supabase
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(
            archivo.rutaDestino,
            buffer,
            {
              upsert: true,
              contentType: 'image/webp',
              cacheControl: '31536000',
            }
          );

        if (error) throw error;

        subidos++;

        console.log(
          `    ✅ ${formatearTamano(tamanoOriginal)} → ${formatearTamano(tamanoProcesado)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%) → ${archivo.rutaDestino}`
        );
      }
    } catch (error) {
      erroresSubida++;

      console.error(
        `    ❌ ${error.message}`
      );
    }
  }

  // ----------------------------------------------------------
  // RESULTADO
  // ----------------------------------------------------------

  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  console.log(
    DRY_RUN
      ? '🧪 VISTA PREVIA FINALIZADA'
      : '🎉 PROCESO FINALIZADO'
  );

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  if (DRY_RUN) {
    console.log(
      `📐 Procesadas   : ${paraSubir.length} imágenes`
    );
    console.log(
      `📐 Resultado    : ${TARGET_SIZE}x${TARGET_SIZE}px WebP`
    );
    console.log(
      '\n💡 Para subir ejecuta: node scripts/sincronizar-imagenes-greenline.mjs --force'
    );
  } else {
    console.log(
      `☁️ Subidas        : ${subidos}`
    );

    console.log(
      `❌ Errores subida : ${erroresSubida}`
    );

    console.log(
      `🗑️ Eliminadas     : ${eliminados}`
    );

    console.log(
      `❌ Errores borrado: ${erroresEliminacion}`
    );

    console.log(
      `📐 Resultado      : ${TARGET_SIZE}x${TARGET_SIZE}px WebP`
    );
  }
}


// ============================================================
// HELPERS
// ============================================================

function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}


// ============================================================
// INICIAR
// ============================================================

ejecutar()
  .catch(
    (error) =>
      console.error(
        `\n💥 ERROR FATAL: ${error.message}`
      )
  )
  .finally(
    () => rl.close()
  );