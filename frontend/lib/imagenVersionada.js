/**
 * Versionado (cache-busting) de imágenes del catálogo.
 *
 * Las fotos nuevas de familias como GL4 y M3 ECO comparten el mismo nombre de
 * archivo que las anteriores en Supabase Storage, por lo que el navegador
 * muestra copias en caché. Añadir `?v=...` fuerza a descargar la versión nueva.
 */

const FAMILIAS_VERSIONADAS = ['gl4', 'm3eco'];
const VERSION = '20260901';

export function versionarImagen(src) {
  if (!src) return src;
  const lower = src.toLowerCase();
  if (!FAMILIAS_VERSIONADAS.some((f) => lower.includes(`/${f}/`))) return src;
  return src + (src.includes('?') ? '&' : '?') + `v=${VERSION}`;
}