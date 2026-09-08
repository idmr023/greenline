/**
 * WS4 — Redirecciones QR / legado.
 *
 * El sitio anterior (WordPress) dejó enlaces impresos en QR y URLs antiguas que
 * ahora caen en la SPA (base de `redirection-export.json`). Este módulo resuelve
 * rutas viejas -> rutas nuevas de la app de forma síncrona y determinista.
 *
 * Añade aquí cualquier nueva ruta QR impresa que deba apuntar a una página.
 */

const LEGACY_EXACT = {
  '/tienda/bicicleta-electrica-tailg-fl2': '/producto/bicicleta-elctrica-plegable-fl2',
  '/greenline-empresa-lider-en-vehiculos': '/nosotros',
  '/nueva-tienda-comas': '/tiendas',
  '/nueva-tienda-greenline-comas': '/tiendas',
  '/china-y-transporte-peruano': '/blog',
  '/contenido-para-moto-gasolinera-pf': '/blog',
  '/nuevos-cascos': '/blog',
  '/costo-en-consumo-de-energia': '/blog',
  '/costo-en-mantener-una-moto-electrica': '/blog',
  '/mantenimiento-o-revision-para-una-moto-electrica': '/blog',
  '/diferencia-de-motos': '/blog',
  '/la-conversion-de-w-hp': '/blog',
  '/la-conversion-de-w-hp-2': '/blog',
  '/son-costosos-los-repuestos-de-una-moto-electrica': '/blog',
  '/acudir-al-soporte-tecnico': '/blog',
};

/**
 * Viejos slugs de producto (WooCommerce) -> slug actual en el catálogo.
 * Solo los modelos que interesa apuntar directo a su ficha; el resto de
 * `/tienda/*` antiguos cae a la tienda.
 */
const PRODUCTO_ALIASES = {
  'bicicleta-electrica-tailg-fl2': 'bicicleta-elctrica-plegable-fl2',
};

function normalizar(pathname) {
  return pathname.toLowerCase().replace(/\/+$/, '') || '/';
}

export function resolveLegacyPath(pathname, search = '') {
  const p = normalizar(pathname);

  if (LEGACY_EXACT[p]) return LEGACY_EXACT[p];

  // Bloques de la web anterior anclados a la home (¿cms_block=...?).
  if (p === '/' && search.includes('cms_block=')) {
    return search.includes('redes-gl') ? null : '/preguntas-frecuentes';
  }

  if (p.startsWith('/tienda/')) {
    const rest = p.slice('/tienda/'.length).replace(/\/+$/, '');
    const alias = PRODUCTO_ALIASES[rest];
    return alias ? `/producto/${alias}` : '/tienda';
  }

  if (p.startsWith('/woodmart_slide/')) return '/tienda';
  if (p.startsWith('/elementor-') || p === '/8886') return '/tienda';
  if (p.startsWith('/greenline-empresa-lider')) return '/nosotros';
  if (p.startsWith('/nueva-tienda-greenline')) return '/tiendas';
  if (p.startsWith('/novedades/')) return p;
  if (p.startsWith('/producto/')) return p;

  return null;
}