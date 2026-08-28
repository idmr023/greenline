/**
 * Capa de acceso a datos - Productos
 *
 * Fuente única: Supabase.
 */

import { supabase } from './supabase';

const supabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ============================================================
// Fetch principal: Supabase
// ============================================================

let _productosCache = null;

export async function fetchProductos() {
  if (_productosCache) return _productosCache;

  if (!supabaseConfigured) {
    console.warn('Supabase no configurado: sin datos de productos.');
    _productosCache = [];
    return _productosCache;
  }

  try {
    _productosCache = await fetchFromSupabase();
  } catch (err) {
    console.warn('Supabase fetch failed:', err.message);
    _productosCache = [];
  }
  return _productosCache;
}

export function clearCache() {
  _productosCache = null;
}

// ============================================================
// Fuente: Supabase
// ============================================================

async function fetchFromSupabase() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria:categorias(id, nombre),
      imagenes(id, url, color, es_principal, orden),
      color_rel:prod_color_rel(
        stock,
        color:colores(id, nombre, hex_code)
      ),
      ficha_tecnica(*),
      info_adicional(data)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeSupabase);
}

function normalizeSupabase(raw) {
  // ============================================================
  // TEMPORAL: el catálogo se maneja por DISPONIBILIDAD
  // (productos.disponible = true/false), NO por stock numérico.
  // La lógica numérica de stock (prod_color_stock, unidades,
  // "Pocas unidades") está COMENTADA y se reactivará a futuro.
  // ============================================================

  const coloresDisponibles = (raw.color_rel || [])
    .filter((cr) => cr.color)
    .map((cr) => ({
      id: cr.color.id,
      nombre: cr.color.nombre,
      hex_code: cr.color.hex_code,
      stock: cr.stock,
    }));

  // COMENTADO (temporal — stock por números):
  // const stockTotal = coloresDisponibles.reduce((sum, c) => sum + c.stock, 0);

  const imagenes = (raw.imagenes || [])
    .sort((a, b) => a.orden - b.orden)
    .map((img) => ({
      id: img.id,
      src: img.url,
      color: img.color,
      es_principal: img.es_principal,
    }));

  const ficha = raw.ficha_tecnica || {};
  const info = raw.info_adicional?.data || {};

  // COMENTADO (temporal — derivación numérica de disponibilidad):
  // let disponibilidad = 'En stock';
  // if (stockTotal === 0) disponibilidad = 'Fuera de stock';
  // else if (stockTotal <= 5) disponibilidad = 'Pocas unidades';

  let disponibilidad = raw.disponible === false ? 'Fuera de stock' : 'En stock';

  // TEMPORAL: visibilidad de colores por producto (hasta que se
  // actualicen fotos/colores reales). FL2 solo Rojo, TM7 solo Blanco.
  const colorOverrides = {
    'bicicleta-elctrica-plegable-fl2': ['Rojo'],
    'trimoto-greenline-tm7-v2026': ['Blanco'],
  };
  const allowedColors = colorOverrides[raw.slug];
  let coloresFinales = coloresDisponibles;
  let imagenesFinales = imagenes;
  if (allowedColors) {
    coloresFinales = coloresDisponibles.filter((c) =>
      allowedColors.includes(c.nombre),
    );
    const conFoto = imagenes.filter(
      (img) => img.color && allowedColors.includes(img.color),
    );
    if (conFoto.length === 0 && imagenes.length > 0) {
      // Sin foto del color permitido: la primera imagen queda como
      // placeholder y toma ese color (ej. TM7 Blanco).
      imagenesFinales = imagenes.map((img, idx) =>
        idx === 0 ? { ...img, color: allowedColors[0] } : { ...img, color: null },
      );
    } else {
      imagenesFinales = imagenes.map((img) =>
        img.color && allowedColors.includes(img.color)
          ? img
          : { ...img, color: null },
      );
    }
  }

  return {
    id: raw.id,
    nombre: raw.nombre,
    slug: raw.slug || slugify(raw.nombre),
    descripcion: raw.descripcion,
    precio_original: raw.precio_original,
    precio_actual: raw.precio_actual,
    destacado: raw.destacado,
    videoId: raw.video_id,
    created_at: raw.created_at,
    updated_at: raw.updated_at,

    categoria: raw.categoria?.nombre || null,
    categoria_id: raw.categoria?.id || null,
    colores: coloresFinales.map((c) => c.nombre),
    colores_detalle: coloresFinales,
    // COMENTADO (temporal — stock por números):
    // unidades: stockTotal,
    unidades: null,
    disponibilidad,
    etiquetas: raw.etiquetas || [],
    bateria: ficha.tipo_bateria || null,
    motor: ficha.potencia_motor || null,
    imagenes: imagenesFinales,

    ficha_tecnica: {
      tipo_motor: ficha.tipo_motor || null,
      potencia_motor: ficha.potencia_motor || null,
      torque_maximo: ficha.torque_maximo || null,
      potencia_bateria: ficha.potencia_bateria || null,
      tipo_bateria: ficha.tipo_bateria || null,
      bateria_extraible: ficha.bateria_extraible ?? null,
      capacidad_bateria: ficha.capacidad_bateria || null,
      vida_util_bateria: ficha.vida_util_bateria || null,
      tipo_toma_corriente: ficha.tipo_toma_corriente || null,
      tiempo_carga_min: ficha.tiempo_carga_min || null,
      velocidad_max_kmh: ficha.velocidad_max_kmh || null,
      autonomia_km: ficha.autonomia_km || null,
      carga_maxima_kg: ficha.carga_maxima_kg || null,
      largo_cm: ficha.largo_cm || null,
      ancho_cm: ficha.ancho_cm || null,
      alto_cm: ficha.alto_cm || null,
    },

    info_adicional: info,
  };
}

// ============================================================
// Helpers
// ============================================================

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
