/**
 * Auditoría de colores del catálogo (SOLO LECTURA).
 *
 * Compara, modelo por modelo:
 *   - Colores registrados en el catálogo (prod_color_rel → colores)
 *   - Colores con fotografía (imagenes.color)
 *   - Fotos sin color asignado
 *   - Overrides temporales de frontend/lib/productos.js (colorOverrides)
 *   - Estado del campo "ideal_para" (info_adicional) y sugerencia por categoría
 *
 * Genera un reporte en reports/ para que el equipo lo contraste con el
 * catálogo físico y corrija desde el panel de administración.
 *
 * Uso: node scripts/auditar-colores.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Faltan las variables VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Reflejo de los parches temporales de frontend/lib/productos.js
const COLOR_OVERRIDES = {
  'bicicleta-elctrica-plegable-fl2': ['Rojo'],
  'trimoto-greenline-tm7-v2026': ['Blanco'],
};

// Sugerencia de "ideal_para" (tipo de persona) por categoría.
// El equipo la revisa y la carga desde Admin → Producto → "Ideal para".
const IDEAL_PARA_SUGERIDO = {
  VMP: ['Estudiantes', 'Traslados urbanos cortos'],
  'Motos Eléctricas': ['Profesionales', 'Traslados diarios en ciudad'],
  'Trimotos Eléctricas': ['Delivery', 'Reparto urbano'],
  Cargueros: ['Comerciantes', 'Bodegueros'],
  Cuatrimotos: ['Uso recreacional', 'Terreno rústico'],
};

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const k = row[key];
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(row);
  }
  return map;
}

async function main() {
  const [prodRes, relRes, imgRes, infoRes] = await Promise.all([
    supabase
      .from('productos')
      .select('id, nombre, slug, disponible, categoria:categorias(nombre)')
      .order('nombre'),
    supabase.from('prod_color_rel').select('producto_id, color:colores(nombre)'),
    supabase.from('imagenes').select('producto_id, color, es_principal, url').order('orden'),
    supabase.from('info_adicional').select('producto_id, data'),
  ]);

  for (const [nombre, res] of [
    ['productos', prodRes],
    ['prod_color_rel', relRes],
    ['imagenes', imgRes],
    ['info_adicional', infoRes],
  ]) {
    if (res.error) {
      console.error(`Error consultando ${nombre}:`, res.error.message);
      process.exit(1);
    }
  }

  const productos = prodRes.data || [];
  const relByProd = groupBy(relRes.data || [], 'producto_id');
  const imgsByProd = groupBy(imgRes.data || [], 'producto_id');
  const infoByProd = new Map((infoRes.data || []).map((r) => [r.producto_id, r.data || {}]));

  const lineas = [];
  const fecha = new Date().toISOString().slice(0, 10);
  let productosConHallazgos = 0;

  lineas.push(`# Auditoría de colores del catálogo — ${fecha}`, '');
  lineas.push('> Script: `scripts/auditar-colores.mjs` (solo lectura).', '');
  lineas.push('> Comparar contra el catálogo físico y corregir desde el panel de administración.', '');
  lineas.push('---', '');

  for (const p of productos) {
    const catNombre = p.categoria?.nombre || 'Sin categoría';
    const coloresCatalogo = (relByProd.get(p.id) || [])
      .map((r) => r.color?.nombre)
      .filter(Boolean);
    const imagenes = imgsByProd.get(p.id) || [];
    const coloresConFoto = [...new Set(imagenes.map((i) => i.color).filter(Boolean))];
    const fotosSinColor = imagenes.filter((i) => !i.color);

    const faltanFoto = coloresCatalogo.filter(
      (c) => !coloresConFoto.some((f) => norm(f) === norm(c)),
    );
    const fotoSinCatalogo = coloresConFoto.filter(
      (c) => !coloresCatalogo.some((x) => norm(x) === norm(c)),
    );

    const override = COLOR_OVERRIDES[p.slug];
    const info = infoByProd.get(p.id) || {};
    const idealPara = Array.isArray(info.ideal_para)
      ? info.ideal_para
      : typeof info.ideal_para === 'string'
        ? info.ideal_para.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    const sugerido = IDEAL_PARA_SUGERIDO[catNombre] || [];

    const hallazgos = [];
    if (!imagenes.length) hallazgos.push('No tiene ninguna foto cargada.');
    if (faltanFoto.length)
      hallazgos.push(`Colores en catálogo SIN foto: ${faltanFoto.join(', ')}.`);
    if (fotoSinCatalogo.length)
      hallazgos.push(`Fotos con color NO registrado en catálogo: ${fotoSinCatalogo.join(', ')}.`);
    if (fotosSinColor.length && imagenes.length)
      hallazgos.push(`${fotosSinColor.length} foto(s) sin color asignado (aparecen en la galería general).`);
    if (!coloresCatalogo.length)
      hallazgos.push('No tiene colores registrados en catálogo (prod_color_rel).');
    if (override)
      hallazgos.push(
        `Override temporal activo en frontend/lib/productos.js: mostrar solo ${override.join(', ')}. Verificar si ya se puede retirar.`,
      );
    if (!idealPara.length)
      hallazgos.push(`Falta "ideal_para". Sugerencia por categoría: ${sugerido.join(', ') || '(definir)'}.`);

    if (hallazgos.length) productosConHallazgos += 1;

    lineas.push(`## ${p.nombre} (${catNombre})`, '');
    lineas.push(`- **Slug:** \`${p.slug || '—'}\` · **Disponibilidad:** ${p.disponible === false ? 'Fuera de stock' : 'Disponible'}`);
    lineas.push(`- **Colores en catálogo:** ${coloresCatalogo.join(', ') || '—'}`);
    lineas.push(`- **Colores con foto:** ${coloresConFoto.join(', ') || '—'}`);
    lineas.push(`- **Ideal para (web):** ${idealPara.join(', ') || '—'}`);
    if (hallazgos.length) {
      lineas.push('- **Observaciones:**');
      for (const h of hallazgos) lineas.push(`  - ${h}`);
    } else {
      lineas.push('- **Observaciones:** ninguna. Coherente. ✔');
    }
    lineas.push('');
  }

  lineas.push('---', '');
  lineas.push('## Sugerencias "ideal para" por categoría', '');
  for (const [cat, personas] of Object.entries(IDEAL_PARA_SUGERIDO)) {
    lineas.push(`- **${cat}:** ${personas.join(', ')}`);
  }
  lineas.push('');

  const carpetaReportes = path.resolve(__dirname, '../reports');
  fs.mkdirSync(carpetaReportes, { recursive: true });
  const rutaReporte = path.join(carpetaReportes, `auditoria-colores-${fecha}.md`);
  fs.writeFileSync(rutaReporte, lineas.join('\n'), 'utf8');

  console.log(`Productos auditados: ${productos.length}`);
  console.log(`Productos con observaciones: ${productosConHallazgos}`);
  console.log(`Reporte generado: ${rutaReporte}`);
}

main().catch((err) => {
  console.error('Error en la auditoría:', err.message);
  process.exit(1);
});
