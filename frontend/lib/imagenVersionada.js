/**
 * Versionado (cache-busting) GLOBAL de imágenes.
 *
 * Cuando se reemplaza una foto que conserva el mismo nombre de archivo en el
 * bucket (o en el hosting estático), el navegador sigue mostrando la copia en
 * caché. Añadir `?v=...` a la URL fuerza a recargar la versión nueva.
 *
 * Se versionan:
 *   - TODA URL pública de Supabase Storage (`/storage/v1/object/public/`).
 *   - Rutas locales estáticas que empiezan por `/assets/` o `./assets/`
 *     (carrusel, "Nosotros" y otras imágenes servidas desde public/).
 *
 * La estampa se toma de la variable de build `VITE_IMAGE_VERSION` (la genera
 * scripts/set-build-version.mjs en cada `npm run build`) o de la constante por
 * defecto. Búmpala cada vez que subas/reemplaces fotos para refrescar el caché.
 */

function buildVersion() {
  const env = import.meta.env?.VITE_IMAGE_VERSION;
  if (env) return String(env);
  return "20260915";
}

const VERSION = buildVersion();

const STORAGE_PUBLIC = "/storage/v1/object/public/";
const LOCAL_ASSETS_RE = /^\.?\/assets\//;
const VERSION_RE = /[?&]v=([\w.-]+)/;

function agregarVersion(src) {
  return src + (src.includes("?") ? "&" : "?") + `v=${VERSION}`;
}

export function versionarImagen(src) {
  if (!src) return src;
  const esStorage = src.includes(STORAGE_PUBLIC);
  const esLocal = LOCAL_ASSETS_RE.test(src);
  if (!esStorage && !esLocal) return src;
  if (VERSION_RE.test(src)) return src;
  return agregarVersion(src);
}

/**
 * Aplica versionado (cache-busting) a las imágenes dentro de un HTML
 * (p. ej. el `content_html` de los artículos del blog): reescribe el
 * atributo `src` de cada <img> cuando todavía no tiene `?v=`.
 */
export function versionarHtml(html) {
  if (!html) return html;
  return html.replace(
    /(<img[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
    (match, antes, src, despues) => {
      const versionada = versionarImagen(src);
      return versionada === src ? match : `${antes}${versionada}${despues}`;
    }
  );
}