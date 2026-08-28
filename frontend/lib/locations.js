/**
 * Capa de acceso a datos - Tiendas, Distribuidores, Ventas Provincias
 *
 * Fuente única: Supabase.
 */

import { supabase } from './supabase';

const supabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ============================================================
// Stores (Tiendas)
// ============================================================

let _storesCache = null;

export async function fetchStores() {
  if (_storesCache) return _storesCache;

  if (!supabaseConfigured) {
    console.warn('Supabase no configurado: sin datos de tiendas.');
    _storesCache = [];
    return _storesCache;
  }

  try {
    const { data, error } = await supabase
      .from('greenline_stores')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    _storesCache = data.map(normalizeStore);
  } catch (err) {
    console.warn('Supabase fetch stores failed:', err.message);
    _storesCache = [];
  }
  return _storesCache;
}

function normalizeStore(raw) {
  return {
    id: raw.id,
    country: raw.country,
    department: raw.department,
    province: raw.province,
    district: raw.district,
    name: raw.name,
    address: raw.address,
    coordinates: raw.latitude != null && raw.longitude != null
      ? [Number(raw.latitude), Number(raw.longitude)]
      : null,
    schedule: raw.schedule,
    phone: raw.phone,
    whatsapp_number: raw.whatsapp_number,
    whatsapp_url: raw.whatsapp_url,
    maps_url: raw.maps_url,
    technical_service: raw.technical_service,
    technical_phone: raw.technical_phone,
    technical_whatsapp_number: raw.technical_whatsapp_number,
    technical_whatsapp_url: raw.technical_whatsapp_url,
  };
}

// ============================================================
// Distributors (Distribuidores)
// ============================================================

let _distributorsCache = null;

export async function fetchDistributors() {
  if (_distributorsCache) return _distributorsCache;

  if (!supabaseConfigured) {
    console.warn('Supabase no configurado: sin datos de distribuidores.');
    _distributorsCache = [];
    return _distributorsCache;
  }

  try {
    const { data, error } = await supabase
      .from('greenline_distributors')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) throw error;
    _distributorsCache = data.map(normalizeDistributor);
  } catch (err) {
    console.warn('Supabase fetch distributors failed:', err.message);
    _distributorsCache = [];
  }
  return _distributorsCache;
}

function normalizeDistributor(raw) {
  return {
    id: raw.id,
    country: raw.country,
    department: raw.department,
    province: raw.province,
    district: raw.district,
    name: raw.name,
    ruc: raw.ruc,
    contact_name: raw.contact_name,
    address: raw.address,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
    coordinate_precision: raw.coordinate_precision,
    maps_url: raw.maps_url,
    phone: raw.phone,
    whatsapp_number: raw.whatsapp_number,
    whatsapp_url: raw.whatsapp_url,
    priority: raw.priority,
    technical_service: raw.technical_service,
  };
}

// ============================================================
// Province Sales (Ventas Provincias)
// ============================================================

let _provinceSalesCache = null;

export async function fetchProvinceSales() {
  if (_provinceSalesCache) return _provinceSalesCache;

  if (!supabaseConfigured) {
    console.warn('Supabase no configurado: sin datos de ventas provincias.');
    _provinceSalesCache = null;
    return _provinceSalesCache;
  }

  try {
    const { data, error } = await supabase
      .from('greenline_province_sales')
      .select('*')
      .eq('active', true)
      .limit(1)
      .single();

    if (error) throw error;
    _provinceSalesCache = {
      name: data.name,
      phone: data.phone,
      whatsapp_number: data.whatsapp_number,
      whatsapp_url: data.whatsapp_url,
    };
  } catch (err) {
    console.warn('Supabase fetch province sales failed:', err.message);
    _provinceSalesCache = null;
  }
  return _provinceSalesCache;
}

// ============================================================
// Helpers
// ============================================================

export function clearLocationsCache() {
  _storesCache = null;
  _distributorsCache = null;
  _provinceSalesCache = null;
}
