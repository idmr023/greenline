import { lazy } from 'react';

//////////////////////////////////////////////////////////////////////
/// ROUTING AUTOMÁTICO (file-based routing)
//////////////////////////////////////////////////////////////////////
// Las rutas se generan a partir de los archivos de frontend/pages/.
// Vite vigila el patrón glob: al crear, renombrar o borrar una página,
// las rutas se actualizan solas en dev (HMR) sin tocar App.jsx.
//
// Reglas:
// - Página sin override → ruta kebab-case derivada del archivo
//   (Promociones.jsx → /promociones, PoliticaPrivacidad.jsx → /politica-privacidad).
// - Página en construcción (sin default export) → sirve StubPage.
// - Overrides sólo para lo que el autoderivado no adivina.
// - Reservados (Home/NotFound/LoginPage/StubPage) se registran a mano en App.jsx.
//////////////////////////////////////////////////////////////////////

const pages = import.meta.glob('../frontend/pages/*.{jsx,tsx}');

// Rutas que no se pueden derivar del nombre del archivo
const ROUTING_OVERRIDES = {
  'Shop.jsx': 'tienda',
  'Us.jsx': 'nosotros',
  'Shops.jsx': 'tiendas',
  'Contact.jsx': 'contacto',
  'NovedadesPage.tsx': 'blog',
  'NovedadDetalle.tsx': 'novedades/:slug',
  'ProductPage.jsx': 'producto/:slug',
  'MiCuenta.jsx': { path: 'mi-cuenta', protected: true },
};

// Archivos con registro manual en App.jsx (excluidos del auto-scan)
const RESERVED = new Set(['Home.jsx', 'NotFoundPage.jsx', 'LoginPage.jsx', 'StubPage.jsx']);

// PoliticaPrivacidad.jsx → 'politica-privacidad'
function deriveSegment(filename) {
  const base = filename.replace(/\.(jsx|tsx)$/, '').replace(/Page$/, '');
  return base
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function routeFor(filename) {
  const override = ROUTING_OVERRIDES[filename];
  if (!override) return { path: deriveSegment(filename), protected: false };
  if (typeof override === 'string') return { path: override, protected: false };
  return { path: override.path, protected: Boolean(override.protected) };
}

export function buildRoutes() {
  const routes = [];
  const seen = new Set();

  for (const [file, loader] of Object.entries(pages)) {
    const filename = file.split('/').pop();
    if (RESERVED.has(filename)) continue;

    const { path, protected: isProtected } = routeFor(filename);
    if (seen.has(path)) {
      console.warn(`[routes] Colisión: ${file} deriva a /${path}, que ya está en uso. Renombra el archivo o agrega un override en src/routes.jsx.`);
      continue;
    }
    seen.add(path);

    const Component = lazy(() =>
      loader().then((m) => {
        // Página en construcción (sin default export) → stub
        if (m.default) return m;
        return import('../frontend/pages/StubPage');
      }),
    );

    routes.push({ path, Component, protected: isProtected });
  }

  return routes;
}