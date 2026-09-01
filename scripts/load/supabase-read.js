// k6: Prueba de carga del CATÁLOGO público (la mayor parte del tráfico de usuarios).
// La tienda GreenLine lee productos/imágenes/categorías DIRECTAMENTE de Supabase
// (anon key), sin pasar por Render. Este script simula ese volumen de navegación.
//
// Ejecutar (necesita SUPABASE_URL y SUPABASE_ANON_KEY, mismas del backend/.env):
//   $env:SUPABASE_URL="https://xxxx.supabase.co"
//   $env:SUPABASE_ANON_KEY="eyJ..."
//   $env:SUPABASE_URL="$env:SUPABASE_URL" $env:SUPABASE_ANON_KEY="$env:SUPABASE_ANON_KEY" `
//     k6 run scripts/load/supabase-read.js
//
// En PowerShell:
//   $env:SUPABASE_URL="https://xxxx.supabase.co"; $env:SUPABASE_ANON_KEY="eyJ..."; k6 run scripts/load/supabase-read.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const SB = __ENV.SUPABASE_URL;
const SB_KEY = __ENV.SUPABASE_ANON_KEY;

if (!SB || !SB_KEY) {
  throw new Error('Faltan SUPABASE_URL / SUPABASE_ANON_KEY');
}

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
};

const productos = `${SB}/rest/v1/productos?select=id,nombre,slug,precio,colorId,categoriaId&limit=20`;
const tienda = `${SB}/rest/v1/productos?select=id,nombre,precio&categoriaId=eq.2&limit=12`;

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // calentamiento
    { duration: '2m', target: 100 },  // rampa a 100 usuarios viendo el catálogo
    { duration: '3m', target: 200 },  // carga alta de navegación
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

export default function () {
  // Navegación típica de la tienda: listar productos + un detalle/categoría.
  const r = Math.random();

  const listado = http.get(productos, { headers, tags: { tipo: 'supabase' } });
  check(listado, {
    'catálogo 200': (res) => res.status === 200,
    'catálogo rápido': (res) => res.timings.duration < 300,
  });

  if (r < 0.3) {
    const detalle = http.get(tienda, { headers, tags: { tipo: 'supabase' } });
    check(detalle, { 'detalle 200': (res) => res.status === 200 });
    sleep(0.8);
    return;
  }

  sleep(0.4);
}
