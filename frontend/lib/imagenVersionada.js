/**
 * Versionado (cache-busting) GLOBAL de imágenes de Supabase Storage.
 *
 * Cuando se reemplaza una foto que conserva el mismo nombre de archivo en el
 * bucket, el navegador sigue mostrando la copia en caché. Añadir `?v=...` a
 * TODA URL pública de Storage fuerza a recargar la versión nueva.
 *
 * La estampa se toma de la variable de build `VITE_IMAGE_VERSION` (si la defines
 * en Vercel, cada deploy la cambias ahí) o de la constante por defecto.
 * Búmpala cada vez que subas/reemplaces fotos para refrescar el caché.
 */

function buildVersion() {
  const env = import.meta.env?.VITE_IMAGE_VERSION;
  if (env) return String(env);
  return "20260915";
}

const VERSION = buildVersion();

const STORAGE_PUBLIC = "/storage/v1/object/public/";
const VERSION_RE = /[?&]v=([\w.-]+)/;

export function versionarImagen(src) {
  if (!src) return src;
  if (!src.includes(STORAGE_PUBLIC)) return src;
  if (VERSION_RE.test(src)) return src;
  return src + (src.includes("?") ? "&" : "?") + `v=${VERSION}`;
}