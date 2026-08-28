/**
 * Capa de acceso a datos - Testimonios
 *
 * Fuente única: Supabase.
 */

import { supabase } from './supabase';

const supabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

let _testimoniosCache = null;

export async function fetchTestimonios() {
  if (_testimoniosCache) return _testimoniosCache;

  if (!supabaseConfigured) {
    console.warn('Supabase no configurado: sin datos de testimonios.');
    _testimoniosCache = [];
    return _testimoniosCache;
  }

  try {
    const { data, error } = await supabase
      .from('testimonios')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (error) throw error;
    _testimoniosCache = data.map(normalize);
  } catch (err) {
    console.warn('Supabase fetch testimonios failed:', err.message);
    _testimoniosCache = [];
  }
  return _testimoniosCache;
}

function normalize(raw) {
  return {
    id: raw.id,
    nombre: raw.nombre,
    rol: raw.rol,
    texto: raw.texto,
    vehiculo: raw.vehiculo,
    rating: raw.rating,
  };
}

export function clearTestimoniosCache() {
  _testimoniosCache = null;
}