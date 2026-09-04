/**
 * Capa central de URLs de imágenes.
 *
 * Las imágenes estáticas del sitio viven en Supabase Storage (bucket
 * 'Greenline_database'), bajo el prefijo 'assets/imagenes/imagenes/...'.
 * Este módulo es la fuente única de esas rutas para evitar duplicar URLs
 * en bruto por toda la app.
 *
 * URL pública construida por Supabase:
 *   <VITE_SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>
 */

export const CDN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes`;

/** Construye una URL pública a partir de una ruta relativa dentro del bucket. */
export function img(path) {
  return `${CDN_BASE}/${path}`;
}

// ----------------------------------------------------------------------------
// Logos
// ----------------------------------------------------------------------------
export const LOGO = img('logos/logo_final.webp');

// ----------------------------------------------------------------------------
// Carrusel del home
// ----------------------------------------------------------------------------
export const CARRUSEL = [
  { ...{ img: img('caroussel/1.webp') } },
  { ...{ img: img('caroussel/2.webp') } },
  { ...{ img: img('caroussel/portada_setiembre_aniversario.webp') } },
  { ...{ img: img('caroussel/4.webp') } },
];

// ----------------------------------------------------------------------------
// Banners de categoría (Shop)
// ----------------------------------------------------------------------------
export const BANNERS = {
  default: {
    title: 'Tienda Green Line',
    subtitle: 'Encuentra tu vehículo eléctrico ideal.',
    image: '',
  },
  VMP: {
    title: 'Vehículos de Movilidad Personal',
    subtitle: 'Bicimotos, monopatines y más para tu día a día.',
    image: img('banner_categoria_producto/vmp.webp'),
  },
  'Motos Eléctricas': {
    title: 'Motos Eléctricas',
    subtitle: 'Potencia, autonomía y cero emisiones.',
    image: img('banner_categoria_producto/motos.webp'),
  },
  'Trimotos Eléctricas': {
    title: 'Trimotos Eléctricas',
    subtitle: 'Estabilidad y carga para tu trabajo diario.',
    image: img('banner_categoria_producto/trimotos.webp'),
  },
  Cargueros: {
    title: 'Cargueros Eléctricos',
    subtitle: 'La solución de carga para tu negocio.',
    image: img('banner_categoria_producto/encabezaado-web-fijo.webp'),
  },
  Cuatrimotos: {
    title: 'Cuatrimotos',
    subtitle: 'Estabilidad, seguridad y movilidad universal.',
    image: img('banner_categoria_producto/encabezaado-web-fijo.webp'),
  },
};

// ----------------------------------------------------------------------------
// Banner genérico (PageBanner por defecto)
// ----------------------------------------------------------------------------
export const BANNER_DEFAULT = img('banner_categoria_producto/encabezaado-web-fijo.webp');

// ----------------------------------------------------------------------------
// Tiendas (StoreLocator)
// ----------------------------------------------------------------------------
export const TIENDAS = {
  Lince: img('tiendas/tienda_lince.webp'),
  Surco: img('tiendas/tienda_surco.webp'),
  'La Molina': img('tiendas/tienda_molina.webp'),
  Comas: img('tiendas/tienda_comas.webp'),
  Ate: img('tiendas/tienda_ate.webp'),
  Huancayo: img('tiendas/tienda_huancayo.webp'),
};

// ----------------------------------------------------------------------------
// Nosotros
// ----------------------------------------------------------------------------
export const NOSOTROS_HEADER = img('paginas/nosotros/nosotros_header.webp');
export const NOSOTROS_CARRUSEL = (n) => img(`paginas/nosotros/nosotros_carrousel_${n}.webp`);

// ----------------------------------------------------------------------------
// Social media grid / Videos
// ----------------------------------------------------------------------------
export const SOCIAL_MEDIA_GRID = {
  'm_car_video': img('social_media_grid/m_car_video.webp'),
  'gl3_post': img('social_media_grid/gl3_post.webp'),
  'gl3_post_aura': img('social_media_grid/gl3_post_aura.webp'),
  'gl3_video': img('social_media_grid/gl3_video.webp'),
  'h3_pro_titktok': img('social_media_grid/h3_pro_titktok.webp'),
  'h3_pro_video': img('social_media_grid/h3_pro_video.webp'),
  'l3pro_video': img('social_media_grid/l3pro_video.webp'),
  'mx6_video': img('social_media_grid/mx6_video.webp'),
  'placa_gratis_tiktok': img('social_media_grid/placa_gratis_tiktok.webp'),
  's6pro_video': img('social_media_grid/s6pro_video.webp'),
  't6_post': img('social_media_grid/t6_post.webp'),
  'tc2_160a_post': img('social_media_grid/tc2_160a_post.webp'),
};

// ----------------------------------------------------------------------------
// Aniversario
// ----------------------------------------------------------------------------
export const ANIVERSARIO_VIDEO = img('aniversario/greenline_aniversario_video.webp');
