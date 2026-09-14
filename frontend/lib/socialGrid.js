import { versionarImagen } from "./images";

const v = versionarImagen;

export const SOCIAL_GRID_ITEMS = [
  {
    id: 'm_car_video',
    image: v('/assets/imagenes/social_media_grid/m_car_video.webp'),
    network: 'Instagram',
    caption: 'M-CAR en acción',
    href: 'https://www.instagram.com/reel/DcR6QSMOPnf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 'gl3_post',
    image: v('/assets/imagenes/social_media_grid/gl3_post.webp'),
    network: 'Instagram',
    caption: 'Mira a la GL3 en acción',
    href: 'https://www.instagram.com/p/DcGygc9imeA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 'h3_pro_video',
    image: v('/assets/imagenes/social_media_grid/h3_pro_video.webp'),
    network: 'TikTok',
    caption: 'H3 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'mx6_video',
    image: v('/assets/imagenes/social_media_grid/mx6_video.webp'),
    network: 'TikTok',
    caption: 'MX6',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'tc2_160a_post',
    image: v('/assets/imagenes/social_media_grid/tc2_160a_post.webp'),
    network: 'Instagram',
    caption: 'TC2 160A',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 'x3_post',
    image: v('/assets/imagenes/social_media_grid/x3_post.webp'),
    network: 'Instagram',
    caption: 'X3',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 'placa_gratis_tiktok',
    image: v('/assets/imagenes/social_media_grid/placa_gratis_tiktok.webp'),
    network: 'TikTok',
    caption: 'Placa gratis',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'l3pro_video',
    image: v('/assets/imagenes/social_media_grid/l3pro_video.webp'),
    network: 'TikTok',
    caption: 'L3 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 't6_post',
    image: v('/assets/imagenes/social_media_grid/t6_post.webp'),
    network: 'Instagram',
    caption: 'T6',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 's6pro_video',
    image: v('/assets/imagenes/social_media_grid/s6pro_video.webp'),
    network: 'TikTok',
    caption: 'S6 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'y5_video_tiktok',
    image: v('/assets/imagenes/social_media_grid/y5_video_tiktok.webp'),
    network: 'TikTok',
    caption: 'Y5',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'gl3_post_aura',
    image: v('/assets/imagenes/social_media_grid/gl3_post_aura.webp'),
    network: 'Instagram',
    caption: 'GL3 Aura',
    href: 'https://www.instagram.com/greenline_peru/',
  },
];

/**
 * Intercala tarjetas sociales entre los productos.
 *
 * - Inserta una tarjeta social cada 3 productos.
 * - Cada tarjeta social se utiliza una sola vez.
 * - Respeta el orden de SOCIAL_GRID_ITEMS.
 * - No repite elementos.
 * - Si se terminan las tarjetas sociales, continúa mostrando productos.
 */
export function interleaveSocialGrid(productos) {
  const grid = [];
  let socialIndex = 0;

  productos.forEach((producto, index) => {
    grid.push({
      type: 'product',
      key: `product-${producto.id}`,
      producto,
    });

    const shouldInsertSocial =
      (index + 1) % 3 === 0 &&
      socialIndex < SOCIAL_GRID_ITEMS.length;

    if (shouldInsertSocial) {
      const socialItem = SOCIAL_GRID_ITEMS[socialIndex];

      grid.push({
        type: 'social',
        key: `social-${socialItem.id}`,
        socialItem,
      });

      socialIndex += 1;
    }
  });

  return grid;
}