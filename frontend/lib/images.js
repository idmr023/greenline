/**
 * Capa central de URLs de imágenes.
 *
 * Todas las imágenes viven en public/assets/imagenes/ y se sirven
 * directamente desde el hosting estático (Vite / Render).
 * Sin dependencia de Supabase Storage.
 */

import { versionarImagen } from './imagenVersionada';

const v = versionarImagen;

// ----------------------------------------------------------------------------
// Logos
// ----------------------------------------------------------------------------
export const LOGO = v('/assets/imagenes/logos/logo_final.webp');

// ----------------------------------------------------------------------------
// Carrusel del home
// ----------------------------------------------------------------------------
export const CARRUSEL = [
  v('/assets/imagenes/caroussel/1.webp'),
  v('/assets/imagenes/caroussel/2.jpg'),
  v('/assets/imagenes/caroussel/3.jpg'),
  v('/assets/imagenes/caroussel/portada_setiembre_aniversario.png'),
  v('/assets/imagenes/caroussel/4.jpg'),
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
    image: v('/assets/imagenes/banner_categoria_producto/vmp.webp'),
  },
  'Motos Eléctricas': {
    title: 'Motos Eléctricas',
    subtitle: 'Potencia, autonomía y cero emisiones.',
    image: v('/assets/imagenes/banner_categoria_producto/motos.webp'),
  },
  'Trimotos Eléctricas': {
    title: 'Trimotos Eléctricas',
    subtitle: 'Estabilidad y carga para tu trabajo diario.',
    image: v('/assets/imagenes/banner_categoria_producto/trimotos.webp'),
  },
  Cargueros: {
    title: 'Cargueros Eléctricos',
    subtitle: 'La solución de carga para tu negocio.',
    image: v('/assets/imagenes/banner_categoria_producto/encabezaado-web-fijo.webp'),
  },
  Cuatrimotos: {
    title: 'Cuatrimotos',
    subtitle: 'Estabilidad, seguridad y movilidad universal.',
    image: v('/assets/imagenes/banner_categoria_producto/encabezaado-web-fijo.webp'),
  },
};

// ----------------------------------------------------------------------------
// Banner genérico (PageBanner por defecto)
// ----------------------------------------------------------------------------
export const BANNER_DEFAULT = v('/assets/imagenes/banner_categoria_producto/encabezaado-web-fijo.webp');

// ----------------------------------------------------------------------------
// Tiendas (StoreLocator)
// ----------------------------------------------------------------------------
export const TIENDAS = {
  Lince: v('/assets/imagenes/tiendas/tienda_lince.webp'),
  Surco: v('/assets/imagenes/tiendas/tienda_surco.webp'),
  'San Miguel': v('/assets/imagenes/tiendas/tienda_san_miguel.webp'),
  Miraflores: v('/assets/imagenes/tiendas/tienda_miraflores.webp'),
  'La Molina': v('/assets/imagenes/tiendas/tienda_molina.webp'),
  Comas: v('/assets/imagenes/tiendas/tienda_comas.webp'),
  Salamanca: v('/assets/imagenes/tiendas/tienda_salamanca.webp'),
  Huancayo: v('/assets/imagenes/tiendas/tienda_huancayo.webp'),
  Santiago: v('/assets/imagenes/tiendas/tienda_santiago.webp'),
};

// ----------------------------------------------------------------------------
// Nosotros
// ----------------------------------------------------------------------------
export const NOSOTROS_HEADER = v('/assets/imagenes/paginas/nosotros/nosotros_header.webp');
export const NOSOTROS_CARRUSEL = (n) => v(`/assets/imagenes/paginas/nosotros/nosotros_carrousel_${n}.webp`);

// ----------------------------------------------------------------------------
// Social media grid / Videos
// ----------------------------------------------------------------------------
export const SOCIAL_MEDIA_GRID = {
  f4_pro_video: v('/assets/imagenes/social_media_grid/f4_pro_video.webp'),
  gl3_post: v('/assets/imagenes/social_media_grid/gl3_post.webp'),
  gl3_post_aura: v('/assets/imagenes/social_media_grid/gl3_post_aura.webp'),
  gl3_video: v('/assets/imagenes/social_media_grid/gl3_video.webp'),
  h3_pro_titktok: v('/assets/imagenes/social_media_grid/h3_pro_titktok.webp'),
  h3_pro_video: v('/assets/imagenes/social_media_grid/h3_pro_video.webp'),
  l3pro_video: v('/assets/imagenes/social_media_grid/l3pro_video.webp'),
  m_car_video: v('/assets/imagenes/social_media_grid/m_car_video.webp'),
  mx6_video: v('/assets/imagenes/social_media_grid/mx6_video.webp'),
  placa_gratis_tiktok: v('/assets/imagenes/social_media_grid/placa_gratis_tiktok.webp'),
  s6pro_video: v('/assets/imagenes/social_media_grid/s6pro_video.webp'),
  t6_post: v('/assets/imagenes/social_media_grid/t6_post.webp'),
  tc_bus_post: v('/assets/imagenes/social_media_grid/tc_bus_post.webp'),
  tc2_160a_post: v('/assets/imagenes/social_media_grid/tc2_160a_post.webp'),
  x3_post: v('/assets/imagenes/social_media_grid/x3_post.webp'),
  y5_video_tiktok: v('/assets/imagenes/social_media_grid/y5_video_tiktok.webp'),
};

// ----------------------------------------------------------------------------
// Aniversario
// ----------------------------------------------------------------------------
export const ANIVERSARIO_VIDEO = v('/assets/imagenes/aniversario/greenline_aniversario_video.webp');

// ----------------------------------------------------------------------------
// Productos — URL base para rutas que vienen de la DB
// ----------------------------------------------------------------------------
export const URL_BASE = '/assets/imagenes/productos/';
