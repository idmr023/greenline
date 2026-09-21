// ============================================================
// image-utils.mjs — Utilidades compartidas de imagen
// Usado por: sincronizar-imagenes, descargar-imagenes, backend/blog
// ============================================================

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuración ───────────────────────────────────────────

export const BUCKET = 'Greenline_database';

export const EXTENSIONES_VALIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

export const WEBP_QUALITY = 90;
export const TARGET_SIZE = 800;
export const TRIM_THRESHOLD = 12;
export const TARGET_BANNER_WIDTH = 1920;
export const STORAGE_PAGE_SIZE = 1000;

export const PRESETS_BANNER = ['caroussel/', 'banner_categoria_producto/'];

// ── Helpers ─────────────────────────────────────────────────

export function normalizarRuta(ruta) {
  return ruta.split(path.sep).join('/').replace(/^\/+/, '');
}

export function esBannerPanoramico(rutaRelativa = '') {
  const normalizada = normalizarRuta(rutaRelativa);
  return PRESETS_BANNER.some((prefijo) => normalizada.startsWith(prefijo));
}

export function extensionValida(filePath) {
  return EXTENSIONES_VALIDAS.includes(path.extname(filePath).toLowerCase());
}

export function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ── Procesamiento de imagen (sharp pipeline) ────────────────

/**
 * Procesa una imagen: auto-orientación EXIF → flatten → webp.
 * @param {string|Buffer} input - Ruta de archivo o Buffer con los bytes
 * @param {object} opts
 * @param {string} opts.rutaRelativa - Ruta relativa (para detectar banners)
 * @param {boolean} opts.original - Si true, solo convierte a webp sin resize
 * @param {number} opts.targetSize - Tamaño del lienzo cuadrado (default 800)
 * @returns {Promise<Buffer>} Buffer WebP
 */
export async function procesarImagen(input, opts = {}) {
  const { rutaRelativa = '', original = true, targetSize = TARGET_SIZE } = opts;

  const pipeline = sharp(input, { failOn: 'none' })
    .rotate()
    .flatten({ background: '#ffffff' });

  return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}

// ── Inventario de Supabase Storage ──────────────────────────

/**
 * Lista recursivamente todos los archivos en un prefijo del bucket.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} carpeta - Prefijo a recorrer
 * @param {object} opts
 * @param {boolean} opts.soloImagenes - Si true, filtra solo extensiones de imagen
 * @returns {Promise<string[]>} Rutas relativas de archivos
 */
export async function inventarioBucket(supabase, carpeta, opts = {}) {
  const { soloImagenes = false } = opts;
  const archivos = new Set();

  async function listarPagina(Actual, offset) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(Actual, {
        limit: STORAGE_PAGE_SIZE,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });
    if (error) throw new Error(`Error listando ${Actual}: ${error.message}`);
    return data || [];
  }

  function procesarItem(item, Actual) {
    const ruta = Actual ? `${Actual}/${item.name}` : item.name;
    const esCarpeta = item.id === null || item.metadata === null;
    if (esCarpeta) {
      return { ruta, esCarpeta: true };
    }
    if (!soloImagenes || extensionValida(ruta)) {
      archivos.add(ruta);
    }
    return null;
  }

  async function recorrer(Actual) {
    let offset = 0;
    while (true) {
      const data = await listarPagina(Actual, offset);
      if (!data.length) break;

      for (const item of data) {
        const procesado = procesarItem(item, Actual);
        if (procesado) {
          await recorrer(procesado.ruta);
        }
      }

      if (data.length < STORAGE_PAGE_SIZE) break;
      offset += STORAGE_PAGE_SIZE;
    }
  }

  await recorrer(carpeta.replace(/\/$/, ''));
  return [...archivos].sort((a, b) => a.localeCompare(b, 'es'));
}

// ── Upload a Supabase Storage ───────────────────────────────

/**
 * Sube un buffer procesado a Supabase Storage.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} destino - Ruta destino en el bucket
 * @param {Buffer} buffer - Buffer WebP
 * @param {object} opts
 */
export async function subirStorage(supabase, destino, buffer, opts = {}) {
  const { upsert = true, cacheControl = '0' } = opts;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(destino, buffer, {
      upsert,
      contentType: 'image/webp',
      cacheControl,
    });
  if (error) throw error;
}

// ── Delete de Supabase Storage ──────────────────────────────

/**
 * Elimina un archivo del bucket.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} ruta - Ruta completa en el bucket
 */
export async function eliminarStorage(supabase, ruta) {
  const { error } = await supabase.storage.from(BUCKET).remove([ruta]);
  if (error) throw error;
}
