const orig = require('../redirection-export.json');
const fs = require('fs');
const BASE = 'https://greenline-eta.vercel.app';

const seen = new Set();
const oldRedirects = orig.redirects.filter(r => {
  if (r.action_data.url.startsWith(BASE)) return false;
  if (seen.has(r.match_url)) return false;
  seen.add(r.match_url);
  return true;
});

const newRoutes = [
  { url: '/', dest: BASE + '/' },
  { url: '/tienda', dest: BASE + '/tienda' },
  { url: '/nosotros', dest: BASE + '/nosotros' },
  { url: '/tiendas', dest: BASE + '/tiendas' },
  { url: '/contacto', dest: BASE + '/contacto' },
  { url: '/comparar', dest: BASE + '/comparar' },
  { url: '/preguntas-frecuentes', dest: BASE + '/preguntas-frecuentes' },
  { url: '/blog', dest: BASE + '/blog' },
  { url: '/proximamente', dest: BASE + '/proximamente' },
  { url: '/politica-privacidad', dest: BASE + '/politica-privacidad' },
  { url: '/trabaja-con-nosotros', dest: BASE + '/trabaja-con-nosotros' },
  { url: '/manuales-de-uso', dest: BASE + '/manuales-de-uso' },
  { url: '/checkout', dest: BASE + '/checkout' },
  { url: '/libro-de-reclamaciones', dest: BASE + '/libro-de-reclamaciones' },
];

const regexRoutes = [
  { url: '/novedades/(.*)', dest: BASE + '/novedades/$1' },
  { url: '/producto/(.*)', dest: BASE + '/producto/$1' },
];

// Vehicles with equivalent in Supabase: /tienda/<old-slug>/ -> /producto/<new-slug>/
const vehicleRoutes = [
  ['bicicleta-electrica-fl1', 'bicicleta-elctrica-plegable-fl2'],
  ['bicicleta-electrica-plegable-fl1', 'bicicleta-elctrica-plegable-fl2'],
  ['bicicleta-electrica-tailg-fl1', 'bicicleta-elctrica-plegable-fl2'],
  ['bicicleta-electrica-tailg-fl2', 'bicicleta-elctrica-plegable-fl2'],
  ['greenline-vmp-l3-pro', 'greenline-vmp-l3-pro'],
  ['greenline-vmp-p01', 'greenline-vmp-p01'],
  ['greenline-vmp-s4-pro', 'greenline-vmp-s4-pro'],
  ['greenline-vmp-s6-pro', 'greenline-vmp-s6-pro'],
  ['greenline-vmp-s9', 'greenline-vmp-s9'],
  ['greenline-vmp-t4', 'greenline-vmp-t4'],
  ['carguero-greenline-tc2-110a', 'carguero-greenline-tc2-110a'],
  ['greenline-tc2-160a', 'greenline-tc2-160a'],
  ['greenline-tc2-160-carguero-electrico-con-techo', 'greenline-tc2-160-con-techo'],
  ['greenline-tc2-180a', 'greenline-tc2-180a'],
  ['greenline-tc-bus', 'greenline-tc-bus'],
  ['greenline-f4-pro', 'greenline-f4-pro'],
  ['greenline-gl3', 'greenline-gl3'],
  ['greenline-h3-pro', 'greenline-h3-pro'],
  ['greenline-m3-pro', 'greenline-m3-pro'],
  ['greenline-mx6', 'greenline-mx6'],
  ['greenline-sr', 'greenline-sr'],
  ['greenline-t6', 'greenline-t6'],
  ['greenline-v9-pro', 'greenline-v9-pro'],
  ['greenline-y5', 'greenline-y5'],
  ['greenline-tm6-pro', 'trimoto-greenline-tm6-pro'],
  ['greenline-tm6-v26', 'trimoto-greenline-tm7-v2026'],
  ['greenline-tm7-v2026', 'trimoto-greenline-tm7-v2026'],
  ['greenline-tm9', 'trimoto-greenline-tm9'],
];

function makeRedirect(id, url, dest, isRegex, pos) {
  if (isRegex) {
    return {
      id, url, match_url: url,
      match_data: { source: { flag_query: 'exact', flag_case: true, flag_trailing: true, flag_regex: true } },
      action_code: 301, action_type: 'url', action_data: { url: dest },
      match_type: 'regex', title: '', hits: 0, regex: true,
      group_id: 1, position: pos, last_access: '-', enabled: true
    };
  }
  const matchUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return {
    id, url, match_url: matchUrl,
    match_data: { source: { flag_query: 'exact', flag_case: true, flag_trailing: true, flag_regex: false } },
    action_code: 301, action_type: 'url', action_data: { url: dest },
    match_type: 'url', title: '', hits: 0, regex: false,
    group_id: 1, position: pos, last_access: '-', enabled: true
  };
}

const redirects = [];
let pos = 0;

for (const r of newRoutes) {
  redirects.push(makeRedirect(redirects.length + 1, r.url + '/', r.dest, false, pos++));
}
for (const r of regexRoutes) {
  redirects.push(makeRedirect(redirects.length + 1, r.url, r.dest, true, pos++));
}
for (const [oldSlug, newSlug] of vehicleRoutes) {
  redirects.push(makeRedirect(redirects.length + 1, '/tienda/' + oldSlug + '/', BASE + '/producto/' + newSlug, false, pos++));
}
const seenSlugs = new Set(vehicleRoutes.map(p => p[0]));
for (const r of oldRedirects) {
  const m = r.match_url.match(/^\/tienda\/([^/]+)$/);
  if (m && seenSlugs.has(m[1])) continue;
  redirects.push(makeRedirect(redirects.length + 1, r.url, r.action_data.url, r.regex, pos++));
}

const output = {
  plugin: { version: '5.9.0', date: 'Wed, 02 Sep 2026 21:00:00 +0000' },
  groups: [{ id: 1, name: 'Redirecciones', module_id: 1, status: 'enabled' }],
  redirects
};

fs.writeFileSync('redirection-import-app.json', JSON.stringify(output, null, 2));
console.log('Total:', redirects.length);
console.log('New routes to Vercel:', newRoutes.length + regexRoutes.length);
console.log('Vehicles to Vercel:', vehicleRoutes.length);
console.log('Old to glperu:', redirects.length - newRoutes.length - regexRoutes.length - vehicleRoutes.length);
