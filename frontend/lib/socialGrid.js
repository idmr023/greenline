import { CDN_BASE } from './images';

const BASE = `${CDN_BASE}/social_media_grid`;

export const SOCIAL_GRID_ITEMS = [
  {
    id: 'm_car_video',
    image: `${BASE}/m_car_video.webp`,
    network: 'Instagram',
    caption: 'M-CAR en acción',
    href: 'https://www.instagram.com/reel/DcR6QSMOPnf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 'gl3_post',
    image: `${BASE}/gl3_post.webp`,
    network: 'Instagram',
    caption: 'Mira a la GL3 en acción',
    href: 'https://www.instagram.com/p/DcGygc9imeA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 'h3_pro_video',
    image: `${BASE}/h3_pro_video.webp`,
    network: 'TikTok',
    caption: 'H3 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'mx6_video',
    image: `${BASE}/mx6_video.webp`,
    network: 'TikTok',
    caption: 'MX6',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'tc2_160a_post',
    image: `${BASE}/tc2_160a_post.webp`,
    network: 'Instagram',
    caption: 'TC2 160A',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 'x3_post',
    image: `${BASE}/x3_post.webp`,
    network: 'Instagram',
    caption: 'X3',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 'placa_gratis_tiktok',
    image: `${BASE}/placa_gratis_tiktok.webp`,
    network: 'TikTok',
    caption: 'Placa gratis',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'l3pro_video',
    image: `${BASE}/l3pro_video.webp`,
    network: 'TikTok',
    caption: 'L3 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 't6_post',
    image: `${BASE}/t6_post.webp`,
    network: 'Instagram',
    caption: 'T6',
    href: 'https://www.instagram.com/greenline_peru/',
  },
  {
    id: 's6pro_video',
    image: `${BASE}/s6pro_video.webp`,
    network: 'TikTok',
    caption: 'S6 Pro',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'y5_video_tiktok',
    image: `${BASE}/y5_video_tiktok.webp`,
    network: 'TikTok',
    caption: 'Y5',
    href: 'https://www.tiktok.com/@greenline_peru',
  },
  {
    id: 'gl3_post_aura',
    image: `${BASE}/gl3_post_aura.webp`,
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