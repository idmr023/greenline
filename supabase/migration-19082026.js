/**
 * Migración de productos.json → Supabase
 *
 * Ejecutar con: node supabase/migrate.js
 * Requiere: .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
 *
 * IMPORTANTE: Primero ejecuta schema.sql en el SQL Editor de Supabase.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function estimateAutonomia(motorStr) {
  const w = parseInt(motorStr, 10);
  if (Number.isNaN(w)) return 30;
  if (w <= 350) return 45;
  if (w <= 500) return 40;
  if (w <= 800) return 35;
  if (w <= 1000) return 30;
  if (w <= 1200) return 28;
  return 25;
}

async function migrate() {
  console.log('Leyendo productos.json...');
  const raw = readFileSync(join(__dirname, '..', 'src', 'data', 'productos.json'), 'utf-8');
  const productos = JSON.parse(raw);

  console.log(`Migrando ${productos.length} productos...\n`);

  for (const p of productos) {
    console.log(`→ [${p.id}] ${p.nombre}`);

    // 1. Insertar producto
    const { data: prod, error: prodErr } = await supabase
      .from('productos')
      .insert({
        id: p.id,
        categoria_id: null, // Se resuelve después
        nombre: p.nombre,
        slug: slugify(p.nombre),
        descripcion: null,
        precio_original: p.precio_original,
        precio_actual: p.precio_actual,
        destacado: p.destacado,
        video_id: p.videoId || null,
      })
      .select('id')
      .single();

    if (prodErr) {
      console.error(`  ✗ Error insertando producto: ${prodErr.message}`);
      continue;
    }

    // 2. Resolver categoría
    const { data: cat } = await supabase
      .from('categorias')
      .select('id')
      .eq('nombre', p.categoria)
      .single();

    if (cat) {
      await supabase
        .from('productos')
        .update({ categoria_id: cat.id })
        .eq('id', prod.id);
    }

    // 3. Insertar ficha técnica básica
    const stockPerColor = Math.floor(p.unidades / (p.colores.length || 1));
    const remainder = p.unidades % (p.colores.length || 1);

    await supabase.from('ficha_tecnica').insert({
      producto_id: prod.id,
      potencia_motor: p.motor,
      tipo_bateria: p.bateria,
      autonomia_km: estimateAutonomia(p.motor),
    });

    // 4. Insertar relaciones producto-color con stock
    for (let i = 0; i < p.colores.length; i++) {
      const colorName = p.colores[i];

      // Buscar o crear color
      let { data: color } = await supabase
        .from('colores')
        .select('id')
        .eq('nombre', colorName)
        .single();

      if (!color) {
        const { data: newColor } = await supabase
          .from('colores')
          .insert({ nombre: colorName })
          .select('id')
          .single();
        color = newColor;
      }

      if (color) {
        const stock = stockPerColor + (i < remainder ? 1 : 0);
        await supabase.from('prod_color_rel').insert({
          producto_id: prod.id,
          color_id: color.id,
          stock,
        });
      }
    }

    // 5. Insertar imágenes
    for (let i = 0; i < p.imagenes.length; i++) {
      const img = p.imagenes[i];
      await supabase.from('imagenes').insert({
        producto_id: prod.id,
        url: img.src,
        color: img.color,
        es_principal: i === 0,
        orden: i,
      });
    }

    // 6. Insertar modelo 3D si existe
    if (p.modelo3d) {
      await supabase.from('modelos_3d').insert({
        producto_id: prod.id,
        glb_url: p.modelo3d.glb,
        hotspots: p.modelo3d.hotspots,
      });
    }

    console.log(`  ✓ OK (${p.colores.length} colores, ${p.imagenes.length} imágenes)`);
  }

  console.log('\n✓ Migración completada.');
}

migrate().catch((err) => {
  console.error('Error en migración:', err);
  process.exit(1);
});
