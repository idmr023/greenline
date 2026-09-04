import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'redirection-export.json');
const OUT = join(ROOT, 'redirection-export-app.json');

const BASE = 'https://greenline-eta.vercel.app';

function rutaDeMapa(targetAbsoluteUrl) {
  const target = new URL(targetAbsoluteUrl, BASE);
  const path = target.pathname.replace(/\/+$/, '') || '/';
  const query = target.search;

  if (target.hostname === 'greenline-eta.vercel.app') return null; // ya apunta a la app (raíz)

  if (path === '/tienda/bicicleta-electrica-tailg-fl2') return '/producto/bicicleta-elctrica-plegable-fl2';
  if (path === '/greenline-empresa-lider-en-vehiculos') return '/nosotros';
  if (path === '/nueva-tienda-comas') return '/tiendas';
  if (path === '/china-y-transporte-peruano') return '/blog';
  if (path === '/' && query.includes('cms_block=redes-gl')) return null;
  if (path === '/' && query.includes('cms_block=')) return '/preguntas-frecuentes';
  return null;
}

const data = JSON.parse(readFileSync(SRC, 'utf8'));

const vistos = new Set();
const redirecciones = [];
for (const r of data.redirects) {
  if (vistos.has(r.url)) continue;
  vistos.add(r.url);
  redirecciones.push(r);
}

const redirects = redirecciones.map((r, i) => {
  const destino = rutaDeMapa(r.action_data.url);
  const nuevo = { ...r, id: i + 1, position: i };
  if (destino) nuevo.action_data = { url: BASE + destino };
  return nuevo;
});

const salida = {
  plugin: { version: data.plugin.version, date: new Date().toUTCString().replace('GMT', '+0000') },
  groups: [{ id: 1, name: 'Redirecciones', module_id: 1, status: 'enabled' }],
  redirects,
};

writeFileSync(OUT, JSON.stringify(salida, null, 2), 'utf8');

const reescritas = redirects.filter((r) => r.action_data.url.startsWith(BASE)).length;
console.log(`Total redirecciones: ${redirects.length}`);
console.log(`Reescritas a ${BASE}: ${reescritas}`);
console.log(`Sin cambio (mantienen URL actual): ${redirects.length - reescritas}`);
console.log(`Archivo generado: ${OUT}`);